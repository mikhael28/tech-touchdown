import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { blogService } from '../services/blogService';
import { BlogPost, BlogPostInput } from '../types/blog';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import MarkdownEditor from '../components/MarkdownEditor';
import { ArrowLeft } from 'lucide-react';

const BlogEditor: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(!!slug);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');

  const isEditMode = !!slug;

  // Form state
  const [formData, setFormData] = useState<BlogPostInput>({
    title: '',
    content: '',
    excerpt: '',
    author: user?.login || 'Tech Touchdown Team',
    author_email: user?.email || '',
    status: 'draft',
    featured_image: '',
    tags: [],
  });

  // Load existing post if in edit mode
  useEffect(() => {
    if (slug) {
      loadPost(slug);
    }
  }, [slug]);

  const loadPost = async (postSlug: string) => {
    try {
      setLoadingPost(true);
      setError(null);
      console.log('Loading post for editing:', postSlug);
      const post = await blogService.getPostBySlug(postSlug);
      console.log('✅ Post loaded for editing:', post.title);
      
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || '',
        author: post.author,
        author_email: post.author_email || '',
        status: post.status,
        featured_image: post.featured_image || '',
        tags: post.tags || [],
      });
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error?.message || err?.message || 'Failed to load blog post';
      setError(errorMessage);
      console.error('❌ Error loading post:', err);
    } finally {
      setLoadingPost(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      setError('Title and content are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isEditMode && slug) {
        console.log('📝 Updating post:', slug);
        await blogService.updatePost(slug, formData);
        console.log('✅ Post updated successfully');
        navigate(`/blog/${slug}`);
      } else {
        console.log('📝 Creating new post');
        const createdPost = await blogService.createPost(formData);
        console.log('✅ Post created successfully:', createdPost.slug);
        navigate(`/blog/${createdPost.slug}`);
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error?.message || err?.message || 
        `Failed to ${isEditMode ? 'update' : 'create'} blog post`;
      setError(errorMessage);
      console.error(`❌ Error ${isEditMode ? 'updating' : 'creating'} post:`, err);
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter((t) => t !== tag),
    });
  };

  // Loading state while fetching post for edit
  if (loadingPost) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/blog')}
            className="mb-4 flex items-center space-x-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Cancel</span>
          </Button>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(isEditMode && slug ? `/blog/${slug}` : '/blog')}
            className="mb-4 flex items-center space-x-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Cancel</span>
          </Button>
          <h1 className="text-3xl font-bold">
            {isEditMode ? 'Edit Post' : 'Create New Post'}
          </h1>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-500">
            <CardContent className="p-4">
              <p className="text-red-500">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter post title"
                  className="w-full px-4 py-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium mb-2">Excerpt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief description (optional)"
                  rows={3}
                  className="w-full px-4 py-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium mb-2">Featured Image URL</label>
                <input
                  type="text"
                  value={formData.featured_image}
                  onChange={(e) =>
                    setFormData({ ...formData, featured_image: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add a tag"
                    className="flex-1 px-4 py-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center space-x-2"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as 'draft' | 'published' | 'archived',
                    })
                  }
                  className="w-full px-4 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-medium mb-2">Content *</label>
                <MarkdownEditor
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  placeholder="Write your blog post in Markdown..."
                  height="600px"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(isEditMode && slug ? `/blog/${slug}` : '/blog')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !formData.title || !formData.content}
                >
                  {loading ? 'Saving...' : isEditMode ? 'Update Post' : 'Create Post'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default BlogEditor;

