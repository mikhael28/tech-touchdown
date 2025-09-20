import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { League } from '@/types/game';
import { useTheme } from '@/hooks/useTheme';

interface LeagueFilterProps {
  selectedLeagues: League[];
  onLeagueToggle: (league: League) => void;
  availableLeagues: League[];
}

const LEAGUE_NAMES: Record<League, string> = {
  NFL: 'NFL',
  NBA: 'NBA',
  MLB: 'MLB',
  NHL: 'NHL',
  MLS: 'MLS',
  NCAAF: 'College FB',
  NCAAB: 'College BB',
  EURO: 'Euro',
  EPL: 'Premier League'
};

export function LeagueFilter({ selectedLeagues, onLeagueToggle, availableLeagues }: LeagueFilterProps) {
  const { colors, fontSize } = useTheme();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              backgroundColor: selectedLeagues.length === 0 ? colors.accent : colors.card,
              borderColor: colors.border,
            }
          ]}
          onPress={() => {
            // Clear all filters
            selectedLeagues.forEach(league => onLeagueToggle(league));
          }}
        >
          <Text style={[
            styles.filterText,
            {
              color: selectedLeagues.length === 0 ? '#FFFFFF' : colors.text,
              fontSize: fontSize.sm
            }
          ]}>
            All
          </Text>
        </TouchableOpacity>
        
        {availableLeagues.map((league) => {
          const isSelected = selectedLeagues.includes(league);
          return (
            <TouchableOpacity
              key={league}
              style={[
                styles.filterButton,
                {
                  backgroundColor: isSelected ? colors.accent : colors.card,
                  borderColor: colors.border,
                }
              ]}
              onPress={() => onLeagueToggle(league)}
            >
              <Text style={[
                styles.filterText,
                {
                  color: isSelected ? '#FFFFFF' : colors.text,
                  fontSize: fontSize.sm
                }
              ]}>
                {LEAGUE_NAMES[league]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  },
});