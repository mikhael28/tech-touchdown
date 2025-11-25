import express, { Request, Response } from 'express';
import axios from 'axios';

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

// Get sports news headlines
router.get('/sports-headlines', async (req: Request, res: Response) => {
  try {
    // Using NewsAPI.org - you can get a free API key at https://newsapi.org/
    const apiKey = process.env.NEWS_API_KEY;
    
    // Fallback to ESPN RSS feed if no API key
    if (!apiKey) {
      // Fetch from ESPN RSS feed as fallback
      try {
        const espnResponse = await axios.get('https://www.espn.com/espn/rss/news', {
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; TechTouchdown/1.0)',
          },
        });
        
        // Parse RSS (simple extraction)
        const rssText = espnResponse.data;
        const itemMatches = rssText.matchAll(/<item>(.*?)<\/item>/gs);
        const headlines = [];
        
        for (const match of itemMatches) {
          const item = match[1];
          const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
          const linkMatch = item.match(/<link>(.*?)<\/link>/);
          const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
          
          if (titleMatch && linkMatch) {
            headlines.push({
              source: { id: 'espn', name: 'ESPN' },
              author: 'ESPN',
              title: titleMatch[1],
              description: null,
              url: linkMatch[1],
              urlToImage: null,
              publishedAt: pubDateMatch ? pubDateMatch[1] : new Date().toISOString(),
              content: null,
            });
          }
        }
        
        res.json({
          success: true,
          articles: headlines.slice(0, 20),
          source: 'espn-rss',
        });
        return;
      } catch (rssError) {
        console.error('Error fetching ESPN RSS:', rssError);
        
        // Ultimate fallback with mock data
        res.json({
          success: true,
          articles: [
            {
              source: { id: 'mock', name: 'Sports News' },
              author: null,
              title: 'Breaking: Latest sports news and updates from around the world',
              description: null,
              url: '#',
              urlToImage: null,
              publishedAt: new Date().toISOString(),
              content: null,
            },
            {
              source: { id: 'mock', name: 'Sports News' },
              author: null,
              title: 'Game Day: Top teams face off in crucial matchups',
              description: null,
              url: '#',
              urlToImage: null,
              publishedAt: new Date().toISOString(),
              content: null,
            },
            {
              source: { id: 'mock', name: 'Sports News' },
              author: null,
              title: 'Player Watch: Star athletes making headlines this week',
              description: null,
              url: '#',
              urlToImage: null,
              publishedAt: new Date().toISOString(),
              content: null,
            },
          ],
          source: 'mock',
        });
        return;
      }
    }
    
    // Use NewsAPI if key is available
    const response = await axios.get<NewsAPIResponse>(
      'https://newsapi.org/v2/top-headlines',
      {
        params: {
          category: 'sports',
          language: 'en',
          pageSize: 20,
          apiKey,
        },
        timeout: 10000,
      }
    );
    
    res.json({
      success: true,
      articles: response.data.articles,
      source: 'newsapi',
    });
  } catch (error: any) {
    console.error('Error fetching sports news:', error);
    
    // Fallback response with mock data
    res.json({
      success: true,
      articles: [
        {
          source: { id: 'fallback', name: 'Sports News' },
          author: null,
          title: 'Breaking: Latest sports news and updates from around the world',
          description: null,
          url: '#',
          urlToImage: null,
          publishedAt: new Date().toISOString(),
          content: null,
        },
        {
          source: { id: 'fallback', name: 'Sports News' },
          author: null,
          title: 'Game Day: Top teams face off in crucial matchups',
          description: null,
          url: '#',
          urlToImage: null,
          publishedAt: new Date().toISOString(),
          content: null,
        },
      ],
      source: 'fallback',
    });
  }
});

export default router;

