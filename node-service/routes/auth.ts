import express, { Request, Response } from "express";
import axios from "axios";
import { config } from "dotenv";
import path from "path";

// Load environment variables
config({ path: path.join(process.cwd(), ".env") });

const router = express.Router();

// GitHub OAuth configuration
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

interface GitHubUserResponse {
  id: number;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
  bio: string;
  blog: string;
  location: string;
  company: string;
  twitter_username: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

// Exchange authorization code for access token
router.post("/github", async (req: Request, res: Response) => {
  try {
    const { code, redirect_uri } = req.body;

    if (!code) {
      return res.status(400).json({
        error: "Authorization code is required",
      });
    }

    if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
      console.error("GitHub OAuth credentials not configured");
      return res.status(500).json({
        error: "OAuth service not properly configured",
      });
    }

    // Exchange code for access token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const tokenData: GitHubTokenResponse = tokenResponse.data;

    if (tokenResponse.status !== 200) {
      console.error("GitHub OAuth error:", tokenData);
      return res.status(400).json({
        error: "Failed to exchange code for token",
        details: tokenResponse.data,
      });
    }

    // Get user information from GitHub
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const userData: GitHubUserResponse = userResponse.data;

    // Return both access token and user data
    return res.json({
      access_token: tokenData.access_token,
      user: userData,
    });
  } catch (error) {
    console.error("GitHub OAuth error:", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || "GitHub API error";

      return res.status(status).json({
        error: "GitHub authentication failed",
        details: message,
      });
    }

    return res.status(500).json({
      error: "Internal server error during authentication",
    });
  }
});

// Verify access token and get user info
router.get("/verify", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authorization header with Bearer token required",
      });
    }

    const accessToken = authHeader.substring(7);

    // Verify token with GitHub API
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    return res.json({
      user: userResponse.data,
      valid: true,
    });
  } catch (error) {
    console.error("Token verification error:", error);

    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return res.status(401).json({
        error: "Invalid or expired access token",
        valid: false,
      });
    }

    return res.status(500).json({
      error: "Failed to verify access token",
    });
  }
});

export default router;
