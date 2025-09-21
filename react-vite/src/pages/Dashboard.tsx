import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import TeamSelectionModal from '../components/TeamSelectionModal';
import TechSelectionModal from '../components/TechSelectionModal';
import FavoriteTeamsBubbles from '../components/FavoriteTeamsBubbles';
import FavoriteTechBubbles from '../components/FavoriteTechBubbles';
import SportsSearch from '../components/SportsSearch';
import TechSearch from '../components/TechSearch';
import { useFavoriteTeams } from '../hooks/useFavoriteTeams';
import { useFavoriteTech } from '../hooks/useFavoriteTech';

const Home: React.FC = () => {
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showTechModal, setShowTechModal] = useState(false);

  const {
    favoriteTeams,
    isQuestionnaireCompleted,
    isLoading: teamsLoading,
    saveFavoriteTeams,
    markQuestionnaireCompleted,
    removeTeam,
  } = useFavoriteTeams();

  const {
    favoriteTech,
    isQuestionnaireCompleted: isTechQuestionnaireCompleted,
    isLoading: techLoading,
    saveFavoriteTech,
    markQuestionnaireCompleted: markTechQuestionnaireCompleted,
    removeTech,
  } = useFavoriteTech();

  // Show team selection modal if questionnaire not completed
  useEffect(() => {
    if (!teamsLoading && !isQuestionnaireCompleted) {
      setShowTeamModal(true);
    }
  }, [teamsLoading, isQuestionnaireCompleted]);

  // Show tech selection modal if questionnaire not completed
  useEffect(() => {
    if (!techLoading && !isTechQuestionnaireCompleted) {
      setShowTechModal(true);
    }
  }, [techLoading, isTechQuestionnaireCompleted]);

  const handleTeamSelectionComplete = (teams: any) => {
    saveFavoriteTeams(teams);
    markQuestionnaireCompleted();
    setShowTeamModal(false);
  };

  const handleTechSelectionComplete = (tech: any) => {
    saveFavoriteTech(tech);
    markTechQuestionnaireCompleted();
    setShowTechModal(false);
  };

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
      {/* Header with Favorite Teams and Tech */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="p-6 space-y-6">
          <FavoriteTeamsBubbles
            favoriteTeams={favoriteTeams}
            onRemoveTeam={handleRemoveTeam}
            onEditTeams={handleEditTeams}
          />
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <FavoriteTechBubbles
              favoriteTech={favoriteTech}
              onRemoveTech={handleRemoveTech}
              onEditTech={handleEditTech}
            />
          </div>
        </div>
      </div>

      {/* Side-by-side Search Interfaces */}
      <div className="flex h-[calc(100vh-200px)]">
        {/* Left Side - Sports News */}
        <div className="flex-1 border-r border-gray-200 dark:border-gray-700 overflow-y-auto bg-white dark:bg-gray-800">
          <div className="p-6">
            <SportsSearch />
          </div>
        </div>

        {/* Right Side - Tech News */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800">
          <div className="p-6">
            <TechSearch />
          </div>
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
