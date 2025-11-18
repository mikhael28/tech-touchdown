import React, { useEffect, useState } from 'react';
import { RefreshCw, Flame, Trophy, TrendingUp, AlertCircle, DollarSign } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import useGamblingOdds from '../hooks/useGamblingOdds';
import useAllGames from '../hooks/useAllGames';
import OddsCard from '../components/OddsCard';
import HotGameCard from '../components/HotGameCard';

const Gambling: React.FC = () => {
  const { dashboard, loading, error, fetchOdds, clearError } = useGamblingOdds();
  const {
    data: gamesData,
    loading: gamesLoading,
    fetchGames,
  } = useAllGames();

  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'hot' | 'all' | 'live' | 'futures'>('hot');

  // Initial fetch
  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  // Fetch odds when games data is available
  useEffect(() => {
    if (gamesData?.leagues) {
      const allGames = gamesData.leagues.flatMap((league) => league.games);
      fetchOdds(allGames);
    } else {
      // Fetch with sample data if no games available
      fetchOdds();
    }
  }, [gamesData, fetchOdds]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchGames();
      if (gamesData?.leagues) {
        const allGames = gamesData.leagues.flatMap((league) => league.games);
        fetchOdds(allGames);
      }
    }, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [autoRefresh, gamesData, fetchGames, fetchOdds]);

  const handleRefresh = () => {
    fetchGames();
    if (gamesData?.leagues) {
      const allGames = gamesData.leagues.flatMap((league) => league.games);
      fetchOdds(allGames);
    }
  };

  const formatOdds = (value: number): string => {
    if (value > 0) return `+${value}`;
    return value.toString();
  };

  const isLoading = loading || gamesLoading;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="h-8 w-8 text-warning" />
            <h1 className="text-3xl font-bold text-foreground">Betting Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Real-time odds and betting lines across major sports
          </p>
          {dashboard?.lastUpdated && (
            <p className="text-sm text-muted-foreground mt-1">
              Last updated: {new Date(dashboard.lastUpdated).toLocaleString()}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant={autoRefresh ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto-Refresh {autoRefresh ? 'ON' : 'OFF'}
          </Button>
          <Button onClick={handleRefresh} disabled={isLoading} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Disclaimer */}
      <Card className="border-warning/50 bg-warning/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">For Entertainment Only</p>
              <p className="text-xs text-muted-foreground mt-1">
                This dashboard displays simulated betting odds for demonstration purposes. Odds are
                generated algorithmically and do not reflect real sportsbook lines. Please gamble
                responsibly and only use licensed, regulated sportsbooks.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-warning/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hot Games</p>
                <p className="text-3xl font-bold text-foreground">
                  {dashboard?.hotGames.length || 0}
                </p>
              </div>
              <Flame className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">All Odds</p>
                <p className="text-3xl font-bold text-foreground">
                  {dashboard?.topOdds.length || 0}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-warning/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Live Betting</p>
                <p className="text-3xl font-bold text-warning">
                  {dashboard?.liveGames.length || 0}
                </p>
              </div>
              <div className="h-8 w-8 bg-warning rounded-full animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gold/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Futures</p>
                <p className="text-3xl font-bold text-foreground">
                  {dashboard?.futures.length || 0}
                </p>
              </div>
              <Trophy className="h-8 w-8 text-gold" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-destructive">Error Loading Odds</h3>
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
      {isLoading && !dashboard && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading betting dashboard...</span>
        </div>
      )}

      {/* Tab Navigation */}
      {dashboard && (
        <>
          <div className="flex gap-2 border-b border-border pb-2">
            <button
              onClick={() => setSelectedTab('hot')}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                selectedTab === 'hot'
                  ? 'bg-warning text-warning-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Flame className="h-4 w-4 inline mr-2" />
              Hot Games ({dashboard.hotGames.length})
            </button>
            <button
              onClick={() => setSelectedTab('all')}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                selectedTab === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              All Odds ({dashboard.topOdds.length})
            </button>
            <button
              onClick={() => setSelectedTab('live')}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                selectedTab === 'live'
                  ? 'bg-warning text-warning-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <div className="h-2 w-2 bg-warning rounded-full animate-pulse inline-block mr-2" />
              Live ({dashboard.liveGames.length})
            </button>
            <button
              onClick={() => setSelectedTab('futures')}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                selectedTab === 'futures'
                  ? 'bg-gold text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Trophy className="h-4 w-4 inline mr-2" />
              Futures ({dashboard.futures.length})
            </button>
          </div>

          {/* Hot Games Tab */}
          {selectedTab === 'hot' && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">🔥 Hottest Action Today</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {dashboard.hotGames.map((hotGame, idx) => (
                  <HotGameCard key={`hot-${idx}`} hotGame={hotGame} />
                ))}
              </div>
            </div>
          )}

          {/* All Odds Tab */}
          {selectedTab === 'all' && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">All Betting Lines</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboard.topOdds.map((odds, idx) => (
                  <OddsCard key={`odds-${idx}`} odds={odds} />
                ))}
              </div>
            </div>
          )}

          {/* Live Games Tab */}
          {selectedTab === 'live' && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <div className="h-3 w-3 bg-warning rounded-full animate-pulse" />
                Live In-Game Betting
              </h2>
              {dashboard.liveGames.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No live games available for betting</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dashboard.liveGames.map((liveOdds, idx) => (
                    <Card key={`live-${idx}`} className="border-warning/50">
                      <CardContent className="p-4">
                        <Badge className="bg-warning text-warning-foreground mb-3">
                          LIVE • {liveOdds.period}
                        </Badge>
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">{liveOdds.awayTeam}</span>
                            <span className="text-lg font-bold text-foreground">
                              {liveOdds.currentScore.away}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">{liveOdds.homeTeam}</span>
                            <span className="text-lg font-bold text-foreground">
                              {liveOdds.currentScore.home}
                            </span>
                          </div>
                        </div>
                        {liveOdds.moneyline && (
                          <div className="pt-3 border-t border-border">
                            <div className="text-xs font-medium text-muted-foreground mb-2">
                              Live Moneyline
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-bold text-primary">
                                {formatOdds(liveOdds.moneyline.away)}
                              </span>
                              <span className="text-sm font-bold text-primary">
                                {formatOdds(liveOdds.moneyline.home)}
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Futures Tab */}
          {selectedTab === 'futures' && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Championship Futures</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {dashboard.futures.map((future) => (
                  <Card key={future.id} className="border-gold/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-gold" />
                        {future.category}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {future.league} • Closes{' '}
                        {new Date(future.closingDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {future.options.map((option, idx) => (
                          <button
                            key={idx}
                            className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:border-gold hover:bg-gold/5 transition-all"
                          >
                            <span className="font-medium text-foreground">{option.name}</span>
                            <span className="font-bold text-gold">{formatOdds(option.odds)}</span>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Gambling;
