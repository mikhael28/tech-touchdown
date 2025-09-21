import { Router, Request, Response, NextFunction } from "express";
import fetch from "node-fetch";

const router = Router();

// TypeScript interfaces matching the sports schema
export interface Game {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  gameStatus: string;
  startTime?: string;
  date: string;
  isLive: boolean;
  isCompleted: boolean;
  period?: string;
  broadcast?: string;
}

export interface League {
  name: string;
  games: Game[];
}

export interface SportsData {
  leagues: League[];
  lastUpdated: string;
}

export type GameStatus =
  | "scheduled"
  | "live"
  | "completed"
  | "postponed"
  | "cancelled";

// Request body interface
interface SportsPromptRequest {
  prompt: string;
  maxGames?: number;
  includeCompleted?: boolean;
  includeScheduled?: boolean;
  includeLive?: boolean;
}

// OpenAI API configuration
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o";
const OPENAI_MAX_TOKENS = parseInt(process.env.OPENAI_MAX_TOKENS || "5000");
const OPENAI_TEMPERATURE = parseFloat(process.env.OPENAI_TEMPERATURE || "0.3");

// Check if OpenAI API key is available
const checkOpenAIAvailable = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
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
  next();
};

// Generate sports data from text prompt
router.post(
  "/generate",
  checkOpenAIAvailable,
  async (
    req: Request<{}, any, SportsPromptRequest>,
    res: Response
  ): Promise<void> => {
    try {
      const {
        prompt,
        maxGames = 20,
        includeCompleted = true,
        includeScheduled = true,
        includeLive = true,
      } = req.body;

      if (!prompt || prompt.trim().length === 0) {
        res.status(400).json({
          error: {
            message: "Prompt is required and cannot be empty",
            code: "MISSING_PROMPT",
          },
        });
        return;
      }

      // Validate maxGames
      const validatedMaxGames = Math.min(Math.max(maxGames, 1), 50);

      // Create the system prompt for OpenAI
      const systemPrompt = `You are a sports data generator. Extract ALL sports games from the provided data and return them as a JSON array. You must extract EVERY game mentioned in the data, not just one. Each game should match this exact TypeScript interface:

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
- You MUST return a JSON array containing ALL games found in the data
- Do NOT return just one game - extract every single game mentioned
- The response must start with [ and end with ] to be a valid JSON array
- For each game, determine the appropriate gameStatus based on the game state (e.g., "Final" = completed, "Top 5th" = live, "12:10 AM UTC" = scheduled)
- Set isLive to true if the game is currently in progress (has inning/period info)
- Set isCompleted to true if the game shows "Final" or similar completion status
- Extract team names from the format (e.g., "CHC" vs "CIN")
- Extract scores when available, set to null if not shown
- Use the league name from the section headers (e.g., "Major League Baseball", "Premier League")
- Generate a unique id for each game (e.g., "mlb-chc-cin-2025-09-20")

Return ONLY a valid JSON array with all games, no other text, no markdown formatting, no code blocks. Example format: [{"id": "game1", "league": "MLB", ...}, {"id": "game2", "league": "MLB", ...}]`;

      const userPrompt = `Extract ALL sports games from this data: "${prompt}"

Parse every single game mentioned in the data and return them as a JSON array. Do not skip any games - extract every one you can find. Do not return with Markdown syntax, return a stringified JSON array.`;

      // Prepare the OpenAI API request
      const requestBody = {
        model: OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        max_tokens: OPENAI_MAX_TOKENS,
        temperature: OPENAI_TEMPERATURE,
      };

      // Make the API call to OpenAI
      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `OpenAI API error: ${response.status} ${response.statusText}.`
        );
      }

      const data = await response.json();
      // @ts-ignore
      const content = data.choices?.[0]?.message?.content;
      console.log(content);

      if (!content) {
        throw new Error("No content received from OpenAI API");
      }

      // Clean the content to extract valid JSON
      let cleanedContent = content.trim();

      // Remove markdown code blocks if present
      if (cleanedContent.startsWith("```json")) {
        cleanedContent = cleanedContent
          .replace(/^```json\s*/, "")
          .replace(/\s*```$/, "");
      } else if (cleanedContent.startsWith("```")) {
        cleanedContent = cleanedContent
          .replace(/^```\s*/, "")
          .replace(/\s*```$/, "");
      }

      // Validate that it's valid JSON
      try {
        JSON.parse(cleanedContent);
      } catch (error) {
        console.error("Invalid JSON received from OpenAI:", cleanedContent);
        throw new Error("Invalid JSON format received from OpenAI API");
      }

      // Return the cleaned JSON string
      res.json({
        success: true,
        prompt,
        options: {
          maxGames: validatedMaxGames,
          includeCompleted,
          includeScheduled,
          includeLive,
        },
        data: cleanedContent,
      });
    } catch (error: any) {
      console.error("Sports data generation error:", error);
      res.status(500).json({
        error: {
          message: error.message || "Failed to generate sports data",
          code: "SPORTS_GENERATION_FAILED",
        },
      });
    }
  }
);

// Health check for sports service
router.get("/health", (req: Request, res: Response) => {
  res.json({
    service: "sports",
    status: "healthy",
    openaiAvailable: !!process.env.OPENAI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

export default router;
