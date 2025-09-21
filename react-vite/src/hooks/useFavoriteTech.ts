import { useState, useEffect } from "react";

export interface FavoriteTech {
  languages: string[];
  stacks: string[];
  industries: string[];
  companies: string[];
}

const STORAGE_KEY = "favoriteTech";
const QUESTIONNAIRE_COMPLETED_KEY = "techQuestionnaireCompleted";

const defaultFavoriteTech: FavoriteTech = {
  languages: [],
  stacks: [],
  industries: [],
  companies: [],
};

export const useFavoriteTech = () => {
  const [favoriteTech, setFavoriteTech] =
    useState<FavoriteTech>(defaultFavoriteTech);
  const [isQuestionnaireCompleted, setIsQuestionnaireCompleted] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const storedTech = localStorage.getItem(STORAGE_KEY);
      const storedCompletion = localStorage.getItem(
        QUESTIONNAIRE_COMPLETED_KEY
      );

      if (storedTech) {
        const parsedTech = JSON.parse(storedTech);
        setFavoriteTech(parsedTech);
      }

      if (storedCompletion) {
        setIsQuestionnaireCompleted(JSON.parse(storedCompletion));
      }
    } catch (error) {
      console.error("Error loading favorite tech from localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveFavoriteTech = (tech: FavoriteTech) => {
    try {
      setFavoriteTech(tech);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tech));
    } catch (error) {
      console.error("Error saving favorite tech to localStorage:", error);
    }
  };

  const markQuestionnaireCompleted = () => {
    try {
      setIsQuestionnaireCompleted(true);
      localStorage.setItem(QUESTIONNAIRE_COMPLETED_KEY, JSON.stringify(true));
    } catch (error) {
      console.error("Error marking tech questionnaire as completed:", error);
    }
  };

  const removeTech = (category: keyof FavoriteTech, itemShortName: string) => {
    const updatedTech = {
      ...favoriteTech,
      [category]: favoriteTech[category].filter(
        (item) => item !== itemShortName
      ),
    };
    saveFavoriteTech(updatedTech);
  };

  const resetQuestionnaire = () => {
    try {
      setIsQuestionnaireCompleted(false);
      setFavoriteTech(defaultFavoriteTech);
      localStorage.removeItem(QUESTIONNAIRE_COMPLETED_KEY);
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error resetting tech questionnaire:", error);
    }
  };

  return {
    favoriteTech,
    isQuestionnaireCompleted,
    isLoading,
    saveFavoriteTech,
    markQuestionnaireCompleted,
    removeTech,
    resetQuestionnaire,
  };
};
