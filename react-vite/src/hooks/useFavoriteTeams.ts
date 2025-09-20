import { useState, useEffect } from "react";

export interface FavoriteTeams {
  nfl: string[];
  nba: string[];
  mlb: string[];
  nhl: string[];
}

const STORAGE_KEY = "favoriteTeams";
const QUESTIONNAIRE_COMPLETED_KEY = "teamQuestionnaireCompleted";

const defaultFavoriteTeams: FavoriteTeams = {
  nfl: [],
  nba: [],
  mlb: [],
  nhl: [],
};

export const useFavoriteTeams = () => {
  const [favoriteTeams, setFavoriteTeams] =
    useState<FavoriteTeams>(defaultFavoriteTeams);
  const [isQuestionnaireCompleted, setIsQuestionnaireCompleted] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const storedTeams = localStorage.getItem(STORAGE_KEY);
      const storedCompletion = localStorage.getItem(
        QUESTIONNAIRE_COMPLETED_KEY
      );

      if (storedTeams) {
        const parsedTeams = JSON.parse(storedTeams);
        setFavoriteTeams(parsedTeams);
      }

      if (storedCompletion) {
        setIsQuestionnaireCompleted(JSON.parse(storedCompletion));
      }
    } catch (error) {
      console.error("Error loading favorite teams from localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveFavoriteTeams = (teams: FavoriteTeams) => {
    try {
      setFavoriteTeams(teams);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
    } catch (error) {
      console.error("Error saving favorite teams to localStorage:", error);
    }
  };

  const markQuestionnaireCompleted = () => {
    try {
      setIsQuestionnaireCompleted(true);
      localStorage.setItem(QUESTIONNAIRE_COMPLETED_KEY, JSON.stringify(true));
    } catch (error) {
      console.error("Error marking questionnaire as completed:", error);
    }
  };

  const removeTeam = (sport: keyof FavoriteTeams, teamShortName: string) => {
    const updatedTeams = {
      ...favoriteTeams,
      [sport]: favoriteTeams[sport].filter((team) => team !== teamShortName),
    };
    saveFavoriteTeams(updatedTeams);
  };

  const resetQuestionnaire = () => {
    try {
      setIsQuestionnaireCompleted(false);
      setFavoriteTeams(defaultFavoriteTeams);
      localStorage.removeItem(QUESTIONNAIRE_COMPLETED_KEY);
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error resetting questionnaire:", error);
    }
  };

  return {
    favoriteTeams,
    isQuestionnaireCompleted,
    isLoading,
    saveFavoriteTeams,
    markQuestionnaireCompleted,
    removeTeam,
    resetQuestionnaire,
  };
};
