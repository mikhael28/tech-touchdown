import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogService } from '../services/blogService';
import { BlogPost as BlogPostType } from '../types/blog';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { ArrowLeft, Edit, Trash2, Calendar, User, Tag } from 'lucide-react';
import 'highlight.js/styles/github-dark.css';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if running on localhost
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  // Load post when component mounts or slug changes
  useEffect(() => {
    if (slug) {
      loadPost(slug);
    }
  }, [slug]);

  const loadPost = async (postSlug: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading post:', postSlug);
      const fetchedPost = await blogService.getPostBySlug(postSlug);
      console.log('✅ Post loaded:', fetchedPost.title);
      setPost(fetchedPost);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error?.message || err?.message || 'Failed to load blog post';
      setError(errorMessage);
      console.error('❌ Error loading post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!post || !confirm('Are you sure you want to delete this post?')) return;

    try {
      setLoading(true);
      setError(null);
      await blogService.deletePost(post.slug);
      console.log('✅ Post deleted');
      navigate('/blog');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error?.message || err?.message || 'Failed to delete blog post';
      setError(errorMessage);
      console.error('❌ Error deleting post:', err);
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/blog')}
            className="mb-4 flex items-center space-x-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Blog</span>
          </Button>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/blog')}
            className="mb-4 flex items-center space-x-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Blog</span>
          </Button>
          <Card className="border-red-500">
            <CardContent className="p-8 text-center">
              <p className="text-red-500 text-lg mb-4">
                {error || 'Blog post not found'}
              </p>
              <Button onClick={() => navigate('/blog')}>
                Return to Blog
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Success state - render post
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/blog')}
            className="mb-4 flex items-center space-x-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Blog</span>
          </Button>

          {isLocalhost && (
            <div className="flex items-center space-x-2 mb-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/blog/${post.slug}/edit`)}
                className="flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeletePost}
                className="flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </Button>
            </div>
          )}
        </div>

        {/* Post Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <span
                className={`px-3 py-1 rounded text-sm font-semibold ${
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
            
            {post.featured_image && (
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}

            <CardTitle className="text-4xl">{post.title}</CardTitle>
            
            <div className="flex items-center space-x-6 text-muted-foreground mt-4">
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
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center space-x-1"
                  >
                    <Tag className="h-3 w-3" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            )}
          </CardHeader>

          <CardContent>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeRaw]}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogPost;

