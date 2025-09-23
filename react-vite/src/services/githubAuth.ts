import axios from "axios";
import { GitHubUser } from "../types/auth";

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const GITHUB_REDIRECT_URI = import.meta.env.VITE_GITHUB_REDIRECT_URI;
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

export class GitHubAuthService {
  private static instance: GitHubAuthService;
  private accessToken: string | null = null;

  private constructor() {
    this.accessToken = localStorage.getItem("github_access_token");
  }

  public static getInstance(): GitHubAuthService {
    if (!GitHubAuthService.instance) {
      GitHubAuthService.instance = new GitHubAuthService();
    }
    return GitHubAuthService.instance;
  }

  public getLoginUrl(): string {
    if (!GITHUB_CLIENT_ID || !GITHUB_REDIRECT_URI) {
      console.error(
        "GitHub OAuth not configured. Missing environment variables."
      );
      return "";
    }

    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: GITHUB_REDIRECT_URI,
      scope: "user:email",
      state: this.generateState(),
    });

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  public async exchangeCodeForToken(code: string): Promise<string> {
    try {
      console.log("GitHubAuthService - Exchanging code for token");
      console.log("GitHubAuthService - API_BASE_URL:", API_BASE_URL);
      console.log(
        "GitHubAuthService - GITHUB_REDIRECT_URI:",
        GITHUB_REDIRECT_URI
      );
      console.log("GitHubAuthService - Code:", code);

      const response = await axios.post(`${API_BASE_URL}/auth/github`, {
        code,
        redirect_uri: GITHUB_REDIRECT_URI,
      });

      console.log("GitHubAuthService - Response:", response.data);
      const { access_token } = response.data;
      this.accessToken = access_token;
      localStorage.setItem("github_access_token", access_token);

      return access_token;
    } catch (error: any) {
      console.error("Error exchanging code for token:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }
      throw new Error("Failed to authenticate with GitHub");
    }
  }

  public async getUserInfo(): Promise<GitHubUser> {
    if (!this.accessToken) {
      throw new Error("No access token available");
    }

    try {
      const response = await axios.get("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw new Error("Failed to fetch user information");
    }
  }

  public logout(): void {
    this.accessToken = null;
    localStorage.removeItem("github_access_token");
  }

  public isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  private generateState(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}
