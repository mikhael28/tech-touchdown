// Service for fetching sports news headlines
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export interface NewsArticle {
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

export interface NewsResponse {
  success: boolean;
  articles: NewsArticle[];
  source: "newsapi" | "espn-rss" | "mock" | "fallback";
}

class NewsService {
  async getSportsHeadlines(): Promise<NewsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/news/sports-headlines`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching sports headlines:", error);
      // Return fallback data
      return {
        success: false,
        articles: [],
        source: "fallback",
      };
    }
  }
}

export const newsService = new NewsService();
