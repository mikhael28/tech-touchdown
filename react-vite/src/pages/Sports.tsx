import React, { useState, useEffect } from 'react';
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
  const [jinaData, setJinaData] = useState<string | null>(null);
  const [processedSportsData, setProcessedSportsData] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAutoProcessing, setIsAutoProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');

  const handleJinaFetch = async (url: string = 'https://plaintextsports.com/') => {
    const result = await fetchJinaData(url);
    if (result) {
      const cleanedData = cleanSportsContent(result.data);
      setJinaData(cleanedData);
      setProcessedSportsData(null); // Clear previous processed data
      return cleanedData;
    }
    return null;
  };

  const handleProcessWithAI = async (dataToProcess?: string) => {
    const data = dataToProcess || jinaData;
    if (!data) return;
    
    clearError(); // Clear any previous errors

    console.log(data)
    
    const result = await generateSportsData({
      prompt: `Extract and structure sports game information from this web content: ${data}`,
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
      
      // Save to localStorage
      localStorage.setItem('generatedSportsData', JSON.stringify(sportsData));
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setProcessingStep('Refreshing sports data...');
    try {
      // Re-run Jina fetch
      const cleanedData = await handleJinaFetch();
      // Re-run AI processing if we have Jina data
      if (cleanedData) {
        setProcessingStep('Processing with AI...');
        await handleProcessWithAI(cleanedData);
      }
    } finally {
      setIsRefreshing(false);
      setProcessingStep('');
    }
  };

  const startAutoProcess = async () => {
    setIsAutoProcessing(true);
    setProcessingStep('Fetching sports data from plaintextsports.com...');
    try {
      const cleanedData = await handleJinaFetch();
      if (cleanedData) {
        setProcessingStep('Processing with AI to extract game information...');
        await handleProcessWithAI(cleanedData);
      }
    } catch (error) {
      console.error('Auto process error:', error);
    } finally {
      setIsAutoProcessing(false);
      setProcessingStep('');
    }
  };

  // Load from localStorage on component mount and auto-start if no data
  useEffect(() => {
    const savedData = localStorage.getItem('generatedSportsData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setProcessedSportsData(parsedData);
      } catch (error) {
        console.error('Error parsing saved sports data:', error);
        localStorage.removeItem('generatedSportsData');
        // Start auto process if saved data is corrupted
        startAutoProcess();
      }
    } else {
      // No saved data, start auto process
      startAutoProcess();
    }
  }, []);

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
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || jinaLoading || sportsAILoading}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh All'}
          </button>
          <button
            onClick={refetch}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            Refresh API
          </button>
        </div>
      </div>

      {/* Auto Processing Status */}
      {(isAutoProcessing || isRefreshing) && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200">
                {isRefreshing ? 'Refreshing Sports Data' : 'Fetching All Sports Data'}
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                {processingStep || 'This may take up to a minute to fetch all sports data...'}
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
              Processing data from plaintextsports.com and extracting game information...
            </p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {(jinaError || sportsAIError) && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error processing sports data
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                {jinaError || sportsAIError}
              </div>
              <div className="mt-4">
                <button
                  onClick={handleRefresh}
                  className="bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 text-red-800 dark:text-red-200 px-3 py-1 rounded text-sm font-medium"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Skeletons */}
      {!processedSportsData && !data && (isAutoProcessing || loading) && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Show processed sports data if available, otherwise show regular API data */}
      {processedSportsData && processedSportsData.leagues.length > 0 ? (
        <>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-green-900 dark:text-green-200">
                🏈 AI-Generated Sports Data
              </h2>
              <div className="text-sm text-green-700 dark:text-green-300">
                {processedSportsData.totalGames} games • {processedSportsData.totalLeagues} leagues
              </div>
            </div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">
              Last processed: {new Date(processedSportsData.lastUpdated).toLocaleTimeString()}
            </div>
          </div>
          
          {processedSportsData.leagues.map((league: any) => (
            <LeagueSection key={league.name} league={league} />
          ))}
        </>
      ) : data && data.leagues.length > 0 ? (
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
            <p>Check back later for upcoming games or use the AI analysis above</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sports;
