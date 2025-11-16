export interface Game {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  gameStatus: GameStatus;
  startTime?: string;
  date: string;
  isLive: boolean;
  isCompleted: boolean;
  period?: string;
  broadcast?: string;
  url?: string;
  venue?: string;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
  source?: string;
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
  | "in_progress"
  | "completed"
  | "postponed"
  | "cancelled"
  | "halftime"
  | "final";

// ESPN API Types
export interface ESPNEvent {
  id: string;
  uid: string;
  date: string;
  name: string;
  shortName: string;
  competitions: ESPNCompetition[];
  status: ESPNStatus;
  links?: Array<{ href: string }>;
}

export interface ESPNCompetition {
  id: string;
  uid: string;
  date: string;
  attendance?: number;
  competitors: ESPNCompetitor[];
  venue?: ESPNVenue;
  broadcasts?: Array<{ names: string[] }>;
  status: ESPNStatus;
}

export interface ESPNCompetitor {
  id: string;
  uid: string;
  type: 'team';
  order: number;
  homeAway: 'home' | 'away';
  team: ESPNTeam;
  score?: string;
  winner?: boolean;
}

export interface ESPNTeam {
  id: string;
  uid: string;
  location: string;
  name: string;
  abbreviation: string;
  displayName: string;
  shortDisplayName: string;
  logo?: string;
  logos?: Array<{ href: string }>;
}

export interface ESPNVenue {
  id: string;
  fullName: string;
  address?: {
    city: string;
    state?: string;
  };
}

export interface ESPNStatus {
  clock: number;
  displayClock: string;
  period: number;
  type: {
    id: string;
    name: string;
    state: string;
    completed: boolean;
    description: string;
    detail: string;
    shortDetail: string;
  };
}

export interface ESPNScoreboardResponse {
  leagues: Array<{
    id: string;
    uid: string;
    name: string;
    abbreviation: string;
    slug: string;
  }>;
  season: {
    year: number;
    type: number;
    name: string;
  };
  events: ESPNEvent[];
}

// TheSportsDB API Types
export interface SportsDBEvent {
  idEvent: string;
  strEvent: string;
  strLeague: string;
  strSport: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strStatus: string;
  dateEvent: string;
  strTime: string;
  strVenue: string;
  strThumb?: string;
  strHomeTeamBadge?: string;
  strAwayTeamBadge?: string;
}

export interface SportsDBResponse {
  events: SportsDBEvent[] | null;
}

// API-Football Types
export interface FootballFixture {
  fixture: {
    id: number;
    referee: string | null;
    timezone: string;
    date: string;
    timestamp: number;
    venue: {
      id: number | null;
      name: string;
      city: string;
    };
    status: {
      long: string;
      short: string;
      elapsed: number | null;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
    away: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: { home: number | null; away: number | null };
    fulltime: { home: number | null; away: number | null };
    extratime: { home: number | null; away: number | null };
    penalty: { home: number | null; away: number | null };
  };
}

export interface FootballAPIResponse {
  response: FootballFixture[];
}

// Cricket API Types
export interface CricketMatch {
  id: string;
  name: string;
  matchType: string;
  status: string;
  venue: string;
  date: string;
  dateTimeGMT: string;
  teams: string[];
  teamInfo: Array<{
    name: string;
    shortname: string;
    img?: string;
  }>;
  score: Array<{
    r: number;
    w: number;
    o: number;
    inning: string;
  }>;
  series_id: string;
  fantasyEnabled: boolean;
  bbbEnabled: boolean;
  hasSquad: boolean;
  matchStarted: boolean;
  matchEnded: boolean;
}

export interface CricketAPIResponse {
  success: boolean;
  data: CricketMatch[];
}

// Ball Don't Lie API Types (WNBA, etc.)
export interface BDLGame {
  id: number;
  date: string;
  home_team: BDLTeam;
  home_team_score: number;
  visitor_team: BDLTeam;
  visitor_team_score: number;
  season: number;
  period: number;
  status: string;
  time: string;
  postseason: boolean;
}

export interface BDLTeam {
  id: number;
  abbreviation: string;
  city: string;
  conference: string;
  division: string;
  full_name: string;
  name: string;
}

export interface BDLResponse {
  data: BDLGame[];
  meta: {
    total_pages: number;
    current_page: number;
    next_page: number | null;
    per_page: number;
    total_count: number;
  };
}

// Unified API Response
export interface UnifiedSportsAPIResponse {
  success: boolean;
  data: SportsData;
  errors?: Array<{
    source: string;
    message: string;
  }>;
}
