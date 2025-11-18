import React from 'react';
import { BettingLine } from '../types/gambling';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface OddsCardProps {
  odds: BettingLine;
  variant?: 'default' | 'compact' | 'live';
  showAllMarkets?: boolean;
}

const OddsCard: React.FC<OddsCardProps> = ({
  odds,
  variant = 'default',
  showAllMarkets = true,
}) => {
  const formatOdds = (value: number): string => {
    if (value > 0) return `+${value}`;
    return value.toString();
  };

  const formatSpread = (value: number): string => {
    if (value > 0) return `+${value}`;
    return value.toString();
  };

  const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();
    const diffHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < 1) {
      const diffMins = Math.floor((date.getTime() - now.getTime()) / (1000 * 60));
      return `Starting in ${diffMins}m`;
    }
    if (diffHours < 24) {
      return `Today ${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })}`;
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (variant === 'compact') {
    return (
      <div className="border border-border rounded-lg p-3 hover:bg-muted/30 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {odds.awayTeamLogo && (
                <img src={odds.awayTeamLogo} alt={odds.awayTeam} className="h-5 w-5 object-contain" />
              )}
              <span className="text-sm font-medium text-foreground">{odds.awayTeam}</span>
            </div>
            <div className="flex items-center gap-2">
              {odds.homeTeamLogo && (
                <img src={odds.homeTeamLogo} alt={odds.homeTeam} className="h-5 w-5 object-contain" />
              )}
              <span className="text-sm font-medium text-foreground">{odds.homeTeam}</span>
            </div>
          </div>
          {odds.moneyline && (
            <div className="text-right">
              <div className="text-sm font-bold text-primary">{formatOdds(odds.moneyline.away)}</div>
              <div className="text-sm font-bold text-primary">{formatOdds(odds.moneyline.home)}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="hover:shadow-lg hover:shadow-primary/10 transition-all hover:border-primary/30">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="bg-muted font-semibold">
            {odds.league}
          </Badge>
          <span className="text-xs text-muted-foreground">{formatTime(odds.commenceTime)}</span>
        </div>

        {/* Teams */}
        <div className="space-y-3 mb-4">
          {/* Away Team */}
          <div className="flex items-center gap-3">
            {odds.awayTeamLogo && (
              <div className="h-10 w-10 flex items-center justify-center bg-background rounded-full">
                <img
                  src={odds.awayTeamLogo}
                  alt={odds.awayTeam}
                  className="h-8 w-8 object-contain"
                />
              </div>
            )}
            <span className="text-sm font-semibold text-foreground flex-1">{odds.awayTeam}</span>
          </div>

          {/* Home Team */}
          <div className="flex items-center gap-3">
            {odds.homeTeamLogo && (
              <div className="h-10 w-10 flex items-center justify-center bg-background rounded-full">
                <img
                  src={odds.homeTeamLogo}
                  alt={odds.homeTeam}
                  className="h-8 w-8 object-contain"
                />
              </div>
            )}
            <span className="text-sm font-semibold text-foreground flex-1">{odds.homeTeam}</span>
          </div>
        </div>

        {/* Betting Markets */}
        {showAllMarkets && (
          <div className="space-y-3">
            {/* Moneyline */}
            {odds.moneyline && (
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  Moneyline
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-background hover:bg-primary/10 border border-border hover:border-primary transition-all rounded px-3 py-2 text-center">
                    <div className="text-xs text-muted-foreground mb-1">{odds.awayTeam}</div>
                    <div className="text-sm font-bold text-primary">{formatOdds(odds.moneyline.away)}</div>
                  </button>
                  <button className="bg-background hover:bg-primary/10 border border-border hover:border-primary transition-all rounded px-3 py-2 text-center">
                    <div className="text-xs text-muted-foreground mb-1">{odds.homeTeam}</div>
                    <div className="text-sm font-bold text-primary">{formatOdds(odds.moneyline.home)}</div>
                  </button>
                </div>
                <div className="text-xs text-muted-foreground mt-2 text-center">
                  via {odds.moneyline.bookmaker}
                </div>
              </div>
            )}

            {/* Spread */}
            {odds.spread && (
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  Spread
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-background hover:bg-secondary/10 border border-border hover:border-secondary transition-all rounded px-3 py-2 text-center">
                    <div className="text-xs text-muted-foreground mb-1">{odds.awayTeam}</div>
                    <div className="text-sm font-bold text-secondary">
                      {formatSpread(odds.spread.away)} ({formatOdds(odds.spread.awayOdds)})
                    </div>
                  </button>
                  <button className="bg-background hover:bg-secondary/10 border border-border hover:border-secondary transition-all rounded px-3 py-2 text-center">
                    <div className="text-xs text-muted-foreground mb-1">{odds.homeTeam}</div>
                    <div className="text-sm font-bold text-secondary">
                      {formatSpread(odds.spread.home)} ({formatOdds(odds.spread.homeOdds)})
                    </div>
                  </button>
                </div>
                <div className="text-xs text-muted-foreground mt-2 text-center">
                  via {odds.spread.bookmaker}
                </div>
              </div>
            )}

            {/* Totals (Over/Under) */}
            {odds.totals && (
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  Total Points
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-background hover:bg-accent/10 border border-border hover:border-accent transition-all rounded px-3 py-2 text-center">
                    <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Over {odds.totals.line}
                    </div>
                    <div className="text-sm font-bold text-accent">{formatOdds(odds.totals.over)}</div>
                  </button>
                  <button className="bg-background hover:bg-accent/10 border border-border hover:border-accent transition-all rounded px-3 py-2 text-center">
                    <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
                      <TrendingDown className="h-3 w-3" />
                      Under {odds.totals.line}
                    </div>
                    <div className="text-sm font-bold text-accent">{formatOdds(odds.totals.under)}</div>
                  </button>
                </div>
                <div className="text-xs text-muted-foreground mt-2 text-center">
                  via {odds.totals.bookmaker}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OddsCard;
