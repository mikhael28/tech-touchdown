import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  Dimensions,
  Platform,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ArticleCard } from '@/components/ArticleCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { Header } from '@/components/Header';
import { TabletLayout } from '@/components/TabletLayout';
import { ArticleWebView } from '@/components/ArticleWebView';
import { Article, Category } from '@/types/article';
import { mockArticles } from '@/mocks/articles';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export const HomeScreen: React.FC = () => {
  const { colors, spacing, fontSize } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showWebView, setShowWebView] = useState(false);

  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'all') {
      return mockArticles;
    }
    return mockArticles.filter(article => article.category === selectedCategory);
  }, [selectedCategory]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      console.log('Articles refreshed');
    }, 1500);
  }, []);

  const handleArticlePress = useCallback((article: Article) => {
    setSelectedArticle(article);
    setShowWebView(true);
    console.log('Opening article:', article.title);
  }, []);

  const handleCloseWebView = useCallback(() => {
    setShowWebView(false);
    setTimeout(() => setSelectedArticle(null), 300);
  }, []);

  const renderArticle = useCallback(({ item }: { item: Article }) => (
    <ArticleCard article={item} onPress={handleArticlePress} />
  ), [handleArticlePress]);

  const keyExtractor = useCallback((item: Article) => item.id, []);

  const ListEmptyComponent = useCallback(() => (
    <View style={[styles.emptyContainer, { paddingHorizontal: spacing.lg }]}>
      <Text style={[styles.emptyText, { color: colors.textSecondary, fontSize: fontSize.lg }]}>
        No articles found in this category
      </Text>
    </View>
  ), [colors, spacing, fontSize]);

  return (
    <TabletLayout selectedScreen="index">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {!isTablet && <Header />}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        <FlatList
          data={filteredArticles}
          renderItem={renderArticle}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.accent}
            />
          }
          ListEmptyComponent={ListEmptyComponent}
          testID="articles-list"
        />

        <ArticleWebView
          article={selectedArticle}
          visible={showWebView}
          onClose={handleCloseWebView}
        />
      </View>
    </TabletLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    textAlign: 'center',
  },
});