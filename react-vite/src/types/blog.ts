export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: string;
  author_email?: string;
  status: 'draft' | 'published' | 'archived';
  featured_image?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface BlogPostInput {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  author: string;
  author_email?: string;
  status?: 'draft' | 'published' | 'archived';
  featured_image?: string;
  tags?: string[];
}

export interface BlogPostUpdate {
  title?: string;
  content?: string;
  excerpt?: string;
  status?: 'draft' | 'published' | 'archived';
  featured_image?: string;
  tags?: string[];
  new_slug?: string;
}

