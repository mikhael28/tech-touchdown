import React, { useState, useEffect } from "react";
import {
  ExternalLink,
  Calendar,
  Globe,
  User,
  Clock,
  AlertCircle,
  Loader2,
  Eye,
  FileText,
  Star,
  Zap,
  Newspaper,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { SearchState, ExaSearchResult } from "../types/exa";
import { SearchProvider } from "./SearchInterface";
import RightSideDrawer from "./RightSideDrawer";
import ExternalIframe from "./ExternalIframe";
import ContentDisplay from "./ContentDisplay";
import { exaApi } from "../services/exaApi";
import { parallelApi } from "../services/parallelApi";
import { useFavorites } from "../hooks/useFavorites";
import { getCachedSportsArticles } from "./SportsChyron";
import { NewsArticle } from "../services/newsService";

interface SearchResultsProps {
  searchState: SearchState;
  onSearch: (query: string) => void;
  searchProvider: SearchProvider;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  searchState,
  onSearch,
  searchProvider,
}) => {
  const { isLoading, results, error, query } = searchState;
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  // State for drawer and iframe
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [iframeOpen, setIframeOpen] = useState(false);
  const [selectedContent, setSelectedContent] =
    useState<ExaSearchResult | null>(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);
  const [scrapedContent, setScrapedContent] = useState<ExaSearchResult | null>(
    null
  );
  const [cachedResults, setCachedResults] = useState<ExaSearchResult[]>([]);

  // Helper function to convert NewsArticle to ExaSearchResult
  const convertNewsToExaResult = (article: NewsArticle): ExaSearchResult => {
    return {
      title: article.title,
      url: article.url,
      publishedDate: article.publishedAt,
      author: article.author || undefined,
      score: 1.0,
      id: article.url,
      text: article.content || undefined,
      summary: article.description || undefined,
      source: "news",
    };
  };

  // Load cached articles for news provider when no query
  useEffect(() => {
    if (searchProvider === "news" && !query) {
      const cached = getCachedSportsArticles();
      if (cached && cached.length > 0) {
        const convertedResults = cached.map(convertNewsToExaResult);
        setCachedResults(convertedResults);
      }
    } else {
      setCachedResults([]);
    }
  }, [searchProvider, query]);

  const getDomainFromUrl = (url: string): string => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Unknown date";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Unknown date";
    }
  };

  const truncateText = (text: string, maxLength: number = 200): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleViewContent = async (result: ExaSearchResult) => {
    setSelectedContent(result);
    setDrawerOpen(true);
    setContentLoading(true);
    setContentError(null);
    setScrapedContent(null);

    try {
      if (searchProvider === "parallel") {
        // Use Parallel Extract API
        const response = await parallelApi.extract([result.url]);
        if (response.success && response.results.length > 0) {
          const extractResult = response.results[0];
          if (extractResult.status === "success" && extractResult.markdown) {
            // Convert Parallel extract result to ExaSearchResult format
            setScrapedContent({
              ...result,
              text: extractResult.markdown,
              summary: extractResult.metadata?.description || result.summary,
              author: extractResult.metadata?.author || result.author,
            });
          } else {
            setScrapedContent(result); // Fallback to original result
          }
        } else {
          setScrapedContent(result); // Fallback to original result
        }
      } else if (searchProvider === "news") {
        // News articles already have content - use what we have
        // Optionally, we could use Parallel Extract for better formatting
        setScrapedContent(result);
      } else {
        // Use Exa getContents API
        const response = await exaApi.getContents([result.url]);
        if (response.success && response.results.length > 0) {
          setScrapedContent(response.results[0]);
        } else {
          setScrapedContent(result); // Fallback to original result
        }
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      setContentError(
        error instanceof Error ? error.message : "Failed to load content"
      );
      setScrapedContent(result); // Fallback to original result
    } finally {
      setContentLoading(false);
    }
  };

  const handleOpenIframe = (result: ExaSearchResult) => {
    setSelectedContent(result);
    setIframeOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedContent(null);
    setScrapedContent(null);
    setContentError(null);
  };

  const handleCloseIframe = () => {
    setIframeOpen(false);
    setSelectedContent(null);
  };

  const handleToggleFavorite = async (result: ExaSearchResult) => {
    const isCurrentlyFavorite = isFavorite(result.url);

    if (isCurrentlyFavorite) {
      // Generate the same ID format as in favoritesDB
      const id = btoa(result.url).replace(/[^a-zA-Z0-9]/g, "");
      await removeFavorite(id);
    } else {
      await addFavorite(result);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <CardContent className="p-8 text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-gray-600 dark:text-gray-400" />
          <p className="text-muted-foreground dark:text-gray-400">
            Searching for articles...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <CardContent className="p-8 text-center">
          <AlertCircle className="mx-auto mb-4 h-8 w-8 text-destructive" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Search Error
          </h3>
          <p className="mb-4 text-muted-foreground dark:text-gray-400">
            {error}
          </p>
          <Button onClick={() => onSearch(query)} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!query) {
    // For news provider, show cached articles if available
    if (searchProvider === "news" && cachedResults.length > 0) {
      // Don't return early - we'll render the cached results below
    } else {
      return (
        <Card className="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <CardContent className="p-8 text-center">
            <Globe className="mx-auto mb-4 h-12 w-12 text-muted-foreground dark:text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Start Your Search
            </h3>
            <p className="text-muted-foreground dark:text-gray-400">
              Enter a search query above to discover articles and web content
            </p>
          </CardContent>
        </Card>
      );
    }
  }

  if (results.length === 0 && cachedResults.length === 0) {
    return (
      <Card className="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <CardContent className="p-8 text-center">
          <AlertCircle className="mx-auto mb-4 h-8 w-8 text-muted-foreground dark:text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            No Results Found
          </h3>
          <p className="mb-4 text-muted-foreground dark:text-gray-400">
            No articles found for "{query}". Try adjusting your search terms or
            filters.
          </p>
          <Button onClick={() => onSearch(query)} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Use cached results if available and no query results, otherwise use search results
  const displayResults = results.length > 0 ? results : cachedResults;

  return (
    <div>
      {/* Show header for cached results */}
      {cachedResults.length > 0 && results.length === 0 && (
        <Card className="mb-4 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:border-gray-600 dark:from-gray-800 dark:to-gray-700">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Newspaper className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Showing cached sports headlines • Updated recently
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results List */}
      <div className="">
        {displayResults.map((result, index) => (
          <Card
            key={index}
            className="group border-l-4 border-gray-200 border-l-transparent bg-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:border-l-primary hover:shadow-lg dark:border-gray-700/50 dark:bg-gray-800/50 dark:hover:border-primary/30 dark:hover:shadow-xl dark:hover:shadow-gray-900/20"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-3">
                  {/* Title */}
                  <div className="flex items-start gap-2">
                    <CardTitle
                      className="line-clamp-2 flex-1 cursor-pointer text-xl leading-tight text-gray-900 transition-colors hover:text-primary group-hover:text-primary dark:text-white"
                      onClick={() => handleViewContent(result)}
                    >
                      {result.title}
                    </CardTitle>
                    {result.source && (
                      <Badge
                        variant="outline"
                        className={`shrink-0 text-xs ${
                          result.source === "parallel"
                            ? "border-purple-500 text-purple-600 dark:text-purple-400"
                            : result.source === "news"
                            ? "border-green-500 text-green-600 dark:text-green-400"
                            : "border-blue-500 text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {result.source === "parallel" ? (
                          <>
                            <Zap className="mr-1 inline h-3 w-3" />
                            Parallel
                          </>
                        ) : result.source === "news" ? (
                          <>
                            <Newspaper className="mr-1 inline h-3 w-3" />
                            News
                          </>
                        ) : (
                          "Exa"
                        )}
                      </Badge>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-700/50">
                      <Globe className="h-4 w-4" />
                      <span className="font-medium">
                        {getDomainFromUrl(result.url)}
                      </span>
                    </div>

                    {result.publishedDate && (
                      <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-700/50">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(result.publishedDate)}</span>
                      </div>
                    )}

                    {result.author && (
                      <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-700/50">
                        <User className="h-4 w-4" />
                        <span className="max-w-32 truncate">
                          {result.author}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-shrink-0 gap-2">
                  <Button
                    variant={isFavorite(result.url) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToggleFavorite(result)}
                    className={`flex items-center gap-2 px-3 ${
                      isFavorite(result.url)
                        ? "border-yellow-500 bg-yellow-500 text-white hover:bg-yellow-600"
                        : "border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                    }`}
                    title={
                      isFavorite(result.url)
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    <Star
                      className={`h-4 w-4 ${
                        isFavorite(result.url) ? "fill-current" : ""
                      }`}
                    />
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleViewContent(result)}
                    className="flex items-center gap-2 bg-primary px-3 text-primary-foreground shadow-sm hover:bg-primary/90"
                  >
                    <FileText className="h-4 w-4" />
                    Read
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex items-center gap-2 border-gray-300 px-3 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Visit
                    </a>
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Summary */}
            {result.summary && (
              <CardContent className="pt-0">
                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {result.summary}
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Right Side Drawer for Content */}
      <RightSideDrawer
        open={drawerOpen}
        setOpen={setDrawerOpen}
        title={selectedContent?.title}
        size="xl"
      >
        {selectedContent && (
          <ContentDisplay
            content={scrapedContent || selectedContent}
            isLoading={contentLoading}
            error={contentError}
            onOpenInIframe={() => {
              setDrawerOpen(false);
              handleOpenIframe(selectedContent);
            }}
          />
        )}
      </RightSideDrawer>

      {/* External Iframe Modal */}
      {iframeOpen && selectedContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="flex h-[90vh] w-full max-w-7xl flex-col rounded-lg bg-white shadow-2xl dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
              <h3 className="truncate text-lg font-semibold text-gray-900 dark:text-white">
                {selectedContent.title}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseIframe}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ExternalIframe url={selectedContent.url} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
