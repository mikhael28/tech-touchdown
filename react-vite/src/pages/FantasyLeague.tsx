import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import DraftBoard from '../components/DraftBoard';
import { useFantasyLeague } from '../contexts/FantasyLeagueContext';
import {
  Users,
  Trophy,
  Target,
  Crown,
  Star,
  TrendingUp,
  Calendar,
  Zap,
  Building2,
  Timer,
  Award,
  RotateCcw,
  CheckCircle,
  Clock,
  Eye,
  BarChart3
} from 'lucide-react';

const FantasyLeague: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'league' | 'draft' | 'my-team' | 'leaderboard' | 'review-teams'>('league');
  const [selectedTeamForReview, setSelectedTeamForReview] = useState<string | null>(null);

  const {
    teams,
    draftState,
    startDraft,
    draftCompany,
    loadSavedLeague,
    clearLeague,
    myTeam
  } = useFantasyLeague();

  // Auto-load saved league on mount
  useEffect(() => {
    const loaded = loadSavedLeague();
    if (loaded && draftState.isComplete) {
      setActiveTab('my-team');
    }
  }, []);

  const getVerticalColor = (vertical: string) => {
    const colors: { [key: string]: string } = {
      'B2B': 'bg-blue-500',
      'Healthcare': 'bg-green-500',
      'Fintech': 'bg-yellow-500',
      'Consumer': 'bg-purple-500',
      'Industrials': 'bg-orange-500',
      'Education': 'bg-pink-500',
      'Government': 'bg-gray-500',
      'Construction': 'bg-brown-500',
      '': 'bg-slate-500'
    };
    return colors[vertical] || 'bg-slate-500';
  };

  const currentTeam = draftState.draftOrder[(draftState.currentPick - 1) % draftState.draftOrder.length];
  const isMyTurn = currentTeam === 'You' && draftState.isActive;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Fantasy Startup League
            </h1>
            <p className="text-muted-foreground">
              YC Winter 2025 Batch • Round {draftState.roundsCompleted + 1}/{draftState.totalRounds}
              {draftState.isComplete && ' • Draft Complete!'}
            </p>
          </div>
        </div>

        {/* League Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">League Size</p>
                  <p className="text-2xl font-bold text-blue-600">{teams.length} Teams</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Available Startups</p>
                  <p className="text-2xl font-bold text-green-600">{draftState.availableCompanies.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Your Rank</p>
                  <p className="text-2xl font-bold text-purple-600">#{myTeam?.rank || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Your Companies</p>
                  <p className="text-2xl font-bold text-orange-600">{myTeam?.companies.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Draft Status Alert */}
        {draftState.isComplete && (
          <Card className="mb-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6" />
                <div>
                  <h3 className="font-bold">Draft Complete!</h3>
                  <p className="opacity-90">
                    Your fantasy startup portfolio is ready. Check out your team and compare with others!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isMyTurn && (
          <Card className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6" />
                <div>
                  <h3 className="font-bold">Your Turn to Draft!</h3>
                  <p className="opacity-90">
                    Pick #{draftState.currentPick} • Round {draftState.roundsCompleted + 1}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'league', label: 'League Home', icon: Trophy },
          { id: 'draft', label: 'Draft Room', icon: Target },
          { id: 'my-team', label: 'My Team', icon: Star },
          { id: 'review-teams', label: 'Review Teams', icon: Eye },
          { id: 'leaderboard', label: 'Leaderboard', icon: Crown }
        ].map(tab => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'outline'}
            onClick={() => setActiveTab(tab.id as any)}
            className="flex items-center gap-2"
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'league' && (
        <div className="space-y-6">
          {/* Draft Status */}
          <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6" />
                  <div>
                    <h3 className="text-xl font-bold">
                      {draftState.isComplete ? 'Draft Complete!' :
                       draftState.isActive ? 'Draft in Progress!' : 'Ready to Draft?'}
                    </h3>
                    <p className="opacity-90">
                      {draftState.isComplete
                        ? `All ${draftState.totalRounds} rounds completed! Review your team and compare with others.`
                        : draftState.isActive
                        ? `Pick ${draftState.currentPick} - ${currentTeam}'s turn (Round ${draftState.roundsCompleted + 1})`
                        : 'Start your fantasy startup league with YC Winter 2025 companies'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!draftState.isActive && !draftState.isComplete && (
                    <Button
                      onClick={startDraft}
                      variant="secondary"
                      size="lg"
                      className="bg-white text-purple-600 hover:bg-gray-100"
                    >
                      Start Draft
                    </Button>
                  )}
                  {(draftState.isActive || draftState.isComplete) && (
                    <Button
                      onClick={clearLeague}
                      variant="secondary"
                      size="lg"
                      className="bg-white text-purple-600 hover:bg-gray-100"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset League
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Draft Activity
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {draftState.pickedCompanies.slice(-8).reverse().map((company, index) => {
                  const pickNumber = draftState.pickedCompanies.length - index;
                  const teamIndex = (pickNumber - 1) % draftState.draftOrder.length;
                  const draftingTeam = draftState.draftOrder[teamIndex];

                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-bold">
                        {pickNumber}
                      </div>
                      <img
                        src={company.image_url}
                        alt={company.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{company.name}</p>
                          <span className="text-sm text-muted-foreground">
                            drafted by {draftingTeam === 'You' ? 'You' : draftingTeam}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{company.description}</p>
                      </div>
                      <Badge variant="secondary" className={`${getVerticalColor(company.vertical)} text-white`}>
                        {company.vertical || 'Other'}
                      </Badge>
                    </div>
                  );
                })}
                {draftState.pickedCompanies.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">
                    No companies drafted yet. Start the draft to see activity!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'draft' && (
        <div className="space-y-6">
          {!draftState.isActive && !draftState.isComplete ? (
            <Card className="text-center py-12">
              <CardContent>
                <Target className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Draft Not Started</h3>
                <p className="text-muted-foreground mb-4">
                  Ready to begin drafting your fantasy startup team?
                </p>
                <Button onClick={startDraft} size="lg">
                  <Zap className="w-4 h-4 mr-2" />
                  Start Draft
                </Button>
              </CardContent>
            </Card>
          ) : draftState.isComplete ? (
            <Card className="text-center py-12">
              <CardContent>
                <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Draft Complete!</h3>
                <p className="text-muted-foreground mb-4">
                  All {draftState.totalRounds} rounds have been completed. Check out the results!
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => setActiveTab('my-team')} size="lg">
                    View My Team
                  </Button>
                  <Button onClick={() => setActiveTab('review-teams')} variant="outline" size="lg">
                    Review All Teams
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <DraftBoard
              availableCompanies={draftState.availableCompanies}
              onDraftCompany={draftCompany}
              currentPick={draftState.currentPick}
              draftOrder={draftState.draftOrder}
              pickedCompanies={draftState.pickedCompanies}
            />
          )}
        </div>
      )}

      {activeTab === 'my-team' && (
        <div className="space-y-6">
          {/* Team Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Team Score</p>
                    <p className="text-2xl font-bold text-blue-600">{myTeam?.points || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Companies</p>
                    <p className="text-2xl font-bold text-green-600">{myTeam?.companies.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Score</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {myTeam?.companies.length ? Math.round(myTeam.points / myTeam.companies.length) : 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Composition */}
          {myTeam && myTeam.companies.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Portfolio Breakdown</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(
                    myTeam!.companies.reduce((acc, company) => {
                      const vertical = company.vertical || 'Other';
                      acc[vertical] = (acc[vertical] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([vertical, count]) => (
                    <div
                      key={vertical}
                      className="text-center p-3 rounded-lg border"
                    >
                      <div className={`w-8 h-8 mx-auto mb-2 rounded-full ${getVerticalColor(vertical)}`}></div>
                      <p className="font-semibold text-sm">{vertical}</p>
                      <p className="text-xs text-muted-foreground">{count} companies</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* My Companies */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  My Companies
                </h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Timer className="w-4 h-4 mr-2" />
                    Trade
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trophy className="w-4 h-4 mr-2" />
                    Waivers
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {myTeam?.companies.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h4 className="text-lg font-semibold mb-2">No Companies Yet</h4>
                  <p className="text-muted-foreground">
                    {draftState.isActive ? 'Go to the Draft Room to pick your companies!' : 'Start drafting to build your fantasy startup portfolio!'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myTeam?.companies.map((company, index) => {
                    const mockScore = Math.floor(Math.random() * 100) + 50;
                    const mockChange = Math.floor(Math.random() * 20) - 10;

                    return (
                      <Card key={index} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={company.image_url}
                              alt={company.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-lg">{company.name}</h4>
                                <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                  Pick #{index + 1}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {company.description}
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="secondary"
                                  className={`${getVerticalColor(company.vertical)} text-white`}
                                >
                                  {company.vertical || 'Other'}
                                </Badge>
                                {company['sub-vertical'] && (
                                  <Badge variant="outline" className="text-xs">
                                    {company['sub-vertical']}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl font-bold">{mockScore}</span>
                                <span className={`text-sm ${mockChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                  {mockChange >= 0 ? '+' : ''}{mockChange}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">Fantasy Points</p>
                              <Button variant="outline" size="sm" className="mt-2">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'review-teams' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Team Comparison
              </h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                {teams.map((team) => (
                  <Button
                    key={team.id}
                    variant={selectedTeamForReview === team.owner ? 'default' : 'outline'}
                    onClick={() => setSelectedTeamForReview(team.owner)}
                    className="flex flex-col gap-1 h-auto p-3"
                  >
                    <span className="font-semibold text-sm">{team.name}</span>
                    <span className="text-xs opacity-70">
                      {team.companies.length} companies
                    </span>
                  </Button>
                ))}
              </div>

              {selectedTeamForReview && (
                <div>
                  {(() => {
                    const selectedTeam = teams.find(t => t.owner === selectedTeamForReview);
                    if (!selectedTeam) return null;

                    return (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div>
                            <h4 className="text-lg font-bold">{selectedTeam.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {selectedTeam.companies.length} companies • {selectedTeam.points} points
                            </p>
                          </div>
                          <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                            Rank #{selectedTeam.rank}
                          </Badge>
                        </div>

                        {selectedTeam.companies.length === 0 ? (
                          <p className="text-center text-muted-foreground py-8">
                            This team hasn't drafted any companies yet.
                          </p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedTeam.companies.map((company, index) => (
                              <Card key={index}>
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-3">
                                    <img
                                      src={company.image_url}
                                      alt={company.name}
                                      className="w-12 h-12 rounded-lg object-cover"
                                    />
                                    <div className="flex-1">
                                      <h5 className="font-semibold">{company.name}</h5>
                                      <p className="text-sm text-muted-foreground mb-2">
                                        {company.description}
                                      </p>
                                      <Badge
                                        variant="secondary"
                                        className={`${getVerticalColor(company.vertical)} text-white text-xs`}
                                      >
                                        {company.vertical || 'Other'}
                                      </Badge>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {!selectedTeamForReview && (
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h4 className="text-lg font-semibold mb-2">Select a Team to Review</h4>
                  <p className="text-muted-foreground">
                    Click on any team above to see their drafted companies and strategy.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                League Leaderboard
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teams.map((team, index) => (
                  <div
                    key={team.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border ${
                      team.owner === 'You' ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800' : 'bg-muted'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                      index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-orange-600 text-white' :
                      'bg-muted-foreground text-white'
                    }`}>
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{team.name}</p>
                        {team.owner === 'You' && (
                          <Badge variant="secondary" className="bg-blue-500 text-white">You</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {team.companies.length} companies drafted
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-lg">{team.points.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTeamForReview(team.owner);
                        setActiveTab('review-teams');
                      }}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FantasyLeague;