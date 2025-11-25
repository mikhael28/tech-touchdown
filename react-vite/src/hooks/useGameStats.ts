import { useState, useEffect, useCallback } from 'react';
import { gameStatsService, GameStatsParams } from '../services/gameStatsService';
import { GameStatsResponse } from '../types/gameStats';

export function useGameStats(params: GameStatsParams | null) {
  const [data, setData] = useState<GameStatsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!params) return;

    setLoading(true);
    setError(null);

    try {
      const response = await gameStatsService.getGameStats(params);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch game stats');
      console.error('Error fetching game stats:', err);
    } finally {
      setLoading(false);
    }
  }, [params?.gameId, params?.sport, params?.league]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    data,
    loading,
    error,
    refetch: fetchStats,
  };
}

