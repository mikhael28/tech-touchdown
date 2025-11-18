import axios from 'axios';

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

export class ESPNApiService {
  private readonly baseUrl = 'https://site.api.espn.com/apis/site/v2/sports';

  async getScoreboard(sport: string, league: string): Promise<ESPNScoreboardResponse> {
    try {
      const url = `${this.baseUrl}/${sport}/${league}/scoreboard`;
      const response = await axios.get<ESPNScoreboardResponse>(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; TechTouchdown/1.0)',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching ESPN ${league} scoreboard:`, error);
      throw new Error(`Failed to fetch ${league} data from ESPN`);
    }
  }

  async getNFLScoreboard(): Promise<ESPNScoreboardResponse> {
    return this.getScoreboard('football', 'nfl');
  }

  async getNBAScoreboard(): Promise<ESPNScoreboardResponse> {
    return this.getScoreboard('basketball', 'nba');
  }

  async getWNBAScoreboard(): Promise<ESPNScoreboardResponse> {
    return this.getScoreboard('basketball', 'wnba');
  }

  async getNHLScoreboard(): Promise<ESPNScoreboardResponse> {
    return this.getScoreboard('hockey', 'nhl');
  }

  async getMLBScoreboard(): Promise<ESPNScoreboardResponse> {
    return this.getScoreboard('baseball', 'mlb');
  }

  async getMLSScoreboard(): Promise<ESPNScoreboardResponse> {
    return this.getScoreboard('soccer', 'usa.1');
  }

  async getUEFAChampionsLeague(): Promise<ESPNScoreboardResponse> {
    return this.getScoreboard('soccer', 'uefa.champions');
  }

  async getPremierLeague(): Promise<ESPNScoreboardResponse> {
    return this.getScoreboard('soccer', 'eng.1');
  }

  async getLaLiga(): Promise<ESPNScoreboardResponse> {
    return this.getScoreboard('soccer', 'esp.1');
  }

  async getSerieA(): Promise<ESPNScoreboardResponse> {
    return this.getScoreboard('soccer', 'ita.1');
  }

  async getBundesliga(): Promise<ESPNScoreboardResponse> {
    return this.getScoreboard('soccer', 'ger.1');
  }

  async getLigue1(): Promise<ESPNScoreboardResponse> {
    return this.getScoreboard('soccer', 'fra.1');
  }

  async getNCAAFootballScoreboard(): Promise<ESPNScoreboardResponse> {
    return this.getScoreboard('football', 'college-football');
  }

  async getNCAABasketballScoreboard(): Promise<ESPNScoreboardResponse> {
    return this.getScoreboard('basketball', 'mens-college-basketball');
  }
}

export const espnApiService = new ESPNApiService();
