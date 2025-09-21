import React, { useState } from 'react';
import useSportsData from '../hooks/useSportsData';
import useJinaAI from '../hooks/useJinaAI';
import useSportsAI from '../hooks/useSportsAI';
import LeagueSection from '../components/LeagueSection';

// Utility function to clean and filter Jina API content for sports data
const cleanSportsContent = (content: string): string => {
  // Simply remove the ASCII walls and clean up the content
  let cleaned = content
    .replace(/\[\+[-+]+\+\s*\|\s*/g, '') // Remove opening ASCII wall and first pipe
    .replace(/\|\s*\+[-+]+\+\]/g, '') // Remove closing pipe and ASCII wall
    .replace(/^\s*\|/gm, '') // Remove any remaining leading pipes
    .replace(/^\s*[-+]+\s*$/gm, '') // Remove separator lines
    .replace(/^Title:.*$/gm, '') // Remove title
    .replace(/^URL Source:.*$/gm, '') // Remove URL source
    .replace(/^Published Time:.*$/gm, '') // Remove published time
    .replace(/^Markdown Content:.*$/gm, '') // Remove markdown content header
    .replace(/^\[< .*?\]\(.*?\)/gm, '') // Remove date navigation
    .replace(/^\[.*? >\]\(.*?\)$/gm, '') // Remove date navigation
    .replace(/^\*\*Leagues:\*\*.*$/gm, '') // Remove league links
    .replace(/^\*\*Intl\. Soccer:\*\*.*$/gm, '') // Remove international soccer links
    .replace(/^\*\*College:\*\*.*$/gm, '') // Remove college links
    .replace(/^\[.*?\]\(.*?\)$/gm, '') // Remove other links
    .replace(/^There are no.*games today\.$/gm, '') // Remove no games messages
    .replace(/^_Numbers by number of outs.*$/gm, '') // Remove explanatory text
    .replace(/^_Game links open.*$/gm, '') // Remove explanatory text
    .replace(/^\[Back to Top\].*$/gm, '') // Remove back to top
    .replace(/^Matchday \d+ matches are.*$/gm, '') // Remove matchday messages
    .replace(/^The league phase.*$/gm, '') // Remove league phase messages
    .replace(/^\[See all.*$/gm, '') // Remove see all links
    .replace(/^\s*$/gm, '') // Remove empty lines
    .replace(/\n{3,}/g, '\n\n') // Collapse multiple newlines
    .trim();

  return cleaned;
};

const Sports = () => {
  const { data, loading, error, refetch } = useSportsData();
  const { fetchJinaData, loading: jinaLoading, error: jinaError } = useJinaAI();
  const { generateSportsData, loading: sportsAILoading, error: sportsAIError, clearError } = useSportsAI();
  const [jinaUrl, setJinaUrl] = useState('https://plaintextsports.com/');
  const [jinaData, setJinaData] = useState<string | null>(null);
  const [processedSportsData, setProcessedSportsData] = useState<any>(null);

  const handleJinaFetch = async () => {
    if (!jinaUrl.trim()) return;
    
    const result = await fetchJinaData(jinaUrl.trim());
    if (result) {
      const cleanedData = cleanSportsContent(result.data);
      setJinaData(cleanedData);
      setProcessedSportsData(null); // Clear previous processed data
    }
  };

  const handleProcessWithAI = async () => {
    if (!jinaData) return;
    
    clearError(); // Clear any previous errors

    console.log(jinaData)
    
    const result = await generateSportsData({
      prompt: `Extract and structure sports game information from this web content: ${jinaData}`,
      // maxGames: 20,
      // includeCompleted: true,
      // includeScheduled: true,
      // includeLive: true
    });

    // @ts-ignore
    const parsedData = JSON.parse(result?.data ?? "[]");
    console.log(parsedData);
    
    if (result && result.data) {
      // Ensure we have an array of games
      const gamesArray = Array.isArray(parsedData) ? parsedData : [parsedData];
      
      // Group games by league
      const leaguesMap = new Map();
      gamesArray.forEach((game) => {
        if (!leaguesMap.has(game.league)) {
          leaguesMap.set(game.league, []);
        }
        leaguesMap.get(game.league).push(game);
      });

      const leagues = Array.from(leaguesMap.entries()).map(
        ([name, games]) => ({
          name,
          games,
        })
      );

      const sportsData = {
        leagues,
        lastUpdated: new Date().toISOString(),
        totalGames: gamesArray.length,
        totalLeagues: leagues.length,
      };
      
      setProcessedSportsData(sportsData);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error loading sports data
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
              <div className="mt-4">
                <button
                  onClick={refetch}
                  className="bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 text-red-800 dark:text-red-200 px-3 py-1 rounded text-sm font-medium"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Today's games and scores</p>
        </div>
        <button
          onClick={refetch}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
        >
          Refresh
        </button>
      </div>

      {/* Jina AI Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          AI-Powered Web Content Analysis
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Enter a URL to get AI-processed content using Jina AI
        </p>
        
        <div className="flex gap-3 mb-4">
          <input
            type="url"
            value={jinaUrl}
            onChange={(e) => setJinaUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            onClick={handleJinaFetch}
            disabled={jinaLoading || !jinaUrl.trim()}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium"
          >
            {jinaLoading ? 'Processing...' : 'Analyze'}
          </button>
        </div>

        {jinaError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
            <p className="text-red-800 dark:text-red-200 text-sm">{jinaError}</p>
          </div>
        )}

        {jinaData && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  AI-Processed Content:
                </h3>
                <button
                  onClick={handleProcessWithAI}
                  disabled={sportsAILoading}
                  className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-sm font-medium"
                >
                  {sportsAILoading ? 'Processing...' : 'Extract Sports Data'}
                </button>
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap max-h-96 overflow-y-auto">
                {jinaData}
              </div>
            </div>

            {sportsAIError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-red-800 dark:text-red-200 text-sm">{sportsAIError}</p>
              </div>
            )}

            {processedSportsData && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-900 dark:text-green-200 mb-3">
                  🏈 Extracted Sports Data ({processedSportsData.totalGames} games, {processedSportsData.totalLeagues} leagues):
                </h3>
                <div className="space-y-3">
                  {processedSportsData.leagues.map((league: any) => (
                    <div key={league.name} className="bg-white dark:bg-gray-800 rounded-lg p-3">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">{league.name}</h4>
                      <div className="space-y-1">
                        {league.games.map((game: any) => (
                          <div key={game.id} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700 dark:text-gray-300">
                              {game.awayTeam} @ {game.homeTeam}
                            </span>
                            <div className="flex items-center gap-2">
                              {game.gameStatus === 'live' && (
                                <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded text-xs">
                                  LIVE
                                </span>
                              )}
                              {game.gameStatus === 'completed' && (
                                <span className="text-gray-600 dark:text-gray-400">
                                  {game.awayScore} - {game.homeScore}
                                </span>
                              )}
                              {game.gameStatus === 'scheduled' && game.startTime && (
                                <span className="text-gray-500 dark:text-gray-400 text-xs">
                                  {new Date(game.startTime).toLocaleTimeString()}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  Last processed: {new Date(processedSportsData.lastUpdated).toLocaleTimeString()}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {data && data.leagues.length > 0 ? (
        <>
          {data.leagues.map((league) => (
            <LeagueSection key={league.name} league={league} />
          ))}

          <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4">
            Last updated: {new Date(data.lastUpdated).toLocaleTimeString()}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No games today</h3>
            <p>Check back later for upcoming games</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sports;
