import { useEffect, useState } from 'react';
import useAllGames from '../hooks/useAllGames';
import { Game, GameStatus } from '../types/sports';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { RefreshCw, AlertCircle, Filter, Clock, Trophy } from 'lucide-react';

const Games = () => {
  const { data, loading, error, fetchGames, clearError } = useAllGames();
  const [selectedLeague, setSelectedLeague] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<GameStatus | 'all'>('all');
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchGames();
    }, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [autoRefresh, fetchGames]);

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
      <Badge className={`${statusColors[game.gameStatus]} text-white font-semibold`}>
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

  const filterGames = () => {
    if (!data?.leagues) return [];

    let filteredLeagues = data.leagues;

    if (selectedLeague !== 'all') {
      filteredLeagues = filteredLeagues.filter(
        league => league.name === selectedLeague
      );
    }

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

  const filteredLeagues = filterGames();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Live Sports Games
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time scores from multiple sports leagues
          </p>
          {data?.lastUpdated && (
            <p className="text-sm text-muted-foreground mt-1">
              Last updated: {new Date(data.lastUpdated).toLocaleString()}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant={autoRefresh ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Clock className="h-4 w-4" />
            {autoRefresh ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}
          </Button>
          <Button
            onClick={fetchGames}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-primary/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Games</p>
                <p className="text-3xl font-bold text-foreground">
                  {getTotalGames()}
                </p>
              </div>
              <Trophy className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-warning/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Live Now</p>
                <p className="text-3xl font-bold text-warning">
                  {getLiveGames()}
                </p>
              </div>
              <div className="h-8 w-8 bg-warning rounded-full animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Leagues</p>
                <p className="text-3xl font-bold text-foreground">
                  {data?.leagues.length || 0}
                </p>
              </div>
              <Filter className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                League
              </label>
              <select
                value={selectedLeague}
                onChange={(e) => setSelectedLeague(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Leagues</option>
                {getUniqueLeagues().map((league) => (
                  <option key={league} value={league}>
                    {league}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as GameStatus | 'all')}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Statuses</option>
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
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-destructive">
                  Error Loading Games
                </h3>
                <p className="text-sm text-destructive/80 mt-1">{error}</p>
              </div>
              <Button variant="outline" size="sm" onClick={clearError}>
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && !data && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">
            Loading games...
          </span>
        </div>
      )}

      {/* Games Display */}
      {!loading && filteredLeagues.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No games found matching your filters
            </p>
          </CardContent>
        </Card>
      )}

      {filteredLeagues.map((league) => (
        <Card key={league.name}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{league.name}</span>
              <Badge variant="outline">{league.games.length} games</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {league.games.map((game) => (
                <div
                  key={game.id}
                  className="border border-border rounded-lg p-4 hover:bg-muted/50 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(game)}
                      {game.period && (
                        <span className="text-sm text-muted-foreground font-medium">
                          {game.period}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatTime(game.startTime)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Away Team */}
                    <div className="flex items-center gap-3">
                      {game.awayTeamLogo && (
                        <img
                          src={game.awayTeamLogo}
                          alt={game.awayTeam}
                          className="h-8 w-8 object-contain"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">
                          {game.awayTeam}
                        </p>
                        <p className="text-sm text-muted-foreground">Away</p>
                      </div>
                      {game.awayScore !== null && (
                        <p className="text-2xl font-bold text-foreground tabular-nums">
                          {game.awayScore}
                        </p>
                      )}
                    </div>

                    {/* Home Team */}
                    <div className="flex items-center gap-3">
                      {game.homeTeamLogo && (
                        <img
                          src={game.homeTeamLogo}
                          alt={game.homeTeam}
                          className="h-8 w-8 object-contain"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">
                          {game.homeTeam}
                        </p>
                        <p className="text-sm text-muted-foreground">Home</p>
                      </div>
                      {game.homeScore !== null && (
                        <p className="text-2xl font-bold text-foreground tabular-nums">
                          {game.homeScore}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      {game.venue && <span>{game.venue}</span>}
                      {game.broadcast && <span>📺 {game.broadcast}</span>}
                    </div>
                    {game.source && (
                      <span className="text-xs">Source: {game.source}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Games;
