import React from 'react';
import { ChatRoom } from '../types/chat';
import { Badge } from './ui/badge';
import { Hash, Lock, Volume2, VolumeX, Star } from 'lucide-react';
import { cn } from '../lib/utils';

interface ChatRoomListProps {
  rooms: ChatRoom[];
  activeRoomId: string | null;
  onRoomSelect: (roomId: string) => void;
  unreadCounts?: Record<string, number>;
  mutedRooms?: string[];
  favoriteRooms?: string[];
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({
  rooms,
  activeRoomId,
  onRoomSelect,
  unreadCounts = {},
  mutedRooms = [],
  favoriteRooms = [],
}) => {
  const getColorClass = (color: string): string => {
    const colorMap: Record<string, string> = {
      primary: 'text-primary',
      secondary: 'text-secondary',
      accent: 'text-accent',
      warning: 'text-warning',
      gold: 'text-gold',
      purple: 'text-purple',
    };
    return colorMap[color] || 'text-primary';
  };

  // Group rooms by category
  const groupedRooms = rooms.reduce((acc, room) => {
    if (!acc[room.category]) {
      acc[room.category] = [];
    }
    acc[room.category].push(room);
    return acc;
  }, {} as Record<string, ChatRoom[]>);

  const categoryLabels: Record<string, string> = {
    general: 'General',
    sports: 'Sports',
    tech: 'Tech',
    gaming: 'Gaming',
    'off-topic': 'Off-Topic',
  };

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Hash className="h-5 w-5 text-primary" />
          Chat Rooms
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          {rooms.length} {rooms.length === 1 ? 'room' : 'rooms'} available
        </p>
      </div>

      {/* Rooms List */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(groupedRooms).map(([category, categoryRooms]) => (
          <div key={category} className="py-2">
            {/* Category Header */}
            <div className="px-4 py-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {categoryLabels[category] || category}
              </h3>
            </div>

            {/* Rooms in Category */}
            <div className="space-y-0.5 px-2">
              {categoryRooms.map((room) => {
                const isActive = room.id === activeRoomId;
                const unreadCount = unreadCounts[room.id] || 0;
                const isMuted = mutedRooms.includes(room.id);
                const isFavorite = favoriteRooms.includes(room.id);

                return (
                  <button
                    key={room.id}
                    onClick={() => onRoomSelect(room.id)}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all group',
                      isActive
                        ? 'bg-primary/10 text-foreground font-medium'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    )}
                  >
                    {/* Icon */}
                    <span
                      className={cn(
                        'text-lg flex-shrink-0',
                        isActive ? getColorClass(room.color) : 'opacity-60 group-hover:opacity-100'
                      )}
                    >
                      {room.icon}
                    </span>

                    {/* Room Name */}
                    <span className="flex-1 text-sm truncate">{room.name}</span>

                    {/* Indicators */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {isFavorite && <Star className="h-3 w-3 text-gold fill-gold" />}
                      {isMuted && <VolumeX className="h-3 w-3 text-muted-foreground" />}
                      {!room.isPublic && <Lock className="h-3 w-3 text-muted-foreground" />}
                      {unreadCount > 0 && !isMuted && (
                        <Badge className="bg-warning text-warning-foreground px-1.5 py-0 text-xs min-w-[20px] h-5 flex items-center justify-center">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="text-xs text-muted-foreground">
          <div className="flex items-center justify-between mb-1">
            <span>Total Messages</span>
            <span className="font-medium text-foreground">
              {rooms.reduce((sum, room) => sum + room.messageCount, 0).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Active Users</span>
            <span className="font-medium text-foreground">
              {rooms.reduce((sum, room) => sum + room.userCount, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomList;
