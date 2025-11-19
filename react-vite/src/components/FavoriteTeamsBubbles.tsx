import React from "react";
import { X } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { nfl, nba, mlb, nhl } from "../data/teams";

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
  nfl: { teams: nfl, color: "bg-primary", label: "NFL" },
  nba: { teams: nba, color: "bg-secondary", label: "NBA" },
  mlb: { teams: mlb, color: "bg-accent", label: "MLB" },
  nhl: { teams: nhl, color: "bg-warning", label: "NHL" },
} as const;

const FavoriteTeamsBubbles: React.FC<FavoriteTeamsBubblesProps> = ({
  favoriteTeams,
  onRemoveTeam,
  onEditTeams,
  onTeamItemClick,
}) => {
  const getTeamInfo = (sport: keyof FavoriteTeams, teamShortName: string) => {
    const config = sportConfig[sport];
    return config.teams.find((team) => team.short_name === teamShortName);
  };

  const hasAnyTeams = Object.values(favoriteTeams).some(
    (teams) => teams.length > 0
  );

  if (!hasAnyTeams) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <span className="text-2xl">🏈</span>
          </div>
          <div className="space-y-2">
            <p className="text-lg text-muted-foreground">
              No favorite teams selected
            </p>
            <p className="text-sm text-muted-foreground">
              Choose your favorite teams to get personalized content
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onEditTeams}
            className="mt-4"
          >
            Select Teams
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Your Favorite Teams</h3>
        <Button variant="outline" size="sm" onClick={onEditTeams}>
          Edit Teams
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(favoriteTeams).map(([sport, teams]) => {
          if (teams.length === 0) return null;

          return teams.map((teamShortName: string) => {
            const team = getTeamInfo(
              sport as keyof FavoriteTeams,
              teamShortName
            );
            if (!team) return null;

            const config = sportConfig[sport as keyof FavoriteTeams];

            return (
              <div
                key={`${sport}-${teamShortName}`}
                className={`group relative inline-flex items-center gap-3 rounded-full border border-border bg-gradient-to-r from-muted to-muted/80 px-4 py-2 transition-all duration-200 hover:border-primary/30 hover:from-primary/10 hover:to-primary/5 hover:shadow-md ${
                  onTeamItemClick ? "cursor-pointer" : ""
                }`}
                onClick={() =>
                  onTeamItemClick?.(sport as keyof FavoriteTeams, teamShortName)
                }
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-background">
                  <img
                    src={team.logo_url}
                    alt={team.name}
                    className="h-5 w-5 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {team.short_name}
                </span>
                {/* <div className={`w-2 h-2 rounded-full ${config.color}`} title={config.label}></div> */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full p-0 opacity-0 transition-all duration-200 hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
                  onClick={() =>
                    onRemoveTeam(sport as keyof FavoriteTeams, teamShortName)
                  }
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            );
          });
        })}
      </div>
    </div>
  );
};

export default FavoriteTeamsBubbles;
