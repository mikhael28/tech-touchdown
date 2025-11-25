import React, { useState } from 'react';
import { useGameStats } from '../hooks/useGameStats';
import { Game } from '../types/sports';
import { 
  Trophy, 
  TrendingUp, 
  Users, 
  Activity, 
  Target,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface AdvancedStatsProps {
  game: Game;
}

const AdvancedStats: React.FC<AdvancedStatsProps> = ({ game }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'teamStats' | 'playerStats'>('overview');
  
  // Determine sport and league for ESPN API
  const getSportLeague = (league: string) => {
    const map: Record<string, { sport: string; league: string }> = {
      'NFL': { sport: 'football', league: 'nfl' },
      'NBA': { sport: 'basketball', league: 'nba' },
      'MLB': { sport: 'baseball', league: 'mlb' },
      'NHL': { sport: 'hockey', league: 'nhl' },
    };
    return map[league] || { sport: 'football', league: league.toLowerCase() };
  };

  const { sport, league } = getSportLeague(game.league);
  const { data, loading, error, refetch } = useGameStats({
    gameId: game.id,
    sport,
    league,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading advanced stats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
              Error loading stats
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">
              {error}
            </p>
            <button
              onClick={refetch}
              className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.data?.summary?.boxscore) {
    return (
      <div className="text-center py-12">
        <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No advanced stats available
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Detailed statistics are not available for this game yet.
        </p>
      </div>
    );
  }

  const { summary } = data.data;
  const teamStats = summary?.boxscore?.teams || [];
  const playerStats = summary?.boxscore?.players || [];
  const leaders = summary?.leaders || [];

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Advanced Statistics
        </h2>
        <button
          onClick={refetch}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          title="Refresh stats"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Trophy className="h-4 w-4 mr-2" />
              Overview
            </div>
          </button>
          <button
            onClick={() => setActiveTab('teamStats')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'teamStats'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Team Stats
            </div>
          </button>
          <button
            onClick={() => setActiveTab('playerStats')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'playerStats'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Player Stats
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <OverviewTab leaders={leaders} teamStats={teamStats} />
        )}
        {activeTab === 'teamStats' && (
          <TeamStatsTab teamStats={teamStats} />
        )}
        {activeTab === 'playerStats' && (
          <PlayerStatsTab playerStats={playerStats} league={game.league} />
        )}
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab: React.FC<{ leaders: any[]; teamStats: any[] }> = ({ leaders, teamStats }) => {
  return (
    <div className="space-y-6">
      {/* Game Leaders */}
      {leaders && leaders.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-blue-500" />
            Game Leaders
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leaders.map((leader, idx) => {
              if (!leader) return null;
              
              return (
                <div key={idx} className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    {leader.displayName || 'Unknown'}
                  </h4>
                  {leader.leaders && Array.isArray(leader.leaders) && leader.leaders.map((l: any, lidx: number) => {
                    if (!l || !l.athlete) return null;
                    
                    return (
                      <div key={lidx} className="flex items-center space-x-3">
                        {l.athlete?.headshot?.href && (
                          <img
                            src={l.athlete.headshot.href}
                            alt={l.athlete?.displayName || 'Player'}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {l.athlete?.shortName || l.athlete?.displayName || 'Unknown'}
                          </p>
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {l.displayValue || '-'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Team Comparison */}
      {teamStats && teamStats.length >= 2 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Key Stats Comparison
          </h3>
          <div className="space-y-4">
            {getKeyStats(teamStats).map((stat, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {stat.label}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {stat.awayValue}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {stat.awayTeam}
                    </p>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${stat.awayPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {stat.homeValue}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {stat.homeTeam}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Team Stats Tab Component
const TeamStatsTab: React.FC<{ teamStats: any[] }> = ({ teamStats }) => {
  if (!teamStats || teamStats.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No team statistics available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {teamStats.map((team, idx) => {
        if (!team || !team.team || !team.statistics) return null;
        
        return (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {team.team?.displayName || 'Unknown Team'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.isArray(team.statistics) && team.statistics.map((stat: any, statIdx: number) => {
                if (!stat) return null;
                
                return (
                  <div
                    key={statIdx}
                    className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                  >
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
                      {stat.label || formatStatName(stat.name || 'stat')}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.displayValue || '-'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Player Stats Tab Component
const PlayerStatsTab: React.FC<{ playerStats: any[]; league: string }> = ({ playerStats, league }) => {
  if (!playerStats || playerStats.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No player statistics available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {playerStats.map((team, teamIdx) => {
        if (!team || !team.team || !team.statistics) return null;
        
        return (
          <div key={teamIdx} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white sticky top-0 bg-gray-50 dark:bg-gray-900 py-2 z-10">
              {team.team?.displayName || 'Unknown Team'}
            </h3>
            
            {Array.isArray(team.statistics) && team.statistics.map((category: any, catIdx: number) => {
              if (!category || !category.athletes || !Array.isArray(category.athletes) || category.athletes.length === 0) return null;
              
              return (
                <div
                  key={catIdx}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                      {category.displayName || category.name || 'Statistics'}
                    </h4>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-gray-900">
                            Player
                          </th>
                          {category.descriptions && Array.isArray(category.descriptions) && category.descriptions.map((desc: string, descIdx: number) => (
                            <th
                              key={descIdx}
                              className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                              {desc || '-'}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {category.athletes.map((athlete: any, athleteIdx: number) => {
                          if (!athlete || !athlete.athlete) return null;
                          
                          return (
                            <tr key={athleteIdx} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                              <td className="px-4 py-3 whitespace-nowrap sticky left-0 bg-white dark:bg-gray-800">
                                <div className="flex items-center space-x-3">
                                  {athlete.athlete?.headshot?.href && (
                                    <img
                                      src={athlete.athlete.headshot.href}
                                      alt={athlete.athlete?.displayName || 'Player'}
                                      className="w-8 h-8 rounded-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                  )}
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                      {athlete.athlete?.shortName || athlete.athlete?.displayName || 'Unknown'}
                                    </p>
                                    {athlete.athlete?.position?.abbreviation && (
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {athlete.athlete.position.abbreviation}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </td>
                              {athlete.stats && Array.isArray(athlete.stats) && athlete.stats.map((stat: string, statIdx: number) => (
                                <td
                                  key={statIdx}
                                  className="px-3 py-3 whitespace-nowrap text-center text-sm text-gray-900 dark:text-white font-medium"
                                >
                                  {stat !== null && stat !== undefined ? stat : '-'}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

// Helper Functions
function formatStatName(name: string): string {
  if (!name) return 'Stat';
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function getKeyStats(teamStats: any[]): any[] {
  if (!teamStats || teamStats.length < 2) return [];

  const awayTeam = teamStats[0];
  const homeTeam = teamStats[1];

  if (!awayTeam || !homeTeam || !awayTeam.statistics || !homeTeam.statistics) return [];

  // Map stat names to display labels
  const keyStatNames = [
    'totalYards',
    'passingYards',
    'rushingYards',
    'turnovers',
    'possessionTime',
    'thirdDownEff',
  ];

  const stats: any[] = [];

  keyStatNames.forEach((statName) => {
    if (!Array.isArray(awayTeam.statistics) || !Array.isArray(homeTeam.statistics)) return;
    
    const awayStat = awayTeam.statistics.find((s: any) => s && s.name === statName);
    const homeStat = homeTeam.statistics.find((s: any) => s && s.name === statName);

    if (awayStat && homeStat && awayStat.displayValue && homeStat.displayValue) {
      const awayValue = parseFloat(String(awayStat.displayValue).replace(/[^0-9.-]/g, '')) || 0;
      const homeValue = parseFloat(String(homeStat.displayValue).replace(/[^0-9.-]/g, '')) || 0;
      const total = awayValue + homeValue;
      
      stats.push({
        label: awayStat.label || formatStatName(statName),
        awayValue: awayStat.displayValue,
        homeValue: homeStat.displayValue,
        awayTeam: awayTeam.team?.abbreviation || 'Away',
        homeTeam: homeTeam.team?.abbreviation || 'Home',
        awayPercentage: total > 0 ? (awayValue / total) * 100 : 50,
      });
    }
  });

  return stats;
}

export default AdvancedStats;
