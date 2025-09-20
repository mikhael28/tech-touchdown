import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Game } from '@/types/game';
import { useTheme } from '@/hooks/useTheme';
import { Tv, MapPin, Circle } from 'lucide-react-native';

interface GameCardProps {
  game: Game;
  onPress?: (game: Game) => void;
}

export function GameCard({ game, onPress }: GameCardProps) {
  const { colors, fontSize } = useTheme();

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = () => {
    switch (game.status) {
      case 'live':
        return '#22C55E';
      case 'final':
        return colors.textSecondary;
      case 'postponed':
      case 'cancelled':
        return '#EF4444';
      default:
        return colors.accent;
    }
  };

  const getStatusText = () => {
    switch (game.status) {
      case 'live':
        return 'LIVE';
      case 'final':
        return 'FINAL';
      case 'postponed':
        return 'POSTPONED';
      case 'cancelled':
        return 'CANCELLED';
      default:
        return formatTime(game.startTime);
    }
  };

  const getLeagueColor = () => {
    const leagueColors: Record<string, string> = {
      NFL: '#013369',
      NBA: '#C8102E',
      MLB: '#041E42',
      NHL: '#000000',
      MLS: '#005DAA',
      NCAAF: '#8B0000',
      NCAAB: '#FF8C00'
    };
    return leagueColors[game.league] || colors.accent;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        }
      ]}
      onPress={() => onPress?.(game)}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={[
          styles.leagueBadge,
          { backgroundColor: getLeagueColor() }
        ]}>
          <Text style={[styles.leagueText, { fontSize: fontSize.xs }]}>
            {game.league}
          </Text>
        </View>
        
        <View style={styles.statusContainer}>
          {game.status === 'live' && (
            <Circle size={8} color={getStatusColor()} fill={getStatusColor()} />
          )}
          <Text style={[
            styles.statusText,
            { color: getStatusColor(), fontSize: fontSize.sm }
          ]}>
            {getStatusText()}
          </Text>
        </View>
      </View>

      {/* Teams */}
      <View style={styles.teamsContainer}>
        {/* Away Team */}
        <View style={styles.teamRow}>
          <View style={styles.teamInfo}>
            <Text style={[
              styles.teamName,
              { color: colors.text, fontSize: fontSize.md }
            ]}>
              {game.awayTeam.name}
            </Text>
            {game.awayTeam.record && (
              <Text style={[
                styles.teamRecord,
                { color: colors.textSecondary, fontSize: fontSize.xs }
              ]}>
                {game.awayTeam.record}
              </Text>
            )}
          </View>
          {game.score && (
            <Text style={[
              styles.score,
              { color: colors.text, fontSize: fontSize.xl }
            ]}>
              {game.score.away}
            </Text>
          )}
        </View>

        {/* Home Team */}
        <View style={styles.teamRow}>
          <View style={styles.teamInfo}>
            <Text style={[
              styles.teamName,
              { color: colors.text, fontSize: fontSize.md }
            ]}>
              {game.homeTeam.name}
            </Text>
            {game.homeTeam.record && (
              <Text style={[
                styles.teamRecord,
                { color: colors.textSecondary, fontSize: fontSize.xs }
              ]}>
                {game.homeTeam.record}
              </Text>
            )}
          </View>
          {game.score && (
            <Text style={[
              styles.score,
              { color: colors.text, fontSize: fontSize.xl }
            ]}>
              {game.score.home}
            </Text>
          )}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {game.venue && (
          <View style={styles.infoItem}>
            <MapPin size={14} color={colors.textSecondary} />
            <Text style={[
              styles.infoText,
              { color: colors.textSecondary, fontSize: fontSize.xs }
            ]}>
              {game.venue}
            </Text>
          </View>
        )}
        {game.network && (
          <View style={styles.infoItem}>
            <Tv size={14} color={colors.textSecondary} />
            <Text style={[
              styles.infoText,
              { color: colors.textSecondary, fontSize: fontSize.xs }
            ]}>
              {game.network}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leagueBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  leagueText: {
    color: '#FFFFFF',
    fontWeight: 'bold' as const,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontWeight: '600' as const,
  },
  teamsContainer: {
    gap: 8,
    marginBottom: 12,
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  teamRecord: {
    fontWeight: '500' as const,
  },
  score: {
    fontWeight: 'bold' as const,
    minWidth: 40,
    textAlign: 'right' as const,
  },
  footer: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontWeight: '500' as const,
  },
});