import { espnApiService, ESPNEvent, ESPNCompetitor } from './espnApi';
import { sportsDbApiService, SportsDBEvent } from './sportsDbApi';

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

export type GameStatus =
  | 'scheduled'
  | 'live'
  | 'in_progress'
  | 'completed'
  | 'postponed'
  | 'cancelled'
  | 'halftime'
  | 'final';

export interface League {
  name: string;
  games: Game[];
}

export interface SportsData {
  leagues: League[];
  lastUpdated: string;
}

export interface UnifiedSportsAPIResponse {
  success: boolean;
  data: SportsData;
  errors?: Array<{
    source: string;
    message: string;
  }>;
}

export class UnifiedSportsApiService {
  private convertESPNEventToGame(event: ESPNEvent, leagueName: string): Game | null {
    try {
      const competition = event.competitions[0];
      if (!competition) return null;

      const homeCompetitor = competition.competitors.find(
        (c: ESPNCompetitor) => c.homeAway === 'home'
      );
      const awayCompetitor = competition.competitors.find(
        (c: ESPNCompetitor) => c.homeAway === 'away'
      );

      if (!homeCompetitor || !awayCompetitor) return null;

      const status = competition.status.type;
      const isLive = status.state === 'in' || status.name === 'STATUS_IN_PROGRESS';
      const isCompleted = status.completed || status.state === 'post';

      let gameStatus: GameStatus = 'scheduled';
      if (isCompleted) {
        gameStatus = 'final';
      } else if (isLive) {
        gameStatus = 'in_progress';
      } else if (status.name.includes('HALFTIME')) {
        gameStatus = 'halftime';
      } else if (status.name.includes('POSTPONED')) {
        gameStatus = 'postponed';
      } else if (status.name.includes('CANCELLED')) {
        gameStatus = 'cancelled';
      }

      const broadcasts = competition.broadcasts
        ?.map((b) => b.names.join(', '))
        .join(', ');

      const game: Game = {
        id: event.id,
        league: leagueName,
        homeTeam: homeCompetitor.team.displayName,
        awayTeam: awayCompetitor.team.displayName,
        homeScore: homeCompetitor.score ? parseInt(homeCompetitor.score) : null,
        awayScore: awayCompetitor.score ? parseInt(awayCompetitor.score) : null,
        gameStatus,
        startTime: event.date,
        date: new Date(event.date).toLocaleDateString(),
        isLive,
        isCompleted,
        source: 'ESPN',
      };

      if (status.detail) game.period = status.detail;
      if (broadcasts) game.broadcast = broadcasts;
      if (event.links?.[0]?.href) game.url = event.links[0].href;
      if (competition.venue?.fullName) game.venue = competition.venue.fullName;
      const homeLogoUrl = homeCompetitor.team.logos?.[0]?.href || homeCompetitor.team.logo;
      if (homeLogoUrl) {
        game.homeTeamLogo = homeLogoUrl;
      }
      const awayLogoUrl = awayCompetitor.team.logos?.[0]?.href || awayCompetitor.team.logo;
      if (awayLogoUrl) {
        game.awayTeamLogo = awayLogoUrl;
      }

      return game;
    } catch (error) {
      console.error('Error converting ESPN event:', error);
      return null;
    }
  }

  private convertSportsDBEventToGame(event: SportsDBEvent): Game | null {
    try {
      const isCompleted = event.strStatus === 'Match Finished' || event.strStatus === 'FT';
      const isLive = event.strStatus === 'In Play' || event.strStatus === 'Live';

      let gameStatus: GameStatus = 'scheduled';
      if (isCompleted) {
        gameStatus = 'final';
      } else if (isLive) {
        gameStatus = 'in_progress';
      } else if (event.strStatus.includes('Postponed')) {
        gameStatus = 'postponed';
      } else if (event.strStatus.includes('Cancelled')) {
        gameStatus = 'cancelled';
      }

      const game: Game = {
        id: event.idEvent,
        league: event.strLeague,
        homeTeam: event.strHomeTeam,
        awayTeam: event.strAwayTeam,
        homeScore: event.intHomeScore ? parseInt(event.intHomeScore) : null,
        awayScore: event.intAwayScore ? parseInt(event.intAwayScore) : null,
        gameStatus,
        startTime: `${event.dateEvent} ${event.strTime}`,
        date: event.dateEvent,
        isLive,
        isCompleted,
        source: 'TheSportsDB',
      };

      if (event.strVenue) game.venue = event.strVenue;
      if (event.strHomeTeamBadge) game.homeTeamLogo = event.strHomeTeamBadge;
      if (event.strAwayTeamBadge) game.awayTeamLogo = event.strAwayTeamBadge;

      return game;
    } catch (error) {
      console.error('Error converting SportsDB event:', error);
      return null;
    }
  }

  async getAllGames(): Promise<UnifiedSportsAPIResponse> {
    const errors: Array<{ source: string; message: string }> = [];
    const leagues: League[] = [];

    // Fetch NFL
    try {
      const nflData = await espnApiService.getNFLScoreboard();
      const nflGames = nflData.events
        .map((event) => this.convertESPNEventToGame(event, 'NFL'))
        .filter((game): game is Game => game !== null);

      if (nflGames.length > 0) {
        leagues.push({ name: 'NFL', games: nflGames });
      }
    } catch (error) {
      errors.push({ source: 'ESPN NFL', message: (error as Error).message });
    }

    // Fetch NBA
    try {
      const nbaData = await espnApiService.getNBAScoreboard();
      const nbaGames = nbaData.events
        .map((event) => this.convertESPNEventToGame(event, 'NBA'))
        .filter((game): game is Game => game !== null);

      if (nbaGames.length > 0) {
        leagues.push({ name: 'NBA', games: nbaGames });
      }
    } catch (error) {
      errors.push({ source: 'ESPN NBA', message: (error as Error).message });
    }

    // Fetch WNBA
    try {
      const wnbaData = await espnApiService.getWNBAScoreboard();
      const wnbaGames = wnbaData.events
        .map((event) => this.convertESPNEventToGame(event, 'WNBA'))
        .filter((game): game is Game => game !== null);

      if (wnbaGames.length > 0) {
        leagues.push({ name: 'WNBA', games: wnbaGames });
      }
    } catch (error) {
      errors.push({ source: 'ESPN WNBA', message: (error as Error).message });
    }

    // Fetch NHL
    try {
      const nhlData = await espnApiService.getNHLScoreboard();
      const nhlGames = nhlData.events
        .map((event) => this.convertESPNEventToGame(event, 'NHL'))
        .filter((game): game is Game => game !== null);

      if (nhlGames.length > 0) {
        leagues.push({ name: 'NHL', games: nhlGames });
      }
    } catch (error) {
      errors.push({ source: 'ESPN NHL', message: (error as Error).message });
    }

    // Fetch MLB
    try {
      const mlbData = await espnApiService.getMLBScoreboard();
      const mlbGames = mlbData.events
        .map((event) => this.convertESPNEventToGame(event, 'MLB'))
        .filter((game): game is Game => game !== null);

      if (mlbGames.length > 0) {
        leagues.push({ name: 'MLB', games: mlbGames });
      }
    } catch (error) {
      errors.push({ source: 'ESPN MLB', message: (error as Error).message });
    }

    // Fetch Premier League
    try {
      const plData = await espnApiService.getPremierLeague();
      const plGames = plData.events
        .map((event) => this.convertESPNEventToGame(event, 'Premier League'))
        .filter((game): game is Game => game !== null);

      if (plGames.length > 0) {
        leagues.push({ name: 'Premier League', games: plGames });
      }
    } catch (error) {
      errors.push({ source: 'ESPN Premier League', message: (error as Error).message });
    }

    // Fetch Champions League
    try {
      const uclData = await espnApiService.getUEFAChampionsLeague();
      const uclGames = uclData.events
        .map((event) => this.convertESPNEventToGame(event, 'Champions League'))
        .filter((game): game is Game => game !== null);

      if (uclGames.length > 0) {
        leagues.push({ name: 'Champions League', games: uclGames });
      }
    } catch (error) {
      errors.push({ source: 'ESPN Champions League', message: (error as Error).message });
    }

    // Fetch La Liga
    try {
      const laLigaData = await espnApiService.getLaLiga();
      const laLigaGames = laLigaData.events
        .map((event) => this.convertESPNEventToGame(event, 'La Liga'))
        .filter((game): game is Game => game !== null);

      if (laLigaGames.length > 0) {
        leagues.push({ name: 'La Liga', games: laLigaGames });
      }
    } catch (error) {
      errors.push({ source: 'ESPN La Liga', message: (error as Error).message });
    }

    // Fetch Serie A
    try {
      const serieAData = await espnApiService.getSerieA();
      const serieAGames = serieAData.events
        .map((event) => this.convertESPNEventToGame(event, 'Serie A'))
        .filter((game): game is Game => game !== null);

      if (serieAGames.length > 0) {
        leagues.push({ name: 'Serie A', games: serieAGames });
      }
    } catch (error) {
      errors.push({ source: 'ESPN Serie A', message: (error as Error).message });
    }

    // Fetch Bundesliga
    try {
      const bundesligaData = await espnApiService.getBundesliga();
      const bundesligaGames = bundesligaData.events
        .map((event) => this.convertESPNEventToGame(event, 'Bundesliga'))
        .filter((game): game is Game => game !== null);

      if (bundesligaGames.length > 0) {
        leagues.push({ name: 'Bundesliga', games: bundesligaGames });
      }
    } catch (error) {
      errors.push({ source: 'ESPN Bundesliga', message: (error as Error).message });
    }

    // Fetch MLS
    try {
      const mlsData = await espnApiService.getMLSScoreboard();
      const mlsGames = mlsData.events
        .map((event) => this.convertESPNEventToGame(event, 'MLS'))
        .filter((game): game is Game => game !== null);

      if (mlsGames.length > 0) {
        leagues.push({ name: 'MLS', games: mlsGames });
      }
    } catch (error) {
      errors.push({ source: 'ESPN MLS', message: (error as Error).message });
    }

    // Fetch NCAA Football
    try {
      const ncaafData = await espnApiService.getNCAAFootballScoreboard();
      const ncaafGames = ncaafData.events
        .map((event) => this.convertESPNEventToGame(event, 'NCAA Football'))
        .filter((game): game is Game => game !== null);

      if (ncaafGames.length > 0) {
        leagues.push({ name: 'NCAA Football', games: ncaafGames });
      }
    } catch (error) {
      errors.push({ source: 'ESPN NCAA Football', message: (error as Error).message });
    }

    // Fetch NCAA Basketball
    try {
      const ncaabData = await espnApiService.getNCAABasketballScoreboard();
      const ncaabGames = ncaabData.events
        .map((event) => this.convertESPNEventToGame(event, 'NCAA Basketball'))
        .filter((game): game is Game => game !== null);

      if (ncaabGames.length > 0) {
        leagues.push({ name: 'NCAA Basketball', games: ncaabGames });
      }
    } catch (error) {
      errors.push({ source: 'ESPN NCAA Basketball', message: (error as Error).message });
    }

    // Fetch Cricket from TheSportsDB
    try {
      const today = new Date().toISOString().split('T')[0] ?? '';
      const cricketData = await sportsDbApiService.getCricketEvents(today);

      if (cricketData.events && cricketData.events.length > 0) {
        const cricketGames = cricketData.events
          .map((event) => this.convertSportsDBEventToGame(event))
          .filter((game): game is Game => game !== null);

        if (cricketGames.length > 0) {
          leagues.push({ name: 'Cricket', games: cricketGames });
        }
      }
    } catch (error) {
      errors.push({ source: 'TheSportsDB Cricket', message: (error as Error).message });
    }

    // Fetch Rugby from TheSportsDB
    try {
      const today = new Date().toISOString().split('T')[0] ?? '';
      const rugbyData = await sportsDbApiService.getRugbyEvents(today);

      if (rugbyData.events && rugbyData.events.length > 0) {
        const rugbyGames = rugbyData.events
          .map((event) => this.convertSportsDBEventToGame(event))
          .filter((game): game is Game => game !== null);

        if (rugbyGames.length > 0) {
          leagues.push({ name: 'Rugby', games: rugbyGames });
        }
      }
    } catch (error) {
      errors.push({ source: 'TheSportsDB Rugby', message: (error as Error).message });
    }

    // Fetch Tennis from TheSportsDB
    try {
      const today = new Date().toISOString().split('T')[0] ?? '';
      const tennisData = await sportsDbApiService.getTennisEvents(today);

      if (tennisData.events && tennisData.events.length > 0) {
        const tennisGames = tennisData.events
          .map((event) => this.convertSportsDBEventToGame(event))
          .filter((game): game is Game => game !== null);

        if (tennisGames.length > 0) {
          leagues.push({ name: 'Tennis', games: tennisGames });
        }
      }
    } catch (error) {
      errors.push({ source: 'TheSportsDB Tennis', message: (error as Error).message });
    }

    // Fetch Golf from TheSportsDB
    try {
      const today = new Date().toISOString().split('T')[0] ?? '';
      const golfData = await sportsDbApiService.getGolfEvents(today);

      if (golfData.events && golfData.events.length > 0) {
        const golfGames = golfData.events
          .map((event) => this.convertSportsDBEventToGame(event))
          .filter((game): game is Game => game !== null);

        if (golfGames.length > 0) {
          leagues.push({ name: 'Golf', games: golfGames });
        }
      }
    } catch (error) {
      errors.push({ source: 'TheSportsDB Golf', message: (error as Error).message });
    }

    const response: UnifiedSportsAPIResponse = {
      success: true,
      data: {
        leagues,
        lastUpdated: new Date().toISOString(),
      },
    };

    if (errors.length > 0) {
      response.errors = errors;
    }

    return response;
  }
}

export const unifiedSportsApiService = new UnifiedSportsApiService();
