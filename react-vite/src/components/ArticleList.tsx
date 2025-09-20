import React from 'react';
import { Article } from '../types/article';
import ArticleCard from './ArticleCard';

interface ArticleListProps {
  articles: Article[];
  variant?: 'default' | 'featured' | 'compact';
  title?: string;
  showCategory?: boolean;
}

const ArticleList: React.FC<ArticleListProps> = ({ 
  articles, 
  variant = 'default', 
  title,
  showCategory = false 
}) => {
  const featuredArticles = articles.filter(article => article.featured);
  const regularArticles = articles.filter(article => !article.featured);

  if (variant === 'featured') {
    return (
      <div className="space-y-6">
        {title && (
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featuredArticles.slice(0, 2).map((article) => (
            <ArticleCard key={article.id} article={article} variant="featured" />
          ))}
        </div>
        {regularArticles.length > 0 && (
          <div className="space-y-4">
            {regularArticles.slice(0, 4).map((article) => (
              <ArticleCard key={article.id} article={article} variant="compact" />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="space-y-2">
        {title && (
          <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
        )}
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} variant="compact" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {title && (
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      )}
      <div className="space-y-4">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default ArticleList;
