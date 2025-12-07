import React, { useState, useEffect, useCallback, useRef } from "react";
import { Search as SearchIcon, Filter, X, Zap, Newspaper } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { exaApi } from "../services/exaApi";
import { parallelApi } from "../services/parallelApi";
import { newsApi } from "../services/newsApi";
import { ExaSearchResult, SearchFilters, SearchState } from "../types/exa";
import { parallelToUnified } from "../types/parallel";
import SearchResults from "./SearchResults";

export type SearchProvider = "exa" | "parallel" | "news";

interface SearchInterfaceProps {
  title: string;
  placeholder: string;
  defaultQuery: string;
  className?: string;
  searchQuery?: string;
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({
  title,
  placeholder,
  defaultQuery,
  className = "",
  searchQuery,
}) => {
  const [searchProvider, setSearchProvider] =
    useState<SearchProvider>("parallel");
  const [searchState, setSearchState] = useState<SearchState>({
    isLoading: false,
    results: [],
    error: null,
    query: "",
    filters: {
      query: "",
      numResults: 10,
      useAutoprompt: true,
      type: "neural",
      includeContent: true,
      includeHighlights: false,
      includeSummary: true,
    },
  });

  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const hasInitializedRef = useRef(false);
  const searchTimeoutRef = useRef<number | null>(null);
  const filtersRef = useRef<SearchFilters>({
    query: "",
    numResults: 10,
    useAutoprompt: true,
    type: "neural",
    includeContent: true,
    includeHighlights: false,
    includeSummary: true,
  });

  // Memoize handleSearch to prevent unnecessary recreations
  const handleSearch = useCallback(
    async (query: string, provider?: SearchProvider) => {
      if (!query.trim()) return;

      const trimmedQuery = query.trim();
      const currentProvider = provider || searchProvider;

      // Update state to loading and store filters in ref
      setSearchState((prev) => {
        const updatedFilters = { ...prev.filters, query: trimmedQuery };
        filtersRef.current = updatedFilters;

        return {
          ...prev,
          isLoading: true,
          error: null,
          query: trimmedQuery,
          filters: updatedFilters,
        };
      });

      try {
        let results: ExaSearchResult[];

        if (currentProvider === "parallel") {
          // Use Parallel API
          const parallelResponse = await parallelApi.search({
            objective: trimmedQuery,
            search_queries: [trimmedQuery],
            max_results: filtersRef.current.numResults || 10,
            mode: "one-shot",
            source_policy: {
              include_domains: filtersRef.current.includeDomains,
              exclude_domains: filtersRef.current.excludeDomains,
            },
          });

          // Convert Parallel results to unified format
          results = parallelResponse.results.map(parallelToUnified);
        } else if (currentProvider === "news") {
          // Use News API
          const newsResponse = await newsApi.search({
            query: trimmedQuery,
            numResults: filtersRef.current.numResults || 10,
            sortBy: "publishedAt",
          });

          results = newsResponse.results;
        } else {
          // Use Exa API
          const exaResponse = await exaApi.search(filtersRef.current);
          results = exaResponse.results.map((r) => ({
            ...r,
            source: "exa" as const,
          }));
        }

        setSearchState((prev) => ({
          ...prev,
          isLoading: false,
          results,
        }));
      } catch (error) {
        setSearchState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Search failed",
        }));
      }
    },
    [searchProvider]
  );

  // Initial search with defaultQuery (only once on mount)
  useEffect(() => {
    if (hasInitializedRef.current) return;

    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = window.setTimeout(() => {
      if (!hasInitializedRef.current && defaultQuery) {
        hasInitializedRef.current = true;
        handleSearch(defaultQuery);
      }
    }, 1000);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [defaultQuery, handleSearch]);

  // Effect to handle external search queries (from bubble clicks)
  useEffect(() => {
    if (
      searchQuery &&
      searchQuery.trim() &&
      searchQuery !== searchState.query
    ) {
      // Clear the initial search timeout if it hasn't fired yet
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
        hasInitializedRef.current = true; // Mark as initialized
      }
      handleSearch(searchQuery);
    }
  }, [searchQuery, handleSearch, searchState.query]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setSearchState((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        [key]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchInput, searchProvider);
  };

  const handleProviderChange = (provider: SearchProvider) => {
    setSearchProvider(provider);
    // Re-run search with new provider if there's an active query
    if (searchState.query) {
      handleSearch(searchState.query, provider);
    }
  };

  const clearFilters = () => {
    setSearchState((prev) => ({
      ...prev,
      filters: {
        query: prev.query,
        numResults: 10,
        useAutoprompt: true,
        type: "neural",
        includeContent: true,
        includeHighlights: false,
        includeSummary: true,
      },
    }));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Bar */}
      <Card className="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Provider Toggle */}
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2 dark:border-gray-700">
              <Label className="text-sm text-gray-600 dark:text-gray-400">
                Search Provider:
              </Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={
                    searchProvider === "parallel" ? "default" : "outline"
                  }
                  onClick={() => handleProviderChange("parallel")}
                  className="flex items-center gap-1.5"
                >
                  <Zap className="h-3.5 w-3.5" />
                  Parallel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={searchProvider === "exa" ? "default" : "outline"}
                  onClick={() => handleProviderChange("exa")}
                  className="flex items-center gap-1.5"
                >
                  <SearchIcon className="h-3.5 w-3.5" />
                  Exa
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={searchProvider === "news" ? "default" : "outline"}
                  onClick={() => handleProviderChange("news")}
                  className="flex items-center gap-1.5"
                >
                  <Newspaper className="h-3.5 w-3.5" />
                  News
                </Button>
              </div>
              {searchState.isLoading && (
                <span className="ml-auto text-xs text-muted-foreground">
                  Using{" "}
                  {searchProvider === "parallel"
                    ? "Parallel"
                    : searchProvider === "exa"
                    ? "Exa"
                    : "NewsAPI"}
                  ...
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={placeholder}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={searchState.isLoading}
                  className="flex-1 sm:flex-none"
                >
                  {searchState.isLoading ? "Searching..." : "Search"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex-1 sm:flex-none"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="space-y-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="numResults"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Number of Results
                    </Label>
                    <Select
                      value={searchState.filters.numResults?.toString()}
                      onValueChange={(value) =>
                        handleFilterChange("numResults", parseInt(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 results</SelectItem>
                        <SelectItem value="10">10 results</SelectItem>
                        <SelectItem value="20">20 results</SelectItem>
                        <SelectItem value="50">50 results</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="startDate"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Start Date
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={searchState.filters.startPublishedDate || ""}
                      onChange={(e) =>
                        handleFilterChange(
                          "startPublishedDate",
                          e.target.value || undefined
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="endDate"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      End Date
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={searchState.filters.endPublishedDate || ""}
                      onChange={(e) =>
                        handleFilterChange(
                          "endPublishedDate",
                          e.target.value || undefined
                        )
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="includeDomains"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Include Domains (comma-separated)
                    </Label>
                    <Input
                      id="includeDomains"
                      placeholder="example.com, news.com"
                      value={
                        searchState.filters.includeDomains?.join(", ") || ""
                      }
                      onChange={(e) => {
                        const domains = e.target.value
                          .split(",")
                          .map((d) => d.trim())
                          .filter((d) => d.length > 0);
                        handleFilterChange(
                          "includeDomains",
                          domains.length > 0 ? domains : undefined
                        );
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="excludeDomains"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Exclude Domains (comma-separated)
                    </Label>
                    <Input
                      id="excludeDomains"
                      placeholder="spam.com, ads.com"
                      value={
                        searchState.filters.excludeDomains?.join(", ") || ""
                      }
                      onChange={(e) => {
                        const domains = e.target.value
                          .split(",")
                          .map((d) => d.trim())
                          .filter((d) => d.length > 0);
                        handleFilterChange(
                          "excludeDomains",
                          domains.length > 0 ? domains : undefined
                        );
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeContent"
                      checked={searchState.filters.includeContent}
                      onCheckedChange={(checked) =>
                        handleFilterChange("includeContent", checked)
                      }
                    />
                    <Label
                      htmlFor="includeContent"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Include full content
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeHighlights"
                      checked={searchState.filters.includeHighlights}
                      onCheckedChange={(checked) =>
                        handleFilterChange("includeHighlights", checked)
                      }
                    />
                    <Label
                      htmlFor="includeHighlights"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Include highlights
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeSummary"
                      checked={searchState.filters.includeSummary}
                      onCheckedChange={(checked) =>
                        handleFilterChange("includeSummary", checked)
                      }
                    />
                    <Label
                      htmlFor="includeSummary"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Include AI summary
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="useAutoprompt"
                      checked={searchState.filters.useAutoprompt}
                      onCheckedChange={(checked) =>
                        handleFilterChange("useAutoprompt", checked)
                      }
                    />
                    <Label
                      htmlFor="useAutoprompt"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Use AI autoprompt
                    </Label>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearFilters}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                  <Button type="button" onClick={() => setShowFilters(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Search Results */}
      <SearchResults
        searchState={searchState}
        onSearch={(query) => handleSearch(query, searchProvider)}
        searchProvider={searchProvider}
      />
    </div>
  );
};

export default SearchInterface;
