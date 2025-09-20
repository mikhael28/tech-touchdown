import React from 'react';
import { mockArticles } from '../data/mockArticles';
import ArticleList from '../components/ArticleList';
import { Trophy, TrendingUp, Clock } from 'lucide-react';

const Sports = () => {
  const sportsArticles = mockArticles.filter(article => article.category === 'sports');
  const featuredSports = sportsArticles.filter(article => article.featured);
  const recentSports = sportsArticles.filter(article => !article.featured);

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500 dark:bg-blue-600 rounded-lg">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sports</h1>
            <p className="text-muted-foreground">Latest news from the world of sports</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center space-x-4">
            <div className="rounded-lg bg-blue-100 dark:bg-blue-900 p-2">
              <Trophy className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Articles
              </p>
              <p className="text-2xl font-bold">{sportsArticles.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center space-x-4">
            <div className="rounded-lg bg-green-100 dark:bg-green-900 p-2">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Upvotes
              </p>
              <p className="text-2xl font-bold">
                {sportsArticles.reduce((sum, article) => sum + article.upvotes, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center space-x-4">
            <div className="rounded-lg bg-yellow-100 dark:bg-yellow-900 p-2">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Avg Read Time
              </p>
              <p className="text-2xl font-bold">
                {Math.round(sportsArticles.reduce((sum, article) => sum + article.readTime, 0) / sportsArticles.length)} min
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Articles */}
      {featuredSports.length > 0 && (
        <ArticleList 
          articles={featuredSports} 
          variant="featured" 
          title="Featured Sports News" 
        />
      )}

      {/* Recent Articles */}
      <ArticleList 
        articles={recentSports} 
        title="Recent Sports News" 
      />
    </div>
  );
};

export default Sports;
