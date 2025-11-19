// Public Chat Room Types

export type ChatCategory = 'general' | 'sports' | 'tech' | 'gaming' | 'off-topic';
export type MessageType = 'text' | 'system' | 'join' | 'leave';
export type UserRole = 'user' | 'moderator' | 'admin';
export type UserStatus = 'online' | 'away' | 'busy';
export type NotificationLevel = 'all' | 'mentions' | 'none';
export type ThemeColor = 'primary' | 'secondary' | 'accent' | 'warning' | 'gold' | 'purple';

// Chat Room/Channel
export interface ChatRoom {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ChatCategory;
  icon: string; // Emoji
  color: ThemeColor;
  isPublic: boolean;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  userCount: number;
}

// Chat Message
export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  displayName?: string;
  message: string;
  messageType: MessageType;
  avatarUrl?: string;
  role: UserRole;
  isEdited: boolean;
  isDeleted: boolean;
  deletedAt?: string;
  replyTo?: string; // Message ID this is replying to
  reactions: MessageReaction[];
  createdAt: string;
  updatedAt: string;
}

// Message Reaction
export interface MessageReaction {
  emoji: string;
  users: string[]; // Array of user IDs
  count: number;
}

// Online User
export interface OnlineUser {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  status: UserStatus;
  role: UserRole;
  lastSeen: string;
  joinedAt: string;
}

// User Preferences for a room
export interface UserRoomPreferences {
  id: string;
  roomId: string;
  userId: string;
  isMuted: boolean;
  isFavorite: boolean;
  notificationLevel: NotificationLevel;
  lastReadMessageId?: string;
  createdAt: string;
  updatedAt: string;
}

// Typing Indicator
export interface TypingIndicator {
  userId: string;
  username: string;
  roomId: string;
  timestamp: number;
}

// Message with Reply Context (for displaying threaded messages)
export interface MessageWithReply extends ChatMessage {
  replyToMessage?: ChatMessage;
}

// User with Presence
export interface UserWithPresence {
  userId: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  lastSeen: string;
}

// Chat State (for managing UI state)
export interface ChatState {
  rooms: ChatRoom[];
  activeRoomId: string | null;
  messages: Record<string, ChatMessage[]>; // Key: roomId, Value: messages
  onlineUsers: Record<string, OnlineUser[]>; // Key: roomId, Value: users
  typingUsers: Record<string, TypingIndicator[]>; // Key: roomId, Value: typing indicators
  unreadCounts: Record<string, number>; // Key: roomId, Value: unread count
  isLoading: boolean;
  error: string | null;
}

// Send Message Request
export interface SendMessageRequest {
  roomId: string;
  message: string;
  replyTo?: string;
}

// Edit Message Request
export interface EditMessageRequest {
  messageId: string;
  message: string;
}

// Delete Message Request
export interface DeleteMessageRequest {
  messageId: string;
}

// Add Reaction Request
export interface AddReactionRequest {
  messageId: string;
  emoji: string;
}

// Join Room Request
export interface JoinRoomRequest {
  roomId: string;
}

// Leave Room Request
export interface LeaveRoomRequest {
  roomId: string;
}

// Update User Status Request
export interface UpdateUserStatusRequest {
  status: UserStatus;
}

// WebSocket Events
export type ChatWebSocketEvent =
  | 'message:new'
  | 'message:edit'
  | 'message:delete'
  | 'message:reaction'
  | 'user:join'
  | 'user:leave'
  | 'user:typing'
  | 'user:status'
  | 'room:update';

export interface WebSocketMessage {
  event: ChatWebSocketEvent;
  data: any;
  timestamp: string;
}

// API Responses
export interface ChatRoomsResponse {
  success: boolean;
  data: ChatRoom[];
  error?: string;
}

export interface ChatMessagesResponse {
  success: boolean;
  data: {
    messages: ChatMessage[];
    hasMore: boolean;
    nextCursor?: string;
  };
  error?: string;
}

export interface OnlineUsersResponse {
  success: boolean;
  data: OnlineUser[];
  error?: string;
}

export interface SendMessageResponse {
  success: boolean;
  data: ChatMessage;
  error?: string;
}

// Pagination
export interface MessagePaginationParams {
  roomId: string;
  limit?: number;
  cursor?: string; // Message ID to paginate from
  before?: boolean; // Get messages before cursor (for scrolling up)
}

// Search
export interface MessageSearchParams {
  roomId: string;
  query: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

// Notification
export interface ChatNotification {
  id: string;
  type: 'mention' | 'reply' | 'room';
  roomId: string;
  roomName: string;
  messageId: string;
  message: string;
  sender: string;
  senderAvatar?: string;
  isRead: boolean;
  createdAt: string;
}
