import express, { Request, Response } from "express";
import { getDatabase } from "../lib/database";

const router = express.Router();

// Mock data fallback
const mockMessages = [
  {
    id: "1",
    username: "SportsFan99",
    message: "This is going to be an amazing game!",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    team: "away",
    role: "user",
    user_id: "mock-user-1",
  },
  {
    id: "2",
    username: "HomeTeamChamp",
    message: "Our defense is looking solid this season",
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    team: "home",
    role: "user",
    user_id: "mock-user-2",
  },
  {
    id: "3",
    username: "GameModerator",
    message: "Welcome to the live chat! Please keep it respectful.",
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    team: "away",
    role: "moderator",
    user_id: "mock-user-3",
  },
];

// Get messages for a specific game room
router.get("/games/:gameId/messages", async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    const { awayTeam, homeTeam } = req.query;

    if (!gameId) {
      return res.status(400).json({
        error: "Game ID is required",
      });
    }

    const sql = getDatabase();

    // Get or create game room
    let gameRoom = await sql`
      SELECT * FROM game_rooms WHERE game_id = ${gameId}
    `;

    // Auto-create game room if it doesn't exist
    // @ts-ignore
    if (gameRoom.length === 0) {
      const awayTeamName = (awayTeam as string) || "Away Team";
      const homeTeamName = (homeTeam as string) || "Home Team";

      const newRoom = await sql`
        INSERT INTO game_rooms (game_id, away_team, home_team)
        VALUES (${gameId}, ${awayTeamName}, ${homeTeamName})
        RETURNING *
      `;
      gameRoom = newRoom;
    }

    // Get messages for the game room
    const messages = await sql`
      SELECT
        cm.id,
        cm.user_id,
        cm.username,
        cm.message,
        cm.team,
        cm.role,
        cm.avatar_url as avatar,
        cm.created_at as timestamp
      FROM chat_messages cm
      WHERE cm.game_room_id = ${(gameRoom as any[])[0]?.id}
      ORDER BY cm.created_at ASC
    `;

    return res.json({
      success: true,
      // @ts-ignore
      messages: messages.map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
      // @ts-ignore
      gameRoom: gameRoom[0],
      fallback: false,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);

    // Return mock data as fallback
    return res.json({
      success: true,
      messages: mockMessages,
      gameRoom: {
        id: "mock-room",
        game_id: req.params.gameId,
        away_team: req.query.awayTeam || "Away Team",
        home_team: req.query.homeTeam || "Home Team",
      },
      fallback: true,
      error: "Database unavailable, using mock data",
    });
  }
});

// Post a new message to a game room
router.post("/games/:gameId/messages", async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    const { message, team, username, awayTeam, homeTeam } = req.body;

    if (!gameId || !message || !team || !username) {
      return res.status(400).json({
        error: "Game ID, message, team, and username are required",
      });
    }

    const sql = getDatabase();

    // Get or create game room
    let gameRoom = await sql`
      SELECT * FROM game_rooms WHERE game_id = ${gameId}
    `;

    let id = null;

    // @ts-ignore
    if (gameRoom.length === 0) {
      const awayTeamName = awayTeam || "Away Team";
      const homeTeamName = homeTeam || "Home Team";

      const newRoom = await sql`
        INSERT INTO game_rooms (game_id, away_team, home_team)
        VALUES (${gameId}, ${awayTeamName}, ${homeTeamName})
        RETURNING *
      `;
      gameRoom = newRoom;
    }

    // Insert the new message
    // @ts-ignore
    if (gameRoom.length > 0 && "id" in gameRoom[0]) {
      // @ts-ignore
      id = gameRoom[0].id;
    }

    const newMessage = await sql`
      INSERT INTO chat_messages (
        game_room_id,
        user_id,
        username,
        message,
        team,
        role
      )
      VALUES (
        ${id},
        ${username},
        ${username},
        ${message},
        ${team},
        'user'
      )
      RETURNING
        id,
        user_id,
        username,
        message,
        team,
        role,
        avatar_url as avatar,
        created_at as timestamp
    `;

    return res.status(201).json({
      success: true,
      message: {
        // @ts-ignore
        ...newMessage[0],
        // @ts-ignore
        timestamp: new Date(newMessage[0].timestamp),
      },
    });
  } catch (error) {
    console.error("Error posting message:", error);

    return res.status(500).json({
      error: "Failed to post message. Database may be unavailable.",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get game room info
router.get("/games/:gameId", async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;

    if (!gameId) {
      return res.status(400).json({
        error: "Game ID is required",
      });
    }

    const sql = getDatabase();

    const gameRoom = await sql`
      SELECT * FROM game_rooms WHERE game_id = ${gameId}
    `;

    // @ts-ignore
    if (gameRoom.length === 0) {
      return res.status(404).json({
        error: "Game room not found",
      });
    }

    return res.json({
      success: true,
      // @ts-ignore
      gameRoom: gameRoom[0],
    });
  } catch (error) {
    console.error("Error fetching game room:", error);
    return res.status(500).json({
      error: "Failed to fetch game room",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Create a new game room
router.post("/games/:gameId", async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    const { awayTeam, homeTeam } = req.body;

    if (!gameId || !awayTeam || !homeTeam) {
      return res.status(400).json({
        error: "Game ID, away team, and home team are required",
      });
    }

    const sql = getDatabase();

    // Check if game room already exists
    const existingRoom = await sql`
      SELECT * FROM game_rooms WHERE game_id = ${gameId}
    `;

    // @ts-ignore
    if (existingRoom.length > 0) {
      return res.status(409).json({
        error: "Game room already exists",
        // @ts-ignore
        gameRoom: existingRoom[0],
      });
    }

    // Create new game room
    const newRoom = await sql`
      INSERT INTO game_rooms (game_id, away_team, home_team)
      VALUES (${gameId}, ${awayTeam}, ${homeTeam})
      RETURNING *
    `;

    return res.status(201).json({
      success: true,
      // @ts-ignore
      gameRoom: newRoom[0],
    });
  } catch (error) {
    console.error("Error creating game room:", error);
    return res.status(500).json({
      error: "Failed to create game room",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
