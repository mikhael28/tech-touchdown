import React from 'react';
import { HotGame } from '../types/gambling';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Flame, TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface HotGameCardProps {
  hotGame: HotGame;
  onClick?: () => void;
}

const HotGameCard: React.FC<HotGameCardProps> = ({ hotGame, onClick }) => {
  const formatOdds = (value: number): string => {
    if (value > 0) return `+${value}`;
    return value.toString();
  };

  const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();
    const diffHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < 1) {
      const diffMins = Math.floor((date.getTime() - now.getTime()) / (1000 * 60));
      return `${diffMins}m`;
    }
    if (diffHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getMoneyMovementIcon = () => {
    if (hotGame.moneyMovement === 'home') return <TrendingUp className="h-4 w-4 text-accent" />;
    if (hotGame.moneyMovement === 'away') return <TrendingDown className="h-4 w-4 text-warning" />;
    return <Activity className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <Card
      className={`hover:shadow-lg hover:shadow-warning/20 transition-all hover:border-warning/50 ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* Header with Hot Badge */}
        <div className="flex items-center justify-between mb-3">
          <Badge className="bg-warning text-warning-foreground font-semibold gap-1">
            <Flame className="h-3 w-3" />
            HOT
          </Badge>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">{hotGame.league}</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{formatTime(hotGame.commenceTime)}</span>
          </div>
        </div>

        {/* Trending Reason */}
        <div className="mb-3 flex items-start gap-2">
          {getMoneyMovementIcon()}
          <p className="text-xs font-medium text-muted-foreground italic">{hotGame.trendingReason}</p>
        </div>

        {/* Teams and Moneyline */}
        <div className="space-y-2 mb-3">
          {/* Away Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              {hotGame.odds.awayTeamLogo && (
                <img
                  src={hotGame.odds.awayTeamLogo}
                  alt={hotGame.awayTeam}
                  className="h-6 w-6 object-contain"
                />
              )}
              <span className="text-sm font-semibold text-foreground">{hotGame.awayTeam}</span>
            </div>
            {hotGame.odds.moneyline && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-primary">
                  {formatOdds(hotGame.odds.moneyline.away)}
                </span>
                {hotGame.moneyMovement === 'away' && (
                  <div className="h-2 w-2 bg-warning rounded-full animate-pulse" />
                )}
              </div>
            )}
          </div>

          {/* Home Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              {hotGame.odds.homeTeamLogo && (
                <img
                  src={hotGame.odds.homeTeamLogo}
                  alt={hotGame.homeTeam}
                  className="h-6 w-6 object-contain"
                />
              )}
              <span className="text-sm font-semibold text-foreground">{hotGame.homeTeam}</span>
            </div>
            {hotGame.odds.moneyline && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-primary">
                  {formatOdds(hotGame.odds.moneyline.home)}
                </span>
                {hotGame.moneyMovement === 'home' && (
                  <div className="h-2 w-2 bg-warning rounded-full animate-pulse" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Betting Percentages */}
        {hotGame.betPercentage && (
          <div className="pt-3 border-t border-border">
            <div className="text-xs font-medium text-muted-foreground mb-2">Public Betting</div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                    style={{ width: `${hotGame.betPercentage.away}%` }}
                  />
                </div>
              </div>
              <div className="flex gap-3 text-xs font-semibold">
                <span className="text-foreground">{hotGame.betPercentage.away}%</span>
                <span className="text-muted-foreground">-</span>
                <span className="text-foreground">{hotGame.betPercentage.home}%</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HotGameCard;
