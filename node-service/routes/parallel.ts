import { Router, Request, Response, NextFunction } from "express";
import { Parallel } from "parallel-web";

const router = Router();

// Initialize Parallel client
let parallelClient: Parallel | null = null;
let demoMode = false;

try {
  const apiKey = process.env.PARALLEL_API_KEY;

  if (!apiKey) {
    console.warn(
      "⚠️  PARALLEL_API_KEY not found. Running in demo mode with mock data."
    );
    demoMode = true;
  } else {
    parallelClient = new Parallel({ apiKey });
    console.log("✅ Parallel Web client initialized successfully");
  }
} catch (error) {
  console.error("❌ Failed to initialize Parallel client:", error);
  console.warn("⚠️  Running in demo mode with mock data.");
  parallelClient = null;
  demoMode = true;
}

// Mock data for demo mode
const generateMockSearchResults = (
  objective: string,
  numResults: number = 10
) => {
  const mockResults = Array.from(
    { length: Math.min(numResults, 10) },
    (_, i) => ({
      url: `https://example.com/article-${i + 1}`,
      title: `${objective} - Article ${i + 1}`,
      publish_date: new Date(Date.now() - i * 86400000)
        .toISOString()
        .split("T")[0],
      excerpts: [
        `This is a comprehensive article about ${objective}. The content explores various aspects and provides detailed insights into the topic. Research shows significant developments in this area, with experts predicting continued growth and innovation.`,
        `Key findings include: improved methodologies, enhanced user experience, and broader accessibility. These advances represent a major step forward in understanding and implementing ${objective} effectively.`,
      ],
    })
  );

  return {
    search_id: `mock_search_${Date.now()}`,
    results: mockResults,
    warnings: null,
    usage: [{ name: "sku_search", count: 1 }],
  };
};

const generateMockExtractResults = (urls: string[]) => {
  return {
    extract_id: `mock_extract_${Date.now()}`,
    results: urls.map((url) => ({
      url,
      status: "success" as const,
      markdown: `# Extracted Content from ${url}\n\nThis is mock extracted content from the URL. In production, this would contain the full markdown-formatted content extracted from the page.\n\n## Key Points\n\n- Point 1: Important information\n- Point 2: Relevant details\n- Point 3: Critical insights\n\n## Conclusion\n\nThis represents the extracted and cleaned content that would be suitable for LLM consumption.`,
      metadata: {
        title: `Content from ${url}`,
        description: "Mock extracted content",
        publish_date: new Date().toISOString().split("T")[0],
      },
    })),
    warnings: null,
    usage: [{ name: "sku_extract", count: urls.length }],
  };
};

// Middleware to check if Parallel is available or demo mode
const checkParallelAvailable = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!parallelClient && !demoMode) {
    res.status(503).json({
      error: {
        message:
          "Parallel Web service failed to initialize. Please check your configuration.",
        code: "PARALLEL_INITIALIZATION_FAILED",
      },
    });
    return;
  }
  next();
};

// Types for request bodies
interface SearchRequest {
  objective: string;
  search_queries?: string[];
  max_results?: number;
  mode?: "one-shot" | "agentic";
  source_policy?: {
    include_domains?: string[];
    exclude_domains?: string[];
  };
  excerpts?: {
    max_chars_per_result?: number;
    max_chars_total?: number;
  };
  fetch_policy?: {
    max_age_seconds?: number;
  };
}

interface ExtractRequest {
  urls: string[];
  include_html?: boolean;
  timeout_ms?: number;
}

// Search endpoint
router.post(
  "/search",
  checkParallelAvailable,
  async (
    req: Request<{}, any, SearchRequest>,
    res: Response
  ): Promise<void> => {
    try {
      const {
        objective,
        search_queries,
        max_results = 10,
        mode = "one-shot",
        source_policy,
        excerpts,
        fetch_policy,
      } = req.body;

      if (!objective) {
        res.status(400).json({
          error: {
            message: "Objective parameter is required",
            code: "MISSING_OBJECTIVE",
          },
        });
        return;
      }

      const searchOptions: any = {
        objective,
        max_results: Math.min(max_results, 20),
        mode,
      };

      // Add optional parameters
      if (search_queries && Array.isArray(search_queries)) {
        searchOptions.search_queries = search_queries;
      }
      if (source_policy) {
        searchOptions.source_policy = {};
        if (source_policy.include_domains) {
          searchOptions.source_policy.include_domains =
            source_policy.include_domains;
        }
        if (source_policy.exclude_domains) {
          searchOptions.source_policy.exclude_domains =
            source_policy.exclude_domains;
        }
      }
      if (excerpts) {
        searchOptions.excerpts = excerpts;
      }
      if (fetch_policy) {
        searchOptions.fetch_policy = fetch_policy;
      }

      let results;
      if (demoMode) {
        results = generateMockSearchResults(
          objective,
          searchOptions.max_results
        );
      } else {
        results = await parallelClient!.beta.search(searchOptions);
      }

      res.json({
        success: true,
        ...results,
        demoMode: demoMode,
      });
    } catch (error: any) {
      console.error("Parallel search error:", error);
      res.status(500).json({
        error: {
          message: error.message || "Failed to perform search",
          code: "SEARCH_FAILED",
          details: error.response?.data || error.stack,
        },
      });
    }
  }
);

// Extract endpoint
router.post(
  "/extract",
  checkParallelAvailable,
  async (
    req: Request<{}, any, ExtractRequest>,
    res: Response
  ): Promise<void> => {
    try {
      const { urls, include_html = false, timeout_ms = 30000 } = req.body;

      if (!urls || !Array.isArray(urls) || urls.length === 0) {
        res.status(400).json({
          error: {
            message: "URLs array is required and cannot be empty",
            code: "MISSING_URLS",
          },
        });
        return;
      }

      // Limit number of URLs
      const limitedUrls = urls.slice(0, 10);

      // Validate URLs
      for (const url of limitedUrls) {
        try {
          new URL(url);
        } catch (err) {
          res.status(400).json({
            error: {
              message: `Invalid URL format: ${url}`,
              code: "INVALID_URL",
            },
          });
          return;
        }
      }

      const extractOptions: any = {
        urls: limitedUrls,
        include_html,
        timeout_ms,
      };

      let results;
      if (demoMode) {
        results = generateMockExtractResults(limitedUrls);
      } else {
        results = await parallelClient!.beta.extract(extractOptions);
      }

      res.json({
        success: true,
        ...results,
        demoMode: demoMode,
      });
    } catch (error: any) {
      console.error("Parallel extract error:", error);
      res.status(500).json({
        error: {
          message: error.message || "Failed to extract content",
          code: "EXTRACT_FAILED",
          details: error.response?.data || error.stack,
        },
      });
    }
  }
);

// Health check endpoint
router.get("/health", (req: Request, res: Response): void => {
  res.json({
    status: "ok",
    service: "parallel",
    demoMode: demoMode,
    timestamp: new Date().toISOString(),
  });
});

export default router;
