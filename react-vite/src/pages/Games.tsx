import { useEffect, useState } from 'react';
import useAllGames from '../hooks/useAllGames';
import { Game, GameStatus } from '../types/sports';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { RefreshCw, AlertCircle, Clock, Trophy, X } from 'lucide-react';
import GameDetailDrawer from '../components/GameDetailDrawer';
import SportsChatOverlay from '../components/SportsChatOverlay';

const STORAGE_KEY = 'tech-touchdown-selected-leagues';

const Games = () => {
  const { data, loading, error, fetchGames, clearError } = useAllGames();
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedStatus, setSelectedStatus] = useState<GameStatus | 'all'>('all');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedLeagues));
  }, [selectedLeagues]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchGames();
    }, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [autoRefresh, fetchGames]);

  // Listen for game updates from the game processor
  useEffect(() => {
    const handleGameUpdate = (event: CustomEvent) => {
      const { updatedGame } = event.detail;
      console.log('Game updated:', updatedGame);
      
      // Refresh games data when a game is updated
      fetchGames();
      
      // Update the selected game if it's the same game that was updated
      if (selectedGame && selectedGame.id === updatedGame.id) {
        setSelectedGame(updatedGame);
      }
    };

    window.addEventListener('sportsDataUpdated', handleGameUpdate as EventListener);
    
    return () => {
      window.removeEventListener('sportsDataUpdated', handleGameUpdate as EventListener);
    };
  }, [selectedGame, fetchGames]);

  const getStatusBadge = (game: Game) => {
    const statusColors: Record<GameStatus, string> = {
      scheduled: 'bg-primary',
      live: 'bg-warning animate-pulse',
      in_progress: 'bg-warning animate-pulse',
      completed: 'bg-accent',
      final: 'bg-accent',
      postponed: 'bg-gold',
      cancelled: 'bg-muted',
      halftime: 'bg-secondary',
    };

    return (
      <Badge className={`${statusColors[game.gameStatus]} text-white font-semibold text-xs py-0 px-2`}>
        {game.gameStatus === 'in_progress' ? 'LIVE' : game.gameStatus.toUpperCase()}
      </Badge>
    );
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getUniqueLeagues = () => {
    if (!data?.leagues) return [];
    return data.leagues.map(league => league.name).sort();
  };

  const toggleLeague = (league: string) => {
    setSelectedLeagues(prev => {
      if (prev.includes(league)) {
        return prev.filter(l => l !== league);
      } else {
        return [...prev, league];
      }
    });
  };

  const clearLeagueFilters = () => {
    setSelectedLeagues([]);
  };

  const filterGames = () => {
    if (!data?.leagues) return [];

    let filteredLeagues = data.leagues;

    // Filter by selected leagues (if any are selected)
    if (selectedLeagues.length > 0) {
      filteredLeagues = filteredLeagues.filter(
        league => selectedLeagues.includes(league.name)
      );
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filteredLeagues = filteredLeagues.map(league => ({
        ...league,
        games: league.games.filter(game => game.gameStatus === selectedStatus),
      })).filter(league => league.games.length > 0);
    }

    return filteredLeagues;
  };

  const getTotalGames = () => {
    if (!data?.leagues) return 0;
    return data.leagues.reduce((total, league) => total + league.games.length, 0);
  };

  const getLiveGames = () => {
    if (!data?.leagues) return 0;
    return data.leagues.reduce(
      (total, league) =>
        total + league.games.filter(game => game.isLive).length,
      0
    );
  };

  const handleGameClick = (game: Game) => {
    setSelectedGame(game);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    // Small delay to allow drawer to close before clearing selected game
    setTimeout(() => setSelectedGame(null), 300);
  };

  const filteredLeagues = filterGames();

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Live Sports Games
          </h1>
          {data?.lastUpdated && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Last updated: {new Date(data.lastUpdated).toLocaleTimeString()}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant={autoRefresh ? 'default' : 'outline'}
            size="sm"
            className="flex items-center gap-1.5"
          >
            <Clock className="h-3.5 w-3.5" />
            {autoRefresh ? 'Auto ON' : 'Auto OFF'}
          </Button>
          <Button
            onClick={fetchGames}
            disabled={loading}
            size="sm"
            className="flex items-center gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-primary/30">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Games</p>
                <p className="text-xl font-bold text-foreground">
                  {getTotalGames()}
                </p>
              </div>
              <Trophy className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-warning/30">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Live</p>
                <p className="text-xl font-bold text-warning">
                  {getLiveGames()}
                </p>
              </div>
              <div className="h-5 w-5 bg-warning rounded-full animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent/30">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Leagues</p>
                <p className="text-xl font-bold text-foreground">
                  {data?.leagues.length || 0}
                </p>
              </div>
              <Trophy className="h-5 w-5 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-3">
          <div className="space-y-3">
            {/* League Badges */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-muted-foreground">
                  LEAGUES {selectedLeagues.length > 0 && `(${selectedLeagues.length} selected)`}
                </label>
                {selectedLeagues.length > 0 && (
                  <Button
                    onClick={clearLeagueFilters}
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs px-2"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {getUniqueLeagues().map((league) => {
                  const isSelected = selectedLeagues.includes(league);
                  return (
                    <Badge
                      key={league}
                      onClick={() => toggleLeague(league)}
                      className={`cursor-pointer transition-all text-xs py-1 px-3 ${
                        isSelected
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'bg-muted text-muted-foreground hover:bg-muted/70'
                      }`}
                    >
                      {league}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                STATUS:
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as GameStatus | 'all')}
                className="flex-1 px-3 py-1.5 text-xs border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All</option>
                <option value="live">Live</option>
                <option value="in_progress">In Progress</option>
                <option value="scheduled">Scheduled</option>
                <option value="final">Final</option>
                <option value="completed">Completed</option>
                <option value="halftime">Halftime</option>
                <option value="postponed">Postponed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-destructive">{error}</p>
              </div>
              <Button variant="outline" size="sm" onClick={clearError} className="h-6 text-xs">
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && !data && (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">
            Loading games...
          </span>
        </div>
      )}

      {/* Games Display */}
      {!loading && filteredLeagues.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <Trophy className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              No games found matching your filters
            </p>
          </CardContent>
        </Card>
      )}

      {filteredLeagues.map((league) => (
        <Card key={league.name}>
          <CardHeader className="p-3 pb-2">
            <CardTitle className="flex items-center justify-between text-base">
              <span>{league.name}</span>
              <Badge variant="outline" className="text-xs">{league.games.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="space-y-2">
              {league.games.map((game) => (
                <div
                  key={game.id}
                  onClick={() => handleGameClick(game)}
                  className="border border-border rounded-lg p-3 hover:bg-muted/50 hover:border-primary/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(game)}
                      {game.period && (
                        <span className="text-xs text-muted-foreground font-medium">
                          {game.period}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatTime(game.startTime)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Away Team */}
                    <div className="flex items-center gap-2">
                      {game.awayTeamLogo && (
                        <img
                          src={game.awayTeamLogo}
                          alt={game.awayTeam}
                          className="h-6 w-6 object-contain flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">
                          {game.awayTeam}
                        </p>
                        <p className="text-xs text-muted-foreground">Away</p>
                      </div>
                      {game.awayScore !== null && (
                        <p className="text-xl font-bold text-foreground tabular-nums">
                          {game.awayScore}
                        </p>
                      )}
                    </div>

                    {/* Home Team */}
                    <div className="flex items-center gap-2">
                      {game.homeTeamLogo && (
                        <img
                          src={game.homeTeamLogo}
                          alt={game.homeTeam}
                          className="h-6 w-6 object-contain flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">
                          {game.homeTeam}
                        </p>
                        <p className="text-xs text-muted-foreground">Home</p>
                      </div>
                      {game.homeScore !== null && (
                        <p className="text-xl font-bold text-foreground tabular-nums">
                          {game.homeScore}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Additional Info */}
                  {(game.venue || game.broadcast) && (
                    <div className="mt-2 pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {game.venue && <span className="truncate">{game.venue}</span>}
                        {game.broadcast && <span className="truncate">📺 {game.broadcast}</span>}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Game Detail Drawer */}
      <GameDetailDrawer
        game={selectedGame}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />

      {/* Sports Chat Overlay */}
      <SportsChatOverlay />
    </div>
  );
};

export default Games;
