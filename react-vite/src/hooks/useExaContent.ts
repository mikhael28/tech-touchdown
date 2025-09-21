import { useState, useCallback } from "react";
import useJinaAI from "./useJinaAI";

interface JinaContent {
  title?: string;
  url: string;
  text: string;
  timestamp: string;
}

interface UseJinaContentReturn {
  content: JinaContent | null;
  loading: boolean;
  error: string | null;
  fetchContent: (url: string) => Promise<void>;
  clearContent: () => void;
}

export const useJinaContent = (): UseJinaContentReturn => {
  const [content, setContent] = useState<JinaContent | null>(null);
  const { fetchJinaData, loading, error } = useJinaAI();

  const fetchContent = useCallback(
    async (url: string) => {
      if (!url) return;

      try {
        const result = await fetchJinaData(url);
        if (result) {
          setContent({
            title: result.url, // Use URL as title since Jina doesn't provide separate title
            url: result.url,
            text: result.data,
            timestamp: result.timestamp,
          });
        }
      } catch (err) {
        console.error("Error fetching content:", err);
      }
    },
    [fetchJinaData]
  );

  const clearContent = useCallback(() => {
    setContent(null);
  }, []);

  return {
    content,
    loading,
    error,
    fetchContent,
    clearContent,
  };
};
