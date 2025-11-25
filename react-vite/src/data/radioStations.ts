import { RadioStation } from '../types/radio';

export const radioStations: RadioStation[] = [
  // National Networks
  {
    id: 'espn-radio',
    name: 'ESPN Radio',
    frequency: 'Various',
    market: 'National',
    websiteUrl: 'https://www.espn.com/espnradio/',
    embedType: 'external',
    teams: [],
    leagues: ['NFL', 'NBA', 'MLB', 'NHL'],
    description: 'National sports radio network covering all major sports',
    isNational: true,
  },
  {
    id: 'fox-sports-radio',
    name: 'Fox Sports Radio',
    frequency: 'Various',
    market: 'National',
    websiteUrl: 'https://foxsportsradio.iheart.com/',
    embedType: 'iheart',
    streamUrl: 'https://www.iheart.com/live/fox-sports-radio-6906/',
    teams: [],
    leagues: ['NFL', 'NBA', 'MLB', 'NHL'],
    description: 'National sports talk and live game coverage',
    isNational: true,
  },
  {
    id: 'cbs-sports-radio',
    name: 'CBS Sports Radio',
    frequency: 'Various',
    market: 'National',
    websiteUrl: 'https://www.audacy.com/cbssportsradio',
    embedType: 'audacy',
    streamUrl: 'https://www.audacy.com/cbssportsradio',
    teams: [],
    leagues: ['NFL', 'NBA', 'MLB', 'NHL'],
    description: 'CBS Sports Radio - 24/7 sports talk and analysis',
    isNational: true,
  },

  // New York
  {
    id: 'wfan-ny',
    name: 'WFAN Sports Radio',
    frequency: '660 AM / 101.9 FM',
    market: 'New York',
    websiteUrl: 'https://www.audacy.com/wfan',
    embedType: 'audacy',
    streamUrl: 'https://www.audacy.com/wfan',
    teams: ['Giants', 'Jets', 'Yankees', 'Mets', 'Knicks', 'Nets', 'Rangers', 'Islanders', 'Devils'],
    leagues: ['NFL', 'MLB', 'NBA', 'NHL'],
    description: "New York's legendary sports talk station",
  },
  {
    id: 'espn-ny',
    name: 'ESPN New York',
    frequency: '98.7 FM',
    market: 'New York',
    websiteUrl: 'https://www.espn.com/new-york/',
    embedType: 'external',
    teams: ['Giants', 'Jets', 'Yankees', 'Mets', 'Knicks', 'Nets'],
    leagues: ['NFL', 'MLB', 'NBA'],
    description: 'ESPN New York - Sports radio and talk',
  },

  // Boston
  {
    id: 'sports-hub-boston',
    name: '98.5 The Sports Hub',
    frequency: '98.5 FM',
    market: 'Boston',
    websiteUrl: 'https://www.audacy.com/thesportshub',
    embedType: 'audacy',
    streamUrl: 'https://www.audacy.com/thesportshub',
    teams: ['Patriots', 'Red Sox', 'Celtics', 'Bruins'],
    leagues: ['NFL', 'MLB', 'NBA', 'NHL'],
    description: "Boston's home for sports - Patriots flagship station",
  },
  {
    id: 'weei-boston',
    name: 'WEEI',
    frequency: '93.7 FM',
    market: 'Boston',
    websiteUrl: 'https://www.audacy.com/weei',
    embedType: 'audacy',
    streamUrl: 'https://www.audacy.com/weei',
    teams: ['Patriots', 'Red Sox', 'Celtics', 'Bruins'],
    leagues: ['NFL', 'MLB', 'NBA', 'NHL'],
    description: 'WEEI Sports Radio Network',
  },

  // Chicago
  {
    id: 'score-chicago',
    name: '670 The Score',
    frequency: '670 AM',
    market: 'Chicago',
    websiteUrl: 'https://www.audacy.com/670thescore',
    embedType: 'audacy',
    streamUrl: 'https://www.audacy.com/670thescore',
    teams: ['Bears', 'Cubs', 'White Sox', 'Bulls', 'Blackhawks'],
    leagues: ['NFL', 'MLB', 'NBA', 'NHL'],
    description: "Chicago's sports leader",
  },
  {
    id: 'espn-chicago',
    name: 'ESPN 1000 Chicago',
    frequency: '1000 AM',
    market: 'Chicago',
    websiteUrl: 'https://www.espn.com/chicago/',
    embedType: 'external',
    teams: ['Bears', 'Cubs', 'White Sox', 'Bulls', 'Blackhawks'],
    leagues: ['NFL', 'MLB', 'NBA', 'NHL'],
    description: 'ESPN Chicago - Home of Chicago sports',
  },

  // Dallas
  {
    id: 'fan-dallas',
    name: '105.3 The Fan',
    frequency: '105.3 FM',
    market: 'Dallas',
    websiteUrl: 'https://www.audacy.com/thefan',
    embedType: 'audacy',
    streamUrl: 'https://www.audacy.com/thefan',
    teams: ['Cowboys', 'Rangers', 'Mavericks', 'Stars'],
    leagues: ['NFL', 'MLB', 'NBA', 'NHL'],
    description: "Dallas-Fort Worth's sports station",
  },
  {
    id: 'ticket-dallas',
    name: '1310 The Ticket',
    frequency: '1310 AM / 96.7 FM',
    market: 'Dallas',
    websiteUrl: 'https://www.theticket.com/',
    embedType: 'external',
    teams: ['Cowboys', 'Rangers', 'Mavericks', 'Stars'],
    leagues: ['NFL', 'MLB', 'NBA', 'NHL'],
    description: 'The Little One - Dallas sports talk',
  },

  // Philadelphia
  {
    id: 'wip-philly',
    name: '94.1 WIP',
    frequency: '94.1 FM',
    market: 'Philadelphia',
    websiteUrl: 'https://www.audacy.com/wip',
    embedType: 'audacy',
    streamUrl: 'https://www.audacy.com/wip',
    teams: ['Eagles', 'Phillies', '76ers', 'Flyers'],
    leagues: ['NFL', 'MLB', 'NBA', 'NHL'],
    description: "Philadelphia's premier sports station",
  },
  {
    id: 'fanatic-philly',
    name: '97.5 The Fanatic',
    frequency: '97.5 FM',
    market: 'Philadelphia',
    websiteUrl: 'https://www.audacy.com/sports975thefanatic',
    embedType: 'audacy',
    streamUrl: 'https://www.audacy.com/sports975thefanatic',
    teams: ['Eagles', 'Phillies', '76ers', 'Flyers'],
    leagues: ['NFL', 'MLB', 'NBA', 'NHL'],
    description: 'Philadelphia sports talk and passion',
  },

  // Los Angeles
  {
    id: 'am570-la',
    name: 'AM 570 LA Sports',
    frequency: '570 AM',
    market: 'Los Angeles',
    websiteUrl: 'https://am570lasports.iheart.com/',
    embedType: 'iheart',
    streamUrl: 'https://www.iheart.com/live/am-570-la-sports-189/',
    teams: ['Rams', 'Chargers', 'Lakers', 'Clippers', 'Dodgers', 'Angels', 'Kings', 'Ducks'],
    leagues: ['NFL', 'NBA', 'MLB', 'NHL'],
    description: 'Los Angeles sports talk radio',
  },
  {
    id: 'espn-la',
    name: 'ESPN LA 710',
    frequency: '710 AM',
    market: 'Los Angeles',
    websiteUrl: 'https://www.espn.com/losangeles/',
    embedType: 'external',
    teams: ['Rams', 'Chargers', 'Lakers', 'Dodgers'],
    leagues: ['NFL', 'NBA', 'MLB'],
    description: 'ESPN Los Angeles',
  },

  // San Francisco Bay Area
  {
    id: 'game-sf',
    name: '95.7 The Game',
    frequency: '95.7 FM',
    market: 'San Francisco',
    websiteUrl: 'https://www.audacy.com/957thegame',
    embedType: 'audacy',
    streamUrl: 'https://www.audacy.com/957thegame',
    teams: ['49ers', 'Raiders', 'Warriors', 'Giants', 'Athletics', 'Sharks'],
    leagues: ['NFL', 'NBA', 'MLB', 'NHL'],
    description: 'Bay Area sports radio',
  },
  {
    id: 'knbr-sf',
    name: 'KNBR 680',
    frequency: '680 AM / 104.5 FM',
    market: 'San Francisco',
    websiteUrl: 'https://www.knbr.com/',
    embedType: 'external',
    teams: ['49ers', 'Giants'],
    leagues: ['NFL', 'MLB'],
    description: 'The Sports Leader - 49ers and Giants flagship',
  },

  // Washington DC
  {
    id: 'fan-dc',
    name: '106.7 The Fan',
    frequency: '106.7 FM',
    market: 'Washington DC',
    websiteUrl: 'https://www.audacy.com/thefandc',
    embedType: 'audacy',
    streamUrl: 'https://www.audacy.com/thefandc',
    teams: ['Commanders', 'Nationals', 'Wizards', 'Capitals'],
    leagues: ['NFL', 'MLB', 'NBA', 'NHL'],
    description: "Washington DC's sports talk leader",
  },

  // Denver
  {
    id: 'altitude-denver',
    name: 'Altitude Sports Radio',
    frequency: '92.5 FM',
    market: 'Denver',
    websiteUrl: 'https://www.altitudesportsradio.com/',
    embedType: 'external',
    teams: ['Broncos', 'Nuggets', 'Rockies', 'Avalanche'],
    leagues: ['NFL', 'NBA', 'MLB', 'NHL'],
    description: 'Denver sports radio - Broncos flagship',
  },

  // Seattle
  {
    id: 'espn-seattle',
    name: '710 ESPN Seattle',
    frequency: '710 AM',
    market: 'Seattle',
    websiteUrl: 'https://www.seattlesports.com/',
    embedType: 'external',
    teams: ['Seahawks', 'Mariners', 'Kraken'],
    leagues: ['NFL', 'MLB', 'NHL'],
    description: 'Seattle sports talk - Seahawks flagship',
  },

  // Green Bay
  {
    id: 'wtmj-milwaukee',
    name: 'WTMJ',
    frequency: '620 AM',
    market: 'Milwaukee/Green Bay',
    websiteUrl: 'https://www.wtmj.com/',
    embedType: 'external',
    teams: ['Packers', 'Brewers', 'Bucks'],
    leagues: ['NFL', 'MLB', 'NBA'],
    description: 'Packers Radio Network flagship station',
  },

  // Pittsburgh
  {
    id: 'fan-pittsburgh',
    name: '93.7 The Fan',
    frequency: '93.7 FM',
    market: 'Pittsburgh',
    websiteUrl: 'https://www.audacy.com/937thefan',
    embedType: 'audacy',
    streamUrl: 'https://www.audacy.com/937thefan',
    teams: ['Steelers', 'Pirates', 'Penguins'],
    leagues: ['NFL', 'MLB', 'NHL'],
    description: "Pittsburgh's sports radio home",
  },

  // Miami
  {
    id: 'ticket-miami',
    name: '790 The Ticket',
    frequency: '790 AM',
    market: 'Miami',
    websiteUrl: 'https://www.audacy.com/790theticket',
    embedType: 'audacy',
    streamUrl: 'https://www.audacy.com/790theticket',
    teams: ['Dolphins', 'Marlins', 'Heat', 'Panthers'],
    leagues: ['NFL', 'MLB', 'NBA', 'NHL'],
    description: 'South Florida sports talk',
  },

  // Atlanta
  {
    id: 'fan-atlanta',
    name: '92.9 The Game',
    frequency: '92.9 FM',
    market: 'Atlanta',
    websiteUrl: 'https://www.audacy.com/929thegame',
    embedType: 'audacy',
    streamUrl: 'https://www.audacy.com/929thegame',
    teams: ['Falcons', 'Braves', 'Hawks'],
    leagues: ['NFL', 'MLB', 'NBA'],
    description: 'Atlanta sports talk radio',
  },

  // Phoenix
  {
    id: 'burns-phoenix',
    name: 'Burns & Gambo',
    frequency: '98.7 FM',
    market: 'Phoenix',
    websiteUrl: 'https://arizonasports.com/',
    embedType: 'external',
    teams: ['Cardinals', 'Diamondbacks', 'Suns', 'Coyotes'],
    leagues: ['NFL', 'MLB', 'NBA', 'NHL'],
    description: 'Arizona Sports - Cardinals and Suns',
  },

  // Kansas City
  {
    id: 'fan-kc',
    name: '610 Sports Radio',
    frequency: '610 AM',
    market: 'Kansas City',
    websiteUrl: 'https://www.audacy.com/sportsradio610',
    embedType: 'audacy',
    streamUrl: 'https://www.audacy.com/sportsradio610',
    teams: ['Chiefs', 'Royals', 'Sporting KC'],
    leagues: ['NFL', 'MLB'],
    description: 'Kansas City sports talk - Chiefs flagship',
  },

  // Detroit
  {
    id: 'ticket-detroit',
    name: '97.1 The Ticket',
    frequency: '97.1 FM',
    market: 'Detroit',
    websiteUrl: 'https://www.audacy.com/971theticketxyt',
    embedType: 'audacy',
    streamUrl: 'https://www.audacy.com/971theticketxyt',
    teams: ['Lions', 'Tigers', 'Pistons', 'Red Wings'],
    leagues: ['NFL', 'MLB', 'NBA', 'NHL'],
    description: 'Detroit sports talk',
  },

  // Minnesota
  {
    id: 'kfan-minnesota',
    name: 'KFAN 100.3',
    frequency: '100.3 FM',
    market: 'Minneapolis',
    websiteUrl: 'https://www.audacy.com/kfan',
    embedType: 'audacy',
    streamUrl: 'https://www.audacy.com/kfan',
    teams: ['Vikings', 'Twins', 'Timberwolves', 'Wild'],
    leagues: ['NFL', 'MLB', 'NBA', 'NHL'],
    description: 'Minnesota sports talk - Vikings flagship',
  },

  // Baltimore
  {
    id: 'fan-baltimore',
    name: '105.7 The Fan',
    frequency: '105.7 FM',
    market: 'Baltimore',
    websiteUrl: 'https://www.audacy.com/1057thefan',
    embedType: 'audacy',
    streamUrl: 'https://www.audacy.com/1057thefan',
    teams: ['Ravens', 'Orioles'],
    leagues: ['NFL', 'MLB'],
    description: 'Baltimore sports talk',
  },

  // Cleveland
  {
    id: 'fan-cleveland',
    name: '92.3 The Fan',
    frequency: '92.3 FM',
    market: 'Cleveland',
    websiteUrl: 'https://www.audacy.com/923thefan',
    embedType: 'audacy',
    streamUrl: 'https://www.audacy.com/923thefan',
    teams: ['Browns', 'Guardians', 'Cavaliers'],
    leagues: ['NFL', 'MLB', 'NBA'],
    description: 'Cleveland sports talk',
  },

  // Tampa Bay
  {
    id: 'fan-tampa',
    name: '95.3 WDAE',
    frequency: '95.3 FM',
    market: 'Tampa Bay',
    websiteUrl: 'https://www.audacy.com/953wdae',
    embedType: 'audacy',
    streamUrl: 'https://www.audacy.com/953wdae',
    teams: ['Buccaneers', 'Rays', 'Lightning'],
    leagues: ['NFL', 'MLB', 'NHL'],
    description: 'Tampa Bay sports radio - Bucs flagship',
  },

  // Las Vegas
  {
    id: 'fox-vegas',
    name: 'Fox Sports Las Vegas',
    frequency: '1340 AM / 98.9 FM',
    market: 'Las Vegas',
    websiteUrl: 'https://foxsportsradiolasvegas.iheart.com/',
    embedType: 'iheart',
    streamUrl: 'https://www.iheart.com/live/fox-sports-las-vegas-6953/',
    teams: ['Raiders', 'Golden Knights'],
    leagues: ['NFL', 'NHL'],
    description: 'Las Vegas sports talk - Raiders flagship',
  },

  // Indianapolis
  {
    id: 'fan-indy',
    name: '93.5/107.5 The Fan',
    frequency: '93.5 FM / 107.5 FM',
    market: 'Indianapolis',
    websiteUrl: 'https://www.audacy.com/1075thefan',
    embedType: 'audacy',
    streamUrl: 'https://www.audacy.com/1075thefan',
    teams: ['Colts', 'Pacers'],
    leagues: ['NFL', 'NBA'],
    description: 'Indianapolis sports talk',
  },
];

// Helper functions
export const getStationsByTeam = (teamName: string): RadioStation[] => {
  return radioStations.filter(station => 
    station.teams.some(team => 
      team.toLowerCase().includes(teamName.toLowerCase()) ||
      teamName.toLowerCase().includes(team.toLowerCase())
    )
  );
};

export const getStationsByLeague = (league: string): RadioStation[] => {
  return radioStations.filter(station => 
    station.leagues.includes(league.toUpperCase())
  );
};

export const getStationsByMarket = (market: string): RadioStation[] => {
  return radioStations.filter(station => 
    station.market.toLowerCase() === market.toLowerCase()
  );
};

export const getNationalStations = (): RadioStation[] => {
  return radioStations.filter(station => station.isNational);
};

export const getAllMarkets = (): string[] => {
  const markets = new Set(radioStations.map(s => s.market));
  return Array.from(markets).sort();
};

