import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Filter, Calendar, Globe, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { exaApi } from '../services/exaApi';
import { ExaSearchResult, SearchFilters, SearchState } from '../types/exa';
import SearchResults from '../components/SearchResults';
import TeamSelectionModal from '../components/TeamSelectionModal';
import FavoriteTeamsBubbles from '../components/FavoriteTeamsBubbles';
import { useFavoriteTeams } from '../hooks/useFavoriteTeams';

const Home: React.FC = () => {
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
  const [showTeamModal, setShowTeamModal] = useState(false);

  const {
    favoriteTeams,
    isQuestionnaireCompleted,
    isLoading: teamsLoading,
    saveFavoriteTeams,
    markQuestionnaireCompleted,
    removeTeam,
  } = useFavoriteTeams();

  useEffect(() => {
    setTimeout(() => {
      handleSearch('What are the latest headlines in the NFL, NBA, MLB, and NHL?');
    }, 1000);
  }, []);

  // Show team selection modal if questionnaire not completed
  useEffect(() => {
    if (!teamsLoading && !isQuestionnaireCompleted) {
      setShowTeamModal(true);
    }
  }, [teamsLoading, isQuestionnaireCompleted]);

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

  const handleTeamSelectionComplete = (teams: any) => {
    saveFavoriteTeams(teams);
    markQuestionnaireCompleted();
    setShowTeamModal(false);
  };

  const handleEditTeams = () => {
    setShowTeamModal(true);
  };

  const handleRemoveTeam = (sport: keyof typeof favoriteTeams, teamShortName: string) => {
    removeTeam(sport, teamShortName);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <FavoriteTeamsBubbles
            favoriteTeams={favoriteTeams}
            onRemoveTeam={handleRemoveTeam}
            onEditTeams={handleEditTeams}
          />
        </CardContent>
      </Card>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search for articles, news, or any topic..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={searchState.isLoading}>
                {searchState.isLoading ? 'Searching...' : 'Search'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="border-t pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numResults">Number of Results</Label>
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
                    <Label htmlFor="searchType">Search Type</Label>
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
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={searchState.filters.startPublishedDate || ''}
                      onChange={(e) => handleFilterChange('startPublishedDate', e.target.value || undefined)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
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
                    <Label htmlFor="includeDomains">Include Domains (comma-separated)</Label>
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
                    <Label htmlFor="excludeDomains">Exclude Domains (comma-separated)</Label>
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
                    <Label htmlFor="includeContent">Include full content</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeHighlights"
                      checked={searchState.filters.includeHighlights}
                      onCheckedChange={(checked) => handleFilterChange('includeHighlights', checked)}
                    />
                    <Label htmlFor="includeHighlights">Include highlights</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeSummary"
                      checked={searchState.filters.includeSummary}
                      onCheckedChange={(checked) => handleFilterChange('includeSummary', checked)}
                    />
                    <Label htmlFor="includeSummary">Include AI summary</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="useAutoprompt"
                      checked={searchState.filters.useAutoprompt}
                      onCheckedChange={(checked) => handleFilterChange('useAutoprompt', checked)}
                    />
                    <Label htmlFor="useAutoprompt">Use AI autoprompt</Label>
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

      {/* Favorite Teams Bubbles */}
     

      {/* Search Results */}
      <SearchResults 
        searchState={searchState}
        onSearch={handleSearch}
      />

      {/* Team Selection Modal */}
      <TeamSelectionModal
        isOpen={showTeamModal}
        onClose={() => setShowTeamModal(false)}
        onComplete={handleTeamSelectionComplete}
      />
    </div>
  );
};

export default Home;
