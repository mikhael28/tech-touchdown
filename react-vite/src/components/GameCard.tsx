import React from 'react';
import { Game } from '../types/sports';

interface GameCardProps {
  game: Game;
  onGameClick?: (game: Game) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onGameClick }) => {
  const getStatusColor = (status: string, isLive: boolean, isCompleted: boolean) => {
    if (isLive) return 'text-warning font-bold';
    if (isCompleted) return 'text-muted-foreground';
    return 'text-primary font-semibold';
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
      className={`bg-card rounded-lg border border-border p-4 transition-all ${
        onGameClick ? 'hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] hover:border-primary/50 cursor-pointer' : 'hover:shadow-md'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {game.league}
        </span>
        <span className={`text-xs uppercase tracking-wide ${getStatusColor(game.gameStatus, game.isLive, game.isCompleted)}`}>
          {game.gameStatus}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            {game.awayTeam}
          </span>
          {game.awayScore !== null && (
            <span className="text-sm font-bold text-foreground tabular-nums">
              {game.awayScore}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            {game.homeTeam}
          </span>
          {game.homeScore !== null && (
            <span className="text-sm font-bold text-foreground tabular-nums">
              {game.homeScore}
            </span>
          )}
        </div>
      </div>

      {game.startTime && !game.isLive && !game.isCompleted && (
        <div className="mt-2 pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground">
            {game.startTime}
          </span>
        </div>
      )}

      {game.broadcast && (
        <div className="mt-2 pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground">
            📺 {game.broadcast}
          </span>
        </div>
      )}
    </div>
  );
};

export default GameCard;