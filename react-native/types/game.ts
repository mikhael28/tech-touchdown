export interface Game {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  startTime: string;
  status: GameStatus;
  score?: Score;
  league: League;
  venue?: string;
  network?: string;
}

export interface Team {
  name: string;
  abbreviation: string;
  record?: string;
  logo?: string;
  color?: string;
}

export interface Score {
  home: number;
  away: number;
}

export type GameStatus = 'scheduled' | 'live' | 'final' | 'postponed' | 'cancelled';

export type League = 'NFL' | 'NBA' | 'MLB' | 'NHL' | 'MLS' | 'NCAAF' | 'NCAAB' | 'EURO' | 'EPL';

export interface LiveGameData {
  quarter?: string;
  timeRemaining?: string;
  possession?: 'home' | 'away';
  down?: number;
  distance?: number;
  yardLine?: string;
}