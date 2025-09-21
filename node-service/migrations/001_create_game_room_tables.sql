-- Migration: Create game room chat tables
-- Date: 2025-09-21
-- Description: Creates tables for storing game room chat messages with user authentication

-- Create game_rooms table to store information about each game's chat room
CREATE TABLE IF NOT EXISTS game_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id VARCHAR(255) NOT NULL UNIQUE,
    away_team VARCHAR(255) NOT NULL,
    home_team VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Create chat_messages table to store individual messages
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_room_id UUID NOT NULL REFERENCES game_rooms(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL, -- GitHub user ID
    username VARCHAR(255) NOT NULL, -- GitHub username/login
    message TEXT NOT NULL,
    team VARCHAR(10) NOT NULL CHECK (team IN ('away', 'home')),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
    avatar_url VARCHAR(500), -- GitHub avatar URL
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_game_rooms_game_id ON game_rooms(game_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_game_room_id ON chat_messages(game_room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_team ON chat_messages(team);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_game_rooms_updated_at
    BEFORE UPDATE ON game_rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_messages_updated_at
    BEFORE UPDATE ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add some sample data for testing (optional)
-- This can be removed in production
INSERT INTO game_rooms (game_id, away_team, home_team) VALUES
    ('sample-game-1', 'Lakers', 'Warriors')
ON CONFLICT (game_id) DO NOTHING;