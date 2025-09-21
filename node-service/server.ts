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

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration for React Vite frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
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

// API Routes
app.use("/api/exa", exaRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/sports", sportsRoutes);

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
app.listen(PORT, () => {
  console.log(`🚀 Tech Touchdown API Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Exa AI API: http://localhost:${PORT}/api/exa`);
  console.log(`🏈 Sports API: http://localhost:${PORT}/api/sports`);
  console.log(`⚙️  Scripts API: http://localhost:${PORT}/api/scripts`);

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
});

export default app;
