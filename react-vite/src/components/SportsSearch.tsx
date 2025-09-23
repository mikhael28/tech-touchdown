import React, { useState } from 'react';
import SearchInterface from './SearchInterface';
import FavoriteTeamsBubbles from './FavoriteTeamsBubbles';
import { nfl, nba, mlb, nhl } from '../data/teams';

interface FavoriteTeams {
  nfl: string[];
  nba: string[];
  mlb: string[];
  nhl: string[];
}

interface SportsSearchProps {
  onEditTeams: () => void;
  favoriteTeams: FavoriteTeams;
  onRemoveTeam: (sport: keyof FavoriteTeams, teamShortName: string) => void;
}

const SportsSearch: React.FC<SportsSearchProps> = ({ onEditTeams, favoriteTeams, onRemoveTeam }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Team item click handler
  const handleTeamItemClick = (sport: keyof FavoriteTeams, teamShortName: string) => {
    const sportConfig = {
      nfl: { teams: nfl, label: 'NFL' },
      nba: { teams: nba, label: 'NBA' },
      mlb: { teams: mlb, label: 'MLB' },
      nhl: { teams: nhl, label: 'NHL' },
    };
    
    const config = sportConfig[sport];
    const team = config.teams.find((team: any) => team.short_name === teamShortName);
    
    if (team) {
      const focusedQuery = `${team.name} ${config.label} news articles latest updates`;
      setSearchQuery(focusedQuery);
    }
  };

  // onEditTeams is now passed as a prop from the parent Dashboard component

  return (
    <div className="h-full flex flex-col">
      {/* Favorite Teams Bubbles Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <FavoriteTeamsBubbles
          favoriteTeams={favoriteTeams}
          onRemoveTeam={onRemoveTeam}
          onEditTeams={onEditTeams}
          onTeamItemClick={handleTeamItemClick}
        />
      </div>
      
      {/* Search Interface Section */}
      <div className="flex-1 overflow-y-auto">
        <SearchInterface
          title="🏈 Sports News"
          placeholder="Search for sports articles, news, or any topic..."
          defaultQuery="What are the latest headlines in the NFL, NBA, MLB, and NHL?"
          className="h-full"
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
};

export default SportsSearch;
