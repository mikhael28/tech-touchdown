import { useState, useCallback } from 'react';
import { BettingLine, HotGame, GamblingDashboard, LiveOdds } from '../types/gambling';
import { Game } from '../types/sports';

interface UseGamblingOddsResult {
  dashboard: GamblingDashboard | null;
  loading: boolean;
  error: string | null;
  fetchOdds: (games?: Game[]) => Promise<void>;
  clearError: () => void;
}

// Generate realistic-looking odds
const generateOdds = (homeTeam: string, awayTeam: string, isLive: boolean = false): BettingLine => {
  // Randomize which team is favored
  const homeFavored = Math.random() > 0.5;
  const favoriteSpread = -(Math.random() * 10 + 1.5); // -1.5 to -11.5
  const favoriteML = -(Math.random() * 200 + 105); // -105 to -305
  const underdogML = Math.random() * 200 + 105; // +105 to +305
  const totalLine = Math.random() * 20 + 40; // 40 to 60
  const overUnderOdds = Math.random() > 0.5 ? -110 : +100;

  return {
    gameId: `${homeTeam}-${awayTeam}-${Date.now()}`,
    league: 'Generated',
    homeTeam,
    awayTeam,
    commenceTime: new Date(Date.now() + Math.random() * 86400000).toISOString(),
    moneyline: {
      home: homeFavored ? Math.round(favoriteML) : Math.round(underdogML),
      away: homeFavored ? Math.round(underdogML) : Math.round(favoriteML),
      bookmaker: 'DraftKings',
    },
    spread: {
      home: homeFavored ? favoriteSpread : -favoriteSpread,
      away: homeFavored ? -favoriteSpread : favoriteSpread,
      homeOdds: -110,
      awayOdds: -110,
      bookmaker: 'FanDuel',
    },
    totals: {
      over: overUnderOdds,
      under: -overUnderOdds,
      line: Math.round(totalLine * 2) / 2, // Round to nearest 0.5
      bookmaker: 'BetMGM',
    },
  };
};

// Generate hot games with trending info
const generateHotGames = (games: Game[]): HotGame[] => {
  const trendingReasons = [
    'Heavy action on favorite',
    'Sharp money on underdog',
    'Recent injury report',
    'Line movement in last hour',
    'Weather conditions impacting total',
    'Head-to-head history favors upset',
    'Public betting over 75%',
    'Contrarian play gaining steam',
  ];

  return games.slice(0, 8).map((game) => {
    const homePercentage = Math.round(Math.random() * 40 + 30); // 30-70%
    const awayPercentage = 100 - homePercentage;
    const moneyMovement = homePercentage > 55 ? 'home' : awayPercentage > 55 ? 'away' : 'neutral';

    return {
      gameId: game.id,
      league: game.league,
      homeTeam: game.homeTeam,
      awayTeam: game.awayTeam,
      commenceTime: game.startTime || game.date,
      trendingReason: trendingReasons[Math.floor(Math.random() * trendingReasons.length)],
      betPercentage: {
        home: homePercentage,
        away: awayPercentage,
      },
      moneyMovement,
      odds: {
        ...generateOdds(game.homeTeam, game.awayTeam),
        gameId: game.id,
        league: game.league,
        homeTeamLogo: game.homeTeamLogo,
        awayTeamLogo: game.awayTeamLogo,
      },
    };
  });
};

// Generate live games with in-game odds
const generateLiveOdds = (games: Game[]): LiveOdds[] => {
  const liveGames = games.filter((g) => g.isLive);

  return liveGames.map((game) => {
    const baseOdds = generateOdds(game.homeTeam, game.awayTeam, true);
    return {
      ...baseOdds,
      gameId: game.id,
      league: game.league,
      period: game.period || 'Q2',
      currentScore: {
        home: game.homeScore || Math.floor(Math.random() * 30),
        away: game.awayScore || Math.floor(Math.random() * 30),
      },
      timeRemaining: '7:32',
      isLive: true,
      homeTeamLogo: game.homeTeamLogo,
      awayTeamLogo: game.awayTeamLogo,
    };
  });
};

const useGamblingOdds = (): UseGamblingOddsResult => {
  const [dashboard, setDashboard] = useState<GamblingDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOdds = useCallback(async (games?: Game[]) => {
    try {
      setLoading(true);
      setError(null);

      // If no games provided, create some sample data
      if (!games || games.length === 0) {
        const sampleGames: Game[] = [
          {
            id: '1',
            league: 'NFL',
            homeTeam: 'Kansas City Chiefs',
            awayTeam: 'Buffalo Bills',
            homeScore: null,
            awayScore: null,
            gameStatus: 'scheduled',
            date: new Date(Date.now() + 7200000).toISOString(),
            isLive: false,
            isCompleted: false,
          },
          {
            id: '2',
            league: 'NBA',
            homeTeam: 'Los Angeles Lakers',
            awayTeam: 'Boston Celtics',
            homeScore: 87,
            awayScore: 92,
            gameStatus: 'in_progress',
            date: new Date().toISOString(),
            isLive: true,
            isCompleted: false,
            period: 'Q3',
          },
          {
            id: '3',
            league: 'MLB',
            homeTeam: 'New York Yankees',
            awayTeam: 'Los Angeles Dodgers',
            homeScore: null,
            awayScore: null,
            gameStatus: 'scheduled',
            date: new Date(Date.now() + 14400000).toISOString(),
            isLive: false,
            isCompleted: false,
          },
        ];
        games = sampleGames;
      }

      // Generate odds data
      const hotGames = generateHotGames(games);
      const topOdds = games.slice(0, 12).map((game) => ({
        ...generateOdds(game.homeTeam, game.awayTeam),
        gameId: game.id,
        league: game.league,
        commenceTime: game.startTime || game.date,
        homeTeamLogo: game.homeTeamLogo,
        awayTeamLogo: game.awayTeamLogo,
      }));
      const liveGames = generateLiveOdds(games);

      // Mock futures data
      const futures = [
        {
          id: 'nfl-sb-2025',
          league: 'NFL',
          category: 'Super Bowl LIX Winner',
          options: [
            { name: 'Kansas City Chiefs', odds: +350 },
            { name: 'Buffalo Bills', odds: +450 },
            { name: 'San Francisco 49ers', odds: +550 },
            { name: 'Baltimore Ravens', odds: +650 },
            { name: 'Philadelphia Eagles', odds: +750 },
          ],
          closingDate: '2025-02-09T00:00:00Z',
        },
        {
          id: 'nba-champ-2025',
          league: 'NBA',
          category: 'NBA Championship Winner',
          options: [
            { name: 'Boston Celtics', odds: +275 },
            { name: 'Milwaukee Bucks', odds: +400 },
            { name: 'Denver Nuggets', odds: +450 },
            { name: 'Phoenix Suns', odds: +550 },
            { name: 'Los Angeles Lakers', odds: +650 },
          ],
          closingDate: '2025-06-20T00:00:00Z',
        },
      ];

      setDashboard({
        hotGames,
        topOdds,
        liveGames,
        futures,
        lastUpdated: new Date().toISOString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch odds');
      console.error('Error fetching gambling odds:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    dashboard,
    loading,
    error,
    fetchOdds,
    clearError,
  };
};

export default useGamblingOdds;
