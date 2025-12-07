// API service for Parallel AI integration

import {
  ParallelSearchResponse,
  ParallelExtractResponse,
  ParallelSearchFilters,
} from "../types/parallel";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/parallel`;

class ParallelApiService {
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
        errorData.error?.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  async search(filters: ParallelSearchFilters): Promise<ParallelSearchResponse> {
    return this.makeRequest<ParallelSearchResponse>("/search", {
      method: "POST",
      body: JSON.stringify(filters),
    });
  }

  async extract(urls: string[], includeHtml: boolean = false): Promise<ParallelExtractResponse> {
    return this.makeRequest<ParallelExtractResponse>("/extract", {
      method: "POST",
      body: JSON.stringify({
        urls,
        include_html: includeHtml,
      }),
    });
  }

  async health(): Promise<{ status: string; service: string; demoMode: boolean }> {
    return this.makeRequest("/health", {
      method: "GET",
    });
  }
}

export const parallelApi = new ParallelApiService();
export default parallelApi;

