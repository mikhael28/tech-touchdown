import React from 'react';
import {
  Show,
  Host,
  Block,
  Segment,
  Topic,
  MediaAsset,
  SegmentType,
  BlockType,
  TensionLevel,
  HostPosition,
  ColdOpenSegment,
  MainDebateSegment,
  GuestInterviewSegment,
} from '../types/show';
import { mockShow, mockHosts, mockTopics, mockMediaAssets } from '../types/show-mock';
import {
  Clock,
  Users,
  Play,
  FileText,
  Video,
  TrendingUp,
  AlertCircle,
  MessageSquare,
  Target,
  Zap,
  ChevronDown,
  ChevronRight,
  Star,
  Trash2,
  ExternalLink,
  Calendar,
  Loader2,
  Save,
  Edit,
  Plus,
  X,
} from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';

interface ShowPlanningModuleProps {
  show?: Show;
  isEditable?: boolean;
  onSave?: (show: Show) => void | Promise<void>;
}

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const getTensionColor = (tension: TensionLevel): string => {
  switch (tension) {
    case TensionLevel.EXPLOSIVE:
      return 'bg-red-500 text-white';
    case TensionLevel.HIGH:
      return 'bg-orange-500 text-white';
    case TensionLevel.MEDIUM:
      return 'bg-yellow-500 text-black';
    case TensionLevel.LOW:
      return 'bg-green-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const getUrgencyColor = (urgency: string): string => {
  switch (urgency) {
    case 'breaking':
      return 'bg-red-500 text-white';
    case 'hot':
      return 'bg-orange-500 text-white';
    case 'warm':
      return 'bg-yellow-500 text-black';
    case 'evergreen':
      return 'bg-green-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const getPositionColor = (position: HostPosition): string => {
  switch (position) {
    case HostPosition.PRO:
      return 'bg-green-600 text-white';
    case HostPosition.AGAINST:
      return 'bg-red-600 text-white';
    case HostPosition.NEUTRAL:
      return 'bg-blue-600 text-white';
    case HostPosition.MODERATOR:
      return 'bg-purple-600 text-white';
    default:
      return 'bg-gray-600 text-white';
  }
};

const ShowPlanningModule: React.FC<ShowPlanningModuleProps> = ({ 
  show = mockShow, 
  isEditable = false,
  onSave,
}) => {
  const [expandedBlocks, setExpandedBlocks] = React.useState<Set<string>>(new Set());
  const [expandedSegments, setExpandedSegments] = React.useState<Set<string>>(new Set());
  const [showFavorites, setShowFavorites] = React.useState(true);
  const { favorites, isLoading: favoritesLoading, removeFavorite } = useFavorites();
  
  // Edit mode state
  const [editedShow, setEditedShow] = React.useState<Show>(show);
  const [isSaving, setIsSaving] = React.useState(false);
  
  // Update edited show when prop changes
  React.useEffect(() => {
    setEditedShow(show);
  }, [show]);

  const toggleBlock = (blockId: string) => {
    const newExpanded = new Set(expandedBlocks);
    if (newExpanded.has(blockId)) {
      newExpanded.delete(blockId);
    } else {
      newExpanded.add(blockId);
    }
    setExpandedBlocks(newExpanded);
  };

  const toggleSegment = (segmentId: string) => {
    const newExpanded = new Set(expandedSegments);
    if (newExpanded.has(segmentId)) {
      newExpanded.delete(segmentId);
    } else {
      newExpanded.add(segmentId);
    }
    setExpandedSegments(newExpanded);
  };

  const getHostById = (hostId: string): Host | undefined => {
    return currentShow.hosts.find((h) => h.id === hostId);
  };

  const getTopicById = (topicId: string): Topic | undefined => {
    return mockTopics.find((t) => t.id === topicId);
  };

  const getMediaAssetById = (assetId: string): MediaAsset | undefined => {
    return mockMediaAssets.find((m) => m.id === assetId);
  };

  const renderSegment = (segment: Segment, block: Block) => {
    const isExpanded = expandedSegments.has(segment.id);
    const topic = segment.topic;
    const isMainDebate = segment.type === SegmentType.MAIN_DEBATE;
    const isColdOpen = segment.type === SegmentType.COLD_OPEN;
    const isGuestInterview = segment.type === SegmentType.GUEST_INTERVIEW;

    return (
      <div
        key={segment.id}
        className="border border-gray-200 dark:border-gray-700 rounded-lg mb-3 bg-white dark:bg-gray-800 p-4"
      >
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div 
              className="flex-1 cursor-pointer"
              onClick={() => toggleSegment(segment.id)}
            >
              <div className="flex items-center gap-2 mb-2">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
                {isEditable ? (
                  <input
                    type="text"
                    value={segment.title}
                    onChange={(e) => {
                      e.stopPropagation();
                      updateSegment(block.id, segment.id, { title: e.target.value });
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 flex-1"
                  />
                ) : (
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {segment.title}
                  </h4>
                )}
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getTensionColor(
                    segment.tensionLevel
                  )}`}
                >
                  {segment.tensionLevel}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 ml-6">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDuration(segment.estimatedDurationSeconds)}
                </span>
                <span className="flex items-center gap-1">
                  <Play className="h-3 w-3" />
                  {segment.type.replace('_', ' ')}
                </span>
              </div>
            </div>
            {isEditable && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSegment(block.id, segment.id);
                }}
                className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                title="Delete segment"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="px-4 pb-4 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            {/* Topic Info */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-900 dark:text-white">Topic</h5>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getUrgencyColor(
                    topic.urgency
                  )}`}
                >
                  {topic.urgency.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{topic.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                <span>Trending: {topic.trendingScore}/100</span>
                <span>Debatability: {topic.debatability}/100</span>
                <span>Sport: {topic.sport}</span>
              </div>
            </div>

            {/* Cold Open Hook */}
            {isColdOpen && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Hook</h5>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {(segment as ColdOpenSegment).hook}
                </p>
                {(segment as ColdOpenSegment).teaseNextSegments.length > 0 && (
                  <div className="mt-2">
                    <h6 className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
                      Teasing Next:
                    </h6>
                    <ul className="text-xs text-blue-600 dark:text-blue-400 list-disc list-inside">
                      {(segment as ColdOpenSegment).teaseNextSegments.map((tease, idx) => (
                        <li key={idx}>{tease}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Debate Structure */}
            {isMainDebate && segment.debate && (
              <div className="space-y-3">
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                  <h5 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                    Debate Question
                  </h5>
                  <p className="text-sm text-purple-800 dark:text-purple-200">
                    {segment.debate.question}
                  </p>
                </div>

                {segment.debate.subQuestions && segment.debate.subQuestions.length > 0 && (
                  <div className="ml-4">
                    <h6 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Sub-Questions:
                    </h6>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc list-inside">
                      {segment.debate.subQuestions.map((q, idx) => (
                        <li key={idx}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Host Takes */}
                <div className="space-y-2">
                  <h6 className="text-sm font-medium text-gray-900 dark:text-white">
                    Host Takes
                  </h6>
                  {segment.debate.hostTakes.map((take, idx) => {
                    const host = getHostById(take.hostId);
                    return (
                      <div
                        key={idx}
                        className="border border-gray-200 dark:border-gray-700 rounded p-3 bg-white dark:bg-gray-800"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {host?.name || take.hostId}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getPositionColor(
                              take.position
                            )}`}
                          >
                            {take.position}
                          </span>
                        </div>
                        {take.keyQuote && (
                          <p className="text-sm italic text-gray-700 dark:text-gray-300 mb-2">
                            "{take.keyQuote}"
                          </p>
                        )}
                        <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
                          {take.talkingPoints.map((point, pIdx) => (
                            <li key={pIdx}>{point}</li>
                          ))}
                        </ul>
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          Est. time: {formatDuration(take.predictedResponseTime)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Fact Check Points */}
                {segment.debate.factCheckPoints && segment.debate.factCheckPoints.length > 0 && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                    <h6 className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                      Fact Check Points
                    </h6>
                    <ul className="text-xs text-yellow-800 dark:text-yellow-200 list-disc list-inside">
                      {segment.debate.factCheckPoints.map((fact, idx) => (
                        <li key={idx}>{fact}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Exit Strategy */}
                {segment.debate.exitStrategy && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <h6 className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                      Exit Strategy
                    </h6>
                    <p className="text-xs text-green-800 dark:text-green-200">
                      {segment.debate.exitStrategy}
                    </p>
                  </div>
                )}

                {isMainDebate && (
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <span>
                      Allowed Overtime: {formatDuration((segment as MainDebateSegment).allowedOvertimeSeconds)}
                    </span>
                    <span className="ml-4">
                      Break Timing: {(segment as MainDebateSegment).commercialBreakTiming.replace('_', ' ')}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Guest Interview */}
            {isGuestInterview && (
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3">
                <h5 className="font-medium text-indigo-900 dark:text-indigo-100 mb-2">
                  Guest: {(segment as GuestInterviewSegment).guest.name}
                </h5>
                <p className="text-xs text-indigo-800 dark:text-indigo-200 mb-2">
                  {(segment as GuestInterviewSegment).guest.title}
                </p>
                <p className="text-xs text-indigo-700 dark:text-indigo-300 mb-3">
                  {(segment as GuestInterviewSegment).guest.bio}
                </p>
                <div className="space-y-2">
                  <h6 className="text-xs font-medium text-indigo-900 dark:text-indigo-100">
                    Questions:
                  </h6>
                  {(segment as GuestInterviewSegment).questions.map((q, idx) => (
                    <div key={idx} className="text-xs text-indigo-800 dark:text-indigo-200">
                      <div className="font-medium">{q.question}</div>
                      {q.followUps && q.followUps.length > 0 && (
                        <ul className="ml-4 mt-1 list-disc list-inside">
                          {q.followUps.map((follow, fIdx) => (
                            <li key={fIdx}>{follow}</li>
                          ))}
                        </ul>
                      )}
                      <div className="text-indigo-600 dark:text-indigo-400 mt-1">
                        Time limit: {formatDuration(q.timeLimit)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Participants */}
            <div>
              <h6 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Participants
              </h6>
              <div className="flex flex-wrap gap-2">
                {segment.participants.hosts.map((hostId) => {
                  const host = getHostById(hostId);
                  return (
                    <span
                      key={hostId}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
                    >
                      {host?.name || hostId}
                    </span>
                  );
                })}
                {segment.participants.guests?.map((guestId) => (
                  <span
                    key={guestId}
                    className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs"
                  >
                    Guest {guestId}
                  </span>
                ))}
              </div>
            </div>

            {/* Media Assets */}
            {segment.mediaAssets.length > 0 && (
              <div>
                <h6 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-1">
                  <Video className="h-4 w-4" />
                  Media Assets
                </h6>
                <div className="space-y-2">
                  {segment.mediaAssets.map((assetRef, idx) => {
                    const asset = getMediaAssetById(assetRef.assetId);
                    if (!asset) return null;
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded text-xs"
                      >
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {asset.title}
                          </span>
                          <span className="ml-2 text-gray-600 dark:text-gray-400">
                            ({asset.type.replace('_', ' ')})
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <span>{assetRef.timing}</span>
                          {assetRef.cuePoint !== undefined && (
                            <span>@{formatDuration(assetRef.cuePoint)}</span>
                          )}
                          {assetRef.required && (
                            <span className="text-red-600 dark:text-red-400">Required</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Production Notes */}
            {segment.productionNotes.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                <h6 className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Production Notes
                </h6>
                <ul className="text-xs text-amber-800 dark:text-amber-200 list-disc list-inside space-y-1">
                  {segment.productionNotes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            )}

            {segment.commercialBreakAfter && (
              <div className="text-center py-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
                Commercial Break After
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderBlock = (block: Block) => {
    const isExpanded = expandedBlocks.has(block.id);

    return (
      <div
        key={block.id}
        className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 mb-4 bg-gray-50 dark:bg-gray-900"
      >
        <div className="mb-3">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-2 flex-1 cursor-pointer"
              onClick={() => toggleBlock(block.id)}
            >
              {isExpanded ? (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-500" />
              )}
              {isEditable ? (
                <input
                  type="text"
                  value={block.title}
                  onChange={(e) => {
                    e.stopPropagation();
                    updateBlock(block.id, { title: e.target.value });
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="text-lg font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
                />
              ) : (
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {block.title}
                </h3>
              )}
              <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
                {block.type.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatDuration(block.estimatedDurationSeconds)}
              </span>
              <span>{block.segments.length} segments</span>
              {isEditable && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteBlock(block.id);
                  }}
                  className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                  title="Delete block"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-4 mt-4">
            {/* Block Goals */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-1">
                <Target className="h-4 w-4" />
                Block Goals
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 list-disc list-inside space-y-1">
                {block.goals.map((goal, idx) => (
                  <li key={idx}>{goal}</li>
                ))}
              </ul>
            </div>

            {/* Pace Notes */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
              <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-1 flex items-center gap-1">
                <Zap className="h-4 w-4" />
                Pace Notes
              </h4>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">{block.paceNotes}</p>
            </div>

            {/* Segments */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Segments</h4>
              {block.segments.map((segment) => renderSegment(segment, block))}
            </div>

            {/* Commercial Breaks */}
            {block.commercialBreaks.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Commercial Breaks
                </h4>
                {block.commercialBreaks.map((breakItem, idx) => (
                  <div
                    key={idx}
                    className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 mb-2"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-900 dark:text-green-100">
                        After: {breakItem.afterSegmentId}
                      </span>
                      <span className="text-green-800 dark:text-green-200">
                        {formatDuration(breakItem.estimatedDurationSeconds)}
                      </span>
                      {breakItem.sponsorshipSlot && (
                        <span className="px-2 py-1 bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100 rounded text-xs">
                          {breakItem.sponsorshipSlot}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const handleRemoveFavorite = async (id: string) => {
    await removeFavorite(id);
  };

  const formatFavoriteDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatPublishedDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const handleSave = async () => {
    if (!onSave) return;
    
    try {
      setIsSaving(true);
      await onSave(editedShow);
    } catch (error) {
      console.error('Error saving show:', error);
      alert('Failed to save show. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedShow(show);
  };

  const updateShow = (updates: Partial<Show>) => {
    setEditedShow(prev => ({ ...prev, ...updates }));
  };

  const updateBlock = (blockId: string, updates: Partial<Block>) => {
    setEditedShow(prev => ({
      ...prev,
      blocks: prev.blocks.map(block =>
        block.id === blockId ? { ...block, ...updates } : block
      ),
    }));
  };

  const deleteBlock = (blockId: string) => {
    if (!window.confirm('Are you sure you want to delete this block?')) return;
    setEditedShow(prev => ({
      ...prev,
      blocks: prev.blocks.filter(block => block.id !== blockId),
    }));
  };

  const updateSegment = (blockId: string, segmentId: string, updates: Partial<Segment>) => {
    setEditedShow(prev => ({
      ...prev,
      blocks: prev.blocks.map(block =>
        block.id === blockId
          ? {
              ...block,
              segments: block.segments.map(segment =>
                segment.id === segmentId ? { ...segment, ...updates } : segment
              ),
            }
          : block
      ),
    }));
  };

  const deleteSegment = (blockId: string, segmentId: string) => {
    if (!window.confirm('Are you sure you want to delete this segment?')) return;
    setEditedShow(prev => ({
      ...prev,
      blocks: prev.blocks.map(block =>
        block.id === blockId
          ? {
              ...block,
              segments: block.segments.filter(segment => segment.id !== segmentId),
            }
          : block
      ),
    }));
  };

  const currentShow = isEditable ? editedShow : show;

  return (
    <div className="space-y-6">
      {/* Save/Cancel buttons when editing */}
      {isEditable && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-900 dark:text-blue-100">
                Edit Mode
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Favorite Articles Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-yellow-500 dark:border-yellow-600">
        <div 
          className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          onClick={() => setShowFavorites(!showFavorites)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {showFavorites ? (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-500" />
              )}
              <Star className="h-6 w-6 text-yellow-500 fill-current" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Favorite Articles
              </h3>
              <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-sm font-medium">
                {favorites.length}
              </span>
            </div>
          </div>
        </div>

        {showFavorites && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            {favoritesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : favorites.length === 0 ? (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No favorite articles yet. Add articles to your favorites from the search results.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {favorites.map((favorite) => (
                  <div
                    key={favorite.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-yellow-500 dark:hover:border-yellow-600 transition-colors bg-white dark:bg-gray-900"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {favorite.title}
                        </h4>
                        
                        {favorite.summary && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {favorite.summary}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Saved: {formatFavoriteDate(favorite.savedAt)}
                          </span>
                          
                          {favorite.publishedDate && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Published: {formatPublishedDate(favorite.publishedDate)}
                            </span>
                          )}
                          
                          {favorite.author && (
                            <span className="truncate max-w-32">
                              By {favorite.author}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 flex-shrink-0">
                        <a
                          href={favorite.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          title="Open article"
                        >
                          <ExternalLink className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </a>
                        <button
                          onClick={() => handleRemoveFavorite(favorite.id)}
                          className="p-2 rounded-lg border border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Remove from favorites"
                        >
                          <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Show Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {isEditable ? (
              <input
                type="text"
                value={currentShow.title}
                onChange={(e) => updateShow({ title: e.target.value })}
                className="text-2xl font-bold mb-1 bg-white/20 text-white px-3 py-1 rounded border-2 border-white/30 focus:border-white focus:outline-none w-full"
              />
            ) : (
              <h2 className="text-2xl font-bold mb-1">{currentShow.title}</h2>
            )}
            {currentShow.episodeNumber && (
              <p className="text-blue-100">Episode #{currentShow.episodeNumber}</p>
            )}
          </div>
          {isEditable ? (
            <select
              value={currentShow.status}
              onChange={(e) => updateShow({ status: e.target.value as Show['status'] })}
              className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white border-2 border-white/30 focus:border-white focus:outline-none"
            >
              <option value="planning">PLANNING</option>
              <option value="in_prep">IN PREP</option>
              <option value="ready">READY</option>
              <option value="live">LIVE</option>
              <option value="completed">COMPLETED</option>
              <option value="archived">ARCHIVED</option>
            </select>
          ) : (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                currentShow.status === 'ready' || currentShow.status === 'live'
                  ? 'bg-green-500'
                  : currentShow.status === 'completed'
                  ? 'bg-gray-500'
                  : 'bg-yellow-500'
              }`}
            >
              {currentShow.status.replace('_', ' ').toUpperCase()}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Air Date: {formatDate(currentShow.airDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            <span>Duration: {formatDuration(currentShow.estimatedDurationSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Hosts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Hosts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {currentShow.hosts.map((host) => (
            <div
              key={host.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-900"
            >
              <div className="font-medium text-gray-900 dark:text-white">{host.name}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                {host.role}
              </div>
              <div className="text-xs text-gray-700 dark:text-gray-300 mt-1">{host.bio}</div>
              {host.twitterHandle && (
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {host.twitterHandle}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Opening Teaser */}
      {currentShow.openingTeaser && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-4 text-white">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Opening Teaser
          </h3>
          <p className="text-sm mb-2">Teased Topics:</p>
          <ul className="list-disc list-inside text-sm space-y-1">
            {currentShow.openingTeaser.teasedTopics.map((topic, idx) => (
              <li key={idx}>{topic}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Blocks */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Play className="h-6 w-6" />
          Show Blocks
        </h3>
        {currentShow.blocks.map((block) => renderBlock(block))}
      </div>

      {/* Closing Teaser */}
      {currentShow.closingTeaser && (
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg p-4 text-white">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Closing Teaser
          </h3>
          <p className="text-sm mb-2 font-medium">Tomorrow's Topics:</p>
          <ul className="list-disc list-inside text-sm space-y-1 mb-3">
            {currentShow.closingTeaser.tomorrowsTopics.map((topic, idx) => (
              <li key={idx}>{topic}</li>
            ))}
          </ul>
          <p className="text-sm italic">"{currentShow.closingTeaser.cliffhangerQuestion}"</p>
        </div>
      )}

      {/* Metadata */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Production Info</h3>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
          <div>Producer: {currentShow.metadata.producer}</div>
          <div>Director: {currentShow.metadata.director}</div>
          <div>Studio: {currentShow.metadata.studio}</div>
          {currentShow.metadata.season && <div>Season: {currentShow.metadata.season}</div>}
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {currentShow.metadata.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowPlanningModule;

