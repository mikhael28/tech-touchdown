export interface Game {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  gameStatus: string;
  startTime?: string;
  date: string;
  isLive: boolean;
  isCompleted: boolean;
  period?: string;
  broadcast?: string;
  url?: string;
}

export interface League {
  name: string;
  games: Game[];
}

export interface SportsData {
  leagues: League[];
  lastUpdated: string;
}

export type GameStatus =
  | "scheduled"
  | "live"
  | "completed"
  | "postponed"
  | "cancelled";
