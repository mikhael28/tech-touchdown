import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { GameCard } from '@/components/GameCard';
import { LeagueFilter } from '@/components/LeagueFilter';
import { TabletLayout } from '@/components/TabletLayout';
import { mockGames } from '@/mocks/games';
import { Game, League } from '@/types/game';
import { Calendar, Trophy } from 'lucide-react-native';

export default function GamesScreen() {
  const { colors, fontSize } = useTheme();

  const [selectedLeagues, setSelectedLeagues] = useState<League[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const availableLeagues = useMemo(() => {
    const leagues = new Set(mockGames.map(game => game.league));
    return Array.from(leagues).sort();
  }, []);

  const filteredGames = useMemo(() => {
    if (selectedLeagues.length === 0) {
      return mockGames;
    }
    return mockGames.filter(game => selectedLeagues.includes(game.league));
  }, [selectedLeagues]);

  const handleLeagueToggle = (league: League) => {
    setSelectedLeagues(prev => {
      if (prev.includes(league)) {
        return prev.filter(l => l !== league);
      } else {
        return [...prev, league];
      }
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => {
      if (resolve) {
        setTimeout(resolve, 1000);
      }
    });
    setRefreshing(false);
  };

  const handleGamePress = (game: Game) => {
    console.log('Navigating to chat for game:', game.id);
    router.push(`/chat/${game.id}`);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Trophy size={24} color={colors.accent} />
        <Text style={[
          styles.title,
          { color: colors.text, fontSize: fontSize.xl }
        ]}>
          Today&apos;s Games
        </Text>
      </View>
      
      <View style={styles.dateContainer}>
        <Calendar size={16} color={colors.textSecondary} />
        <Text style={[
          styles.dateText,
          { color: colors.textSecondary, fontSize: fontSize.sm }
        ]}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
      </View>
      
      <LeagueFilter
        selectedLeagues={selectedLeagues}
        onLeagueToggle={handleLeagueToggle}
        availableLeagues={availableLeagues}
      />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Trophy size={48} color={colors.textSecondary} />
      <Text style={[
        styles.emptyTitle,
        { color: colors.text, fontSize: fontSize.lg }
      ]}>
        No Games Found
      </Text>
      <Text style={[
        styles.emptySubtitle,
        { color: colors.textSecondary, fontSize: fontSize.md }
      ]}>
        Try adjusting your league filters
      </Text>
    </View>
  );

  return (
    <TabletLayout selectedScreen="tech">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={filteredGames}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GameCard game={item} onPress={handleGamePress} />
          )}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 20,
            flexGrow: 1
          }}
        />
        </SafeAreaView>
      </View>
    </TabletLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold' as const,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  dateText: {
    fontWeight: '500' as const,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  emptyTitle: {
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
  },
  emptySubtitle: {
    textAlign: 'center' as const,
    lineHeight: 20,
  },
});