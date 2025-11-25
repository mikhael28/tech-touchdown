import React, { useState, useEffect, useRef } from 'react';
import { ChatRoom, ChatMessage as ChatMessageType, OnlineUser } from '../types/chat';
import ChatRoomList from './ChatRoomList';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatUserList from './ChatUserList';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Hash, Users, X, MessageCircle, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const SportsChatOverlay: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessageType[]>>({});
  const [onlineUsers, setOnlineUsers] = useState<Record<string, OnlineUser[]>>({});
  const [replyingTo, setReplyingTo] = useState<{ username: string; message: string } | null>(null);
  const [showUserList, setShowUserList] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize sports-related chat rooms
  useEffect(() => {
    const sportsRooms: ChatRoom[] = [
      {
        id: '1',
        name: 'Sports Talk',
        slug: 'sports-talk',
        description: 'Discuss today\'s games and sports news',
        category: 'sports',
        icon: '🏈',
        color: 'primary',
        isPublic: true,
        isActive: true,
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messageCount: 3421,
        userCount: 156,
      },
      {
        id: '2',
        name: 'Live Games',
        slug: 'live-games',
        description: 'Real-time commentary during live sporting events',
        category: 'sports',
        icon: '🔴',
        color: 'warning',
        isPublic: true,
        isActive: true,
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messageCount: 5673,
        userCount: 234,
      },
      {
        id: '3',
        name: 'Betting Corner',
        slug: 'betting-corner',
        description: 'Odds, picks, and betting strategy discussion',
        category: 'gaming',
        icon: '💰',
        color: 'gold',
        isPublic: true,
        isActive: true,
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messageCount: 1923,
        userCount: 112,
      },
    ];

    setRooms(sportsRooms);
    setActiveRoomId(sportsRooms[0].id);

    // Initialize demo messages and users for each room
    const demoMessages: Record<string, ChatMessageType[]> = {};
    const demoOnlineUsers: Record<string, OnlineUser[]> = {};

    sportsRooms.forEach((room) => {
      demoMessages[room.id] = [
        {
          id: `${room.id}-system`,
          roomId: room.id,
          userId: 'system',
          username: 'Tech Touchdown Bot',
          message: `Welcome to ${room.name}! ${room.description}`,
          messageType: 'system',
          role: 'admin',
          isEdited: false,
          isDeleted: false,
          reactions: [],
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          updatedAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ];

      demoOnlineUsers[room.id] = [
        { id: `${room.id}-user1`, roomId: room.id, userId: 'user1', username: 'SportsFan42', role: 'user', status: 'online', lastSeen: new Date().toISOString(), joinedAt: new Date().toISOString() },
        { id: `${room.id}-user2`, roomId: room.id, userId: 'user2', username: 'GameWatcher', role: 'user', status: 'online', lastSeen: new Date().toISOString(), joinedAt: new Date().toISOString() },
      ];
    });

    setMessages(demoMessages);
    setOnlineUsers(demoOnlineUsers);
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeRoomId]);

  // Simulate real-time messages from other users
  useEffect(() => {
    if (!isOpen || !activeRoomId) return;

    const demoUsernames = ['SportsFan42', 'GameWatcher', 'BallDontLie', 'CoachKiller', 'StatNerd', 'HoopsDreams'];
    const demoMessages = [
      'That last play was insane! 🔥',
      'Anyone else watching this game?',
      'The refs are really letting them play tonight',
      'Can\'t believe they made that comeback',
      'This is going to be a great series',
      'Defense is looking solid tonight',
      'That was a questionable call...',
      'MVP performance right there 👏',
      'This game is going down to the wire!',
    ];

    const interval = setInterval(() => {
      // 30% chance of a new message every 10 seconds
      if (Math.random() > 0.7) {
        const randomUsername = demoUsernames[Math.floor(Math.random() * demoUsernames.length)];
        const randomMessage = demoMessages[Math.floor(Math.random() * demoMessages.length)];

        const newMessage: ChatMessageType = {
          id: `msg-sim-${Date.now()}`,
          roomId: activeRoomId,
          userId: `sim-${randomUsername}`,
          username: randomUsername,
          message: randomMessage,
          messageType: 'text',
          role: 'user',
          isEdited: false,
          isDeleted: false,
          reactions: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setMessages((prev) => ({
          ...prev,
          [activeRoomId]: [...(prev[activeRoomId] || []), newMessage],
        }));
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [isOpen, activeRoomId]);

  const activeRoom = rooms.find((r) => r.id === activeRoomId);
  const roomMessages = activeRoomId ? messages[activeRoomId] || [] : [];
  const roomOnlineUsers = activeRoomId ? onlineUsers[activeRoomId] || [] : [];

  const handleSendMessage = (message: string) => {
    if (!activeRoomId || !user) return;

    const newMessage: ChatMessageType = {
      id: `msg-${Date.now()}`,
      roomId: activeRoomId,
      userId: user.id?.toString() || 'user',
      username: user.login || user.name || 'Anonymous',
      displayName: user.name,
      message,
      messageType: 'text',
      avatarUrl: user.avatar_url,
      role: 'user',
      isEdited: false,
      isDeleted: false,
      reactions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMessages((prev) => ({
      ...prev,
      [activeRoomId]: [...(prev[activeRoomId] || []), newMessage],
    }));

    setReplyingTo(null);
  };

  const handleReply = (message: ChatMessageType) => {
    setReplyingTo({
      username: message.username,
      message: message.message,
    });
  };

  const handleReact = (messageId: string, emoji: string) => {
    if (!activeRoomId || !user) return;

    setMessages((prev) => {
      const roomMessages = prev[activeRoomId] || [];
      return {
        ...prev,
        [activeRoomId]: roomMessages.map((msg) => {
          if (msg.id !== messageId) return msg;

          const existingReaction = msg.reactions.find((r) => r.emoji === emoji);
          const userId = user.id?.toString() || 'user';

          if (existingReaction) {
            const hasReacted = existingReaction.users.includes(userId);
            if (hasReacted) {
              const newUsers = existingReaction.users.filter((u) => u !== userId);
              return {
                ...msg,
                reactions: newUsers.length > 0
                  ? msg.reactions.map((r) =>
                      r.emoji === emoji ? { ...r, users: newUsers, count: newUsers.length } : r
                    )
                  : msg.reactions.filter((r) => r.emoji !== emoji),
              };
            } else {
              return {
                ...msg,
                reactions: msg.reactions.map((r) =>
                  r.emoji === emoji
                    ? { ...r, users: [...r.users, userId], count: r.users.length + 1 }
                    : r
                ),
              };
            }
          } else {
            return {
              ...msg,
              reactions: [...msg.reactions, { emoji, users: [userId], count: 1 }],
            };
          }
        }),
      };
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-40 bg-primary hover:bg-primary/90"
          size="icon"
          title={isAuthenticated ? "Open chat" : "View chat (sign in to participate)"}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Overlay */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[600px] h-[600px] bg-background border rounded-lg shadow-2xl z-50 flex">
          {/* Room List */}
          <div className="w-48 border-r">
            <div className="p-3 border-b flex items-center justify-between">
              <h3 className="font-semibold text-sm">Rooms</h3>
            </div>
            <div className="overflow-y-auto h-[calc(100%-52px)]">
              {rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setActiveRoomId(room.id)}
                  className={`w-full text-left px-3 py-2 hover:bg-accent transition-colors ${
                    activeRoomId === room.id ? 'bg-accent' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{room.icon}</span>
                    <span className="text-sm font-medium truncate">{room.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="h-14 border-b bg-card flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">{activeRoom?.icon}</span>
                <div>
                  <div className="flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    <h2 className="font-semibold text-sm">{activeRoom?.name}</h2>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {roomOnlineUsers.length} online
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {roomMessages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isOwn={message.userId === user?.id?.toString()}
                  onReply={handleReply}
                  onReact={handleReact}
                  currentUserId={user?.id?.toString()}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t">
              {isAuthenticated ? (
                <ChatInput
                  onSendMessage={handleSendMessage}
                  replyingTo={replyingTo}
                  onCancelReply={() => setReplyingTo(null)}
                  placeholder={`Message #${activeRoom?.name || 'chat'}`}
                />
              ) : (
                <div className="p-4 bg-muted/50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <LogIn className="h-4 w-4" />
                    <span>Sign in to join the conversation</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/login');
                    }}
                    className="ml-2"
                  >
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SportsChatOverlay;
