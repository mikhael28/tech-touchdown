// Gambling/Betting Odds Types

export type BetType = 'moneyline' | 'spread' | 'totals' | 'props' | 'futures' | 'parlays';
export type BetStatus = 'pending' | 'won' | 'lost' | 'pushed' | 'cancelled';

export interface Bookmaker {
  key: string;
  title: string;
  lastUpdate: string;
}

export interface Outcome {
  name: string;
  price: number; // American odds (e.g., +150, -110)
  point?: number; // For spreads and totals
}

export interface Market {
  key: string; // e.g., 'h2h' (moneyline), 'spreads', 'totals'
  lastUpdate: string;
  outcomes: Outcome[];
}

export interface BookmakerOdds {
  bookmaker: Bookmaker;
  markets: Market[];
}

export interface OddsData {
  id: string;
  sportKey: string;
  sportTitle: string;
  commenceTime: string;
  homeTeam: string;
  awayTeam: string;
  bookmakers: BookmakerOdds[];
}

// Simplified betting line for display
export interface BettingLine {
  gameId: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: string;
  moneyline?: {
    home: number;
    away: number;
    bookmaker: string;
  };
  spread?: {
    home: number;
    away: number;
    homeOdds: number;
    awayOdds: number;
    bookmaker: string;
  };
  totals?: {
    over: number;
    under: number;
    line: number;
    bookmaker: string;
  };
  homeTeamLogo?: string;
  awayTeamLogo?: string;
}

// Hot games - trending bets
export interface HotGame {
  gameId: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: string;
  trendingReason: string; // e.g., "Heavy action on home team", "Line movement", "Injury report"
  betPercentage?: {
    home: number;
    away: number;
  };
  moneyMovement?: 'home' | 'away' | 'neutral';
  odds: BettingLine;
}

// User bet slip (for future implementation)
export interface BetSlipItem {
  id: string;
  gameId: string;
  betType: BetType;
  selection: string;
  odds: number;
  stake?: number;
  potentialPayout?: number;
}

// Betting trends and analytics
export interface BettingTrend {
  gameId: string;
  publicBetting: {
    home: number;
    away: number;
  };
  moneyPercentage: {
    home: number;
    away: number;
  };
  lineMovement: {
    opening: number;
    current: number;
    direction: 'up' | 'down' | 'stable';
  };
}

// Props betting (player/team props)
export interface PropBet {
  id: string;
  gameId: string;
  category: 'player' | 'team' | 'game';
  description: string;
  options: Array<{
    name: string;
    odds: number;
  }>;
  playerName?: string;
  statType?: string; // e.g., 'points', 'rebounds', 'touchdowns'
}

// Parlay bet
export interface Parlay {
  id: string;
  legs: BetSlipItem[];
  combinedOdds: number;
  potentialPayout: number;
  status: BetStatus;
}

// Live betting (in-game odds)
export interface LiveOdds extends BettingLine {
  period: string;
  currentScore: {
    home: number;
    away: number;
  };
  timeRemaining?: string;
  isLive: boolean;
}

// Futures betting (championship, MVP, etc.)
export interface FuturesBet {
  id: string;
  league: string;
  category: string; // e.g., 'Championship', 'MVP', 'Rookie of the Year'
  options: Array<{
    name: string; // Team or player name
    odds: number;
  }>;
  closingDate: string;
}

// Betting dashboard summary
export interface GamblingDashboard {
  hotGames: HotGame[];
  topOdds: BettingLine[];
  liveGames: LiveOdds[];
  futures: FuturesBet[];
  lastUpdated: string;
}

// The Odds API Response Types
export interface TheOddsAPIResponse {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Array<{
    key: string;
    title: string;
    last_update: string;
    markets: Array<{
      key: string;
      last_update: string;
      outcomes: Array<{
        name: string;
        price: number;
        point?: number;
      }>;
    }>;
  }>;
}

// Sport keys for The Odds API
export type SportKey =
  | 'americanfootball_nfl'
  | 'basketball_nba'
  | 'icehockey_nhl'
  | 'baseball_mlb'
  | 'soccer_epl'
  | 'soccer_uefa_champs_league'
  | 'basketball_ncaab'
  | 'americanfootball_ncaaf'
  | 'mma_mixed_martial_arts'
  | 'boxing_boxing';
