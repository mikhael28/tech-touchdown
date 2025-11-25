import React, { useState } from 'react';
import { RadioStation } from '../types/radio';
import { ExternalLink, Radio, Play, Volume2 } from 'lucide-react';

interface RadioPlayerProps {
  station: RadioStation;
  compact?: boolean;
}

const RadioPlayer: React.FC<RadioPlayerProps> = ({ station, compact = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    // Open station in new tab since most streams require their own player
    window.open(station.websiteUrl, '_blank');
    setIsPlaying(true);
  };

  if (compact) {
    return (
      <button
        onClick={handlePlay}
        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <Play className="w-4 h-4" />
        <span className="text-sm font-medium">Listen Live</span>
      </button>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <Radio className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {station.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {station.frequency}
            </p>
          </div>
        </div>
        
        <a
          href={station.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          title="Visit station website"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {station.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          {station.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {station.isNational && (
            <span className="text-xs font-medium px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 rounded">
              National
            </span>
          )}
          {station.leagues.slice(0, 3).map(league => (
            <span 
              key={league}
              className="text-xs font-medium px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded"
            >
              {league}
            </span>
          ))}
        </div>

        <button
          onClick={handlePlay}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Volume2 className="w-4 h-4" />
          <span className="text-sm font-medium">Listen Live</span>
        </button>
      </div>

      {/* Market and Teams Info */}
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs">
          <div className="text-gray-500 dark:text-gray-400">
            <span className="font-medium">Market:</span> {station.market}
          </div>
          {station.teams.length > 0 && (
            <div className="text-gray-500 dark:text-gray-400">
              <span className="font-medium">Teams:</span> {station.teams.slice(0, 2).join(', ')}
              {station.teams.length > 2 && ` +${station.teams.length - 2} more`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RadioPlayer;

