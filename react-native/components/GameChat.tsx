import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  SafeAreaView
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Send, Hash } from 'lucide-react-native';
import { ChatMessage, UserTeamSelection } from '@/types/chat';
import { Game } from '@/types/game';

interface GameChatProps {
  game: Game;
  messages: ChatMessage[];
  userTeamSelection: UserTeamSelection;
  onSendMessage: (message: string) => void;
}

export function GameChat({ game, messages, userTeamSelection, onSendMessage }: GameChatProps) {
  const { colors, fontSize } = useTheme();
  const [inputMessage, setInputMessage] = useState<string>('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSendMessage = () => {
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage || trimmedMessage.length > 500) return;
    
    onSendMessage(trimmedMessage);
    setInputMessage('');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTeamColor = (team: 'home' | 'away') => {
    if (team === 'home') {
      return game.homeTeam.color || '#DC2626';
    }
    return game.awayTeam.color || '#2563EB';
  };



  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.headerContent}>
          <Hash size={20} color={colors.accent} />
          <Text style={[styles.headerTitle, { color: colors.text, fontSize: fontSize.lg }]}>
            {game.awayTeam.name} vs {game.homeTeam.name}
          </Text>
        </View>
        <View style={styles.teamIndicator}>
          <View style={[
            styles.teamBadge,
            { backgroundColor: userTeamSelection.teamColor }
          ]}>
            <Text style={[styles.teamBadgeText, { fontSize: fontSize.xs }]}>
              {userTeamSelection.teamName}
            </Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View key={message.id} style={styles.messageContainer}>
            <View style={styles.messageHeader}>
              <Text style={[
                styles.username,
                { 
                  color: getTeamColor(message.team),
                  fontSize: fontSize.sm 
                }
              ]}>
                {message.username}
              </Text>
              <Text style={[
                styles.timestamp,
                { color: colors.textSecondary, fontSize: fontSize.xs }
              ]}>
                {formatTime(message.timestamp)}
              </Text>
            </View>
            <Text style={[
              styles.messageText,
              { color: colors.text, fontSize: fontSize.md }
            ]}>
              {message.message}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={[styles.inputContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <TextInput
            style={[
              styles.textInput,
              { 
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.text,
                fontSize: fontSize.md
              }
            ]}
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder={`Message as ${userTeamSelection.teamName} fan...`}
            placeholderTextColor={colors.textSecondary}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={handleSendMessage}
            testID="chat-input"
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { 
                backgroundColor: inputMessage.trim() ? colors.accent : colors.border,
                opacity: inputMessage.trim() ? 1 : 0.5
              }
            ]}
            onPress={handleSendMessage}
            disabled={!inputMessage.trim()}
            activeOpacity={0.7}
            testID="send-button"
          >
            <Send size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  headerTitle: {
    fontWeight: '600' as const,
  },
  teamIndicator: {
    alignItems: 'flex-end',
  },
  teamBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  teamBadgeText: {
    color: '#FFFFFF',
    fontWeight: '600' as const,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 16,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  username: {
    fontWeight: '600' as const,
  },
  timestamp: {
    fontWeight: '400' as const,
  },
  messageText: {
    lineHeight: 20,
    paddingLeft: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    minHeight: 44,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});