// Load environment variables FIRST, before any other imports
import { config } from "dotenv";
import path from "path";

config({ path: path.join(process.cwd(), ".env") });

// Now import other modules that depend on environment variables
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import fetch from "node-fetch";
import exaRoutes from "./routes/exa";
import authRoutes from "./routes/auth";
import sportsRoutes from "./routes/sports";
import twilioRoutes from "./routes/twilio";
import twimlRoutes from "./routes/twiml";
import gameChatRoutes from "./routes/gameChat";
import { initializeDatabase, testConnection } from "./lib/database";

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration for React Vite frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Logging middleware
app.use(morgan("combined"));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static files (for frontend example and assets)
app.use("/static", express.static(__dirname));

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Jina AI endpoint
app.post("/api/jina", async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    if (!url) {
      res.status(400).json({
        error: {
          message: "URL is required",
        },
      });
      return;
    }

    const jinaUrl = `https://r.jina.ai/${url}`;
    const headers = {
      Authorization:
        "Bearer jina_c2e1c121a61e4e3ba0032a5abda74edfDb9wTnY7Bp00uewzE__W2uI5VcgG",
    };

    const response = await fetch(jinaUrl, { headers });

    if (!response.ok) {
      throw new Error(
        `Jina AI API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.text();

    res.status(200).json({
      success: true,
      data: data,
      url: url,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Jina AI error:", error);
    res.status(500).json({
      error: {
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch data from Jina AI",
      },
    });
  }
});

// Process single game with Jina + OpenAI
app.post("/api/game/process", async (req: Request, res: Response) => {
  try {
    const { gameId, url } = req.body;

    if (!gameId || !url) {
      res.status(400).json({
        error: {
          message: "Game ID and URL are required",
        },
      });
      return;
    }

    if (!process.env.OPENAI_API_KEY) {
      res.status(503).json({
        error: {
          message:
            "OpenAI API key not found. Please set OPENAI_API_KEY in environment variables.",
          code: "OPENAI_API_KEY_MISSING",
        },
      });
      return;
    }

    // Step 1: Fetch content using Jina AI
    const jinaUrl = `https://r.jina.ai/${url}`;
    const jinaHeaders = {
      Authorization:
        "Bearer jina_c2e1c121a61e4e3ba0032a5abda74edfDb9wTnY7Bp00uewzE__W2uI5VcgG",
    };

    const jinaResponse = await fetch(jinaUrl, { headers: jinaHeaders });

    if (!jinaResponse.ok) {
      throw new Error(
        `Jina AI API error: ${jinaResponse.status} ${jinaResponse.statusText}`
      );
    }

    const jinaData = await jinaResponse.text();

    // Step 2: Process with OpenAI to extract game data
    const systemPrompt = `You are a sports data processor. Extract the most up-to-date game information from the provided content and return it as a JSON object matching this exact TypeScript interface:

interface Game {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  gameStatus: 'scheduled' | 'live' | 'completed' | 'postponed' | 'cancelled';
  startTime?: string;
  date: string;
  isLive: boolean;
  isCompleted: boolean;
  period?: string;
  broadcast?: string;
  url?: string;
}

CRITICAL REQUIREMENTS:
- Return ONLY a valid JSON object, no other text, no markdown formatting
- Use the provided gameId as the id field
- Determine the appropriate gameStatus based on the content (e.g., "Final" = completed, "Top 5th" = live, "12:10 AM UTC" = scheduled)
- Set isLive to true if the game is currently in progress (has inning/period info)
- Set isCompleted to true if the game shows "Final" or similar completion status
- Extract team names and scores accurately
- Use the league name from the content or infer it appropriately
- Include the original URL in the url field

Return ONLY the JSON object, no other text.`;

    const userPrompt = `Extract the most current game information from this content for game ID "${gameId}": "${jinaData}"`;

    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          max_tokens: 1000,
          temperature: 0.3,
        }),
      }
    );

    if (!openaiResponse.ok) {
      throw new Error(
        `OpenAI API error: ${openaiResponse.status} ${openaiResponse.statusText}`
      );
    }

    const openaiData = (await openaiResponse.json()) as any;
    const content = openaiData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content received from OpenAI API");
    }

    // Clean the content to extract valid JSON
    let cleanedContent = content.trim();
    if (cleanedContent.startsWith("```json")) {
      cleanedContent = cleanedContent
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "");
    } else if (cleanedContent.startsWith("```")) {
      cleanedContent = cleanedContent
        .replace(/^```\s*/, "")
        .replace(/\s*```$/, "");
    }

    // Validate JSON
    let gameData;
    try {
      gameData = JSON.parse(cleanedContent);
    } catch (error) {
      console.error("Invalid JSON received from OpenAI:", cleanedContent);
      throw new Error("Invalid JSON format received from OpenAI API");
    }

    res.status(200).json({
      success: true,
      gameId,
      gameData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Game processing error:", error);
    res.status(500).json({
      error: {
        message:
          error instanceof Error
            ? error.message
            : "Failed to process game data",
      },
    });
  }
});

// API Routes
app.use("/api/exa", exaRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/sports", sportsRoutes);
app.use("/api/twilio", twilioRoutes);
app.use("/api/twiml", twimlRoutes);
app.use("/api/chat", gameChatRoutes);

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Tech Touchdown",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      exa: "/api/exa",
      auth: "/api/auth",
      sports: "/api/sports",
      twilio: "/api/twilio",
      twiml: "/api/twiml",
      jina: "/api/jina",
      scripts: "/api/scripts",
      frontend_example: "/static/frontend-example.html",
    },
    links: {
      "Test Interface": `http://localhost:${PORT}/static/frontend-example.html`,
      "API Documentation": "See README.md for full API documentation",
    },
  });
});

// Error handling middleware
interface CustomError extends Error {
  status?: number;
}

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
});

// 404 handler
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    error: {
      message: "Route not found",
      path: req.originalUrl,
    },
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Tech Touchdown API Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Exa AI API: http://localhost:${PORT}/api/exa`);
  console.log(`🏈 Sports API: http://localhost:${PORT}/api/sports`);
  console.log(`📞 Twilio API: http://localhost:${PORT}/api/twilio`);
  console.log(`🎵 TwiML API: http://localhost:${PORT}/api/twiml`);
  console.log(`💬 Game Chat API: http://localhost:${PORT}/api/chat`);
  console.log(`⚙️  Scripts API: http://localhost:${PORT}/api/scripts`);

  // Initialize database if NEON_DATABASE_URL is provided
  if (process.env.NEON_DATABASE_URL) {
    console.log(`🗄️  Initializing Neon database...`);
    try {
      const isConnected = await testConnection();
      if (isConnected) {
        const isInitialized = await initializeDatabase();
        if (isInitialized) {
          console.log(`✅ Neon database connected and initialized`);
        } else {
          console.log(`⚠️  Database connected but initialization failed`);
        }
      } else {
        console.log(`❌ Database connection failed`);
      }
    } catch (error) {
      console.log(`❌ Database setup error:`, error);
    }
  } else {
    console.log(`⚠️  NEON_DATABASE_URL not found - chat will use mock data`);
  }

  // Check for required environment variables
  if (!process.env.EXA_API_KEY && !process.env.EXASEARCH_API_KEY) {
    console.warn(
      "⚠️  Warning: EXA_API_KEY or EXASEARCH_API_KEY not found in environment variables"
    );
  }
  if (!process.env.OPENAI_API_KEY) {
    console.warn(
      "⚠️  Warning: OPENAI_API_KEY not found in environment variables"
    );
  }
  if (
    !process.env.TWILIO_ACCOUNT_SID ||
    !process.env.TWILIO_API_KEY ||
    !process.env.TWILIO_API_SECRET ||
    !process.env.TWILIO_TWIML_APP_SID
  ) {
    console.warn(
      "⚠️  Warning: Twilio configuration not found in environment variables"
    );
  }
});

export default app;
