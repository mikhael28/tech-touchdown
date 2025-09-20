export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
  team: 'home' | 'away';
}

export interface ChatRoom {
  gameId: string;
  homeTeam: string;
  awayTeam: string;
  messages: ChatMessage[];
}

export interface UserTeamSelection {
  gameId: string;
  team: 'home' | 'away';
  teamName: string;
  teamColor: string;
}