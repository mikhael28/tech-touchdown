import React, { useState, useEffect, useRef } from 'react';
import { ChatRoom, ChatMessage as ChatMessageType, OnlineUser } from '../types/chat';
import ChatRoomList from '../components/ChatRoomList';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import ChatUserList from '../components/ChatUserList';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Hash, Users, X, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Chat: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessageType[]>>({});
  const [onlineUsers, setOnlineUsers] = useState<Record<string, OnlineUser[]>>({});
  const [replyingTo, setReplyingTo] = useState<{ username: string; message: string } | null>(null);
  const [showUserList, setShowUserList] = useState(true);
  const [showRoomList, setShowRoomList] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Initialize demo data
  useEffect(() => {
    // Demo rooms
    const demoRooms: ChatRoom[] = [
      {
        id: '1',
        name: 'General',
        slug: 'general',
        description: 'Main discussion channel for all topics',
        category: 'general',
        icon: '💬',
        color: 'primary',
        isPublic: true,
        isActive: true,
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messageCount: 1247,
        userCount: 89,
      },
      {
        id: '2',
        name: 'Sports Talk',
        slug: 'sports-talk',
        description: 'Discuss the latest games, trades, and sports news',
        category: 'sports',
        icon: '🏈',
        color: 'secondary',
        isPublic: true,
        isActive: true,
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messageCount: 3421,
        userCount: 156,
      },
      {
        id: '3',
        name: 'Tech Hub',
        slug: 'tech-hub',
        description: 'Programming, frameworks, and tech industry discussion',
        category: 'tech',
        icon: '💻',
        color: 'accent',
        isPublic: true,
        isActive: true,
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messageCount: 892,
        userCount: 67,
      },
      {
        id: '4',
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
        id: '5',
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
      {
        id: '6',
        name: 'Off-Topic',
        slug: 'off-topic',
        description: 'Anything goes - random discussions and fun',
        category: 'off-topic',
        icon: '🎉',
        color: 'purple',
        isPublic: true,
        isActive: true,
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messageCount: 2156,
        userCount: 98,
      },
    ];

    setRooms(demoRooms);
    setActiveRoomId(demoRooms[0].id);

    // Demo messages for each room
    const demoMessages: Record<string, ChatMessageType[]> = {};
    demoRooms.forEach((room) => {
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
        ...generateDemoMessages(room.id, room.name),
      ];
    });

    setMessages(demoMessages);

    // Demo online users
    const demoOnlineUsers: Record<string, OnlineUser[]> = {};
    demoRooms.forEach((room) => {
      demoOnlineUsers[room.id] = generateDemoUsers(room.id);
    });

    setOnlineUsers(demoOnlineUsers);
  }, []);

  // Generate demo messages
  const generateDemoMessages = (roomId: string, roomName: string): ChatMessageType[] => {
    const demoUsers = [
      { id: 'user1', username: 'SportsFan42', avatar: null },
      { id: 'user2', username: 'TechGuru', avatar: null },
      { id: 'user3', username: 'BetMaster', avatar: null },
      { id: 'user4', username: 'CodeNinja', avatar: null },
    ];

    const sampleMessages = [
      "Hey everyone! Great to be here 👋",
      "Anyone watching the game tonight?",
      "Just saw the latest tech news, pretty exciting!",
      "What do you all think about the new feature?",
      "This community is amazing!",
      "Looking forward to the next match!",
      "Anyone else working on a new project?",
      "The odds look interesting today 🎲",
    ];

    return sampleMessages.map((text, idx) => {
      const user = demoUsers[idx % demoUsers.length];
      return {
        id: `${roomId}-msg-${idx}`,
        roomId,
        userId: user.id,
        username: user.username,
        message: text,
        messageType: 'text',
        role: idx === 0 ? 'moderator' : 'user',
        isEdited: false,
        isDeleted: false,
        reactions: idx % 3 === 0 ? [
          { emoji: '👍', users: ['user1', 'user2'], count: 2 },
          { emoji: '🔥', users: ['user3'], count: 1 },
        ] : [],
        createdAt: new Date(Date.now() - (sampleMessages.length - idx) * 600000).toISOString(),
        updatedAt: new Date(Date.now() - (sampleMessages.length - idx) * 600000).toISOString(),
      };
    });
  };

  // Generate demo online users
  const generateDemoUsers = (roomId: string): OnlineUser[] => {
    const demoUsers = [
      { userId: 'user1', username: 'SportsFan42', role: 'moderator', status: 'online' },
      { userId: 'user2', username: 'TechGuru', role: 'user', status: 'online' },
      { userId: 'user3', username: 'BetMaster', role: 'user', status: 'away' },
      { userId: 'user4', username: 'CodeNinja', role: 'admin', status: 'online' },
      { userId: 'user5', username: 'GameWatcher', role: 'user', status: 'online' },
    ];

    return demoUsers.map((user, idx) => ({
      id: `${roomId}-${user.userId}`,
      roomId,
      userId: user.userId,
      username: user.username,
      role: user.role as 'user' | 'moderator' | 'admin',
      status: user.status as 'online' | 'away' | 'busy',
      lastSeen: new Date().toISOString(),
      joinedAt: new Date(Date.now() - idx * 3600000).toISOString(),
    }));
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeRoomId]);

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
            // Toggle reaction
            const hasReacted = existingReaction.users.includes(userId);
            if (hasReacted) {
              // Remove reaction
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
              // Add reaction
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
            // New reaction
            return {
              ...msg,
              reactions: [...msg.reactions, { emoji, users: [userId], count: 1 }],
            };
          }
        }),
      };
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="text-6xl">💬</div>
          <h1 className="text-2xl font-bold text-foreground">Chat Rooms</h1>
          <p className="text-muted-foreground max-w-md">
            Please sign in with GitHub to access the chat rooms and join the conversation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background">
      {/* Room List Sidebar (Collapsible on Mobile) */}
      <div
        className={`${
          showRoomList ? 'w-64' : 'w-0'
        } transition-all duration-300 overflow-hidden flex-shrink-0`}
      >
        <ChatRoomList
          rooms={rooms}
          activeRoomId={activeRoomId}
          onRoomSelect={setActiveRoomId}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeRoom ? (
          <>
            {/* Chat Header */}
            <div className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
              <div className="flex items-center gap-3 min-w-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 lg:hidden"
                  onClick={() => setShowRoomList(!showRoomList)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <span className="text-2xl flex-shrink-0">{activeRoom.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-primary flex-shrink-0" />
                    <h2 className="font-semibold text-foreground truncate">{activeRoom.name}</h2>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{activeRoom.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant="outline" className="hidden sm:flex">
                  {roomOnlineUsers.length} online
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowUserList(!showUserList)}
                  title={showUserList ? 'Hide users' : 'Show users'}
                >
                  {showUserList ? <X className="h-5 w-5" /> : <Users className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto"
              style={{ scrollBehavior: 'smooth' }}
            >
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

            {/* Input Area */}
            <ChatInput
              onSendMessage={handleSendMessage}
              replyingTo={replyingTo}
              onCancelReply={() => setReplyingTo(null)}
              placeholder={`Message #${activeRoom.name}`}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-6xl">💬</div>
              <h2 className="text-xl font-semibold text-foreground">Select a Room</h2>
              <p className="text-muted-foreground">Choose a chat room from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>

      {/* Online Users Sidebar (Collapsible) */}
      <div
        className={`${
          showUserList ? 'w-64' : 'w-0'
        } transition-all duration-300 overflow-hidden flex-shrink-0`}
      >
        <ChatUserList users={roomOnlineUsers} currentUserId={user?.id?.toString()} />
      </div>
    </div>
  );
};

export default Chat;
