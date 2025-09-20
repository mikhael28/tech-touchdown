import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Game } from '@/types/game';
import { ChatMessage, UserTeamSelection } from '@/types/chat';
import { mockGames } from '@/mocks/games';
import { mockChatMessages } from '@/mocks/chatMessages';
import { TeamSelectionModal } from '@/components/TeamSelectionModal';
import { GameChat } from '@/components/GameChat';

export default function GameChatScreen() {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userTeamSelection, setUserTeamSelection] = useState<UserTeamSelection | null>(null);
  const [showTeamSelection, setShowTeamSelection] = useState<boolean>(false);

  useEffect(() => {
    if (!gameId) return;

    const foundGame = mockGames.find(g => g.id === gameId);
    if (foundGame) {
      setGame(foundGame);
      setMessages(mockChatMessages);
      setShowTeamSelection(true);
    }
  }, [gameId]);

  const handleTeamSelection = (team: 'home' | 'away', teamName: string, teamColor: string) => {
    if (!gameId) return;
    
    const selection: UserTeamSelection = {
      gameId,
      team,
      teamName,
      teamColor
    };
    
    setUserTeamSelection(selection);
    setShowTeamSelection(false);
  };

  const handleSendMessage = (messageText: string) => {
    if (!userTeamSelection || !game) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: 'current-user',
      username: 'You',
      message: messageText,
      timestamp: new Date().toISOString(),
      team: userTeamSelection.team
    };

    setMessages(prev => [...prev, newMessage]);
  };

  if (!game) {
    return null;
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: `${game.awayTeam.name} vs ${game.homeTeam.name}`,
          headerBackTitle: 'Games'
        }} 
      />
      
      {userTeamSelection ? (
        <GameChat
          game={game}
          messages={messages}
          userTeamSelection={userTeamSelection}
          onSendMessage={handleSendMessage}
        />
      ) : (
        <TeamSelectionModal
          visible={showTeamSelection}
          game={game}
          onSelectTeam={handleTeamSelection}
          onClose={() => setShowTeamSelection(false)}
        />
      )}
    </>
  );
}