import React, { useEffect, useState, useRef } from 'react';
import { newsService, NewsArticle } from '../services/newsService';

const SportsChyron: React.FC = () => {
  // Start with fallback headlines so the chyron always shows
  const [headlines, setHeadlines] = useState<NewsArticle[]>([
    {
      source: { id: 'tech-touchdown', name: 'Tech Touchdown' },
      author: null,
      title: 'Welcome to Tech Touchdown - Your source for Sports + Tech news',
      description: null,
      url: '#',
      urlToImage: null,
      publishedAt: new Date().toISOString(),
      content: null,
    },
    {
      source: { id: 'sports-news', name: 'Sports News' },
      author: null,
      title: 'Loading latest sports headlines...',
      description: null,
      url: '#',
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
        const response = await newsService.getSportsHeadlines();
        if (response.success && response.articles.length > 0) {
          setHeadlines(response.articles);
        } else {
          // Use fallback headlines if API returns nothing
          setHeadlines([
            {
              source: { id: 'sports-update', name: 'Sports Update' },
              author: null,
              title: 'Stay tuned for the latest sports news and updates',
              description: null,
              url: '#',
              urlToImage: null,
              publishedAt: new Date().toISOString(),
              content: null,
            },
            {
              source: { id: 'game-day', name: 'Game Day' },
              author: null,
              title: 'Check back soon for breaking sports headlines',
              description: null,
              url: '#',
              urlToImage: null,
              publishedAt: new Date().toISOString(),
              content: null,
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching headlines:', error);
        // Keep existing fallback headlines on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeadlines();

    // Refresh headlines every 5 minutes
    const interval = setInterval(fetchHeadlines, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Duplicate headlines to create seamless loop
  const displayHeadlines = [...headlines, ...headlines, ...headlines];

  return (
    <div className="fixed bottom-0 left-64 right-0 z-30 h-[10vh] bg-gradient-to-r from-red-900 via-red-800 to-red-900 border-t-2 border-red-600 overflow-hidden">
      {/* Breaking News Label */}
      <div className="absolute left-0 top-0 bottom-0 z-10 bg-red-950 px-4 flex items-center border-r-2 border-red-600">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-white font-bold text-sm uppercase tracking-wider">
            Breaking Sports
          </span>
        </div>
      </div>

      {/* Scrolling Headlines */}
      <div className="ml-44 h-full flex items-center">
        <div
          ref={scrollRef}
          className="flex items-center gap-8 animate-scroll"
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
              <span className="text-yellow-400 text-2xl">•</span>
              
              {/* Headline */}
              <a
                href={article.url !== '#' ? article.url : undefined}
                target={article.url !== '#' ? '_blank' : undefined}
                rel={article.url !== '#' ? 'noopener noreferrer' : undefined}
                className={`text-white text-base font-medium ${
                  article.url !== '#' ? 'hover:text-yellow-300 cursor-pointer' : 'cursor-default'
                } transition-colors duration-200`}
              >
                <span className="text-yellow-400 font-bold mr-2">
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

