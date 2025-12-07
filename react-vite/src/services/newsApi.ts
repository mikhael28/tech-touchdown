// API service for NewsAPI integration

import { ExaSearchResult } from "../types/exa";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/news`;

export interface NewsSearchFilters {
  query: string;
  numResults?: number;
  category?: string;
  language?: string;
  sortBy?: 'relevancy' | 'popularity' | 'publishedAt';
  from?: string;  // ISO date string
  to?: string;    // ISO date string
}

export interface NewsSearchResponse {
  success: boolean;
  results: ExaSearchResult[];
  autopromptString?: string;
  demoMode?: boolean;
  error?: string;
}

class NewsApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  async search(filters: NewsSearchFilters): Promise<NewsSearchResponse> {
    return this.makeRequest<NewsSearchResponse>("/search", {
      method: "POST",
      body: JSON.stringify(filters),
    });
  }

  async health(): Promise<{ status: string; service: string; demoMode: boolean }> {
    return this.makeRequest("/health", {
      method: "GET",
    });
  }
}

export const newsApi = new NewsApiService();
export default newsApi;
