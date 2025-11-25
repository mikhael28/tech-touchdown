// TypeScript types for ESPN Game Stats

export interface TeamStatistic {
  name: string;
  displayValue: string;
  label?: string;
}

export interface TeamStats {
  team: {
    id: string;
    displayName: string;
    abbreviation: string;
  };
  statistics: TeamStatistic[];
}

export interface PlayerAthlete {
  athlete: {
    id: string;
    displayName: string;
    shortName: string;
    position?: {
      abbreviation: string;
    };
    headshot?: {
      href: string;
    };
  };
  stats: string[];
}

export interface PlayerStatCategory {
  name: string;
  displayName: string;
  shortDisplayName?: string;
  descriptions?: string[];
  athletes: PlayerAthlete[];
}

export interface TeamPlayerStats {
  team: {
    id: string;
    displayName: string;
  };
  statistics: PlayerStatCategory[];
}

export interface GameLeader {
  name: string;
  displayName: string;
  leaders: Array<{
    displayValue: string;
    athlete: {
      id: string;
      displayName: string;
      shortName: string;
      headshot?: {
        href: string;
      };
    };
  }>;
}

export interface Drive {
  id: string;
  description: string;
  team: {
    name: string;
    abbreviation: string;
  };
  start: {
    yardLine: number;
    text: string;
  };
  end: {
    yardLine: number;
    text: string;
  };
  plays: number;
  yards: number;
  result: string;
}

export interface Play {
  id: string;
  type: {
    text: string;
  };
  text: string;
  scoreValue?: number;
  statYardage?: number;
  start?: {
    yardLine: number;
  };
  end?: {
    yardLine: number;
  };
}

export interface DriveWithPlays extends Omit<Drive, 'plays'> {
  start: Drive['start'] & {
    period: number;
    clock: {
      displayValue: string;
    };
  };
  end: Drive['end'] & {
    period: number;
    clock: {
      displayValue: string;
    };
  };
  plays: Play[];
}

export interface GameSummary {
  boxscore?: {
    teams: TeamStats[];
    players?: TeamPlayerStats[];
  };
  drives?: {
    previous?: Drive[];
  };
  leaders?: GameLeader[];
  header?: {
    competitions: Array<{
      competitors: Array<{
        id: string;
        team: {
          displayName: string;
          logo: string;
        };
        score: string;
        records?: Array<{
          summary: string;
        }>;
      }>;
    }>;
  };
}

export interface PlayByPlay {
  drives?: {
    previous?: DriveWithPlays[];
  };
}

export interface GameStatsResponse {
  success: boolean;
  data: {
    gameId: string;
    sport: string;
    league: string;
    summary?: GameSummary;
    playByPlay?: PlayByPlay;
  };
  errors?: Array<{
    source: string;
    message: string;
  }>;
}

// NFL-specific stats helpers
export interface NFLPassingStats {
  completions: number;
  attempts: number;
  yards: number;
  touchdowns: number;
  interceptions: number;
}

export interface NFLRushingStats {
  carries: number;
  yards: number;
  touchdowns: number;
  longRush: number;
}

export interface NFLReceivingStats {
  receptions: number;
  yards: number;
  touchdowns: number;
  targets: number;
}

export interface NFLDefensiveStats {
  tackles: number;
  sacks: number;
  interceptions: number;
  forcedFumbles: number;
}

