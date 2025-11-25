import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { blogService } from '../services/blogService';
import { BlogPost } from '../types/blog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Plus, Calendar, User, FileText, BookOpen } from 'lucide-react';

const BlogList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get status filter from URL query params (e.g., /blog?status=draft)
  const statusFilter = (searchParams.get('status') as 'all' | 'draft' | 'published' | 'archived') || 'all';

  // Check if running on localhost
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  // Filter posts on frontend
  const posts = statusFilter === 'all' 
    ? allPosts 
    : allPosts.filter(post => post.status === statusFilter);

  // Load posts on mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading all posts from database...');
      const fetchedPosts = await blogService.getAllPosts();
      console.log('✅ Successfully fetched', fetchedPosts.length, 'posts');
      setAllPosts(fetchedPosts);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error?.message || err?.message || 'Failed to load blog posts';
      setError(errorMessage);
      console.error('❌ Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatusFilter = (status: 'all' | 'draft' | 'published' | 'archived') => {
    if (status === 'all') {
      searchParams.delete('status');
    } else {
      searchParams.set('status', status);
    }
    setSearchParams(searchParams);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold flex items-center space-x-3">
              <BookOpen className="h-10 w-10" />
              <span>Tech Touchdown Blog</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Perspectives on sports, technology, and the community that bridges them
            </p>
          </div>
          {isLocalhost && (
            <Button onClick={() => navigate('/blog/new')} className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>New Post</span>
            </Button>
          )}
        </div>

        {/* Filter Tabs */}
        {isLocalhost && (
          <div className="flex space-x-2 mb-6">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => updateStatusFilter('all')}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'published' ? 'default' : 'outline'}
              onClick={() => updateStatusFilter('published')}
              size="sm"
            >
              Published
            </Button>
            <Button
              variant={statusFilter === 'draft' ? 'default' : 'outline'}
              onClick={() => updateStatusFilter('draft')}
              size="sm"
            >
              Drafts
            </Button>
            <Button
              variant={statusFilter === 'archived' ? 'default' : 'outline'}
              onClick={() => updateStatusFilter('archived')}
              size="sm"
            >
              Archived
            </Button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-500">
            <CardContent className="p-4">
              <p className="text-red-500">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && posts.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg">
                {statusFilter === 'all' 
                  ? 'No blog posts yet. Create your first post to share your thoughts!'
                  : `No ${statusFilter} posts found.`}
              </p>
            </CardContent>
          </Card>
        )}

        {!loading && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/blog/${post.slug}`)}
              >
                {post.featured_image && (
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                          : post.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt || 'No excerpt available'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                          +{post.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;

