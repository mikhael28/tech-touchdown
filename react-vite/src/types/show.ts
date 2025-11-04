// ============================================================================
// HYBRID SPORTS + TECH/AI TALK SHOW CONTENT MANAGEMENT SYSTEM - TYPE DEFINITIONS
// This show focuses on both sports news and tech/AI developments, creating
// a unique cross-industry perspective that bridges athletic performance and
// technological innovation.
// ============================================================================

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
