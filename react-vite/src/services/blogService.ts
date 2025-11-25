import axios from 'axios';
import { BlogPost, BlogPostInput, BlogPostUpdate } from '../types/blog';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const blogService = {
  // Get all blog posts
  async getAllPosts(): Promise<BlogPost[]> {
    try {
      console.log('Fetching all posts from API...');
      const response = await axios.get(`${API_BASE_URL}/api/blog/posts`);
      console.log('API response:', response.data);
      return response.data.posts;
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  },

  // Get single blog post by slug
  async getPostBySlug(slug: string): Promise<BlogPost> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/blog/posts/${slug}`);
      return response.data.post;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      throw error;
    }
  },

  // Create new blog post
  async createPost(post: BlogPostInput): Promise<BlogPost> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/blog/posts`, post);
      return response.data.post;
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  },

  // Update blog post
  async updatePost(slug: string, updates: BlogPostUpdate): Promise<BlogPost> {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/blog/posts/${slug}`, updates);
      return response.data.post;
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  },

  // Delete blog post
  async deletePost(slug: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/api/blog/posts/${slug}`);
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  },

  // Generate slug from title
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  },
};

