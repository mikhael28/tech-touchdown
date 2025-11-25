// Service for generating show schedules from favorites via backend API

import { Show, Host, Sport } from '../types/show';
import { FavoriteArticle } from './favoritesDb';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

interface GenerateShowParams {
  summary: string;
  favorites: FavoriteArticle[];
  hosts?: Host[];
  targetDuration?: number; // in seconds, default 3600 (1 hour)
  episodeNumber?: number;
}

interface BackendResponse {
  success: boolean;
  show: Show;
  timestamp: string;
}

export class ShowGenerationService {
  private apiBaseUrl: string;

  constructor(apiBaseUrl?: string) {
    this.apiBaseUrl = apiBaseUrl || API_BASE_URL;
  }

  async generateShow(params: GenerateShowParams): Promise<Show> {
    const { summary, favorites, hosts, targetDuration = 3600, episodeNumber } = params;

    // Validate inputs
    if (!summary || !favorites || favorites.length === 0) {
      throw new Error('Summary and favorites are required to generate a show');
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/shows/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary,
          favorites,
          hosts: hosts || this.getDefaultHosts(),
          targetDuration,
          episodeNumber,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to generate show');
      }

      const data: BackendResponse = await response.json();

      // Convert date strings back to Date objects if needed
      const show = {
        ...data.show,
        airDate: new Date(data.show.airDate),
      };

      return show;
    } catch (error) {
      console.error('Error generating show:', error);
      throw error;
    }
  }

  private getDefaultHosts(): Host[] {
    return [
      {
        id: 'host-1',
        name: 'Mike "The Tech" Thompson',
        role: 'host',
        photoUrl: '',
        bio: 'Former Silicon Valley engineer turned sports tech analyst',
        expertise: [Sport.NFL, Sport.NBA],
        personalityTraits: ['analytical', 'tech-focused', 'data-driven'],
        twitterHandle: '@MikeTechThompson',
      },
      {
        id: 'host-2',
        name: 'Sarah "Stats" Martinez',
        role: 'co-host',
        photoUrl: '',
        bio: 'Sports journalist and AI enthusiast',
        expertise: [Sport.NBA, Sport.MLB],
        personalityTraits: ['passionate', 'opinionated', 'stats-lover'],
        twitterHandle: '@SarahStatsM',
      },
      {
        id: 'host-3',
        name: 'Jake "The Moderator" Chen',
        role: 'moderator',
        photoUrl: '',
        bio: 'Veteran sports broadcaster with tech startup experience',
        expertise: [Sport.GENERAL],
        personalityTraits: ['balanced', 'diplomatic', 'insightful'],
        twitterHandle: '@JakeModChen',
      },
    ];
  }
}

// Export singleton instance
export const showGenerationService = new ShowGenerationService();

