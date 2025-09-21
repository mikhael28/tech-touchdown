import React, { useEffect, useState, useRef, useCallback } from 'react';
import RightSideDrawer from './RightSideDrawer';
import LeftSideDrawer from './LeftSideDrawer';
import { useJinaContent } from '../hooks/useJinaContent';
import useGameProcessor from '../hooks/useGameProcessor';
import ExternalIframe from './ExternalIframe';
import GameChat from './GameChat';
import { Game } from '../types/sports';
import { RefreshCw, BarChart3 } from 'lucide-react';

interface GameDetailDrawerProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
}

const GameDetailDrawer: React.FC<GameDetailDrawerProps> = ({ game, isOpen, onClose }) => {
  const { content, loading, error, fetchContent, clearContent } = useJinaContent();
  const { processGame, loading: processingGame, error: processingError } = useGameProcessor();
  const [isAdvancedStatsOpen, setIsAdvancedStatsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const isFetchingRef = useRef(false);

  const handleRefreshGame = useCallback(async () => {
    if (!game?.id || !game?.url) return;
    
    setIsProcessing(true);
    try {
      await processGame(game.id, game.url);
    } catch (error) {
      console.error('Error refreshing game:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [game?.id, game?.url, processGame]);

  useEffect(() => {
    if (isOpen && game?.url && !isFetchingRef.current) {
      console.log('Fetching content for game:', game.url);
      isFetchingRef.current = true;
      fetchContent(game.url).finally(() => {
        isFetchingRef.current = false;
      });
      
      // Auto-refresh game data when drawer opens
      if (game.id && game.url) {
        handleRefreshGame();
      }
    } else if (!isOpen) {
      clearContent();
      isFetchingRef.current = false;
    }
  }, [isOpen, game?.url, game?.id, fetchContent, clearContent, handleRefreshGame]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading game details...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error loading content
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            </div>
          </div>
        </div>
      );
    }



    if (!content) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No content available</h3>
            <p>Unable to load content for this game</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Game Header */}
        {game && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {game.awayTeam} vs {game.homeTeam}
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded-full">
                  {game.league}
                </span>
                {game.url && (
                  <button
                    onClick={handleRefreshGame}
                    disabled={isProcessing || processingGame}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={isProcessing || processingGame ? "Refreshing game data..." : "Refresh game data"}
                  >
                    <RefreshCw className={`h-4 w-4 ${(isProcessing || processingGame) ? 'animate-spin' : ''}`} />
                  </button>
                )}
                {(isProcessing || processingGame) && (
                  <div className="text-xs text-blue-600 dark:text-blue-400 ml-2">
                    Updating...
                  </div>
                )}
              </div>
            </div>
            
            {/* Enhanced Scoreboard */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                {/* Away Team */}
                <div className="flex-1 text-center">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    {game.awayTeam}
                  </div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {game.awayScore !== null ? game.awayScore : '-'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Away
                  </div>
                </div>
                
                {/* Game Status & Period */}
                <div className="flex flex-col items-center justify-center px-3">
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                    {game.gameStatus === 'live' ? 'LIVE' : 
                     game.gameStatus === 'completed' ? 'FINAL' :
                     game.gameStatus === 'scheduled' ? 'UPCOMING' :
                     game.gameStatus.toUpperCase()}
                  </div>
                  {game.period && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {game.period}
                    </div>
                  )}
                  <div className="w-6 h-px bg-gray-300 dark:bg-gray-600 my-1"></div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">VS</div>
                </div>
                
                {/* Home Team */}
                <div className="flex-1 text-center">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    {game.homeTeam}
                  </div>
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                    {game.homeScore !== null ? game.homeScore : '-'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Home
                  </div>
                </div>
              </div>
              
              {/* Game Status Indicator */}
              <div className="mt-3 flex items-center justify-center">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  game.gameStatus === 'live' 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 animate-pulse'
                    : game.gameStatus === 'completed'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    : game.gameStatus === 'scheduled'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                    game.gameStatus === 'live' 
                      ? 'bg-red-500 animate-pulse'
                      : game.gameStatus === 'completed'
                      ? 'bg-green-500'
                      : game.gameStatus === 'scheduled'
                      ? 'bg-blue-500'
                      : 'bg-gray-500'
                  }`}></div>
                  {game.gameStatus === 'live' ? 'Live Game' : 
                   game.gameStatus === 'completed' ? 'Game Complete' :
                   game.gameStatus === 'scheduled' ? 'Scheduled' :
                   game.gameStatus}
                </div>
              </div>
            </div>

            {/* Game Details */}
            <div className="mt-3 space-y-2">
              {game.startTime && (
                <div className="flex items-center justify-center text-xs text-gray-600 dark:text-gray-400">
                  <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {game.startTime}
                </div>
              )}

              {game.broadcast && (
                <div className="flex items-center justify-center text-xs text-gray-600 dark:text-gray-400">
                  <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {game.broadcast}
                </div>
              )}

              {game.period && game.gameStatus === 'live' && (
                <div className="flex items-center justify-center text-xs text-gray-600 dark:text-gray-400">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5 animate-pulse"></div>
                  Currently in: {game.period}
                </div>
              )}

              {/* Advanced Stats Button */}
              {game.url && (
                <div className="flex justify-center mt-3">
                  <button
                    onClick={() => setIsAdvancedStatsOpen(true)}
                    className="flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors"
                  >
                    <BarChart3 className="h-3 w-3 mr-1.5" />
                    View Advanced Stats
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Game Chat */}
        {game && (
          <div className="flex-1 min-h-0">
            <GameChat 
              gameId={game.id} 
              awayTeam={game.awayTeam} 
              homeTeam={game.homeTeam} 
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <RightSideDrawer
        open={isOpen}
        setOpen={onClose}
        title={game ? `${game.awayTeam} vs ${game.homeTeam}` : 'Game Details'}
        size="xl"
      >
        <div className="h-full flex flex-col">
          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {renderContent()}
          </div>
        </div>
      </RightSideDrawer>

      {/* Advanced Stats Left Side Drawer */}
      {game && (
        <LeftSideDrawer
          open={isAdvancedStatsOpen}
          setOpen={setIsAdvancedStatsOpen}
          title="Advanced Stats"
          size="lg"
        >
          <div className="h-full">
            {game.url ? (
              <ExternalIframe url={game.url} />
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400">
                  <BarChart3 className="mx-auto h-12 w-12 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No stats available</h3>
                  <p>Advanced statistics are not available for this game</p>
                </div>
              </div>
            )}
          </div>
        </LeftSideDrawer>
      )}
    </>
  );
};

export default GameDetailDrawer;
