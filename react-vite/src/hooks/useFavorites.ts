// Custom hook for managing favorite articles with IndexedDB

import { useState, useEffect, useCallback } from 'react';
import { favoritesDB, FavoriteArticle } from '../services/favoritesDb';
import { ExaSearchResult } from '../types/exa';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize DB and load favorites
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setIsLoading(true);
        await favoritesDB.init();
        const allFavorites = await favoritesDB.getAllFavorites();
        setFavorites(allFavorites);
        setError(null);
      } catch (err) {
        console.error('Error loading favorites:', err);
        setError(err instanceof Error ? err.message : 'Failed to load favorites');
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const addFavorite = useCallback(async (article: ExaSearchResult) => {
    try {
      const newFavorite = await favoritesDB.addFavorite(article);
      setFavorites(prev => [newFavorite, ...prev]);
      setError(null);
      return true;
    } catch (err) {
      console.error('Error adding favorite:', err);
      setError(err instanceof Error ? err.message : 'Failed to add favorite');
      return false;
    }
  }, []);

  const removeFavorite = useCallback(async (id: string) => {
    try {
      await favoritesDB.removeFavorite(id);
      setFavorites(prev => prev.filter(fav => fav.id !== id));
      setError(null);
      return true;
    } catch (err) {
      console.error('Error removing favorite:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove favorite');
      return false;
    }
  }, []);

  const isFavorite = useCallback((url: string): boolean => {
    return favorites.some(fav => fav.url === url);
  }, [favorites]);

  const clearAll = useCallback(async () => {
    try {
      await favoritesDB.clearAllFavorites();
      setFavorites([]);
      setError(null);
      return true;
    } catch (err) {
      console.error('Error clearing favorites:', err);
      setError(err instanceof Error ? err.message : 'Failed to clear favorites');
      return false;
    }
  }, []);

  return {
    favorites,
    isLoading,
    error,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearAll,
  };
};

