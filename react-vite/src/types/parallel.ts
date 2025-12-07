// Types for Parallel AI API responses

export interface ParallelSearchResult {
  url: string;
  title?: string;
  publish_date?: string;
  excerpts?: string[];
}

export interface ParallelSearchResponse {
  success: boolean;
  search_id: string;
  results: ParallelSearchResult[];
  warnings?: any;
  usage?: Array<{ name: string; count: number }>;
  demoMode?: boolean;
}

export interface ParallelExtractResult {
  url: string;
  status: "success" | "error" | "timeout";
  markdown?: string;
  html?: string;
  metadata?: {
    title?: string;
    description?: string;
    publish_date?: string;
    author?: string;
  };
  error?: string;
}

export interface ParallelExtractResponse {
  success: boolean;
  extract_id: string;
  results: ParallelExtractResult[];
  warnings?: any;
  usage?: Array<{ name: string; count: number }>;
  demoMode?: boolean;
}

export interface ParallelSearchFilters {
  objective: string;
  search_queries?: string[];
  max_results?: number;
  mode?: "one-shot" | "agentic";
  source_policy?: {
    include_domains?: string[];
    exclude_domains?: string[];
  };
  excerpts?: {
    max_chars_per_result?: number;
    max_chars_total?: number;
  };
  fetch_policy?: {
    max_age_seconds?: number;
  };
}

export interface ParallelSearchState {
  isLoading: boolean;
  results: ParallelSearchResult[];
  error: string | null;
  objective: string;
  filters: ParallelSearchFilters;
}

// Unified search result type that can represent both Exa and Parallel results
export interface UnifiedSearchResult {
  title: string;
  url: string;
  publishedDate?: string;
  author?: string;
  score?: number;
  text?: string;
  excerpts?: string[];
  highlights?: string[];
  summary?: string;
  source: "exa" | "parallel";
}

// Convert Parallel result to unified format
export function parallelToUnified(
  result: ParallelSearchResult
): UnifiedSearchResult {
  return {
    title: result.title || new URL(result.url).hostname,
    url: result.url,
    publishedDate: result.publish_date,
    excerpts: result.excerpts,
    summary: result.excerpts?.[0], // Use first excerpt as summary
    text: result.excerpts?.join("\n\n"),
    source: "parallel",
  };
}
