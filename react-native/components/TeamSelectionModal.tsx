import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Game } from '@/types/game';

interface TeamSelectionModalProps {
  visible: boolean;
  game: Game;
  onSelectTeam: (team: 'home' | 'away', teamName: string, teamColor: string) => void;
  onClose: () => void;
}

export function TeamSelectionModal({ visible, game, onSelectTeam, onClose }: TeamSelectionModalProps) {
  const { colors, fontSize } = useTheme();

  const handleTeamSelection = (team: 'home' | 'away') => {
    if (!team || (team !== 'home' && team !== 'away')) return;
    
    const teamName = team === 'home' ? game.homeTeam.name : game.awayTeam.name;
    const teamColor = team === 'home' 
      ? (game.homeTeam.color || '#DC2626') 
      : (game.awayTeam.color || '#2563EB');
    
    onSelectTeam(team, teamName, teamColor);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[
          styles.container,
          { backgroundColor: colors.card, borderColor: colors.border }
        ]}>
          <Text style={[
            styles.title,
            { color: colors.text, fontSize: fontSize.xl }
          ]}>
            Choose Your Team
          </Text>
          
          <Text style={[
            styles.subtitle,
            { color: colors.textSecondary, fontSize: fontSize.md }
          ]}>
            Who are you rooting for in this game?
          </Text>

          <View style={styles.teamsContainer}>
            <TouchableOpacity
              style={[
                styles.teamButton,
                { 
                  backgroundColor: game.awayTeam.color || '#2563EB',
                  borderColor: colors.border 
                }
              ]}
              onPress={() => handleTeamSelection('away')}
              activeOpacity={0.8}
            >
              <Text style={[styles.teamName, { fontSize: fontSize.lg }]}>
                {game.awayTeam.name}
              </Text>
              <Text style={[styles.teamLabel, { fontSize: fontSize.sm }]}>
                Away Team
              </Text>
            </TouchableOpacity>

            <Text style={[
              styles.vsText,
              { color: colors.textSecondary, fontSize: fontSize.md }
            ]}>
              VS
            </Text>

            <TouchableOpacity
              style={[
                styles.teamButton,
                { 
                  backgroundColor: game.homeTeam.color || '#DC2626',
                  borderColor: colors.border 
                }
              ]}
              onPress={() => handleTeamSelection('home')}
              activeOpacity={0.8}
            >
              <Text style={[styles.teamName, { fontSize: fontSize.lg }]}>
                {game.homeTeam.name}
              </Text>
              <Text style={[styles.teamLabel, { fontSize: fontSize.sm }]}>
                Home Team
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold' as const,
    marginBottom: 8,
    textAlign: 'center' as const,
  },
  subtitle: {
    textAlign: 'center' as const,
    marginBottom: 32,
    lineHeight: 20,
  },
  teamsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  teamButton: {
    width: '100%',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  teamName: {
    color: '#FFFFFF',
    fontWeight: 'bold' as const,
    marginBottom: 4,
    textAlign: 'center' as const,
  },
  teamLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500' as const,
  },
  vsText: {
    fontWeight: 'bold' as const,
    marginVertical: 8,
  },
});