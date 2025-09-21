import React, { useState } from 'react';
import { ExternalLink, Calendar, Globe, User, Clock, AlertCircle, Loader2, Eye, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { SearchState, ExaSearchResult } from '../types/exa';
import RightSideDrawer from './RightSideDrawer';
import ExternalIframe from './ExternalIframe';
import ContentDisplay from './ContentDisplay';
import { exaApi } from '../services/exaApi';

interface SearchResultsProps {
  searchState: SearchState;
  onSearch: (query: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchState, onSearch }) => {
  const { isLoading, results, error, query } = searchState;
  
  // State for drawer and iframe
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [iframeOpen, setIframeOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ExaSearchResult | null>(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);
  const [scrapedContent, setScrapedContent] = useState<ExaSearchResult | null>(null);

  const getDomainFromUrl = (url: string): string => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Unknown date';
    }
  };

  const truncateText = (text: string, maxLength: number = 200): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleViewContent = async (result: ExaSearchResult) => {
    setSelectedContent(result);
    setDrawerOpen(true);
    setContentLoading(true);
    setContentError(null);
    setScrapedContent(null);

    try {
      const response = await exaApi.getContents([result.url]);
      if (response.success && response.results.length > 0) {
        setScrapedContent(response.results[0]);
      } else {
        setScrapedContent(result); // Fallback to original result
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      setContentError(error instanceof Error ? error.message : 'Failed to load content');
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

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-600 dark:text-gray-400" />
          <p className="text-muted-foreground dark:text-gray-400">Searching for articles...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Search Error</h3>
          <p className="text-muted-foreground dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={() => onSearch(query)} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!query) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-8 text-center">
          <Globe className="h-12 w-12 text-muted-foreground dark:text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Start Your Search</h3>
          <p className="text-muted-foreground dark:text-gray-400">
            Enter a search query above to discover articles and web content
          </p>
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground dark:text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">No Results Found</h3>
          <p className="text-muted-foreground dark:text-gray-400 mb-4">
            No articles found for "{query}". Try adjusting your search terms or filters.
          </p>
          <Button onClick={() => onSearch(query)} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {query}
        </h2>

      </div>

      <div className="space-y-4">
        {results.map((result, index) => (
          <Card key={index} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-900/20 transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-3">
                  <CardTitle 
                    className="text-xl leading-tight cursor-pointer hover:text-primary transition-colors line-clamp-2 text-gray-900 dark:text-gray-100"
                    onClick={() => handleViewContent(result)}
                  >
                    {result.title}
                  </CardTitle>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Globe className="h-4 w-4" />
                      <span className="font-medium">{getDomainFromUrl(result.url)}</span>
                    </div>
                    
                    {result.publishedDate && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(result.publishedDate)}</span>
                      </div>
                    )}
                    
                    {result.author && (
                      <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4" />
                        <span>{result.author}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewContent(result)}
                    className="flex items-center gap-2 px-3"
                  >
                    <FileText className="h-4 w-4" />
                    Read
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenIframe(result)}
                    className="flex items-center gap-2 px-3"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex items-center gap-2 px-3"
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
            
            {result.summary && (
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
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
