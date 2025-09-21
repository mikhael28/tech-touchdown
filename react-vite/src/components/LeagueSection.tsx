import React from 'react';
import { League, Game } from '../types/sports';
import GameCard from './GameCard';

interface LeagueSectionProps {
  league: League;
  onGameClick?: (game: Game) => void;
}

const LeagueSection: React.FC<LeagueSectionProps> = ({ league, onGameClick }) => {
  if (league.games.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        {league.name}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {league.games.map((game) => (
          <GameCard key={game.id} game={game} onGameClick={onGameClick} />
        ))}
      </div>
    </div>
  );
};

export default LeagueSection;