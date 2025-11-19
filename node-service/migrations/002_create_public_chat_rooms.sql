-- Migration: Create public chat rooms system
-- Date: 2025-01-19
-- Description: Creates tables for Discord-like public chat rooms with channels and messages

-- Create public_chat_rooms table to store chat room/channel information
CREATE TABLE IF NOT EXISTS public_chat_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE, -- URL-friendly name (e.g., 'general', 'sports-talk')
    description TEXT,
    category VARCHAR(100) DEFAULT 'general' CHECK (category IN ('general', 'sports', 'tech', 'gaming', 'off-topic')),
    icon VARCHAR(50) DEFAULT '💬', -- Emoji or icon identifier
    color VARCHAR(20) DEFAULT 'primary', -- Theme color (primary, secondary, accent, warning, gold)
    is_public BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_by VARCHAR(255), -- GitHub user ID of creator
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    message_count INTEGER DEFAULT 0,
    user_count INTEGER DEFAULT 0
);

-- Create public_chat_messages table to store messages in chat rooms
CREATE TABLE IF NOT EXISTS public_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES public_chat_rooms(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL, -- GitHub user ID
    username VARCHAR(255) NOT NULL, -- GitHub username/login
    display_name VARCHAR(255), -- Optional display name (defaults to username)
    message TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'system', 'join', 'leave')),
    avatar_url VARCHAR(500), -- GitHub avatar URL
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
    is_edited BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP WITH TIME ZONE,
    reply_to UUID REFERENCES public_chat_messages(id) ON DELETE SET NULL, -- For threaded replies
    reactions JSONB DEFAULT '[]', -- Array of reaction objects: [{emoji: '👍', users: ['user1', 'user2']}]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create online_users table to track who's currently in each room
CREATE TABLE IF NOT EXISTS public_chat_online_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES public_chat_rooms(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'online' CHECK (status IN ('online', 'away', 'busy')),
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(room_id, user_id)
);

-- Create user_room_preferences table for user-specific room settings
CREATE TABLE IF NOT EXISTS public_chat_user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES public_chat_rooms(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    is_muted BOOLEAN DEFAULT false,
    is_favorite BOOLEAN DEFAULT false,
    notification_level VARCHAR(20) DEFAULT 'all' CHECK (notification_level IN ('all', 'mentions', 'none')),
    last_read_message_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(room_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_public_chat_rooms_slug ON public_chat_rooms(slug);
CREATE INDEX IF NOT EXISTS idx_public_chat_rooms_category ON public_chat_rooms(category);
CREATE INDEX IF NOT EXISTS idx_public_chat_rooms_is_active ON public_chat_rooms(is_active);

CREATE INDEX IF NOT EXISTS idx_public_chat_messages_room_id ON public_chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_public_chat_messages_user_id ON public_chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_public_chat_messages_created_at ON public_chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_public_chat_messages_reply_to ON public_chat_messages(reply_to);
CREATE INDEX IF NOT EXISTS idx_public_chat_messages_is_deleted ON public_chat_messages(is_deleted);

CREATE INDEX IF NOT EXISTS idx_online_users_room_id ON public_chat_online_users(room_id);
CREATE INDEX IF NOT EXISTS idx_online_users_user_id ON public_chat_online_users(user_id);
CREATE INDEX IF NOT EXISTS idx_online_users_last_seen ON public_chat_online_users(last_seen);

CREATE INDEX IF NOT EXISTS idx_user_preferences_room_user ON public_chat_user_preferences(room_id, user_id);

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_public_chat_rooms_updated_at
    BEFORE UPDATE ON public_chat_rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_public_chat_messages_updated_at
    BEFORE UPDATE ON public_chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_public_chat_user_preferences_updated_at
    BEFORE UPDATE ON public_chat_user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to increment message count on new message
CREATE OR REPLACE FUNCTION increment_room_message_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public_chat_rooms
    SET message_count = message_count + 1
    WHERE id = NEW.room_id;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create trigger to auto-increment message count
CREATE TRIGGER auto_increment_message_count
    AFTER INSERT ON public_chat_messages
    FOR EACH ROW
    WHEN (NEW.is_deleted = false AND NEW.message_type = 'text')
    EXECUTE FUNCTION increment_room_message_count();

-- Insert default chat rooms
INSERT INTO public_chat_rooms (name, slug, description, category, icon, color) VALUES
    ('General', 'general', 'Main discussion channel for all topics', 'general', '💬', 'primary'),
    ('Sports Talk', 'sports-talk', 'Discuss the latest games, trades, and sports news', 'sports', '🏈', 'secondary'),
    ('Tech Hub', 'tech-hub', 'Programming, frameworks, and tech industry discussion', 'tech', '💻', 'accent'),
    ('Live Games', 'live-games', 'Real-time commentary during live sporting events', 'sports', '🔴', 'warning'),
    ('Betting Corner', 'betting-corner', 'Odds, picks, and betting strategy discussion', 'gaming', '💰', 'gold'),
    ('Off-Topic', 'off-topic', 'Anything goes - random discussions and fun', 'off-topic', '🎉', 'purple')
ON CONFLICT (slug) DO NOTHING;

-- Add some sample system messages for each room
INSERT INTO public_chat_messages (room_id, user_id, username, message, message_type)
SELECT
    id,
    'system',
    'Tech Touchdown Bot',
    'Welcome to ' || name || '! ' || description,
    'system'
FROM public_chat_rooms
WHERE NOT EXISTS (
    SELECT 1 FROM public_chat_messages WHERE room_id = public_chat_rooms.id
);
