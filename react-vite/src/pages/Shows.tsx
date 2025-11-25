import React, { useState } from 'react';
import { useShows } from '../hooks/useShows';
import { useFavorites } from '../hooks/useFavorites';
import { showGenerationService } from '../services/showGenerationService';
import { SavedShow } from '../services/showsDb';
import ShowPlanningModule from '../components/ShowPlanningModule';
import {
  Plus,
  Loader2,
  Calendar,
  Clock,
  Trash2,
  Edit,
  ArrowLeft,
  Save,
  Sparkles,
  AlertCircle,
  List,
} from 'lucide-react';

type ViewMode = 'list' | 'create' | 'edit' | 'view';

const Shows: React.FC = () => {
  const { shows, isLoading: showsLoading, saveShow, updateShow, deleteShow } = useShows();
  const { favorites, isLoading: favoritesLoading } = useFavorites();
  
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedShow, setSelectedShow] = useState<SavedShow | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  // Form state for creating new show
  const [showSummary, setShowSummary] = useState('');
  const [selectedFavorites, setSelectedFavorites] = useState<Set<string>>(new Set());

  const handleCreateNewShow = () => {
    setViewMode('create');
    setShowSummary('');
    setSelectedFavorites(new Set(favorites.map(f => f.id))); // Select all by default
    setGenerationError(null);
  };

  const handleGenerateShow = async () => {
    if (!showSummary.trim()) {
      setGenerationError('Please provide a show summary');
      return;
    }

    if (selectedFavorites.size === 0) {
      setGenerationError('Please select at least one article');
      return;
    }

    try {
      setIsGenerating(true);
      setGenerationError(null);

      const selectedArticles = favorites.filter(f => selectedFavorites.has(f.id));

      const show = await showGenerationService.generateShow({
        summary: showSummary,
        favorites: selectedArticles,
        episodeNumber: shows.length + 1,
      });

      // Save the show with generation params
      const savedShow = await saveShow(show, {
        summary: showSummary,
        favoriteIds: Array.from(selectedFavorites),
        timestamp: new Date(),
      });

      setSelectedShow(savedShow);
      setViewMode('view');
    } catch (error) {
      console.error('Error generating show:', error);
      setGenerationError(error instanceof Error ? error.message : 'Failed to generate show');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewShow = (show: SavedShow) => {
    setSelectedShow(show);
    setViewMode('view');
  };

  const handleEditShow = (show: SavedShow) => {
    setSelectedShow(show);
    setViewMode('edit');
  };

  const handleDeleteShow = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this show?')) {
      await deleteShow(id);
      if (selectedShow?.id === id) {
        setSelectedShow(null);
        setViewMode('list');
      }
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedShow(null);
  };

  const toggleFavoriteSelection = (id: string) => {
    setSelectedFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  if (showsLoading || favoritesLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // LIST VIEW
  if (viewMode === 'list') {
    return (
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Show Planning</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Create and manage show schedules from your favorite articles
            </p>
          </div>
          <button
            onClick={handleCreateNewShow}
            disabled={favorites.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="h-5 w-5" />
            Generate New Show
          </button>
        </div>

        {favorites.length === 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-900 dark:text-yellow-100">No Favorite Articles</h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                  You need to save some articles as favorites before you can generate shows. Go to the News page and start adding favorites!
                </p>
              </div>
            </div>
          </div>
        )}

        {shows.length === 0 ? (
          <div className="text-center py-16">
            <List className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Shows Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Generate your first show from your favorite articles
            </p>
            <button
              onClick={handleCreateNewShow}
              disabled={favorites.length === 0}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <Sparkles className="h-5 w-5" />
              Generate First Show
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {shows.map((show) => (
              <div
                key={show.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 hover:border-blue-500 dark:hover:border-blue-600 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {show.title}
                      </h3>
                      {show.episodeNumber && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm font-medium">
                          Episode #{show.episodeNumber}
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        show.status === 'ready' || show.status === 'live'
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : show.status === 'completed'
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                          : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                      }`}>
                        {show.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Updated: {formatDate(show.updatedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDuration(show.estimatedDurationSeconds)}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs">
                        {show.blocks.length} blocks
                      </span>
                      <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded text-xs">
                        {show.blocks.reduce((acc, block) => acc + block.segments.length, 0)} segments
                      </span>
                    </div>

                    {show.generationParams && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                        {show.generationParams.summary}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {show.metadata.tags.slice(0, 5).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleViewShow(show)}
                      className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      title="View show"
                    >
                      <List className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleEditShow(show)}
                      className="p-2 rounded-lg border border-blue-300 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      title="Edit show"
                    >
                      <Edit className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteShow(show.id)}
                      className="p-2 rounded-lg border border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Delete show"
                    >
                      <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // CREATE VIEW
  if (viewMode === 'create') {
    return (
      <div className="space-y-6 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToList}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Generate New Show</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Create a show schedule from your favorite articles using AI
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          {/* Show Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Show Summary <span className="text-red-500">*</span>
            </label>
            <textarea
              value={showSummary}
              onChange={(e) => setShowSummary(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the overall theme and tone of this episode. What should the show focus on? What angles should the hosts take?"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              This summary will guide the AI in creating appropriate segments and debate structures
            </p>
          </div>

          {/* Article Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                Select Articles <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedFavorites(new Set(favorites.map(f => f.id)))}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Select All
                </button>
                <button
                  onClick={() => setSelectedFavorites(new Set())}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear All
                </button>
              </div>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              {favorites.map((favorite) => (
                <label
                  key={favorite.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedFavorites.has(favorite.id)}
                    onChange={() => toggleFavoriteSelection(favorite.id)}
                    className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      {favorite.title}
                    </div>
                    {favorite.summary && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {favorite.summary}
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Selected: {selectedFavorites.size} of {favorites.length} articles
            </p>
          </div>

          {/* Error Message */}
          {generationError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-900 dark:text-red-100">Generation Error</h3>
                  <p className="text-sm text-red-800 dark:text-red-200 mt-1">{generationError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleBackToList}
              disabled={isGenerating}
              className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerateShow}
              disabled={isGenerating || !showSummary.trim() || selectedFavorites.size === 0}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating Show...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Generate Show with AI
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // VIEW and EDIT modes - use ShowPlanningModule
  if ((viewMode === 'view' || viewMode === 'edit') && selectedShow) {
    return (
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToList}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {viewMode === 'edit' ? 'Edit Show' : 'View Show'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {selectedShow.title}
              </p>
            </div>
          </div>
          {viewMode === 'view' && (
            <button
              onClick={() => setViewMode('edit')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="h-5 w-5" />
              Edit Show
            </button>
          )}
        </div>

        <ShowPlanningModule 
          show={selectedShow} 
          isEditable={viewMode === 'edit'}
          onSave={async (updatedShow) => {
            await updateShow({ ...selectedShow, ...updatedShow });
            setViewMode('view');
          }}
        />
      </div>
    );
  }

  return null;
};

export default Shows;

