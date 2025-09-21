import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { exaApi } from '../services/exaApi';
import { ExaSearchResult, SearchFilters, SearchState } from '../types/exa';
import SearchResults from './SearchResults';

interface SearchInterfaceProps {
  title: string;
  placeholder: string;
  defaultQuery: string;
  className?: string;
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({
  title,
  placeholder,
  defaultQuery,
  className = ''
}) => {
  const [searchState, setSearchState] = useState<SearchState>({
    isLoading: false,
    results: [],
    error: null,
    query: '',
    filters: {
      query: '',
      numResults: 10,
      useAutoprompt: true,
      type: 'neural',
      includeContent: true,
      includeHighlights: false,
      includeSummary: true,
    }
  });

  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    setTimeout(() => {
      handleSearch(defaultQuery);
    }, 1000);
  }, [defaultQuery]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    const trimmedQuery = query.trim();
    const updatedFilters = { ...searchState.filters, query: trimmedQuery };

    setSearchState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      query: trimmedQuery,
      filters: updatedFilters
    }));

    try {
      const response = await exaApi.search(updatedFilters);
      setSearchState(prev => ({
        ...prev,
        isLoading: false,
        results: response.results,
      }));
    } catch (error) {
      setSearchState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Search failed',
      }));
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setSearchState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [key]: value,
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchInput);
  };

  const clearFilters = () => {
    setSearchState(prev => ({
      ...prev,
      filters: {
        query: prev.query,
        numResults: 10,
        useAutoprompt: true,
        type: 'neural',
        includeContent: true,
        includeHighlights: false,
        includeSummary: true,
      }
    }));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{title}</h2>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder={placeholder}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={searchState.isLoading} className="flex-1 sm:flex-none">
                  {searchState.isLoading ? 'Searching...' : 'Search'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex-1 sm:flex-none"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numResults" className="text-gray-700 dark:text-gray-300">Number of Results</Label>
                    <Select
                      value={searchState.filters.numResults?.toString()}
                      onValueChange={(value) => handleFilterChange('numResults', parseInt(value))}
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
                    <Label htmlFor="searchType" className="text-gray-700 dark:text-gray-300">Search Type</Label>
                    <Select
                      value={searchState.filters.type}
                      onValueChange={(value) => handleFilterChange('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="neural">Neural (AI-powered)</SelectItem>
                        <SelectItem value="keyword">Keyword</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-gray-700 dark:text-gray-300">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={searchState.filters.startPublishedDate || ''}
                      onChange={(e) => handleFilterChange('startPublishedDate', e.target.value || undefined)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-gray-700 dark:text-gray-300">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={searchState.filters.endPublishedDate || ''}
                      onChange={(e) => handleFilterChange('endPublishedDate', e.target.value || undefined)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="includeDomains" className="text-gray-700 dark:text-gray-300">Include Domains (comma-separated)</Label>
                    <Input
                      id="includeDomains"
                      placeholder="example.com, news.com"
                      value={searchState.filters.includeDomains?.join(', ') || ''}
                      onChange={(e) => {
                        const domains = e.target.value
                          .split(',')
                          .map(d => d.trim())
                          .filter(d => d.length > 0);
                        handleFilterChange('includeDomains', domains.length > 0 ? domains : undefined);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excludeDomains" className="text-gray-700 dark:text-gray-300">Exclude Domains (comma-separated)</Label>
                    <Input
                      id="excludeDomains"
                      placeholder="spam.com, ads.com"
                      value={searchState.filters.excludeDomains?.join(', ') || ''}
                      onChange={(e) => {
                        const domains = e.target.value
                          .split(',')
                          .map(d => d.trim())
                          .filter(d => d.length > 0);
                        handleFilterChange('excludeDomains', domains.length > 0 ? domains : undefined);
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeContent"
                      checked={searchState.filters.includeContent}
                      onCheckedChange={(checked) => handleFilterChange('includeContent', checked)}
                    />
                    <Label htmlFor="includeContent" className="text-gray-700 dark:text-gray-300">Include full content</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeHighlights"
                      checked={searchState.filters.includeHighlights}
                      onCheckedChange={(checked) => handleFilterChange('includeHighlights', checked)}
                    />
                    <Label htmlFor="includeHighlights" className="text-gray-700 dark:text-gray-300">Include highlights</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeSummary"
                      checked={searchState.filters.includeSummary}
                      onCheckedChange={(checked) => handleFilterChange('includeSummary', checked)}
                    />
                    <Label htmlFor="includeSummary" className="text-gray-700 dark:text-gray-300">Include AI summary</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="useAutoprompt"
                      checked={searchState.filters.useAutoprompt}
                      onCheckedChange={(checked) => handleFilterChange('useAutoprompt', checked)}
                    />
                    <Label htmlFor="useAutoprompt" className="text-gray-700 dark:text-gray-300">Use AI autoprompt</Label>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearFilters}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowFilters(false)}
                  >
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
        onSearch={handleSearch}
      />
    </div>
  );
};

export default SearchInterface;
