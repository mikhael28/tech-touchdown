import express, { Request, Response } from "express";
const { AccessToken } = require("twilio").jwt;

// VoiceGrant class for Twilio v5
class VoiceGrant {
  key: string;
  outgoingApplicationSid: string;
  incomingAllow: boolean;

  constructor(options: {
    outgoingApplicationSid: string;
    incomingAllow: boolean;
  }) {
    this.key = "voice";
    this.outgoingApplicationSid = options.outgoingApplicationSid;
    this.incomingAllow = options.incomingAllow;
  }

  toPayload() {
    const payload: any = {
      outgoing: {
        application_sid: this.outgoingApplicationSid,
      },
    };

    if (this.incomingAllow) {
      payload.incoming = {
        allow: true,
      };
    }

    return payload;
  }
}

const router = express.Router();

// Generate Twilio access token for Voice SDK
router.post("/access-token", (req: Request, res: Response) => {
  try {
    const { identity, roomName } = req.body;

    if (!identity) {
      res.status(400).json({
        error: "Identity is required",
      });
      return;
    }

    // Validate required environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const apiKey = process.env.TWILIO_API_KEY;
    const apiSecret = process.env.TWILIO_API_SECRET;
    const appSid = process.env.TWILIO_TWIML_APP_SID;

    if (!accountSid || !apiKey || !apiSecret || !appSid) {
      res.status(500).json({
        error:
          "Missing required Twilio configuration. Please check environment variables.",
        missing: {
          accountSid: !accountSid,
          apiKey: !apiKey,
          apiSecret: !apiSecret,
          appSid: !appSid,
        },
      });
      return;
    }

    // Create access token
    const accessToken = new AccessToken(accountSid, apiKey, apiSecret, {
      identity: identity,
      ttl: 3600, // 1 hour
    });

    // Create voice grant for Twilio v5
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: appSid,
      incomingAllow: true,
    });

    accessToken.addGrant(voiceGrant);

    res.status(200).json({
      success: true,
      token: accessToken.toJwt(),
      identity: identity,
      roomName: roomName || `game-chat-${Date.now()}`,
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
    });
  } catch (error) {
    console.error("Twilio access token error:", error);
    res.status(500).json({
      error: "Failed to generate access token",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Generate room-specific conference endpoint
router.post("/conference/join", (req: Request, res: Response) => {
  try {
    const { identity, roomName } = req.body;

    if (!identity || !roomName) {
      res.status(400).json({
        error: "Both identity and roomName are required",
      });
      return;
    }

    // Validate required environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const apiKey = process.env.TWILIO_API_KEY;
    const apiSecret = process.env.TWILIO_API_SECRET;
    const appSid = process.env.TWILIO_TWIML_APP_SID;

    if (!accountSid || !apiKey || !apiSecret || !appSid) {
      res.status(500).json({
        error: "Missing required Twilio configuration",
      });
      return;
    }

    // Create access token for conference
    const accessToken = new AccessToken(accountSid, apiKey, apiSecret, {
      identity: identity,
      ttl: 3600, // 1 hour
    });

    // Create voice grant with conference capability for Twilio v5
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: appSid,
      incomingAllow: true,
    });

    accessToken.addGrant(voiceGrant);

    res.status(200).json({
      success: true,
      token: accessToken.toJwt(),
      identity: identity,
      roomName: roomName,
      conferenceUrl: `conference:${roomName}`,
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
    });
  } catch (error) {
    console.error("Twilio conference join error:", error);
    res.status(500).json({
      error: "Failed to join conference",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
