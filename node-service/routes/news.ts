import express, { Request, Response } from "express";
import axios from "axios";

const router = express.Router();

interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

// Convert NewsAPI article to unified search result format
function convertToUnifiedFormat(article: NewsArticle) {
  return {
    url: article.url,
    title: article.title,
    publishedDate: article.publishedAt,
    author: article.author || article.source.name,
    score: 1.0,
    summary: article.description || undefined,
    text: article.content || undefined,
    source: "news" as const,
  };
}

// General search endpoint - search for news articles by query
router.post("/search", async (req: Request, res: Response) => {
  try {
    const {
      query,
      numResults = 10,
      category,
      language = "en",
      sortBy = "publishedAt",
      from,
      to,
    } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Query parameter is required",
      });
    }

    const apiKey = process.env.NEWS_API_KEY;

    // Fallback to demo data if no API key
    if (!apiKey) {
      console.warn("⚠️  NEWS_API_KEY not found - using demo mode");
      const demoArticles = [
        {
          source: { id: "demo", name: "Demo News" },
          author: "Demo Author",
          title: `Demo: ${query} - Latest developments and insights`,
          description: `This is a demo article about ${query}. In production, this would show real news articles from NewsAPI.org`,
          url: "https://newsapi.org",
          urlToImage: null,
          publishedAt: new Date().toISOString(),
          content: `Demo content for ${query}. Get a free API key at https://newsapi.org to see real results.`,
        },
        {
          source: { id: "demo", name: "Demo Tech News" },
          author: "Demo Tech Reporter",
          title: `Breaking: ${query} trends and analysis`,
          description: `Comprehensive coverage of ${query} with expert analysis and commentary.`,
          url: "https://newsapi.org",
          urlToImage: null,
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          content: `In-depth analysis of ${query}. Real articles available with API key.`,
        },
        {
          source: { id: "demo", name: "Demo Sports & Tech" },
          author: "Demo Analyst",
          title: `${query}: What you need to know today`,
          description: `Key updates and essential information about ${query}.`,
          url: "https://newsapi.org",
          urlToImage: null,
          publishedAt: new Date(Date.now() - 7200000).toISOString(),
          content: `Summary of ${query} developments. Sign up at NewsAPI.org for real-time news.`,
        },
      ];

      return res.json({
        success: true,
        results: demoArticles.slice(0, numResults).map(convertToUnifiedFormat),
        demoMode: true,
        autopromptString: query,
      });
    }

    // Use NewsAPI if key is available
    const params: any = {
      q: query,
      pageSize: Math.min(numResults, 100),
      language,
      sortBy,
      apiKey,
    };

    if (category) params.category = category;
    if (from) params.from = from;
    if (to) params.to = to;

    const response = await axios.get<NewsAPIResponse>(
      "https://newsapi.org/v2/everything",
      {
        params,
        timeout: 10000,
      }
    );

    return res.json({
      success: true,
      results: response.data.articles.map(convertToUnifiedFormat),
      autopromptString: query,
    });
  } catch (error: any) {
    console.error("Error searching news:", error);

    // Provide error response with fallback data
    return res.status(error.response?.status || 500).json({
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Failed to search news",
      results: [],
    });
  }
});

// Get sports news headlines
router.get("/sports-headlines", async (req: Request, res: Response) => {
  try {
    // Using NewsAPI.org - you can get a free API key at https://newsapi.org/
    const apiKey = process.env.NEWS_API_KEY;

    // Fallback to ESPN RSS feed if no API key
    if (!apiKey) {
      // Fetch from ESPN RSS feed as fallback
      try {
        const espnResponse = await axios.get(
          "https://www.espn.com/espn/rss/news",
          {
            timeout: 10000,
            headers: {
              "User-Agent": "Mozilla/5.0 (compatible; TechTouchdown/1.0)",
            },
          }
        );

        // Parse RSS (simple extraction)
        const rssText = espnResponse.data;
        const itemMatches = rssText.matchAll(/<item>(.*?)<\/item>/gs);
        const headlines = [];

        for (const match of itemMatches) {
          const item = match[1];
          const titleMatch = item.match(
            /<title><!\[CDATA\[(.*?)\]\]><\/title>/
          );
          const linkMatch = item.match(/<link>(.*?)<\/link>/);
          const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);

          if (titleMatch && linkMatch) {
            headlines.push({
              source: { id: "espn", name: "ESPN" },
              author: "ESPN",
              title: titleMatch[1],
              description: null,
              url: linkMatch[1],
              urlToImage: null,
              publishedAt: pubDateMatch
                ? pubDateMatch[1]
                : new Date().toISOString(),
              content: null,
            });
          }
        }

        res.json({
          success: true,
          articles: headlines.slice(0, 20),
          source: "espn-rss",
        });
        return;
      } catch (rssError) {
        console.error("Error fetching ESPN RSS:", rssError);

        // Ultimate fallback with mock data
        res.json({
          success: true,
          articles: [
            {
              source: { id: "mock", name: "Sports News" },
              author: null,
              title:
                "Breaking: Latest sports news and updates from around the world",
              description: null,
              url: "#",
              urlToImage: null,
              publishedAt: new Date().toISOString(),
              content: null,
            },
            {
              source: { id: "mock", name: "Sports News" },
              author: null,
              title: "Game Day: Top teams face off in crucial matchups",
              description: null,
              url: "#",
              urlToImage: null,
              publishedAt: new Date().toISOString(),
              content: null,
            },
            {
              source: { id: "mock", name: "Sports News" },
              author: null,
              title: "Player Watch: Star athletes making headlines this week",
              description: null,
              url: "#",
              urlToImage: null,
              publishedAt: new Date().toISOString(),
              content: null,
            },
          ],
          source: "mock",
        });
        return;
      }
    }

    // Use NewsAPI if key is available
    const response = await axios.get<NewsAPIResponse>(
      "https://newsapi.org/v2/top-headlines",
      {
        params: {
          category: "sports",
          language: "en",
          pageSize: 20,
          apiKey,
        },
        timeout: 10000,
      }
    );

    res.json({
      success: true,
      articles: response.data.articles,
      source: "newsapi",
    });
  } catch (error: any) {
    console.error("Error fetching sports news:", error);

    // Fallback response with mock data
    res.json({
      success: true,
      articles: [
        {
          source: { id: "fallback", name: "Sports News" },
          author: null,
          title:
            "Breaking: Latest sports news and updates from around the world",
          description: null,
          url: "#",
          urlToImage: null,
          publishedAt: new Date().toISOString(),
          content: null,
        },
        {
          source: { id: "fallback", name: "Sports News" },
          author: null,
          title: "Game Day: Top teams face off in crucial matchups",
          description: null,
          url: "#",
          urlToImage: null,
          publishedAt: new Date().toISOString(),
          content: null,
        },
      ],
      source: "fallback",
    });
  }
});

// Health check endpoint
router.get("/health", (req: Request, res: Response) => {
  const apiKey = process.env.NEWS_API_KEY;
  res.json({
    status: "ok",
    service: "NewsAPI",
    demoMode: !apiKey,
  });
});

export default router;
