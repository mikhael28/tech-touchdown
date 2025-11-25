import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Radio, ChevronDown, ChevronUp, ExternalLink, Volume2 } from 'lucide-react';
import { getNationalStations, radioStations } from '../data/radioStations';

interface SidebarRadioListProps {
  collapsed?: boolean;
}

const SidebarRadioList: React.FC<SidebarRadioListProps> = ({ collapsed = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNational, setShowNational] = useState(true);
  
  const nationalStations = useMemo(() => getNationalStations(), []);
  const topLocalStations = useMemo(() => {
    // Get top local stations by market size
    const majorMarkets = ['New York', 'Los Angeles', 'Chicago', 'Dallas', 'Boston', 'Philadelphia'];
    return radioStations
      .filter(s => !s.isNational && majorMarkets.includes(s.market))
      .slice(0, 6);
  }, []);

  const displayStations = showNational ? nationalStations : topLocalStations;

  const handleStationClick = (websiteUrl: string) => {
    window.open(websiteUrl, '_blank', 'noopener,noreferrer');
  };

  if (collapsed) {
    return null;
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-blue-500" />
          <span>Sports Radio</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="mt-2 space-y-2 px-3">
          {/* Toggle National/Local */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setShowNational(true)}
              className={`flex-1 px-2 py-1 text-xs font-medium rounded transition-colors ${
                showNational
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              National
            </button>
            <button
              onClick={() => setShowNational(false)}
              className={`flex-1 px-2 py-1 text-xs font-medium rounded transition-colors ${
                !showNational
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Local
            </button>
          </div>

          {/* Station List */}
          <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
            {displayStations.map((station) => (
              <div
                key={station.id}
                className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-xs text-gray-900 dark:text-white truncate">
                      {station.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {station.frequency}
                    </div>
                    {!station.isNational && (
                      <div className="text-xs text-gray-400 dark:text-gray-500 truncate">
                        {station.market}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleStationClick(station.websiteUrl)}
                    className="flex-shrink-0 p-1.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded transition-all duration-200 shadow-sm hover:shadow-md"
                    title={`Listen to ${station.name}`}
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Leagues badges */}
                {station.leagues.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {station.leagues.slice(0, 4).map((league) => (
                      <span
                        key={league}
                        className="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded"
                      >
                        {league}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* View All Link */}
          <Link
            to="/radio"
            className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <span>View All {radioStations.length} Stations</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default SidebarRadioList;

