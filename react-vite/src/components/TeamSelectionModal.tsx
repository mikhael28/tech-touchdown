import React, { useState, useEffect } from 'react';
import { X, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { nfl, nba, mlb, nhl } from '../data/teams';

interface TeamSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (favoriteTeams: FavoriteTeams) => void;
}

interface FavoriteTeams {
  nfl: string[];
  nba: string[];
  mlb: string[];
  nhl: string[];
}

const sports = [
  { key: 'nfl', name: 'NFL', teams: nfl, color: 'bg-blue-500' },
  { key: 'nba', name: 'NBA', teams: nba, color: 'bg-orange-500' },
  { key: 'mlb', name: 'MLB', teams: mlb, color: 'bg-green-500' },
  { key: 'nhl', name: 'NHL', teams: nhl, color: 'bg-red-500' },
] as const;

const TeamSelectionModal: React.FC<TeamSelectionModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentSportIndex, setCurrentSportIndex] = useState(0);
  const [selectedTeams, setSelectedTeams] = useState<FavoriteTeams>({
    nfl: [],
    nba: [],
    mlb: [],
    nhl: [],
  });

  const currentSport = sports[currentSportIndex];
  const isLastSport = currentSportIndex === sports.length - 1;
  const isFirstSport = currentSportIndex === 0;

  const handleTeamToggle = (teamShortName: string) => {
    const sportKey = currentSport.key;
    setSelectedTeams(prev => ({
      ...prev,
      [sportKey]: prev[sportKey].includes(teamShortName)
        ? prev[sportKey].filter(t => t !== teamShortName)
        : [...prev[sportKey], teamShortName]
    }));
  };

  const handleNext = () => {
    if (isLastSport) {
      onComplete(selectedTeams);
    } else {
      setCurrentSportIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstSport) {
      setCurrentSportIndex(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onComplete(selectedTeams);
  };

  const canProceed = selectedTeams[currentSport.key].length > 0 || isLastSport;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden">
        <Card className="bg-card border-0 shadow-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${currentSport.color} flex items-center justify-center text-white font-bold text-lg`}>
                  {currentSport.name}
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    Select Your Favorite {currentSport.name} Teams
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Choose all teams you want to follow (you can select multiple)
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Progress indicator */}
            <div className="flex items-center gap-2">
              {sports.map((sport, index) => (
                <div
                  key={sport.key}
                  className={`flex-1 h-2 rounded-full transition-colors ${
                    index <= currentSportIndex
                      ? sport.color
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            {/* Team grid */}
            <div className="max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                {currentSport.teams.map((team) => {
                  const isSelected = selectedTeams[currentSport.key].includes(team.short_name);
                  return (
                    <button
                      key={team.short_name}
                      onClick={() => handleTeamToggle(team.short_name)}
                      className={`group relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                        isSelected
                          ? 'border-primary bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50 hover:bg-gradient-to-br hover:from-muted/50 hover:to-muted/20'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-3">
                        <div className="relative">
                          <div className={`w-16 h-16 rounded-full ${isSelected ? 'bg-primary/10' : 'bg-muted/50'} flex items-center justify-center transition-colors duration-200`}>
                            <img
                              src={team.logo_url}
                              alt={team.name}
                              className="w-12 h-12 object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                          {isSelected && (
                            <div className="absolute -top-2 -right-2 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-lg animate-in zoom-in-50 duration-200">
                              <Check className="w-4 h-4 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="text-center space-y-1">
                          <p className="text-sm font-semibold text-foreground truncate max-w-24">
                            {team.short_name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate max-w-24 leading-tight">
                            {team.name.split(' ').pop()}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected teams summary */}
            {selectedTeams[currentSport.key].length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Selected:</span>
                {selectedTeams[currentSport.key].map(teamShortName => {
                  const team = currentSport.teams.find(t => t.short_name === teamShortName);
                  return (
                    <Badge key={teamShortName} variant="secondary" className="text-xs">
                      {team?.short_name}
                    </Badge>
                  );
                })}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex gap-2">
                {!isFirstSport && (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Skip for now
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className="flex items-center gap-2"
                >
                  {isLastSport ? 'Complete' : 'Next'}
                  {!isLastSport && <ArrowRight className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamSelectionModal;
