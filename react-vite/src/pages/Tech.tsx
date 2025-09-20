import React from 'react';
import { mockArticles } from '../data/mockArticles';
import ArticleList from '../components/ArticleList';
import { Laptop, TrendingUp, Clock, Zap } from 'lucide-react';

const Tech = () => {
  const techArticles = mockArticles.filter(article => article.category === 'tech');
  const featuredTech = techArticles.filter(article => article.featured);
  const recentTech = techArticles.filter(article => !article.featured);

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-500 dark:bg-green-600 rounded-lg">
            <Laptop className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tech & Startups</h1>
            <p className="text-muted-foreground">Latest news from the tech and startup world</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center space-x-4">
            <div className="rounded-lg bg-green-100 dark:bg-green-900 p-2">
              <Laptop className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Articles
              </p>
              <p className="text-2xl font-bold">{techArticles.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center space-x-4">
            <div className="rounded-lg bg-blue-100 dark:bg-blue-900 p-2">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Upvotes
              </p>
              <p className="text-2xl font-bold">
                {techArticles.reduce((sum, article) => sum + article.upvotes, 0).toLocaleString()}
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
                {Math.round(techArticles.reduce((sum, article) => sum + article.readTime, 0) / techArticles.length)} min
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center space-x-4">
            <div className="rounded-lg bg-purple-100 dark:bg-purple-900 p-2">
              <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Hot Topics
              </p>
              <p className="text-2xl font-bold">
                {new Set(techArticles.flatMap(article => article.tags)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Articles */}
      {featuredTech.length > 0 && (
        <ArticleList 
          articles={featuredTech} 
          variant="featured" 
          title="Featured Tech News" 
        />
      )}

      {/* Recent Articles */}
      <ArticleList 
        articles={recentTech} 
        title="Recent Tech News" 
      />
    </div>
  );
};

export default Tech;
