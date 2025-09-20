// Types for Exa AI API responses

export interface ExaSearchResult {
  title: string;
  url: string;
  publishedDate?: string;
  author?: string;
  score?: number;
  text?: string;
  highlights?: string[];
  summary?: string;
}

export interface ExaSearchResponse {
  success: boolean;
  query: string;
  options: {
    numResults: number;
    useAutoprompt: boolean;
    type: "neural" | "keyword";
    includeDomains?: string[];
    excludeDomains?: string[];
    startPublishedDate?: string;
    endPublishedDate?: string;
  };
  results: ExaSearchResult[];
  autopromptString?: string;
}

export interface ExaSearchWithContentResponse {
  success: boolean;
  query: string;
  options: {
    numResults: number;
    useAutoprompt: boolean;
    type: "neural" | "keyword";
    includeDomains?: string[];
    excludeDomains?: string[];
    startPublishedDate?: string;
    endPublishedDate?: string;
  };
  contentOptions: {
    text?: boolean | { maxCharacters?: number; includeHtmlTags?: boolean };
    highlights?: boolean | { numSentences?: number; highlightsPerUrl?: number };
    summary?: boolean | { query?: string };
  };
  results: ExaSearchResult[];
  autopromptString?: string;
}

export interface ExaAnswerResponse {
  success: boolean;
  query: string;
  options: {
    useAutoprompt: boolean;
    includeDomains?: string[];
    excludeDomains?: string[];
    startPublishedDate?: string;
    endPublishedDate?: string;
  };
  answer: string;
  citations: ExaSearchResult[];
}

export interface SearchFilters {
  query: string;
  numResults?: number;
  includeDomains?: string[];
  excludeDomains?: string[];
  startPublishedDate?: string;
  endPublishedDate?: string;
  useAutoprompt?: boolean;
  type?: "neural" | "keyword";
  includeContent?: boolean;
  includeHighlights?: boolean;
  includeSummary?: boolean;
}

export interface SearchState {
  isLoading: boolean;
  results: ExaSearchResult[];
  error: string | null;
  query: string;
  filters: SearchFilters;
}
