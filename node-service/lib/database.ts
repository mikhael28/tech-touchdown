import { neon } from "@neondatabase/serverless";

// Database connection configuration
let sql: ReturnType<typeof neon> | null = null;

export const getDatabase = () => {
  if (!sql) {
    const databaseUrl = process.env.NEON_DATABASE_URL!;

    sql = neon(databaseUrl);
  }

  return sql;
};

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const sql = getDatabase();
    await sql`SELECT 1 as test`;
    return true;
  } catch (error) {
    console.error("Database connection test failed:", error);
    return false;
  }
};

// Initialize database tables (run migrations)
export const initializeDatabase = async (): Promise<boolean> => {
  try {
    const sql = getDatabase();

    // Create game_rooms table
    await sql`
      CREATE TABLE IF NOT EXISTS game_rooms (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        game_id VARCHAR(255) NOT NULL UNIQUE,
        away_team VARCHAR(255) NOT NULL,
        home_team VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        is_active BOOLEAN DEFAULT true
      )
    `;

    // Create chat_messages table
    await sql`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        game_room_id UUID NOT NULL REFERENCES game_rooms(id) ON DELETE CASCADE,
        user_id VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        team VARCHAR(10) NOT NULL CHECK (team IN ('away', 'home')),
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
        avatar_url VARCHAR(500),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_game_rooms_game_id ON game_rooms(game_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_chat_messages_game_room_id ON chat_messages(game_room_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_chat_messages_team ON chat_messages(team)`;

    // Create update trigger function
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `;

    // Create triggers
    await sql`DROP TRIGGER IF EXISTS update_game_rooms_updated_at ON game_rooms`;
    await sql`
      CREATE TRIGGER update_game_rooms_updated_at
          BEFORE UPDATE ON game_rooms
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column()
    `;

    await sql`DROP TRIGGER IF EXISTS update_chat_messages_updated_at ON chat_messages`;
    await sql`
      CREATE TRIGGER update_chat_messages_updated_at
          BEFORE UPDATE ON chat_messages
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column()
    `;

    console.log("✅ Database tables initialized successfully");
    return true;
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    return false;
  }
};

export default { getDatabase, testConnection, initializeDatabase };
