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
      scheduled: 'bg-gray-500',
      live: 'bg-red-500 animate-pulse',
      in_progress: 'bg-red-500 animate-pulse',
      completed: 'bg-green-600',
      final: 'bg-green-600',
      postponed: 'bg-yellow-600',
      cancelled: 'bg-gray-600',
      halftime: 'bg-orange-500',
    };

    return (
      <Badge className={`${statusColors[game.gameStatus]} text-white`}>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Live Sports Games
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Real-time scores from multiple sports leagues
          </p>
          {data?.lastUpdated && (
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
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
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Games</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {getTotalGames()}
                </p>
              </div>
              <Trophy className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Live Now</p>
                <p className="text-3xl font-bold text-red-500">
                  {getLiveGames()}
                </p>
              </div>
              <div className="h-8 w-8 bg-red-500 rounded-full animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Leagues</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {data?.leagues.length || 0}
                </p>
              </div>
              <Filter className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                League
              </label>
              <select
                value={selectedLeague}
                onChange={(e) => setSelectedLeague(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as GameStatus | 'all')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
        <Card className="border-red-500 bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 dark:text-red-200">
                  Error Loading Games
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
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
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">
            Loading games...
          </span>
        </div>
      )}

      {/* Games Display */}
      {!loading && filteredLeagues.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Trophy className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
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
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(game)}
                      {game.period && (
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {game.period}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
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
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {game.awayTeam}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Away</p>
                      </div>
                      {game.awayScore !== null && (
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
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
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {game.homeTeam}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Home</p>
                      </div>
                      {game.homeScore !== null && (
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {game.homeScore}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
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
