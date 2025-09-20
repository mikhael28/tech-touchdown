export interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  source: string;
  author: string;
  publishedAt: string;
  category: 'nfl' | 'tech' | 'startups' | 'all';
  readTime: number;
  likes: number;
  comments: number;
}

export type Category = 'all' | 'nfl' | 'tech' | 'startups';