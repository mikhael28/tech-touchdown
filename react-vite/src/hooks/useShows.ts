// Custom hook for managing shows with IndexedDB

import { useState, useEffect, useCallback } from 'react';
import { showsDB, SavedShow } from '../services/showsDb';
import { Show } from '../types/show';

export const useShows = () => {
  const [shows, setShows] = useState<SavedShow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize DB and load shows
  useEffect(() => {
    const loadShows = async () => {
      try {
        setIsLoading(true);
        await showsDB.init();
        const allShows = await showsDB.getAllShows();
        setShows(allShows);
        setError(null);
      } catch (err) {
        console.error('Error loading shows:', err);
        setError(err instanceof Error ? err.message : 'Failed to load shows');
      } finally {
        setIsLoading(false);
      }
    };

    loadShows();
  }, []);

  const saveShow = useCallback(async (show: Show, generationParams?: SavedShow['generationParams']) => {
    try {
      const savedShow = await showsDB.saveShow(show, generationParams);
      setShows(prev => {
        const existing = prev.findIndex(s => s.id === savedShow.id);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = savedShow;
          return updated;
        }
        return [savedShow, ...prev];
      });
      setError(null);
      return savedShow;
    } catch (err) {
      console.error('Error saving show:', err);
      setError(err instanceof Error ? err.message : 'Failed to save show');
      throw err;
    }
  }, []);

  const updateShow = useCallback(async (show: SavedShow) => {
    try {
      const updatedShow = await showsDB.updateShow(show);
      setShows(prev => prev.map(s => s.id === updatedShow.id ? updatedShow : s));
      setError(null);
      return updatedShow;
    } catch (err) {
      console.error('Error updating show:', err);
      setError(err instanceof Error ? err.message : 'Failed to update show');
      throw err;
    }
  }, []);

  const getShow = useCallback(async (id: string): Promise<SavedShow | undefined> => {
    try {
      const show = await showsDB.getShow(id);
      setError(null);
      return show;
    } catch (err) {
      console.error('Error getting show:', err);
      setError(err instanceof Error ? err.message : 'Failed to get show');
      return undefined;
    }
  }, []);

  const deleteShow = useCallback(async (id: string) => {
    try {
      await showsDB.deleteShow(id);
      setShows(prev => prev.filter(s => s.id !== id));
      setError(null);
      return true;
    } catch (err) {
      console.error('Error deleting show:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete show');
      return false;
    }
  }, []);

  const clearAllShows = useCallback(async () => {
    try {
      await showsDB.clearAllShows();
      setShows([]);
      setError(null);
      return true;
    } catch (err) {
      console.error('Error clearing shows:', err);
      setError(err instanceof Error ? err.message : 'Failed to clear shows');
      return false;
    }
  }, []);

  return {
    shows,
    isLoading,
    error,
    saveShow,
    updateShow,
    getShow,
    deleteShow,
    clearAllShows,
  };
};

