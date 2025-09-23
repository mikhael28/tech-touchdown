import { useState } from "react";
import { SportsData } from "../types/sports";

export interface SportsPromptRequest {
  prompt: string;
  maxGames?: number;
  includeCompleted?: boolean;
  includeScheduled?: boolean;
  includeLive?: boolean;
}

export interface SportsResponse {
  success: boolean;
  prompt: string;
  options: {
    maxGames: number;
    includeCompleted: boolean;
    includeScheduled: boolean;
    includeLive: boolean;
  };
  data: SportsData;
  totalGames: number;
  totalLeagues: number;
}

export interface SportsError {
  error: {
    message: string;
    code: string;
  };
}

const useSportsAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSportsData = async (
    request: SportsPromptRequest
  ): Promise<SportsResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      console.log(request);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/sports/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        }
      );

      if (!response.ok) {
        const errorData: SportsError = await response.json();
        throw new Error(errorData.error.message);
      }

      const data: SportsResponse = await response.json();
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate sports data";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return { generateSportsData, loading, error, clearError };
};

export default useSportsAI;
