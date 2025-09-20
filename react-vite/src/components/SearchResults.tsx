import React from 'react';
import { ExternalLink, Calendar, Globe, User, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { SearchState } from '../types/exa';

interface SearchResultsProps {
  searchState: SearchState;
  onSearch: (query: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchState, onSearch }) => {
  const { isLoading, results, error, query } = searchState;

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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Searching for articles...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Search Error</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => onSearch(query)} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!query) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Start Your Search</h3>
          <p className="text-muted-foreground">
            Enter a search query above to discover articles and web content
          </p>
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
          <p className="text-muted-foreground mb-4">
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          Search Results for "{query}"
        </h2>
        <Badge variant="secondary">
          {results.length} result{results.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="space-y-4">
        {results.map((result, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg leading-tight mb-2">
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      {result.title}
                    </a>
                  </CardTitle>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      <span>{getDomainFromUrl(result.url)}</span>
                    </div>
                    
                    {result.publishedDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(result.publishedDate)}</span>
                      </div>
                    )}
                    
                    {result.author && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{result.author}</span>
                      </div>
                    )}
                    
                    {result.score && (
                      <Badge variant="outline" className="text-xs">
                        Score: {result.score.toFixed(2)}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="ml-2 flex-shrink-0"
                >
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Visit
                  </a>
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              {result.summary && (
                <div className="mb-3">
                  <Badge variant="secondary" className="mb-2">
                    AI Summary
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {result.summary}
                  </p>
                </div>
              )}
              
              {result.text && (
                <div className="mb-3">
                  <p className="text-sm leading-relaxed">
                    {truncateText(result.text, 300)}
                  </p>
                </div>
              )}
              
              {result.highlights && result.highlights.length > 0 && (
                <div>
                  <Badge variant="outline" className="mb-2">
                    Key Highlights
                  </Badge>
                  <ul className="space-y-1">
                    {result.highlights.slice(0, 3).map((highlight, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
