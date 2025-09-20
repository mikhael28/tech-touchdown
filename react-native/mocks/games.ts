import { Game } from '@/types/game';

const today = new Date();
const formatTime = (hours: number, minutes: number = 0) => {
  const gameTime = new Date(today);
  gameTime.setHours(hours, minutes, 0, 0);
  return gameTime.toISOString();
};

export const mockGames: Game[] = [
  {
    id: '1',
    homeTeam: {
      name: 'Kansas City Chiefs',
      abbreviation: 'KC',
      record: '11-1',
      color: '#E31837'
    },
    awayTeam: {
      name: 'Buffalo Bills',
      abbreviation: 'BUF',
      record: '10-2',
      color: '#00338D'
    },
    startTime: formatTime(20, 25), // 8:25 PM
    status: 'scheduled',
    league: 'NFL',
    venue: 'Arrowhead Stadium',
    network: 'NBC'
  },
  {
    id: '2',
    homeTeam: {
      name: 'Los Angeles Lakers',
      abbreviation: 'LAL',
      record: '15-12',
      color: '#552583'
    },
    awayTeam: {
      name: 'Boston Celtics',
      abbreviation: 'BOS',
      record: '22-6',
      color: '#007A33'
    },
    startTime: formatTime(22, 0), // 10:00 PM
    status: 'live',
    score: { home: 89, away: 94 },
    league: 'NBA',
    venue: 'Crypto.com Arena',
    network: 'ESPN'
  },
  {
    id: '3',
    homeTeam: {
      name: 'New York Yankees',
      abbreviation: 'NYY',
      record: '47-23',
      color: '#132448'
    },
    awayTeam: {
      name: 'Houston Astros',
      abbreviation: 'HOU',
      record: '32-39',
      color: '#EB6E1F'
    },
    startTime: formatTime(13, 5), // 1:05 PM
    status: 'final',
    score: { home: 7, away: 4 },
    league: 'MLB',
    venue: 'Yankee Stadium',
    network: 'YES'
  },
  {
    id: '4',
    homeTeam: {
      name: 'Tampa Bay Lightning',
      abbreviation: 'TB',
      record: '18-11-2',
      color: '#002868'
    },
    awayTeam: {
      name: 'Florida Panthers',
      abbreviation: 'FLA',
      record: '19-11-2',
      color: '#041E42'
    },
    startTime: formatTime(19, 0), // 7:00 PM
    status: 'scheduled',
    league: 'NHL',
    venue: 'Amalie Arena',
    network: 'Bally Sports'
  },
  {
    id: '5',
    homeTeam: {
      name: 'Inter Miami CF',
      abbreviation: 'MIA',
      record: '12-8-4',
      color: '#F7B5CD'
    },
    awayTeam: {
      name: 'LAFC',
      abbreviation: 'LAFC',
      record: '15-6-3',
      color: '#C39E6D'
    },
    startTime: formatTime(21, 30), // 9:30 PM
    status: 'scheduled',
    league: 'MLS',
    venue: 'DRV PNK Stadium',
    network: 'Apple TV'
  },
  {
    id: '6',
    homeTeam: {
      name: 'Georgia Bulldogs',
      abbreviation: 'UGA',
      record: '12-1',
      color: '#BA0C2F'
    },
    awayTeam: {
      name: 'Texas Longhorns',
      abbreviation: 'TEX',
      record: '12-1',
      color: '#BF5700'
    },
    startTime: formatTime(16, 0), // 4:00 PM
    status: 'scheduled',
    league: 'NCAAF',
    venue: 'Mercedes-Benz Stadium',
    network: 'ABC'
  }
];