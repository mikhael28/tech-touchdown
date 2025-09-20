import React from 'react';
import { Article } from '../types/article';
import { Clock, MessageCircle, ThumbsUp, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact';
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, variant = 'default' }) => {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getCategoryColor = (category: string) => {
    return category === 'sports' ? 'bg-blue-500' : 'bg-green-500';
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
        {article.imageUrl && (
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-16 h-16 object-cover rounded-md flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm line-clamp-2 text-foreground">
            {article.title}
          </h3>
          <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
            <span className={`px-2 py-1 rounded-full text-white text-xs ${getCategoryColor(article.category)}`}>
              {article.category}
            </span>
            <span>{formatTimeAgo(article.publishedAt)}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <ThumbsUp className="w-3 h-3" />
            <span>{article.upvotes}</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div className="relative rounded-lg overflow-hidden border bg-card">
        {article.imageUrl && (
          <div className="aspect-video relative">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getCategoryColor(article.category)}`}>
                {article.category.toUpperCase()}
              </span>
            </div>
          </div>
        )}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-3 line-clamp-2">
            {article.title}
          </h2>
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {article.summary}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>By {article.author}</span>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{article.readTime} min read</span>
              </div>
              <span>{formatTimeAgo(article.publishedAt)}</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <ThumbsUp className="w-4 h-4" />
                <span>{article.upvotes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{article.comments}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        {article.imageUrl && (
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-24 h-24 object-cover rounded-md flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-white text-xs font-medium ${getCategoryColor(article.category)}`}>
              {article.category}
            </span>
            <span className="text-xs text-muted-foreground">{formatTimeAgo(article.publishedAt)}</span>
          </div>
          <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">
            {article.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {article.summary}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
              <span>By {article.author}</span>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{article.readTime} min</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <ThumbsUp className="w-4 h-4" />
                <span className="text-sm">{article.upvotes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{article.comments}</span>
              </div>
              <Button variant="ghost" size="sm">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
