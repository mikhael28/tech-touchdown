import { ChatMessage } from '@/types/chat';

export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    userId: 'user1',
    username: 'ChiefsFan2024',
    message: 'Let\'s go Chiefs! Mahomes is gonna light it up today! 🔥',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    team: 'home'
  },
  {
    id: '2',
    userId: 'user2',
    username: 'BuffaloBeast',
    message: 'Bills Mafia in the house! Josh Allen is the real MVP',
    timestamp: new Date(Date.now() - 240000).toISOString(),
    team: 'away'
  },
  {
    id: '3',
    userId: 'user3',
    username: 'RedKingdom',
    message: 'Arrowhead is going to be LOUD today!',
    timestamp: new Date(Date.now() - 180000).toISOString(),
    team: 'home'
  },
  {
    id: '4',
    userId: 'user4',
    username: 'BillsBreaker',
    message: 'Defense wins championships, let\'s see what we got',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    team: 'away'
  },
  {
    id: '5',
    userId: 'user5',
    username: 'KCWarrior',
    message: 'This is our year! Kingdom ready! 👑',
    timestamp: new Date(Date.now() - 60000).toISOString(),
    team: 'home'
  },
  {
    id: '6',
    userId: 'user6',
    username: 'TableSmasher',
    message: 'Bills by 20! We\'re taking this one home!',
    timestamp: new Date(Date.now() - 30000).toISOString(),
    team: 'away'
  }
];