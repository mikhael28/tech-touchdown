import { Router, Request, Response } from "express";
import { getDatabase } from "../lib/database";

const router = Router();

// Get all blog posts
router.get("/posts", async (req: Request, res: Response) => {
  try {
    const sql = getDatabase();

    console.log('Fetching all blog posts...');
    
    const posts = await sql`
      SELECT 
        id, title, slug, excerpt, author, author_email, 
        status, featured_image, tags, created_at, updated_at
      FROM blog_posts
      ORDER BY created_at DESC
    ` as any[];
    
    console.log(`Found ${posts.length} posts:`, posts.map(p => ({ title: p.title, status: p.status })));

    res.json({
      success: true,
      posts,
      total: posts.length,
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    res.status(500).json({
      success: false,
      error: {
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch blog posts",
      },
    });
  }
});

// Get single blog post by slug
router.get("/posts/:slug", async (req: Request, res: Response) => {
  try {
    const sql = getDatabase();
    const { slug } = req.params;

    const posts = await sql`
      SELECT 
        id, title, slug, content, excerpt, author, author_email,
        status, featured_image, tags, created_at, updated_at
      FROM blog_posts
      WHERE slug = ${slug}
      LIMIT 1
    ` as any[];

    if (posts.length === 0) {
      res.status(404).json({
        success: false,
        error: {
          message: "Blog post not found",
        },
      });
      return;
    }

    res.json({
      success: true,
      post: posts[0],
    });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    res.status(500).json({
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to fetch blog post",
      },
    });
  }
});

// Create new blog post
router.post("/posts", async (req: Request, res: Response) => {
  try {
    const sql = getDatabase();
    const {
      title,
      slug,
      content,
      excerpt,
      author = "Michael Nightingale",
      author_email = "michael@expatriaonline.com",
      status = "draft",
      featured_image,
      tags = [],
    } = req.body;

    console.log("📝 CREATE POST REQUEST");
    console.log("Title:", title);
    console.log("Status:", status);
    console.log("Author:", author);

    // Validate required fields
    if (!title || !content || !author) {
      console.log("Validation failed: missing required fields");
      res.status(400).json({
        success: false,
        error: {
          message: "Title, content, and author are required",
        },
      });
      return;
    }

    // Generate slug from title if not provided
    const finalSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    console.log("Generated slug:", finalSlug);

    // Check if slug already exists
    const existingPosts = await sql`
      SELECT id FROM blog_posts WHERE slug = ${finalSlug} LIMIT 1
    ` as any[];

    if (existingPosts.length > 0) {
      console.log("Slug conflict: A post with slug", finalSlug, "already exists");
      res.status(400).json({
        success: false,
        error: {
          message: `A post with this slug already exists: ${finalSlug}`,
        },
      });
      return;
    }

    const result = await sql`
      INSERT INTO blog_posts (
        title, slug, content, excerpt, author, author_email,
        status, featured_image, tags
      ) VALUES (
        ${title}, ${finalSlug}, ${content}, ${excerpt || ""}, ${author}, 
        ${author_email || ""}, ${status}, ${featured_image || ""}, ${JSON.stringify(tags)}
      )
      RETURNING id, title, slug, excerpt, author, author_email, status, 
                featured_image, tags, created_at, updated_at
    ` as any[];

    console.log('✅ POST CREATED SUCCESSFULLY!');
    console.log('   ID:', result[0].id);
    console.log('   Title:', result[0].title);
    console.log('   Slug:', result[0].slug);
    console.log('   Status:', result[0].status);

    res.status(201).json({
      success: true,
      post: result[0],
    });
  } catch (error) {
    console.error("Error creating blog post:", error);
    res.status(500).json({
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to create blog post",
      },
    });
  }
});

// Update blog post
router.put("/posts/:slug", async (req: Request, res: Response) => {
  try {
    const sql = getDatabase();
    const { slug } = req.params;
    const {
      title,
      content,
      excerpt,
      status,
      featured_image,
      tags,
      new_slug,
    } = req.body;

    // Check if post exists
    const existingPosts = await sql`
      SELECT id FROM blog_posts WHERE slug = ${slug} LIMIT 1
    ` as any[];

    if (existingPosts.length === 0) {
      res.status(404).json({
        success: false,
        error: {
          message: "Blog post not found",
        },
      });
      return;
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];

    if (title !== undefined) {
      updates.push("title = $" + (values.length + 1));
      values.push(title);
    }
    if (content !== undefined) {
      updates.push("content = $" + (values.length + 1));
      values.push(content);
    }
    if (excerpt !== undefined) {
      updates.push("excerpt = $" + (values.length + 1));
      values.push(excerpt);
    }
    if (status !== undefined) {
      updates.push("status = $" + (values.length + 1));
      values.push(status);
    }
    if (featured_image !== undefined) {
      updates.push("featured_image = $" + (values.length + 1));
      values.push(featured_image);
    }
    if (tags !== undefined) {
      updates.push("tags = $" + (values.length + 1));
      values.push(JSON.stringify(tags));
    }
    if (new_slug !== undefined) {
      updates.push("slug = $" + (values.length + 1));
      values.push(new_slug);
    }

    if (updates.length === 0) {
      res.status(400).json({
        success: false,
        error: {
          message: "No fields to update",
        },
      });
      return;
    }

    updates.push("updated_at = NOW()");

    const result = await sql`
      UPDATE blog_posts 
      SET 
        ${title !== undefined ? sql`title = ${title},` : sql``}
        ${content !== undefined ? sql`content = ${content},` : sql``}
        ${excerpt !== undefined ? sql`excerpt = ${excerpt},` : sql``}
        ${status !== undefined ? sql`status = ${status},` : sql``}
        ${featured_image !== undefined ? sql`featured_image = ${featured_image},` : sql``}
        ${tags !== undefined ? sql`tags = ${JSON.stringify(tags)},` : sql``}
        ${new_slug !== undefined ? sql`slug = ${new_slug},` : sql``}
        updated_at = NOW()
      WHERE slug = ${slug}
      RETURNING id, title, slug, excerpt, author, author_email, status, 
                featured_image, tags, created_at, updated_at
    ` as any[];

    res.json({
      success: true,
      post: result[0],
    });
  } catch (error) {
    console.error("Error updating blog post:", error);
    res.status(500).json({
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to update blog post",
      },
    });
  }
});

// Delete blog post
router.delete("/posts/:slug", async (req: Request, res: Response) => {
  try {
    const sql = getDatabase();
    const { slug } = req.params;

    const result = await sql`
      DELETE FROM blog_posts 
      WHERE slug = ${slug}
      RETURNING id
    ` as any[];

    if (result.length === 0) {
      res.status(404).json({
        success: false,
        error: {
          message: "Blog post not found",
        },
      });
      return;
    }

    res.json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    res.status(500).json({
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to delete blog post",
      },
    });
  }
});

export default router;

