import express, { Request, Response } from "express";

const router = express.Router();

// TwiML endpoint for voice calls to join conference
router.post("/voice", (req: Request, res: Response) => {
  try {
    const { To } = req.body;

    // Extract room name from the To parameter (format: conference:roomName)
    let roomName = "default-room";
    if (To && To.startsWith("conference:")) {
      roomName = To.replace("conference:", "");
    }

    // Generate TwiML response to join conference
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial>
    <Conference
      waitUrl="http://twimlets.com/holdmusic?Bucket=com.twilio.music.ambient"
      statusCallback="/api/twiml/conference-status"
      statusCallbackEvent="start end join leave mute hold"
      statusCallbackMethod="POST"
      record="false"
      trim="trim-silence"
      maxParticipants="20"
      beep="false"
      endConferenceOnExit="false"
    >${roomName}</Conference>
  </Dial>
</Response>`;

    res.set("Content-Type", "text/xml");
    res.status(200).send(twiml);

  } catch (error) {
    console.error("TwiML voice error:", error);

    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Sorry, there was an error joining the conference. Please try again.</Say>
  <Hangup/>
</Response>`;

    res.set("Content-Type", "text/xml");
    res.status(500).send(errorTwiml);
  }
});

// Conference status callback endpoint
router.post("/conference-status", (req: Request, res: Response) => {
  try {
    const {
      ConferenceSid,
      StatusCallbackEvent,
      FriendlyName,
      Timestamp,
      ParticipantLabel
    } = req.body;

    console.log(`Conference ${StatusCallbackEvent}:`, {
      conferenceSid: ConferenceSid,
      roomName: FriendlyName,
      participant: ParticipantLabel,
      timestamp: Timestamp
    });

    // You can add additional logic here to track conference events
    // For example, updating a database or sending real-time notifications

    res.status(200).send("OK");
  } catch (error) {
    console.error("Conference status callback error:", error);
    res.status(500).send("Error");
  }
});

// Health check for TwiML endpoints
router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    service: "TwiML endpoints",
    timestamp: new Date().toISOString()
  });
});

export default router;