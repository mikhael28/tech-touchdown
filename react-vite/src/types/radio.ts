export interface RadioStation {
  id: string;
  name: string;
  frequency: string;
  market: string;
  streamUrl?: string;
  websiteUrl: string;
  embedType: 'audacy' | 'iframe' | 'external' | 'iheart';
  embedCode?: string;
  teams: string[];
  leagues: string[];
  description?: string;
  logo?: string;
  isNational?: boolean;
}

export interface RadioCategory {
  id: string;
  name: string;
  stations: RadioStation[];
}

