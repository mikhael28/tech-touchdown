import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { Clock } from 'lucide-react-native';
import { Article } from '@/types/article';
import { useTheme } from '@/hooks/useTheme';
import { useSettings } from '@/hooks/useSettings';

interface ArticleCardProps {
  article: Article;
  onPress: (article: Article) => void;
}

const ArticleCardComponent: React.FC<ArticleCardProps> = ({ article, onPress }) => {
  const { colors, spacing, borderRadius, fontSize } = useTheme();
  const { settings } = useSettings();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nfl':
        return colors.accentSecondary;
      case 'tech':
        return colors.accent;
      case 'startups':
        return '#F59E0B';
      default:
        return colors.textSecondary;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderRadius: borderRadius.lg,
          marginHorizontal: spacing.md,
          marginVertical: spacing.sm,
          borderColor: colors.border,
        },
      ]}
      onPress={() => onPress(article)}
      activeOpacity={0.7}
      testID={`article-card-${article.id}`}
    >
      {settings.showPictures && (
        <Image
          source={{ uri: article.imageUrl }}
          style={[styles.image, { borderRadius: borderRadius.md }]}
          resizeMode="cover"
        />
      )}
      
      <View style={[styles.content, { padding: spacing.md }]}>
        <View style={styles.categoryRow}>
          <View
            style={[
              styles.categoryBadge,
              {
                backgroundColor: getCategoryColor(article.category) + '20',
                paddingHorizontal: spacing.sm,
                paddingVertical: spacing.xs,
                borderRadius: borderRadius.sm,
              },
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                {
                  color: getCategoryColor(article.category),
                  fontSize: fontSize.xs,
                },
              ]}
            >
              {article.category.toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.source, { color: colors.textSecondary, fontSize: fontSize.xs }]}>
            {article.source}
          </Text>
        </View>

        <Text
          style={[styles.title, { color: colors.text, fontSize: fontSize.lg }]}
          numberOfLines={2}
        >
          {article.title}
        </Text>

        <Text
          style={[styles.description, { color: colors.textSecondary, fontSize: fontSize.sm }]}
          numberOfLines={2}
        >
          {article.description}
        </Text>

        <View style={[styles.footer, { marginTop: spacing.sm }]}>
          <Text style={[styles.date, { color: colors.textSecondary, fontSize: fontSize.xs }]}>
            {formatDate(article.publishedAt)}
          </Text>
          <View style={styles.statItem}>
            <Clock size={14} color={colors.textSecondary} />
            <Text style={[styles.statText, { color: colors.textSecondary, fontSize: fontSize.xs }]}>
              {article.readTime} min
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

ArticleCardComponent.displayName = 'ArticleCard';

export const ArticleCard = React.memo(ArticleCardComponent);

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    flex: 1,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  source: {
    fontWeight: '500' as const,
  },
  title: {
    fontWeight: '700' as const,
    lineHeight: 24,
    marginBottom: 8,
  },
  description: {
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontWeight: '500' as const,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontWeight: '500' as const,
  },
});