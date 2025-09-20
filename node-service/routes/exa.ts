import { Router, Request, Response, NextFunction } from "express";
import Exa from "exa-js";

const router = Router();

// Initialize Exa client
let exaClient: Exa | null = null;
let demoMode = false;

try {
  // Try to initialize with API key - Exa expects EXASEARCH_API_KEY or EXA_API_KEY
  const apiKey = process.env.EXASEARCH_API_KEY || process.env.EXA_API_KEY;

  if (!apiKey) {
    console.warn(
      "⚠️  EXA_API_KEY or EXASEARCH_API_KEY not found. Running in demo mode with mock data."
    );
    demoMode = true;
  } else {
    exaClient = new Exa(apiKey);
    console.log("✅ Exa AI client initialized successfully");
  }
} catch (error) {
  console.error("❌ Failed to initialize Exa client:", error);
  console.warn("⚠️  Running in demo mode with mock data.");
  exaClient = null;
  demoMode = true;
}

// Mock data for demo mode
const generateMockResults = (query: string, numResults: number = 10) => {
  const mockResults = [
    {
      title: `Latest AI Breakthrough: ${query} Revolutionizes Technology`,
      url: "https://techcrunch.com/2024/01/15/ai-breakthrough-revolutionizes-tech",
      publishedDate: "2024-01-15T10:30:00Z",
      author: "Tech Reporter",
      score: 0.95,
      text: `In a groundbreaking development, researchers have made significant progress in ${query} technology. This advancement promises to transform how we interact with digital systems and could lead to major improvements in efficiency and user experience. The new approach combines machine learning with traditional algorithms to create more robust and intelligent systems.`,
      highlights: [
        `Major breakthrough in ${query} technology announced`,
        "New approach combines machine learning with traditional algorithms",
        "Potential to transform digital system interactions",
      ],
      summary: `Researchers have developed a new ${query} system that significantly improves performance and efficiency through innovative machine learning techniques.`,
    },
    {
      title: `How ${query} is Changing the Future of Work`,
      url: "https://wired.com/2024/01/14/future-of-work-ai-transformation",
      publishedDate: "2024-01-14T14:20:00Z",
      author: "Industry Analyst",
      score: 0.88,
      text: `The workplace is undergoing a dramatic transformation as ${query} technologies become more prevalent. Companies are finding new ways to integrate these tools into their daily operations, leading to increased productivity and new job opportunities. However, this shift also brings challenges as workers adapt to new technologies.`,
      highlights: [
        `${query} technologies transforming workplace operations`,
        "Companies seeing increased productivity with new tools",
        "Workers adapting to new technological challenges",
      ],
      summary: `${query} is revolutionizing workplace operations, creating new opportunities while presenting adaptation challenges for workers.`,
    },
    {
      title: `The Ethics of ${query}: Balancing Innovation and Responsibility`,
      url: "https://mit.edu/2024/01/13/ai-ethics-responsibility",
      publishedDate: "2024-01-13T09:15:00Z",
      author: "Ethics Researcher",
      score: 0.82,
      text: `As ${query} becomes more powerful and widespread, questions about its ethical implications grow more pressing. Researchers and policymakers are working to establish guidelines that ensure these technologies are developed and deployed responsibly. The conversation around AI ethics is crucial for building public trust and ensuring beneficial outcomes.`,
      highlights: [
        "Growing concerns about ethical implications of AI",
        "Researchers developing responsible deployment guidelines",
        "Public trust crucial for AI adoption",
      ],
      summary: `Ethical considerations around ${query} are becoming increasingly important as the technology becomes more powerful and widespread.`,
    },
  ];

  return mockResults.slice(0, numResults);
};

// Middleware to check if Exa is available or demo mode
const checkExaAvailable = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!exaClient && !demoMode) {
    res.status(503).json({
      error: {
        message:
          "Exa AI service failed to initialize. Please check your configuration.",
        code: "EXA_INITIALIZATION_FAILED",
      },
    });
    return;
  }
  next();
};

// Types for request bodies
interface SearchRequest {
  query: string;
  numResults?: number;
  includeDomains?: string[];
  excludeDomains?: string[];
  startPublishedDate?: string;
  endPublishedDate?: string;
  useAutoprompt?: boolean;
  type?: "neural" | "keyword";
}

interface SearchWithContentRequest extends SearchRequest {
  text?: boolean | { maxCharacters?: number; includeHtmlTags?: boolean };
  highlights?: boolean | { numSentences?: number; highlightsPerUrl?: number };
  summary?: boolean | { query?: string };
}

interface FindSimilarRequest {
  url: string;
  numResults?: number;
  excludeSourceDomain?: boolean;
}

interface GetContentsRequest {
  urls: string[];
  text?: boolean | { maxCharacters?: number; includeHtmlTags?: boolean };
  highlights?: boolean | { numSentences?: number; highlightsPerUrl?: number };
  summary?: boolean | { query?: string };
}

interface AnswerRequest {
  query: string;
  includeDomains?: string[];
  excludeDomains?: string[];
  startPublishedDate?: string;
  endPublishedDate?: string;
  useAutoprompt?: boolean;
  outputSchema?: Record<string, any>;
}

// Basic search endpoint
router.post(
  "/search",
  checkExaAvailable,
  async (
    req: Request<{}, any, SearchRequest>,
    res: Response
  ): Promise<void> => {
    try {
      const {
        query,
        numResults = 10,
        includeDomains,
        excludeDomains,
        startPublishedDate,
        endPublishedDate,
        useAutoprompt = true,
        type = "neural",
      } = req.body;

      if (!query) {
        res.status(400).json({
          error: {
            message: "Query parameter is required",
            code: "MISSING_QUERY",
          },
        });
        return;
      }

      const searchOptions: any = {
        numResults: Math.min(numResults, 50), // Limit max results
        useAutoprompt,
        type,
      };

      // Add optional filters
      if (includeDomains && Array.isArray(includeDomains)) {
        searchOptions.includeDomains = includeDomains;
      }
      if (excludeDomains && Array.isArray(excludeDomains)) {
        searchOptions.excludeDomains = excludeDomains;
      }
      if (startPublishedDate) {
        searchOptions.startPublishedDate = startPublishedDate;
      }
      if (endPublishedDate) {
        searchOptions.endPublishedDate = endPublishedDate;
      }

      let results;
      if (demoMode) {
        // Use mock data for demo mode
        const mockResults = generateMockResults(
          query,
          searchOptions.numResults
        );
        results = {
          results: mockResults,
          autopromptString: `Demo search for: ${query}`,
        };
      } else {
        results = await exaClient!.search(query, searchOptions);
      }

      res.json({
        success: true,
        query,
        options: searchOptions,
        results: results.results,
        autopromptString: results.autopromptString,
        demoMode: demoMode,
      });
    } catch (error: any) {
      console.error("Exa search error:", error);
      res.status(500).json({
        error: {
          message: error.message || "Failed to perform search",
          code: "SEARCH_FAILED",
        },
      });
    }
  }
);

// Search with content extraction
router.post(
  "/search-with-content",
  checkExaAvailable,
  async (
    req: Request<{}, any, SearchWithContentRequest>,
    res: Response
  ): Promise<void> => {
    try {
      const {
        query,
        numResults = 10,
        includeDomains,
        excludeDomains,
        startPublishedDate,
        endPublishedDate,
        useAutoprompt = true,
        type = "neural",
        text = true,
        highlights = false,
        summary = false,
      } = req.body;

      if (!query) {
        res.status(400).json({
          error: {
            message: "Query parameter is required",
            code: "MISSING_QUERY",
          },
        });
        return;
      }

      const searchOptions: any = {
        numResults: Math.min(numResults, 20), // Lower limit for content extraction
        useAutoprompt,
        type,
      };

      // Add optional filters
      if (includeDomains && Array.isArray(includeDomains)) {
        searchOptions.includeDomains = includeDomains;
      }
      if (excludeDomains && Array.isArray(excludeDomains)) {
        searchOptions.excludeDomains = excludeDomains;
      }
      if (startPublishedDate) {
        searchOptions.startPublishedDate = startPublishedDate;
      }
      if (endPublishedDate) {
        searchOptions.endPublishedDate = endPublishedDate;
      }

      // Content options
      const contentOptions: any = {};
      if (text) {
        contentOptions.text = typeof text === "object" ? text : true;
      }
      if (highlights) {
        contentOptions.highlights = highlights;
      }
      if (summary) {
        contentOptions.summary = summary;
      }

      let results;
      if (demoMode) {
        // Use mock data for demo mode
        const mockResults = generateMockResults(
          query,
          searchOptions.numResults
        );
        results = {
          results: mockResults,
          autopromptString: `Demo search with content for: ${query}`,
        };
      } else {
        results = await exaClient!.searchAndContents(query, {
          ...searchOptions,
          ...contentOptions,
        });
      }

      res.json({
        success: true,
        query,
        options: searchOptions,
        contentOptions,
        results: results.results,
        autopromptString: results.autopromptString,
        demoMode: demoMode,
      });
    } catch (error: any) {
      console.error("Exa search with content error:", error);
      res.status(500).json({
        error: {
          message: error.message || "Failed to perform search with content",
          code: "SEARCH_CONTENT_FAILED",
        },
      });
    }
  }
);

// Find similar pages
router.post(
  "/find-similar",
  checkExaAvailable,
  async (
    req: Request<{}, any, FindSimilarRequest>,
    res: Response
  ): Promise<void> => {
    try {
      const { url, numResults = 10, excludeSourceDomain = false } = req.body;

      if (!url) {
        res.status(400).json({
          error: {
            message: "URL parameter is required",
            code: "MISSING_URL",
          },
        });
        return;
      }

      // Validate URL format
      try {
        new URL(url);
      } catch (err) {
        res.status(400).json({
          error: {
            message: "Invalid URL format",
            code: "INVALID_URL",
          },
        });
        return;
      }

      const options = {
        numResults: Math.min(numResults, 50),
        excludeSourceDomain,
      };

      const results = await exaClient!.findSimilar(url, options as any);

      res.json({
        success: true,
        sourceUrl: url,
        options,
        results: results.results,
      });
    } catch (error: any) {
      console.error("Exa find similar error:", error);
      res.status(500).json({
        error: {
          message: error.message || "Failed to find similar pages",
          code: "FIND_SIMILAR_FAILED",
        },
      });
    }
  }
);

// Get content from URLs
router.post(
  "/get-contents",
  checkExaAvailable,
  async (
    req: Request<{}, any, GetContentsRequest>,
    res: Response
  ): Promise<void> => {
    try {
      const {
        urls,
        text = true,
        highlights = false,
        summary = false,
      } = req.body;

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
      const limitedUrls = urls.slice(0, 20);

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

      const contentOptions: any = {};
      if (text) {
        contentOptions.text = typeof text === "object" ? text : true;
      }
      if (highlights) {
        contentOptions.highlights = highlights;
      }
      if (summary) {
        contentOptions.summary = summary;
      }

      const results = await exaClient!.getContents(limitedUrls, contentOptions);

      res.json({
        success: true,
        requestedUrls: limitedUrls,
        contentOptions,
        results: results.results,
      });
    } catch (error: any) {
      console.error("Exa get contents error:", error);
      res.status(500).json({
        error: {
          message: error.message || "Failed to get content",
          code: "GET_CONTENT_FAILED",
        },
      });
    }
  }
);

// AI-powered answer endpoint
router.post(
  "/answer",
  checkExaAvailable,
  async (
    req: Request<{}, any, AnswerRequest>,
    res: Response
  ): Promise<void> => {
    try {
      const {
        query,
        includeDomains,
        excludeDomains,
        startPublishedDate,
        endPublishedDate,
        useAutoprompt = true,
        outputSchema,
      } = req.body;

      if (!query) {
        res.status(400).json({
          error: {
            message: "Query parameter is required",
            code: "MISSING_QUERY",
          },
        });
        return;
      }

      const options: any = {
        useAutoprompt,
      };

      // Add optional filters
      if (includeDomains && Array.isArray(includeDomains)) {
        options.includeDomains = includeDomains;
      }
      if (excludeDomains && Array.isArray(excludeDomains)) {
        options.excludeDomains = excludeDomains;
      }
      if (startPublishedDate) {
        options.startPublishedDate = startPublishedDate;
      }
      if (endPublishedDate) {
        options.endPublishedDate = endPublishedDate;
      }
      if (outputSchema) {
        options.outputSchema = outputSchema;
      }

      const result = await exaClient!.answer(query, options);

      res.json({
        success: true,
        query,
        options,
        answer: result.answer,
        citations: result.citations,
      });
    } catch (error: any) {
      console.error("Exa answer error:", error);
      res.status(500).json({
        error: {
          message: error.message || "Failed to generate answer",
          code: "ANSWER_FAILED",
        },
      });
    }
  }
);

// Streaming answer endpoint
router.post(
  "/stream-answer",
  checkExaAvailable,
  async (
    req: Request<{}, any, Omit<AnswerRequest, "outputSchema">>,
    res: Response
  ): Promise<void> => {
    try {
      const {
        query,
        includeDomains,
        excludeDomains,
        startPublishedDate,
        endPublishedDate,
        useAutoprompt = true,
      } = req.body;

      if (!query) {
        res.status(400).json({
          error: {
            message: "Query parameter is required",
            code: "MISSING_QUERY",
          },
        });
        return;
      }

      const options: any = {
        useAutoprompt,
      };

      // Add optional filters
      if (includeDomains && Array.isArray(includeDomains)) {
        options.includeDomains = includeDomains;
      }
      if (excludeDomains && Array.isArray(excludeDomains)) {
        options.excludeDomains = excludeDomains;
      }
      if (startPublishedDate) {
        options.startPublishedDate = startPublishedDate;
      }
      if (endPublishedDate) {
        options.endPublishedDate = endPublishedDate;
      }

      // Set up Server-Sent Events
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Cache-Control",
      });

      try {
        for await (const chunk of exaClient!.streamAnswer(query, options)) {
          const data = JSON.stringify(chunk);
          res.write(`data: ${data}\n\n`);
        }

        res.write("data: [DONE]\n\n");
        res.end();
      } catch (streamError: any) {
        const errorData = JSON.stringify({
          error: {
            message: streamError.message || "Stream failed",
            code: "STREAM_FAILED",
          },
        });
        res.write(`data: ${errorData}\n\n`);
        res.end();
      }
    } catch (error: any) {
      console.error("Exa stream answer error:", error);
      res.status(500).json({
        error: {
          message: error.message || "Failed to start answer stream",
          code: "STREAM_START_FAILED",
        },
      });
    }
  }
);

export default router;
