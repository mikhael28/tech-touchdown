import React from 'react';
import SearchInterface from './SearchInterface';
import FavoriteTeamsBubbles from './FavoriteTeamsBubbles';
import { useFavoriteTeams } from '../hooks/useFavoriteTeams';

interface FavoriteTeams {
  nfl: string[];
  nba: string[];
  mlb: string[];
  nhl: string[];
}

interface SportsSearchProps {
  onEditTeams: () => void;
}

const SportsSearch: React.FC<SportsSearchProps> = ({ onEditTeams }) => {
  const {
    favoriteTeams,
    removeTeam,
  } = useFavoriteTeams();

  const handleRemoveTeam = (sport: keyof FavoriteTeams, teamShortName: string) => {
    removeTeam(sport, teamShortName);
  };

  // onEditTeams is now passed as a prop from the parent Dashboard component

  return (
    <div className="h-full flex flex-col">
      {/* Favorite Teams Bubbles Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <FavoriteTeamsBubbles
          favoriteTeams={favoriteTeams}
          onRemoveTeam={handleRemoveTeam}
          onEditTeams={onEditTeams}
        />
      </div>
      
      {/* Search Interface Section */}
      <div className="flex-1 overflow-hidden">
        <SearchInterface
          title="🏈 Sports News"
          placeholder="Search for sports articles, news, or any topic..."
          defaultQuery="What are the latest headlines in the NFL, NBA, MLB, and NHL?"
          className="h-full"
        />
      </div>
    </div>
  );
};

export default SportsSearch;
