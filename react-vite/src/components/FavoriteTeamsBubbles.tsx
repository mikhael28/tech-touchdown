import React from "react";
import { nfl, nba, mlb, nhl } from "../data/teams";
import FavoriteItemsBubbles from "./FavoriteItemsBubbles";

interface FavoriteTeamsBubblesProps {
  favoriteTeams: FavoriteTeams;
  onRemoveTeam: (sport: keyof FavoriteTeams, teamShortName: string) => void;
  onEditTeams: () => void;
  onTeamItemClick?: (sport: keyof FavoriteTeams, teamShortName: string) => void;
}

interface FavoriteTeams {
  nfl: string[];
  nba: string[];
  mlb: string[];
  nhl: string[];
}

const sportConfig = {
  nfl: { items: nfl, color: "bg-primary", label: "NFL" },
  nba: { items: nba, color: "bg-secondary", label: "NBA" },
  mlb: { items: mlb, color: "bg-accent", label: "MLB" },
  nhl: { items: nhl, color: "bg-warning", label: "NHL" },
} as const;

const FavoriteTeamsBubbles: React.FC<FavoriteTeamsBubblesProps> = ({
  favoriteTeams,
  onRemoveTeam,
  onEditTeams,
  onTeamItemClick,
}) => {
  return (
    <FavoriteItemsBubbles
      type="sports"
      title="Your Favorite Teams"
      emptyIcon="🏈"
      emptyTitle="No favorite teams selected"
      emptyDescription="Choose your favorite teams to get personalized content"
      editButtonText="Edit Teams"
      favoriteItems={favoriteTeams}
      categoryConfig={sportConfig}
      onRemoveItem={onRemoveTeam}
      onEdit={onEditTeams}
      onItemClick={onTeamItemClick}
    />
  );
};

export default FavoriteTeamsBubbles;
