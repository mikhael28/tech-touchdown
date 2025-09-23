import { useState, useEffect } from "react";
import { SportsData, Game, League } from "../types/sports";

const useSportsData = () => {
  const [data, setData] = useState<SportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSportsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Fetch data from plaintextsports.com using Jina AI
      const jinaResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/jina`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: "https://plaintextsports.com/" }),
        }
      );

      if (!jinaResponse.ok) {
        throw new Error("Failed to fetch sports data from Jina AI");
      }

      const jinaData = await jinaResponse.json();

      if (!jinaData.success) {
        throw new Error("Jina AI request failed");
      }

      // Step 2: Process the data with OpenAI to extract structured sports data
      const aiResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/sports/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: `Extract and structure sports game information from this web content: ${jinaData.data}`,
            maxGames: 50,
            includeCompleted: true,
            includeScheduled: true,
            includeLive: true,
          }),
        }
      );

      if (!aiResponse.ok) {
        throw new Error("Failed to process sports data with AI");
      }

      const aiData = await aiResponse.json();

      if (!aiData.success) {
        throw new Error("AI processing failed");
      }

      // Parse the AI response and structure it as SportsData
      const gamesArray = JSON.parse(aiData.data);

      // Group games by league
      const leaguesMap = new Map<string, Game[]>();
      gamesArray.forEach((game: Game) => {
        if (!leaguesMap.has(game.league)) {
          leaguesMap.set(game.league, []);
        }
        leaguesMap.get(game.league)!.push(game);
      });

      const leagues = Array.from(leaguesMap.entries()).map(([name, games]) => ({
        name,
        games,
      }));

      const sportsData: SportsData = {
        leagues,
        lastUpdated: new Date().toISOString(),
      };

      setData(sportsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSportsData();
  }, []);

  return { data, loading, error, refetch: fetchSportsData };
};

export default useSportsData;
