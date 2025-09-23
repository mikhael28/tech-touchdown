import { useState, useCallback } from "react";
import { Game, SportsData, League } from "../types/sports";

interface ProcessGameResponse {
  success: boolean;
  gameId: string;
  gameData: Game;
  timestamp: string;
}

interface ProcessGameError {
  error: {
    message: string;
  };
}

const useGameProcessor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processGame = useCallback(
    async (gameId: string, url: string): Promise<Game | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/game/process`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ gameId, url }),
          }
        );

        if (!response.ok) {
          const errorData: ProcessGameError = await response.json();
          throw new Error(errorData.error.message);
        }

        const data: ProcessGameResponse = await response.json();

        if (data.success && data.gameData) {
          // Update localStorage with the new game data
          updateGameInLocalStorage(data.gameData);
          return data.gameData;
        }

        return null;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to process game data";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateGameInLocalStorage = useCallback((updatedGame: Game) => {
    try {
      // Get current sports data from localStorage
      const storedData = localStorage.getItem("generatedSportsData");
      if (!storedData) {
        console.warn("No sports data found in localStorage");
        return;
      }

      const sportsData: SportsData = JSON.parse(storedData);

      // Find and update the game in the leagues
      let gameUpdated = false;
      const updatedLeagues = sportsData.leagues.map((league: League) => {
        const updatedGames = league.games.map((game: Game) => {
          if (game.id === updatedGame.id) {
            gameUpdated = true;
            return { ...game, ...updatedGame };
          }
          return game;
        });
        return { ...league, games: updatedGames };
      });

      if (gameUpdated) {
        // Update the lastUpdated timestamp
        const updatedSportsData: SportsData = {
          ...sportsData,
          leagues: updatedLeagues,
          lastUpdated: new Date().toISOString(),
        };

        // Save back to localStorage
        localStorage.setItem(
          "generatedSportsData",
          JSON.stringify(updatedSportsData)
        );

        // Dispatch a custom event to notify components of the update
        window.dispatchEvent(
          new CustomEvent("sportsDataUpdated", {
            detail: { updatedGame, sportsData: updatedSportsData },
          })
        );

        console.log("Game updated in localStorage:", updatedGame);
      } else {
        console.warn(
          `Game with ID ${updatedGame.id} not found in localStorage`
        );
      }
    } catch (error) {
      console.error("Error updating game in localStorage:", error);
    }
  }, []);

  return {
    processGame,
    loading,
    error,
  };
};

export default useGameProcessor;
