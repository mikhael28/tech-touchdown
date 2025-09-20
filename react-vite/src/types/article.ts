export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishedAt: string;
  category: "sports" | "tech";
  tags: string[];
  upvotes: number;
  comments: number;
  readTime: number; // in minutes
  featured?: boolean;
  imageUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}
