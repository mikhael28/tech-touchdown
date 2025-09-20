import React from "react";
import { mockArticles } from "../data/mockArticles";
import ArticleList from "../components/ArticleList";
import { Trophy, Laptop, TrendingUp, Users, Clock, MessageCircle } from "lucide-react";

const Home = () => {
  const allArticles = mockArticles;
  const featuredArticles = allArticles.filter(article => article.featured);
  const sportsArticles = allArticles.filter(article => article.category === 'sports');
  const techArticles = allArticles.filter(article => article.category === 'tech');
  const recentArticles = allArticles.filter(article => !article.featured).slice(0, 6);

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Welcome to Tech Touchdown</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your one-stop destination for the latest sports news and tech innovation. 
          Stay updated with breaking news from the world of athletics and technology.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center space-x-4">
            <div className="rounded-lg bg-blue-100 dark:bg-blue-900 p-2">
              <Trophy className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Sports Articles
              </p>
              <p className="text-2xl font-bold">{sportsArticles.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center space-x-4">
            <div className="rounded-lg bg-green-100 dark:bg-green-900 p-2">
              <Laptop className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Tech Articles
              </p>
              <p className="text-2xl font-bold">{techArticles.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center space-x-4">
            <div className="rounded-lg bg-purple-100 dark:bg-purple-900 p-2">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Upvotes
              </p>
              <p className="text-2xl font-bold">
                {allArticles.reduce((sum, article) => sum + article.upvotes, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center space-x-4">
            <div className="rounded-lg bg-yellow-100 dark:bg-yellow-900 p-2">
              <MessageCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Comments
              </p>
              <p className="text-2xl font-bold">
                {allArticles.reduce((sum, article) => sum + article.comments, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <ArticleList 
          articles={featuredArticles} 
          variant="featured" 
          title="Featured Stories" 
        />
      )}

      {/* Recent Articles */}
      <ArticleList 
        articles={recentArticles} 
        title="Latest News" 
      />
    </div>
  );
};

export default Home;
