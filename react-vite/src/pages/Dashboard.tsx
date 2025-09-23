import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '../components/ui/card';
import TeamSelectionModal from '../components/TeamSelectionModal';
import TechSelectionModal from '../components/TechSelectionModal';
import SportsSearch from '../components/SportsSearch';
import TechSearch from '../components/TechSearch';
import { useFavoriteTeams, FavoriteTeams } from '../hooks/useFavoriteTeams';
import { useFavoriteTech, FavoriteTech } from '../hooks/useFavoriteTech';

const Home: React.FC = () => {
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showTechModal, setShowTechModal] = useState(false);

  const {
    favoriteTeams,
    isQuestionnaireCompleted,
    isLoading: teamsLoading,
    saveFavoriteTeams,
    markQuestionnaireCompleted,
    saveFavoriteTeamsAndComplete,
    removeTeam,
  } = useFavoriteTeams();

  const {
    favoriteTech,
    isQuestionnaireCompleted: isTechQuestionnaireCompleted,
    isLoading: techLoading,
    saveFavoriteTech,
    markQuestionnaireCompleted: markTechQuestionnaireCompleted,
    saveFavoriteTechAndComplete,
    removeTech,
  } = useFavoriteTech();

  // Show team selection modal if questionnaire not completed
  useEffect(() => {
    if (!teamsLoading && !isQuestionnaireCompleted && !showTechModal) {
      setShowTeamModal(true);
    }
  }, [teamsLoading, isQuestionnaireCompleted, showTechModal]);

  // Show tech selection modal if questionnaire not completed (only after team questionnaire is done)
  useEffect(() => {
    if (!techLoading && !isTechQuestionnaireCompleted && isQuestionnaireCompleted && !showTeamModal) {
      setShowTechModal(true);
    }
  }, [techLoading, isTechQuestionnaireCompleted, isQuestionnaireCompleted, showTeamModal]);

  const handleTeamSelectionComplete = useCallback((teams: any) => {
    saveFavoriteTeamsAndComplete(teams);
    setShowTeamModal(false);
  }, [saveFavoriteTeamsAndComplete]);

  const handleTechSelectionComplete = useCallback((tech: any) => {
    saveFavoriteTechAndComplete(tech);
    setShowTechModal(false);
  }, [saveFavoriteTechAndComplete]);

  const handleEditTeams = () => {
    setShowTeamModal(true);
  };

  const handleEditTech = () => {
    setShowTechModal(true);
  };

  const handleRemoveTeam = (sport: keyof typeof favoriteTeams, teamShortName: string) => {
    removeTeam(sport, teamShortName);
  };

  const handleRemoveTech = (category: keyof typeof favoriteTech, itemShortName: string) => {
    removeTech(category, itemShortName);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Side-by-side Search Interfaces with Integrated Bubbles */}
      <div className="flex h-screen">
        {/* Left Side - Sports News */}
        <div className="flex-1 border-r border-gray-200 dark:border-gray-700 overflow-y-auto bg-white dark:bg-gray-800">
          <SportsSearch 
            onEditTeams={handleEditTeams}
            favoriteTeams={favoriteTeams}
            onRemoveTeam={handleRemoveTeam}
          />
        </div>

        {/* Right Side - Tech News */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800">
          <TechSearch 
            onEditTech={handleEditTech}
            favoriteTech={favoriteTech}
            onRemoveTech={handleRemoveTech}
          />
        </div>
      </div>

      {/* Team Selection Modal */}
      <TeamSelectionModal
        isOpen={showTeamModal}
        onClose={() => setShowTeamModal(false)}
        onComplete={handleTeamSelectionComplete}
      />

      {/* Tech Selection Modal */}
      <TechSelectionModal
        isOpen={showTechModal}
        onClose={() => setShowTechModal(false)}
        onComplete={handleTechSelectionComplete}
      />
    </div>
  );
};

export default Home;
