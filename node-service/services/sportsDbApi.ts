import axios from 'axios';

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

export class SportsDBApiService {
  private readonly baseUrl = 'https://www.thesportsdb.com/api/v1/json';
  private readonly apiKey = '3'; // Free tier API key

  async getEventsByDate(sport: string, date: string): Promise<SportsDBResponse> {
    try {
      const url = `${this.baseUrl}/${this.apiKey}/eventsday.php`;
      const response = await axios.get<SportsDBResponse>(url, {
        params: {
          d: date, // Format: YYYY-MM-DD
          s: sport,
        },
        timeout: 10000,
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching SportsDB events for ${sport}:`, error);
      throw new Error(`Failed to fetch ${sport} data from TheSportsDB`);
    }
  }

  async getLeagueEvents(leagueId: string): Promise<SportsDBResponse> {
    try {
      const url = `${this.baseUrl}/${this.apiKey}/eventsnextleague.php`;
      const response = await axios.get<SportsDBResponse>(url, {
        params: {
          id: leagueId,
        },
        timeout: 10000,
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching SportsDB league events:`, error);
      throw new Error(`Failed to fetch league data from TheSportsDB`);
    }
  }

  async getSoccerEvents(date: string): Promise<SportsDBResponse> {
    return this.getEventsByDate('Soccer', date);
  }

  async getCricketEvents(date: string): Promise<SportsDBResponse> {
    return this.getEventsByDate('Cricket', date);
  }

  async getTennisEvents(date: string): Promise<SportsDBResponse> {
    return this.getEventsByDate('Tennis', date);
  }

  async getRugbyEvents(date: string): Promise<SportsDBResponse> {
    return this.getEventsByDate('Rugby', date);
  }

  async getGolfEvents(date: string): Promise<SportsDBResponse> {
    return this.getEventsByDate('Golf', date);
  }
}

export const sportsDbApiService = new SportsDBApiService();
