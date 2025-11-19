import React, { useState } from 'react';
import { ChatMessage as ChatMessageType, MessageReaction } from '../types/chat';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MoreVertical, Reply, Smile, Trash2, Edit3 } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
  isOwn: boolean;
  showAvatar?: boolean;
  showTimestamp?: boolean;
  onReply?: (message: ChatMessageType) => void;
  onReact?: (messageId: string, emoji: string) => void;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  currentUserId?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isOwn,
  showAvatar = true,
  showTimestamp = true,
  onReply,
  onReact,
  onEdit,
  onDelete,
  currentUserId,
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getRoleBadgeColor = (role: string): string => {
    switch (role) {
      case 'admin':
        return 'bg-warning text-warning-foreground';
      case 'moderator':
        return 'bg-primary text-primary-foreground';
      default:
        return '';
    }
  };

  const quickEmojis = ['👍', '❤️', '😂', '🔥', '🎉', '👀'];

  if (message.messageType === 'system' || message.messageType === 'join' || message.messageType === 'leave') {
    return (
      <div className="flex items-center justify-center py-2">
        <span className="text-xs text-muted-foreground italic px-4 py-1 bg-muted/50 rounded-full">
          {message.message}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`group relative px-4 py-2 hover:bg-muted/30 transition-colors ${
        isOwn ? 'bg-primary/5' : ''
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowEmojiPicker(false);
      }}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        {showAvatar && (
          <div className="flex-shrink-0">
            {message.avatarUrl ? (
              <img
                src={message.avatarUrl}
                alt={message.username}
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                {message.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        )}

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-foreground">
              {message.displayName || message.username}
            </span>
            {message.role !== 'user' && (
              <Badge className={`text-xs px-2 py-0 ${getRoleBadgeColor(message.role)}`}>
                {message.role}
              </Badge>
            )}
            {showTimestamp && (
              <span className="text-xs text-muted-foreground">{formatTime(message.createdAt)}</span>
            )}
            {message.isEdited && (
              <span className="text-xs text-muted-foreground italic">(edited)</span>
            )}
          </div>

          {/* Message Text */}
          <div className="text-sm text-foreground break-words">
            {message.isDeleted ? (
              <span className="italic text-muted-foreground">Message deleted</span>
            ) : (
              message.message
            )}
          </div>

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {message.reactions.map((reaction, idx) => {
                const hasReacted = currentUserId && reaction.users.includes(currentUserId);
                return (
                  <button
                    key={idx}
                    onClick={() => onReact?.(message.id, reaction.emoji)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
                      hasReacted
                        ? 'bg-primary/20 border border-primary text-foreground'
                        : 'bg-muted hover:bg-muted/70 text-muted-foreground'
                    }`}
                  >
                    <span>{reaction.emoji}</span>
                    <span className="font-medium">{reaction.count}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions (show on hover) */}
        {!message.isDeleted && (showActions || showEmojiPicker) && (
          <div className="absolute top-0 right-4 flex items-center gap-1 bg-card border border-border rounded-lg shadow-lg p-1">
            {/* Quick Emoji Picker */}
            {showEmojiPicker ? (
              <div className="flex gap-1 px-1">
                {quickEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      onReact?.(message.id, emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="hover:bg-muted rounded px-2 py-1 text-lg transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowEmojiPicker(true)}
                  title="Add reaction"
                >
                  <Smile className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onReply?.(message)}
                  title="Reply"
                >
                  <Reply className="h-4 w-4" />
                </Button>
                {isOwn && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit?.(message.id)}
                      title="Edit"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => onDelete?.(message.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
