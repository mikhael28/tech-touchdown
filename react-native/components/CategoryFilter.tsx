import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Category } from '@/types/article';
import { useTheme } from '@/hooks/useTheme';

interface CategoryFilterProps {
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
}

const categories: { id: Category; label: string; emoji: string }[] = [
  { id: 'all', label: 'All', emoji: '🔥' },
  { id: 'nfl', label: 'NFL', emoji: '🏈' },
  { id: 'tech', label: 'Tech', emoji: '💻' },
  { id: 'startups', label: 'Startups', emoji: '🚀' },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = React.memo(({
  selectedCategory,
  onCategoryChange,
}) => {
  const { colors, spacing, borderRadius, fontSize } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: spacing.md }]}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                {
                  backgroundColor: isSelected ? colors.accent : colors.card,
                  borderRadius: borderRadius.xl,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                  marginRight: spacing.sm,
                  borderWidth: 1,
                  borderColor: isSelected ? colors.accent : colors.border,
                },
              ]}
              onPress={() => onCategoryChange(category.id)}
              activeOpacity={0.7}
              testID={`category-${category.id}`}
            >
              <Text style={[styles.emoji, { fontSize: fontSize.md }]}>
                {category.emoji}
              </Text>
              <Text
                style={[
                  styles.categoryLabel,
                  {
                    color: isSelected ? '#FFFFFF' : colors.textSecondary,
                    fontSize: fontSize.sm,
                  },
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  scrollContent: {
    alignItems: 'center',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emoji: {},
  categoryLabel: {
    fontWeight: '600' as const,
  },
});