import React, { useEffect, useState, useRef } from "react";
import { newsService, NewsArticle } from "../services/newsService";

// Cache key for localStorage
const CACHE_KEY = "sportsChyronCache";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

interface CachedData {
  articles: NewsArticle[];
  timestamp: number;
}

// Helper function to get cached articles
export const getCachedSportsArticles = (): NewsArticle[] | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data: CachedData = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid (less than 30 minutes old)
    if (now - data.timestamp < CACHE_DURATION) {
      console.log("📦 Using cached sports articles");
      return data.articles;
    }

    console.log("⏰ Cache expired, need to fetch new articles");
    return null;
  } catch (error) {
    console.error("Error reading cache:", error);
    return null;
  }
};

// Helper function to set cached articles
const setCachedSportsArticles = (articles: NewsArticle[]): void => {
  try {
    const data: CachedData = {
      articles,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    console.log("💾 Cached sports articles");
  } catch (error) {
    console.error("Error writing cache:", error);
  }
};

const SportsChyron: React.FC = () => {
  // Start with fallback headlines so the chyron always shows
  const [headlines, setHeadlines] = useState<NewsArticle[]>([
    {
      source: { id: "tech-touchdown", name: "Tech Touchdown" },
      author: null,
      title: "Welcome to Tech Touchdown - Your source for Sports + Tech news",
      description: null,
      url: "#",
      urlToImage: null,
      publishedAt: new Date().toISOString(),
      content: null,
    },
    {
      source: { id: "sports-news", name: "Sports News" },
      author: null,
      title: "Loading latest sports headlines...",
      description: null,
      url: "#",
      urlToImage: null,
      publishedAt: new Date().toISOString(),
      content: null,
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHeadlines = async () => {
      try {
        // Check cache first
        const cachedArticles = getCachedSportsArticles();
        if (cachedArticles && cachedArticles.length > 0) {
          setHeadlines(cachedArticles);
          setIsLoading(false);
          return;
        }

        // Cache miss or expired - fetch new data
        const response = await newsService.getSportsHeadlines();
        console.log("Sports headlines response:", response);

        if (response.success && response.articles.length > 0) {
          console.log(
            `✅ Loaded ${response.articles.length} headlines from ${response.source}`
          );
          setHeadlines(response.articles);
          setCachedSportsArticles(response.articles);
        } else {
          console.warn(
            "⚠️ No articles returned from API, using fallback headlines"
          );
          // Use fallback headlines if API returns nothing
          setHeadlines([
            {
              source: { id: "sports-update", name: "Sports Update" },
              author: null,
              title: "Stay tuned for the latest sports news and updates",
              description: null,
              url: "#",
              urlToImage: null,
              publishedAt: new Date().toISOString(),
              content: null,
            },
            {
              source: { id: "game-day", name: "Game Day" },
              author: null,
              title: "Check back soon for breaking sports headlines",
              description: null,
              url: "#",
              urlToImage: null,
              publishedAt: new Date().toISOString(),
              content: null,
            },
          ]);
        }
      } catch (error) {
        console.error("❌ Error fetching headlines:", error);
        // Keep existing fallback headlines on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeadlines();

    // Refresh headlines every 30 minutes (to match cache duration)
    const interval = setInterval(fetchHeadlines, CACHE_DURATION);
    return () => clearInterval(interval);
  }, []);

  // Duplicate headlines to create seamless loop
  const displayHeadlines = [...headlines, ...headlines, ...headlines];

  return (
    <div className="fixed bottom-0 left-64 right-0 z-30 h-[10vh] overflow-hidden border-t-2 border-red-600 bg-gradient-to-r from-red-900 via-red-800 to-red-900">
      {/* Breaking News Label */}
      <div className="absolute bottom-0 left-0 top-0 z-10 flex items-center border-r-2 border-red-600 bg-red-950 px-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          <span className="text-sm font-bold uppercase tracking-wider text-white">
            Breaking Sports
          </span>
        </div>
      </div>

      {/* Scrolling Headlines */}
      <div className="ml-44 flex h-full items-center">
        <div
          ref={scrollRef}
          className="animate-scroll flex items-center gap-8"
          style={{
            animationDuration: `${headlines.length * 10}s`,
          }}
        >
          {displayHeadlines.map((article, index) => (
            <div
              key={`${article.url}-${index}`}
              className="flex items-center gap-3 whitespace-nowrap"
            >
              {/* Separator */}
              <span className="text-2xl text-yellow-400">•</span>

              {/* Headline */}
              <a
                href={article.url !== "#" ? article.url : undefined}
                target={article.url !== "#" ? "_blank" : undefined}
                rel={article.url !== "#" ? "noopener noreferrer" : undefined}
                className={`text-base font-medium text-white ${
                  article.url !== "#"
                    ? "cursor-pointer hover:text-yellow-300"
                    : "cursor-default"
                } transition-colors duration-200`}
              >
                <span className="mr-2 font-bold text-yellow-400">
                  {article.source.name}
                </span>
                {article.title}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        .animate-scroll {
          animation: scroll linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default SportsChyron;
