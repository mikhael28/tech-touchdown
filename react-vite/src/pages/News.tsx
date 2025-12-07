import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "../components/ui/card";
import TeamSelectionModal from "../components/TeamSelectionModal";
import TechSelectionModal from "../components/TechSelectionModal";
import SportsSearch from "../components/SportsSearch";
import TechSearch from "../components/TechSearch";
import { useFavoriteTeams, FavoriteTeams } from "../hooks/useFavoriteTeams";
import { useFavoriteTech, FavoriteTech } from "../hooks/useFavoriteTech";

const News: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"sports" | "tech">("sports");
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
    if (
      !techLoading &&
      !isTechQuestionnaireCompleted &&
      isQuestionnaireCompleted &&
      !showTeamModal
    ) {
      setShowTechModal(true);
    }
  }, [
    techLoading,
    isTechQuestionnaireCompleted,
    isQuestionnaireCompleted,
    showTeamModal,
  ]);

  const handleTeamSelectionComplete = useCallback(
    (teams: any) => {
      saveFavoriteTeamsAndComplete(teams);
      setShowTeamModal(false);
    },
    [saveFavoriteTeamsAndComplete]
  );

  const handleTechSelectionComplete = useCallback(
    (tech: any) => {
      saveFavoriteTechAndComplete(tech);
      setShowTechModal(false);
    },
    [saveFavoriteTechAndComplete]
  );

  const handleEditTeams = () => {
    setShowTeamModal(true);
  };

  const handleEditTech = () => {
    setShowTechModal(true);
  };

  const handleRemoveTeam = (
    sport: keyof typeof favoriteTeams,
    teamShortName: string
  ) => {
    removeTeam(sport, teamShortName);
  };

  const handleRemoveTech = (
    category: keyof typeof favoriteTech,
    itemShortName: string
  ) => {
    removeTech(category, itemShortName);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Tab Navigation */}
      <div className="border-b border-border bg-card">
        <div className="flex">
          <button
            onClick={() => setActiveTab("sports")}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === "sports"
                ? "border-b-2 border-primary bg-background text-foreground"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            Sports News
          </button>
          <button
            onClick={() => setActiveTab("tech")}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === "tech"
                ? "border-b-2 border-primary bg-background text-foreground"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            Tech News
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="h-[calc(100vh-57px)] overflow-y-auto bg-card">
        {activeTab === "sports" ? (
          <SportsSearch
            onEditTeams={handleEditTeams}
            favoriteTeams={favoriteTeams}
            onRemoveTeam={handleRemoveTeam}
          />
        ) : (
          <TechSearch
            onEditTech={handleEditTech}
            favoriteTech={favoriteTech}
            onRemoveTech={handleRemoveTech}
          />
        )}
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

export default News;
