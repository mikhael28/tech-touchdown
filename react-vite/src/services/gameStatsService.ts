import { GameStatsResponse } from '../types/gameStats';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface GameStatsParams {
  gameId: string;
  sport: string;
  league: string;
}

class GameStatsService {
  async getGameStats(params: GameStatsParams): Promise<GameStatsResponse> {
    const { gameId, sport, league } = params;
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/sports/games/${gameId}/stats?sport=${encodeURIComponent(sport)}&league=${encodeURIComponent(league)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch game stats: ${response.statusText}`);
      }

      const data: GameStatsResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching game stats:', error);
      throw error;
    }
  }
}

export const gameStatsService = new GameStatsService();

