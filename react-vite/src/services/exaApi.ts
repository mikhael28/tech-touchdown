// API service for Exa AI integration

import {
  ExaSearchResponse,
  ExaSearchWithContentResponse,
  ExaAnswerResponse,
  SearchFilters,
} from "../types/exa";

const API_BASE_URL = "http://localhost:3001/api/exa";

class ExaApiService {
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

  async search(filters: SearchFilters): Promise<ExaSearchResponse> {
    const {
      includeContent,
      includeHighlights,
      includeSummary,
      ...searchParams
    } = filters;

    if (includeContent) {
      return this.searchWithContent(filters);
    }

    return this.makeRequest<ExaSearchResponse>("/search", {
      method: "POST",
      body: JSON.stringify(searchParams),
    });
  }

  async searchWithContent(
    filters: SearchFilters
  ): Promise<ExaSearchWithContentResponse> {
    const {
      includeContent,
      includeHighlights,
      includeSummary,
      ...searchParams
    } = filters;

    const contentOptions = {
      text: includeContent ? true : false,
      highlights: includeHighlights || false,
      summary: includeSummary || false,
    };

    return this.makeRequest<ExaSearchWithContentResponse>(
      "/search-with-content",
      {
        method: "POST",
        body: JSON.stringify({
          ...searchParams,
          ...contentOptions,
        }),
      }
    );
  }

  async findSimilar(
    url: string,
    numResults: number = 10
  ): Promise<ExaSearchResponse> {
    return this.makeRequest<ExaSearchResponse>("/find-similar", {
      method: "POST",
      body: JSON.stringify({ url, numResults }),
    });
  }

  async getContents(urls: string[]): Promise<ExaSearchWithContentResponse> {
    return this.makeRequest<ExaSearchWithContentResponse>("/get-contents", {
      method: "POST",
      body: JSON.stringify({
        urls,
        text: true,
        highlights: true,
        summary: true,
      }),
    });
  }

  async answer(
    query: string,
    filters?: Partial<SearchFilters>
  ): Promise<ExaAnswerResponse> {
    return this.makeRequest<ExaAnswerResponse>("/answer", {
      method: "POST",
      body: JSON.stringify({
        query,
        ...filters,
      }),
    });
  }

  async streamAnswer(
    query: string,
    filters?: Partial<SearchFilters>,
    onChunk?: (chunk: any) => void
  ): Promise<void> {
    const url = `${API_BASE_URL}/stream-answer`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        ...filters,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body reader available");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") return;

            try {
              const chunk = JSON.parse(data);
              onChunk?.(chunk);
            } catch (e) {
              console.warn("Failed to parse SSE chunk:", data);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}

export const exaApi = new ExaApiService();
export default exaApi;
