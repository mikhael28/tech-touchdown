import React from 'react';
import { OnlineUser, UserRole } from '../types/chat';
import { Badge } from './ui/badge';
import { Circle } from 'lucide-react';
import { cn } from '../lib/utils';

interface ChatUserListProps {
  users: OnlineUser[];
  currentUserId?: string;
}

const ChatUserList: React.FC<ChatUserListProps> = ({ users, currentUserId }) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'online':
        return 'text-accent bg-accent';
      case 'away':
        return 'text-gold bg-gold';
      case 'busy':
        return 'text-warning bg-warning';
      default:
        return 'text-muted-foreground bg-muted-foreground';
    }
  };

  const getRoleLabel = (role: string): string | null => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'moderator':
        return 'Mod';
      default:
        return null;
    }
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

  // Group users by role
  const admins = users.filter((u) => u.role === 'admin');
  const moderators = users.filter((u) => u.role === 'moderator');
  const regularUsers = users.filter((u) => u.role === 'user');

  const UserItem: React.FC<{ user: OnlineUser }> = ({ user }) => {
    const isCurrentUser = user.userId === currentUserId;
    const roleLabel = getRoleLabel(user.role);

    return (
      <div
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group',
          isCurrentUser ? 'bg-primary/10' : 'hover:bg-muted/50'
        )}
      >
        {/* Avatar with Status */}
        <div className="relative flex-shrink-0">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xs">
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
          {/* Status Indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card">
            <Circle className={cn('h-full w-full fill-current', getStatusColor(user.status))} />
          </div>
        </div>

        {/* Username and Role */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground truncate">
              {user.username}
              {isCurrentUser && ' (You)'}
            </span>
            {roleLabel && (
              <Badge className={cn('text-xs px-1.5 py-0', getRoleBadgeColor(user.role))}>
                {roleLabel}
              </Badge>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">
          Online — {users.length}
        </h2>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {/* Admins */}
        {admins.length > 0 && (
          <div className="mb-4">
            <div className="px-3 py-1">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Admins — {admins.length}
              </h3>
            </div>
            <div className="space-y-0.5">
              {admins.map((user) => (
                <UserItem key={user.id} user={user} />
              ))}
            </div>
          </div>
        )}

        {/* Moderators */}
        {moderators.length > 0 && (
          <div className="mb-4">
            <div className="px-3 py-1">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Moderators — {moderators.length}
              </h3>
            </div>
            <div className="space-y-0.5">
              {moderators.map((user) => (
                <UserItem key={user.id} user={user} />
              ))}
            </div>
          </div>
        )}

        {/* Regular Users */}
        {regularUsers.length > 0 && (
          <div>
            <div className="px-3 py-1">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Members — {regularUsers.length}
              </h3>
            </div>
            <div className="space-y-0.5">
              {regularUsers.map((user) => (
                <UserItem key={user.id} user={user} />
              ))}
            </div>
          </div>
        )}

        {users.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">No users online</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatUserList;
