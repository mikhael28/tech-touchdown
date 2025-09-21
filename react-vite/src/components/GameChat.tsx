import React, { useState, useRef, useEffect } from 'react';
import { Send, Users, MessageCircle, Crown, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AudioChat from './AudioChat';

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  team: 'away' | 'home';
  role: 'user' | 'moderator' | 'admin';
  avatar?: string;
}

interface GameChatProps {
  gameId: string;
  awayTeam: string;
  homeTeam: string;
}

const GameChat: React.FC<GameChatProps> = ({ gameId, awayTeam, homeTeam }) => {
  const { user } = useAuth();
  const [selectedTeam, setSelectedTeam] = useState<'away' | 'home' | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [voiceParticipants, setVoiceParticipants] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data for chat messages
  const mockMessages: ChatMessage[] = [
    {
      id: '1',
      username: 'SportsFan99',
      message: 'This is going to be an amazing game!',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      team: 'away',
      role: 'user'
    },
    {
      id: '2',
      username: 'HomeTeamChamp',
      message: 'Our defense is looking solid this season',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      team: 'home',
      role: 'user'
    },
    {
      id: '3',
      username: 'GameModerator',
      message: 'Welcome to the live chat! Please keep it respectful.',
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      team: 'away',
      role: 'moderator'
    },
    {
      id: '4',
      username: 'AwayTeamSupporter',
      message: 'That last play was incredible!',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      team: 'away',
      role: 'user'
    },
    {
      id: '5',
      username: 'HomeTeamFan',
      message: 'We need to step up our offense in the second half',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      team: 'home',
      role: 'user'
    },
    {
      id: '6',
      username: 'NeutralObserver',
      message: 'Both teams are playing really well today',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      team: 'away',
      role: 'user'
    }
  ];

  // API URL from environment or default to localhost
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // Load messages when component mounts
  useEffect(() => {
    loadMessages();
  }, [gameId]);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/chat/games/${gameId}/messages?awayTeam=${encodeURIComponent(awayTeam)}&homeTeam=${encodeURIComponent(homeTeam)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
        setIsUsingFallback(data.fallback || false);
      } else {
        throw new Error('Failed to load messages');
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      // Fallback to mock data
      setMessages(mockMessages);
      setIsUsingFallback(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Force scroll to bottom when messages change
  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  const handleJoinChat = () => {
    if (selectedTeam && user?.login) {
      setIsConnected(true);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && selectedTeam && user?.login) {
      setIsLoading(true);

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/chat/games/${gameId}/messages`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: message.trim(),
              team: selectedTeam,
              username: user.login,
              awayTeam,
              homeTeam,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setMessages(prev => [...prev, data.message]);
          setMessage('');
          setIsUsingFallback(false);
        } else {
          throw new Error('Failed to send message');
        }
      } catch (error) {
        console.error('Error sending message:', error);

        // Fallback to local message handling
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          username: user.login,
          message: message.trim(),
          timestamp: new Date(),
          team: selectedTeam,
          role: 'user'
        };
        setMessages(prev => [...prev, newMessage]);
        setMessage('');
        setIsUsingFallback(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-3 w-3 text-yellow-500" />;
      case 'moderator':
        return <Shield className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const getTeamColor = (team: 'away' | 'home') => {
    return team === 'away' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400';
  };

  const getTeamBgColor = (team: 'away' | 'home') => {
    return team === 'away' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-red-50 dark:bg-red-900/20';
  };

  if (!isConnected) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <MessageCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Join the Game Chat
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose your team to start chatting as @{user?.login}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Choose Your Team
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedTeam('away')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTeam === 'away'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {awayTeam}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">Away Team</div>
                  </div>
                </button>
                <button
                  onClick={() => setSelectedTeam('home')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTeam === 'home'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-red-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {homeTeam}
                    </div>
                    <div className="text-xs text-red-600 dark:text-red-400">Home Team</div>
                  </div>
                </button>
              </div>
            </div>

            <button
              onClick={handleJoinChat}
              disabled={!selectedTeam}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Join Chat
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Chat Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4 text-blue-500" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {awayTeam} vs {homeTeam}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Live Game Chat {voiceParticipants > 0 && `• ${voiceParticipants} in voice`}
                {isUsingFallback && (
                  <span className="ml-2 text-orange-500">• Offline Mode</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400">
            <Users className="h-3 w-3" />
            <span>{messages.length} messages</span>
          </div>
        </div>
      </div>

      {/* Audio Chat Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3">
        <AudioChat
          gameId={gameId}
          roomName={`game-${gameId}-${selectedTeam || 'neutral'}`}
          onParticipantCountChange={setVoiceParticipants}
        />
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-2 p-2 rounded-lg ${
              msg.team === selectedTeam ? getTeamBgColor(msg.team) : 'bg-white dark:bg-gray-800'
            }`}
          >
            <div className="flex-shrink-0">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white ${
                msg.team === 'away' ? 'bg-blue-500' : 'bg-red-500'
              }`}>
                {msg.username.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1 mb-1">
                <span className="text-xs font-medium text-gray-900 dark:text-white">
                  {msg.username}
                </span>
                {getRoleIcon(msg.role)}
                <span className={`text-xs font-medium ${getTeamColor(msg.team)}`}>
                  {msg.team === 'away' ? awayTeam : homeTeam}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300 break-words">
                {msg.message}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Message the ${selectedTeam === 'away' ? awayTeam : homeTeam} chat...`}
            className="flex-1 px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-1.5 rounded-md transition-colors"
          >
            {isLoading ? (
              <div className="h-3 w-3 border border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-3 w-3" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GameChat;
