import React, { useState, useMemo } from 'react';
import { Radio as RadioIcon, Search, MapPin, Users, TrendingUp } from 'lucide-react';
import RadioPlayer from '../components/RadioPlayer';
import { radioStations, getAllMarkets, getNationalStations } from '../data/radioStations';

const Radio: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarket, setSelectedMarket] = useState<string>('all');
  const [selectedLeague, setSelectedLeague] = useState<string>('all');

  const markets = useMemo(() => getAllMarkets(), []);
  const leagues = ['NFL', 'NBA', 'MLB', 'NHL'];

  // Filter stations based on search and filters
  const filteredStations = useMemo(() => {
    let filtered = [...radioStations];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(station =>
        station.name.toLowerCase().includes(query) ||
        station.market.toLowerCase().includes(query) ||
        station.teams.some(team => team.toLowerCase().includes(query)) ||
        station.description?.toLowerCase().includes(query)
      );
    }

    // Market filter
    if (selectedMarket !== 'all') {
      filtered = filtered.filter(station => station.market === selectedMarket);
    }

    // League filter
    if (selectedLeague !== 'all') {
      filtered = filtered.filter(station => station.leagues.includes(selectedLeague));
    }

    return filtered;
  }, [searchQuery, selectedMarket, selectedLeague]);

  const nationalStations = useMemo(() => getNationalStations(), []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <RadioIcon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Sports Radio Directory</h1>
              <p className="text-blue-100 text-lg">
                Listen to live sports talk and game coverage from top stations nationwide
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-blue-200" />
                <div>
                  <div className="text-2xl font-bold">{radioStations.length}</div>
                  <div className="text-sm text-blue-200">Total Stations</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-200" />
                <div>
                  <div className="text-2xl font-bold">{markets.length}</div>
                  <div className="text-sm text-blue-200">Markets</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-200" />
                <div>
                  <div className="text-2xl font-bold">{leagues.length}</div>
                  <div className="text-sm text-blue-200">Major Leagues</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search stations, teams, or cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Market Filter */}
            <div>
              <select
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Markets</option>
                {markets.map(market => (
                  <option key={market} value={market}>{market}</option>
                ))}
              </select>
            </div>

            {/* League Filter */}
            <div>
              <select
                value={selectedLeague}
                onChange={(e) => setSelectedLeague(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Leagues</option>
                {leagues.map(league => (
                  <option key={league} value={league}>{league}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Summary */}
          {(searchQuery || selectedMarket !== 'all' || selectedLeague !== 'all') && (
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Showing {filteredStations.length} of {radioStations.length} stations
              </span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedMarket('all');
                  setSelectedLeague('all');
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* National Stations Section */}
        {selectedMarket === 'all' && !searchQuery && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                National Networks
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nationalStations.map(station => (
                <RadioPlayer key={station.id} station={station} />
              ))}
            </div>
          </div>
        )}

        {/* All Stations / Filtered Results */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedMarket !== 'all' ? `${selectedMarket} Stations` : 'Local Markets'}
            </h2>
          </div>

          {filteredStations.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
              <RadioIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No stations found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filters to find more stations.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStations
                .filter(station => !station.isNational)
                .map(station => (
                  <RadioPlayer key={station.id} station={station} />
                ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            About Sports Radio Streaming
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <p>
              All radio stations listed are official broadcasters. Clicking "Listen Live" will take you to the station's official streaming page.
            </p>
            <p>
              <strong>Note:</strong> Some stations may be geo-restricted or require registration. Game broadcasts may be subject to blackout restrictions based on your location.
            </p>
            <p>
              Radio broadcasts are a great way to follow your favorite teams while browsing stats, reading articles, or working. Many stations offer pre-game shows, post-game analysis, and daily sports talk programming.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Radio;

