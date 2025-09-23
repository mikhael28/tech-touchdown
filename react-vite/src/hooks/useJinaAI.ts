import { useState, useCallback } from "react";

export interface JinaResponse {
  success: boolean;
  data: string;
  url: string;
  timestamp: string;
}

export interface JinaError {
  error: {
    message: string;
  };
}

const useJinaAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJinaData = useCallback(
    async (url: string): Promise<JinaResponse | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/jina`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url }),
          }
        );

        if (!response.ok) {
          const errorData: JinaError = await response.json();
          throw new Error(errorData.error.message);
        }

        const data: JinaResponse = await response.json();
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to fetch data from Jina AI";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { fetchJinaData, loading, error };
};

export default useJinaAI;
