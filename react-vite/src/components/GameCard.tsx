import React from 'react';
import { Game } from '../types/sports';

interface GameCardProps {
  game: Game;
  onGameClick?: (game: Game) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onGameClick }) => {
  const getStatusColor = (status: string, isLive: boolean, isCompleted: boolean) => {
    if (isLive) return 'text-red-500';
    if (isCompleted) return 'text-gray-500';
    return 'text-blue-500';
  };

  const formatScore = (homeScore: number | null, awayScore: number | null) => {
    if (homeScore === null || awayScore === null) return '';
    return `${awayScore} - ${homeScore}`;
  };

  const handleClick = () => {
    if (onGameClick) {
      onGameClick(game);
    }
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 transition-all ${
        onGameClick ? 'hover:shadow-md hover:scale-[1.02] cursor-pointer' : 'hover:shadow-md'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {game.league}
        </span>
        <span className={`text-xs font-medium ${getStatusColor(game.gameStatus, game.isLive, game.isCompleted)}`}>
          {game.gameStatus}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {game.awayTeam}
          </span>
          {game.awayScore !== null && (
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {game.awayScore}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {game.homeTeam}
          </span>
          {game.homeScore !== null && (
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {game.homeScore}
            </span>
          )}
        </div>
      </div>

      {game.startTime && !game.isLive && !game.isCompleted && (
        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {game.startTime}
          </span>
        </div>
      )}

      {game.broadcast && (
        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            📺 {game.broadcast}
          </span>
        </div>
      )}
    </div>
  );
};

export default GameCard;