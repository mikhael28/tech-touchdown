import express, { Request, Response } from 'express';
import fetch from 'node-fetch';

const router = express.Router();

interface FavoriteArticle {
  id: string;
  title: string;
  url: string;
  summary?: string;
  publishedDate?: string;
  author?: string;
  savedAt: Date;
}

interface Host {
  id: string;
  name: string;
  role: string;
  photoUrl?: string;
  bio: string;
  expertise: string[];
  personalityTraits: string[];
  twitterHandle?: string;
}

interface GenerateShowRequest {
  summary: string;
  favorites: FavoriteArticle[];
  hosts?: Host[];
  targetDuration?: number;
  episodeNumber?: number;
}

interface OpenAIResponse {
  id: string;
  choices: {
    message: {
      content: string;
    };
  }[];
}

// Generate a show schedule from favorite articles
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { summary, favorites, hosts, targetDuration = 3600, episodeNumber }: GenerateShowRequest = req.body;

    // Validate inputs
    if (!summary || !favorites || favorites.length === 0) {
      res.status(400).json({
        error: {
          message: 'Summary and favorites are required',
        },
      });
      return;
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      res.status(503).json({
        error: {
          message: 'OpenAI API key not configured on server',
          code: 'OPENAI_API_KEY_MISSING',
        },
      });
      return;
    }

    // Create the prompt
    const systemPrompt = getSystemPrompt();
    const userPrompt = createPrompt(summary, favorites, targetDuration);

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.json() as any;
      throw new Error(`OpenAI API error: ${error.error?.message || openaiResponse.statusText}`);
    }

    const data = await openaiResponse.json() as OpenAIResponse;
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('Invalid response from OpenAI API');
    }
    
    const choice = data.choices[0];
    if (!choice || !choice.message || !choice.message.content) {
      throw new Error('Invalid response from OpenAI API');
    }
    
    const generatedContent = choice.message.content;

    // Parse the JSON response
    let showData;
    try {
      showData = JSON.parse(generatedContent);
    } catch (error) {
      console.error('Error parsing OpenAI response:', generatedContent);
      throw new Error('Invalid JSON response from OpenAI');
    }

    // Construct the full Show object
    const show = {
      id: generateId(),
      title: showData.title || 'Tech Touchdown',
      episodeNumber: episodeNumber,
      airDate: new Date().toISOString(),
      estimatedDurationSeconds: targetDuration,
      hosts: hosts || getDefaultHosts(),
      blocks: showData.blocks || [],
      openingTeaser: showData.openingTeaser,
      closingTeaser: showData.closingTeaser,
      metadata: {
        producer: 'AI Generated',
        director: 'AI Generated',
        studio: 'Tech Touchdown Studios',
        tags: extractTags(favorites),
      },
      status: 'planning',
    };

    res.status(200).json({
      success: true,
      show,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Show generation error:', error);
    res.status(500).json({
      error: {
        message: error instanceof Error ? error.message : 'Failed to generate show',
      },
    });
  }
});

// Helper functions
function getSystemPrompt(): string {
  return `You are an expert TV show producer for "Tech Touchdown," a hybrid sports and tech/AI talk show. 
Your job is to take a collection of news articles (sports and tech) and create a comprehensive show schedule with blocks, segments, debate structures, and production notes.

The show should:
- Balance sports and tech/AI content
- Create engaging debate structures between hosts
- Build tension throughout the show
- Include cold opens, main debates, quick hitters, and closing segments
- Allocate time appropriately across all segments
- Reference specific articles in the relevant segments

Return ONLY valid JSON matching the Show type structure. Include:
- Multiple blocks (A, B, C, D blocks)
- Varied segment types (cold open, main debates, quick hitters, etc.)
- Detailed debate structures with host takes and talking points
- Production notes and media asset suggestions
- Tension levels and pacing notes

`; 
}

function createPrompt(summary: string, favorites: FavoriteArticle[], targetDuration: number): string {
  const articlesContext = favorites.map((fav, idx) => 
    `Article ${idx + 1}:
Title: ${fav.title}
Summary: ${fav.summary || 'No summary available'}
URL: ${fav.url}
Published: ${fav.publishedDate || 'Unknown'}
`
  ).join('\n\n');

  return `Create a ${Math.floor(targetDuration / 60)}-minute show based on the following:

SHOW SUMMARY:
${summary}

AVAILABLE ARTICLES:
${articlesContext}

Please generate a complete show structure with:
1. An engaging title based on the content
2. 4 blocks (A_BLOCK, B_BLOCK, C_BLOCK, D_BLOCK) with varied segment types
3. A cold open that hooks viewers with the most explosive topic
4. Main debate segments with detailed debate structures including:
   - A central debate question
   - Host takes with positions (PRO, AGAINST, NEUTRAL)
   - Talking points for each host
   - Fact check points
   - Exit strategies
5. Quick hitters for covering multiple stories briefly
6. Appropriate tension levels building throughout
7. Opening and closing teasers
8. Production notes for each segment
9. Realistic time allocations that sum to approximately ${targetDuration} seconds

Make sure to:
- Reference specific articles by their titles in the relevant segments
- Create engaging debate questions that connect sports and tech themes
- Balance the content between sports and tech/AI topics
- Suggest specific media assets (highlight packages, graphics, stats)
- Include specific talking points that reference the article content

Return the response as a JSON object with this structure. Only return a JSON object, no other text, no markdown formatting, no code blocks. Dont' try to return a js object, return json compliant.


// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export enum BlockType {
  A_BLOCK = "A_BLOCK",
  B_BLOCK = "B_BLOCK",
  C_BLOCK = "C_BLOCK",
  D_BLOCK = "D_BLOCK",
}

export enum SegmentType {
  COLD_OPEN = "COLD_OPEN",
  MAIN_DEBATE = "MAIN_DEBATE",
  GUEST_INTERVIEW = "GUEST_INTERVIEW",
  HOT_TOPIC = "HOT_TOPIC",
  LIGHT_SEGMENT = "LIGHT_SEGMENT",
  PREDICTIONS = "PREDICTIONS",
  QUICK_HITTERS = "QUICK_HITTERS",
  FINAL_WORD = "FINAL_WORD",
  SOCIAL_MEDIA = "SOCIAL_MEDIA",
}

export enum Sport {
  NFL = "NFL",
  NBA = "NBA",
  MLB = "MLB",
  NHL = "NHL",
  COLLEGE_FOOTBALL = "COLLEGE_FOOTBALL",
  COLLEGE_BASKETBALL = "COLLEGE_BASKETBALL",
  SOCCER = "SOCCER",
  UFC = "UFC",
  BOXING = "BOXING",
  GENERAL = "GENERAL",
}

export enum MediaType {
  HIGHLIGHT_PACKAGE = "HIGHLIGHT_PACKAGE",
  B_ROLL = "B_ROLL",
  GRAPHIC = "GRAPHIC",
  STAT_CARD = "STAT_CARD",
  SPLIT_SCREEN = "SPLIT_SCREEN",
  FULL_SCREEN_QUOTE = "FULL_SCREEN_QUOTE",
  SOCIAL_MEDIA_POST = "SOCIAL_MEDIA_POST",
  REPLAY = "REPLAY",
}

export enum TensionLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  EXPLOSIVE = "EXPLOSIVE",
}

export enum HostPosition {
  PRO = "PRO",
  AGAINST = "AGAINST",
  NEUTRAL = "NEUTRAL",
  MODERATOR = "MODERATOR",
}

// ============================================================================
// MEDIA & VISUAL ASSETS
// ============================================================================

export interface MediaAsset {
  id: string;
  type: MediaType;
  title: string;
  description?: string;
  url: string;
  durationSeconds: number;
  sport?: Sport;
  tags: string[];
  createdAt: Date;
}

export interface HighlightPackage extends MediaAsset {
  type: MediaType.HIGHLIGHT_PACKAGE;
  clips: {
    startTime: number;
    endTime: number;
    description: string;
    playerId?: string;
    teamId?: string;
  }[];
  musicTrack?: string;
}

export interface Graphic extends MediaAsset {
  type: MediaType.GRAPHIC | MediaType.STAT_CARD | MediaType.FULL_SCREEN_QUOTE;
  template: string;
  data: Record<string, any>;
  animationDuration?: number;
}

export interface SocialMediaPost extends MediaAsset {
  type: MediaType.SOCIAL_MEDIA_POST;
  platform: "twitter" | "instagram" | "tiktok" | "facebook";
  author: string;
  authorHandle: string;
  content: string;
  likes?: number;
  retweets?: number;
  timestamp: Date;
}

// ============================================================================
// PEOPLE & PARTICIPANTS
// ============================================================================

export interface Host {
  id: string;
  name: string;
  role: "host" | "co-host" | "moderator" | "analyst";
  photoUrl: string;
  bio: string;
  expertise: Sport[];
  personalityTraits: string[];
  twitterHandle?: string;
}

export interface Guest {
  id: string;
  name: string;
  title: string;
  photoUrl: string;
  bio: string;
  expertise: Sport[];
  bookingNotes?: string;
  previousAppearances: number;
  rating?: number; // How good were they on air?
}

export interface HostTake {
  hostId: string;
  position: HostPosition;
  talkingPoints: string[];
  keyQuote?: string;
  predictedResponseTime: number; // seconds
}

// ============================================================================
// TOPICS & DEBATE STRUCTURE
// ============================================================================

export interface Topic {
  id: string;
  title: string;
  description: string;
  sport: Sport;
  urgency: "breaking" | "hot" | "warm" | "evergreen";
  trendingScore: number; // 0-100, based on social media engagement
  debatability: number; // 0-100, how much can people argue about this?
  lastUpdated: Date;
  relatedPlayers?: string[];
  relatedTeams?: string[];
  tags: string[];
}

export interface DebateStructure {
  question: string;
  subQuestions?: string[];
  hostTakes: HostTake[];
  potentialCounterArguments: string[];
  factCheckPoints?: string[];
  exitStrategy: string; // How to wrap this up and move on
}

// ============================================================================
// SEGMENTS
// ============================================================================

export interface BaseSegment {
  id: string;
  type: SegmentType;
  title: string;
  estimatedDurationSeconds: number;
  actualDurationSeconds?: number;
  runOrder: number;

  topic: Topic;
  debate?: DebateStructure;

  participants: {
    hosts: string[]; // Host IDs
    guests?: string[]; // Guest IDs
  };

  mediaAssets: {
    assetId: string;
    timing: "intro" | "during" | "outro" | "background";
    cuePoint?: number; // When to trigger during segment
    required: boolean;
  }[];

  productionNotes: string[];
  tensionLevel: TensionLevel;
  commercialBreakAfter: boolean;
}

export interface ColdOpenSegment extends BaseSegment {
  type: SegmentType.COLD_OPEN;
  hook: string; // The one-liner that starts the show
  teaseNextSegments: string[];
}

export interface MainDebateSegment extends BaseSegment {
  type: SegmentType.MAIN_DEBATE;
  debate: DebateStructure;
  allowedOvertimeSeconds: number; // Can run long if it's good
  commercialBreakTiming: "peak_tension" | "natural_pause" | "time_based";
}

export interface GuestInterviewSegment extends BaseSegment {
  type: SegmentType.GUEST_INTERVIEW;
  guest: Guest;
  questions: {
    question: string;
    followUps?: string[];
    timeLimit: number;
  }[];
  callInOrInStudio: "call_in" | "in_studio" | "remote_video";
}

export interface QuickHittersSegment extends BaseSegment {
  type: SegmentType.QUICK_HITTERS;
  stories: {
    topicId: string;
    allocatedSeconds: number;
    oneLineSetup: string;
    quickTake: string;
  }[];
}

export type Segment =
  | ColdOpenSegment
  | MainDebateSegment
  | GuestInterviewSegment
  | QuickHittersSegment
  | BaseSegment;

// ============================================================================
// BLOCKS
// ============================================================================

export interface Block {
  id: string;
  type: BlockType;
  title: string;
  estimatedDurationSeconds: number;
  actualDurationSeconds?: number;
  runOrder: number;

  segments: Segment[];

  goals: string[]; // What should this block accomplish?
  paceNotes: string; // "Start explosive", "Build tension", etc.

  commercialBreaks: {
    afterSegmentId: string;
    estimatedDurationSeconds: number;
    sponsorshipSlot?: string;
  }[];
}

// ============================================================================
// SHOW STRUCTURE
// ============================================================================

export interface Show {
  id: string;
  title: string;
  episodeNumber?: number;
  airDate: Date;
  estimatedDurationSeconds: number;
  actualDurationSeconds?: number;

  hosts: Host[];

  blocks: Block[];

  openingTeaser?: {
    teasedTopics: string[];
    durationSeconds: number;
    mediaAssets: string[];
  };

  closingTeaser?: {
    tomorrowsTopics: string[];
    cliffhangerQuestion: string;
    durationSeconds: number;
  };

  metadata: {
    producer: string;
    director: string;
    studio: string;
    season?: number;
    tags: string[];
  };

  status: "planning" | "in_prep" | "ready" | "live" | "completed" | "archived";
}

// ============================================================================
// RUNDOWN / PRODUCTION DOCUMENT
// ============================================================================

export interface RundownItem {
  timestamp: string; // "00:00:00"
  blockId?: string;
  segmentId?: string;
  description: string;
  duration: number;
  cumulativeTime: number;
  cameraDirections?: string[];
  audioNotes?: string[];
  graphicsQueue?: string[];
}

export interface ShowRundown {
  showId: string;
  items: RundownItem[];
  totalDuration: number;
  lastUpdated: Date;
  approvedBy?: string;
}

// ============================================================================
// HELPER TYPES
// ============================================================================

export interface TimeSegment {
  start: number; // seconds from show start
  end: number;
  label: string;
}

export interface ContentRules {
  maxDebateTimeSeconds: number;
  minTopicVariety: number; // How many different sports to cover
  requiredTensionArc: TensionLevel[]; // Should build throughout show
  socialMediaIntegrationRequired: boolean;
  guestSlotsAvailable: number;
}
  `;
}

function getDefaultHosts(): Host[] {
  return [
    {
      id: 'host-1',
      name: 'Mike "The Tech" Thompson',
      role: 'host',
      photoUrl: '',
      bio: 'Former Silicon Valley engineer turned sports tech analyst',
      expertise: ['NFL', 'NBA'],
      personalityTraits: ['analytical', 'tech-focused', 'data-driven'],
      twitterHandle: '@MikeTechThompson',
    },
    {
      id: 'host-2',
      name: 'Sarah "Stats" Martinez',
      role: 'co-host',
      photoUrl: '',
      bio: 'Sports journalist and AI enthusiast',
      expertise: ['NBA', 'MLB'],
      personalityTraits: ['passionate', 'opinionated', 'stats-lover'],
      twitterHandle: '@SarahStatsM',
    },
    {
      id: 'host-3',
      name: 'Jake "The Moderator" Chen',
      role: 'moderator',
      photoUrl: '',
      bio: 'Veteran sports broadcaster with tech startup experience',
      expertise: ['GENERAL'],
      personalityTraits: ['balanced', 'diplomatic', 'insightful'],
      twitterHandle: '@JakeModChen',
    },
  ];
}

function extractTags(favorites: FavoriteArticle[]): string[] {
  const tags = new Set<string>();
  
  favorites.forEach(fav => {
    const title = fav.title.toLowerCase();
    
    // Sports tags
    if (title.includes('nfl') || title.includes('football')) tags.add('NFL');
    if (title.includes('nba') || title.includes('basketball')) tags.add('NBA');
    if (title.includes('mlb') || title.includes('baseball')) tags.add('MLB');
    if (title.includes('nhl') || title.includes('hockey')) tags.add('NHL');
    
    // Tech tags
    if (title.includes('ai') || title.includes('artificial intelligence')) tags.add('AI');
    if (title.includes('machine learning') || title.includes('ml')) tags.add('ML');
    if (title.includes('tech') || title.includes('technology')) tags.add('Technology');
    if (title.includes('startup')) tags.add('Startups');
    if (title.includes('crypto') || title.includes('blockchain')) tags.add('Crypto');
  });

  return Array.from(tags);
}

function generateId(): string {
  return `show-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export default router;

