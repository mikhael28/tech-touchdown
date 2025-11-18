import { useState, useCallback } from "react";
import { SportsData } from "../types/sports";

export interface UseAllGamesResult {
  data: SportsData | null;
  loading: boolean;
  error: string | null;
  fetchGames: () => Promise<void>;
  clearError: () => void;
}

const useAllGames = (): UseAllGamesResult => {
  const [data, setData] = useState<SportsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/sports/games/all`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch games: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error("Failed to fetch games from APIs");
      }

      setData(result.data);

      // Log any errors from individual API sources
      if (result.errors && result.errors.length > 0) {
        console.warn("Some API sources failed:", result.errors);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching all games:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { data, loading, error, fetchGames, clearError };
};

export default useAllGames;
