// ============================================================================
// MOCK DATA - 1 HOUR HYBRID SPORTS + TECH/AI TALK SHOW
// "The Hot Take Hour" - Episode 247
// This show uniquely blends sports analysis with tech and AI news, providing
// a cross-industry perspective that connects athletic performance with
// technological innovation. Topics range from NFL/NBA/MLB to GPT-5 releases
// and AI developments, creating engaging debates that span both worlds.
// ============================================================================

import {
  Show,
  Host,
  Guest,
  Topic,
  MediaAsset,
  HighlightPackage,
  Graphic,
  SocialMediaPost,
  Block,
  Segment,
  ColdOpenSegment,
  MainDebateSegment,
  GuestInterviewSegment,
  QuickHittersSegment,
  BlockType,
  SegmentType,
  Sport,
  MediaType,
  TensionLevel,
  HostPosition,
  DebateStructure,
  BaseSegment,
} from "./show";

// ============================================================================
// HOSTS
// ============================================================================

export const mockHosts: Host[] = [
  {
    id: "host-001",
    name: "Michael Nightingale",
    role: "host",
    photoUrl: "/images/hosts/michael-nightingale.jpg",
    bio: "Sports and tech commentator bringing fresh perspectives to the conversation.",
    expertise: [Sport.NFL, Sport.MLB, Sport.GENERAL],
    personalityTraits: ["analytical", "insightful", "balanced"],
    twitterHandle: "@MichaelNightingale",
  },
  {
    id: "host-002",
    name: "Jim Liu",
    role: "co-host",
    photoUrl: "/images/hosts/jim-liu.jpg",
    bio: "Tech enthusiast and sports analyst with a unique cross-industry perspective.",
    expertise: [Sport.GENERAL, Sport.NFL, Sport.MLB],
    personalityTraits: ["tech-savvy", "curious", "thoughtful"],
    twitterHandle: "@JimLiu",
  },
  {
    id: "host-003",
    name: "Will Johnson",
    role: "co-host",
    photoUrl: "/images/hosts/will-johnson.jpg",
    bio: "Passionate sports fan and analyst, especially when it comes to the Chiefs.",
    expertise: [Sport.NFL, Sport.MLB, Sport.GENERAL],
    personalityTraits: ["passionate", "team-focused", "honest"],
    twitterHandle: "@WillJohnson",
  },
];

// ============================================================================
// GUESTS
// ============================================================================

export const mockGuests: Guest[] = [
  {
    id: "guest-001",
    name: "Adrian Wojnarowski",
    title: "NBA Insider, ESPN",
    photoUrl: "/images/guests/woj.jpg",
    bio: "Breaking news before anyone else since 2007.",
    expertise: [Sport.NBA],
    previousAppearances: 47,
    rating: 9.2,
  },
];

// ============================================================================
// TOPICS
// ============================================================================

export const mockTopics: Topic[] = [
  {
    id: "topic-001",
    title: "Chiefs 0-2 Start: Is Will Worried About Missing Playoffs?",
    description:
      "For the first time in Patrick Mahomes' career, the Chiefs are 0-2. Is this cause for concern or just early season struggles?",
    sport: Sport.NFL,
    urgency: "hot",
    trendingScore: 92,
    debatability: 85,
    lastUpdated: new Date("2025-11-04T08:00:00Z"),
    relatedPlayers: ["Patrick Mahomes", "Travis Kelce"],
    relatedTeams: ["Kansas City Chiefs"],
    tags: ["chiefs", "nfl", "mahomes", "playoffs", "early-season"],
  },
  {
    id: "topic-002",
    title: "GPT-5: Did It Live Up to the Hype?",
    description:
      "OpenAI's latest model has been released. The tech world is buzzing - but does it deliver on the promises?",
    sport: Sport.GENERAL,
    urgency: "breaking",
    trendingScore: 96,
    debatability: 78,
    lastUpdated: new Date("2025-11-04T09:00:00Z"),
    tags: ["gpt-5", "ai", "tech", "openai", "artificial-intelligence"],
  },
  {
    id: "topic-003",
    title: "Cal Raleigh: Is He This Year's MVP?",
    description:
      "The Mariners catcher has been putting up incredible numbers. Is he the American League MVP frontrunner?",
    sport: Sport.MLB,
    urgency: "hot",
    trendingScore: 88,
    debatability: 82,
    lastUpdated: new Date("2025-11-04T08:30:00Z"),
    relatedPlayers: ["Cal Raleigh"],
    relatedTeams: ["Seattle Mariners"],
    tags: ["mlb", "mvp", "mariners", "cal-raleigh", "baseball"],
  },
];

// ============================================================================
// MEDIA ASSETS
// ============================================================================

export const mockMediaAssets: MediaAsset[] = [
  // Highlight Packages
  {
    id: "media-001",
    type: MediaType.HIGHLIGHT_PACKAGE,
    title: "Chiefs 0-2 Start Lowlights",
    description: "Key moments from the Chiefs' first two losses",
    url: "/media/highlights/chiefs-0-2-losses.mp4",
    durationSeconds: 45,
    sport: Sport.NFL,
    tags: ["chiefs", "mahomes", "losses", "nfl"],
    createdAt: new Date("2025-11-04T07:00:00Z"),
  } as HighlightPackage,
  {
    id: "media-002",
    type: MediaType.HIGHLIGHT_PACKAGE,
    title: "Cal Raleigh MVP Highlights",
    description: "The best moments from Cal Raleigh's MVP-caliber season",
    url: "/media/highlights/cal-raleigh-highlights.mp4",
    durationSeconds: 52,
    sport: Sport.MLB,
    tags: ["cal-raleigh", "mariners", "mvp", "highlights"],
    createdAt: new Date("2025-11-03T20:00:00Z"),
  } as HighlightPackage,

  // Graphics
  {
    id: "media-003",
    type: MediaType.STAT_CARD,
    title: "Chiefs 0-2: Historical Context",
    description: "How teams that start 0-2 have fared in recent years",
    url: "/media/graphics/chiefs-0-2-stats.json",
    durationSeconds: 8,
    sport: Sport.NFL,
    tags: ["statistics", "chiefs", "nfl", "playoffs"],
    createdAt: new Date("2025-11-04T08:00:00Z"),
  } as Graphic,
  {
    id: "media-004",
    type: MediaType.GRAPHIC,
    title: "GPT-5 Capabilities Comparison",
    description: "GPT-5 vs GPT-4 vs GPT-3.5 feature comparison",
    url: "/media/graphics/gpt-5-comparison.json",
    durationSeconds: 6,
    sport: Sport.GENERAL,
    tags: ["gpt-5", "ai", "tech", "comparison"],
    createdAt: new Date("2025-11-04T09:00:00Z"),
  } as Graphic,
  {
    id: "media-005",
    type: MediaType.STAT_CARD,
    title: "Cal Raleigh MVP Stats",
    description:
      "Cal Raleigh's season statistics compared to other MVP candidates",
    url: "/media/graphics/cal-raleigh-mvp-stats.json",
    durationSeconds: 8,
    sport: Sport.MLB,
    tags: ["statistics", "cal-raleigh", "mvp", "mlb"],
    createdAt: new Date("2025-11-04T08:30:00Z"),
  } as Graphic,

  // Social Media
  {
    id: "media-006",
    type: MediaType.SOCIAL_MEDIA_POST,
    title: "Fan Reaction to Chiefs 0-2",
    description: "Twitter reactions to Chiefs' slow start",
    url: "/media/social/chiefs-fan-reaction.json",
    durationSeconds: 3,
    sport: Sport.NFL,
    tags: ["twitter", "chiefs", "fan-reaction"],
    platform: "twitter",
    author: "Chiefs Kingdom",
    authorHandle: "@ChiefsKingdom",
    content:
      "0-2 for the first time in Mahomes era. Still not worried. This team always figures it out. But we need to see something soon!",
    likes: 12400,
    retweets: 3200,
    timestamp: new Date("2025-11-04T07:15:00Z"),
    createdAt: new Date("2025-11-04T07:15:00Z"),
  } as SocialMediaPost,
  {
    id: "media-007",
    type: MediaType.SOCIAL_MEDIA_POST,
    title: "GPT-5 Launch Reactions",
    description: "Tech community reactions to GPT-5 release",
    url: "/media/social/gpt-5-reactions.json",
    durationSeconds: 3,
    sport: Sport.GENERAL,
    tags: ["twitter", "gpt-5", "ai", "tech"],
    platform: "twitter",
    author: "Tech Insider",
    authorHandle: "@TechInsider",
    content:
      "GPT-5 is here and it's... interesting. Some impressive improvements, but did it live up to the hype? The benchmarks tell a mixed story.",
    likes: 28900,
    retweets: 5600,
    timestamp: new Date("2025-11-04T09:15:00Z"),
    createdAt: new Date("2025-11-04T09:15:00Z"),
  } as SocialMediaPost,

  // B-Roll
  {
    id: "media-008",
    type: MediaType.B_ROLL,
    title: "Arrowhead Stadium",
    description: "Generic establishing shots of Arrowhead Stadium",
    url: "/media/broll/arrowhead-stadium.mp4",
    durationSeconds: 120,
    sport: Sport.NFL,
    tags: ["broll", "chiefs", "stadium"],
    createdAt: new Date("2025-11-01T10:00:00Z"),
  },
  {
    id: "media-009",
    type: MediaType.B_ROLL,
    title: "T-Mobile Park",
    description: "Mariners home stadium shots",
    url: "/media/broll/t-mobile-park.mp4",
    durationSeconds: 90,
    sport: Sport.MLB,
    tags: ["broll", "mariners", "stadium"],
    createdAt: new Date("2025-10-28T14:00:00Z"),
  },
];

// ============================================================================
// DEBATE STRUCTURES
// ============================================================================

const chiefsDebateStructure: DebateStructure = {
  question:
    "Chiefs are 0-2 for the first time in Mahomes' career - is Will worried about missing the playoffs?",
  subQuestions: [
    "Is this just early season rust or a real problem?",
    "What's different about this Chiefs team?",
    "Can the Chiefs still turn it around?",
  ],
  hostTakes: [
    {
      hostId: "host-003",
      position: HostPosition.NEUTRAL,
      talkingPoints: [
        "It's concerning, but it's only two games",
        "The Chiefs have struggled early before and figured it out",
        "The defense looks better than last year",
        "Mahomes is still Mahomes - he'll find a way",
      ],
      keyQuote:
        "I'm worried, but I'm not panicking. This team has been here before.",
      predictedResponseTime: 90,
    },
    {
      hostId: "host-001",
      position: HostPosition.AGAINST,
      talkingPoints: [
        "0-2 is a hole, but not insurmountable",
        "The Chiefs have one of the toughest schedules early",
        "They've lost to good teams - not terrible losses",
        "History shows 0-2 teams can still make playoffs",
      ],
      keyQuote:
        "The Chiefs have too much talent and coaching to stay down. This is a blip, not a collapse.",
      predictedResponseTime: 85,
    },
    {
      hostId: "host-002",
      position: HostPosition.PRO,
      talkingPoints: [
        "The AFC is loaded - every loss matters",
        "The offense looks out of sync",
        "Can't afford to fall too far behind in the division",
        "The schedule doesn't get easier",
      ],
      keyQuote:
        "I'm more worried than I thought I'd be. The margin for error is shrinking.",
      predictedResponseTime: 75,
    },
  ],
  potentialCounterArguments: [
    "But teams have started 0-2 and won Super Bowls",
    "The Chiefs always find their rhythm by mid-season",
    "Two games is too small a sample size",
  ],
  factCheckPoints: [
    "Chiefs record: 0-2",
    "Mahomes' career record before this: Never started 0-2",
    "Last 0-2 team to make playoffs: Multiple teams do it every year",
    "AFC West standings: Early but competitive",
  ],
  exitStrategy:
    'Pivot to: "Regardless of whether they make the playoffs, what do the Chiefs need to fix RIGHT NOW to get back on track?"',
};

const gpt5DebateStructure: DebateStructure = {
  question: "GPT-5: Did it live up to the hype?",
  subQuestions: [
    "What were the expectations vs reality?",
    "Are the improvements meaningful or incremental?",
    "What does this mean for the AI industry?",
  ],
  hostTakes: [
    {
      hostId: "host-002",
      position: HostPosition.NEUTRAL,
      talkingPoints: [
        "The benchmarks show real improvements",
        "But not the revolutionary leap some expected",
        "The practical applications are impressive",
        "It's an evolution, not a revolution",
      ],
      keyQuote:
        "GPT-5 is better, but is 'better' enough when the hype was this massive?",
      predictedResponseTime: 90,
    },
    {
      hostId: "host-001",
      position: HostPosition.AGAINST,
      talkingPoints: [
        "The hype was always unrealistic",
        "Incremental improvements are still valuable",
        "The real test is in production use",
        "We're judging too early - give it time",
      ],
      keyQuote:
        "People expected magic. What we got is a significantly better tool. That's a win.",
      predictedResponseTime: 85,
    },
    {
      hostId: "host-003",
      position: HostPosition.PRO,
      talkingPoints: [
        "The hype suggested transformative change",
        "The improvements feel incremental, not revolutionary",
        "The competition is catching up",
        "The price point doesn't justify the improvements",
      ],
      keyQuote:
        "It's good, but 'good' isn't what we were promised. The hype let us down.",
      predictedResponseTime: 75,
    },
  ],
  potentialCounterArguments: [
    "But the capabilities are genuinely impressive",
    "Real-world testing will show the value",
    "You can't judge revolutionary technology in week one",
  ],
  factCheckPoints: [
    "GPT-5 release date: Recent",
    "Benchmark improvements: 10-30% depending on task",
    "Pricing: Similar to GPT-4",
    "Competition: Claude, Gemini, others",
  ],
  exitStrategy:
    'Pivot to: "Whether it lived up to the hype or not, where does AI go from here?"',
};

const calRaleighMVPStructure: DebateStructure = {
  question: "Is Cal Raleigh the American League MVP?",
  subQuestions: [
    "Do his stats justify MVP consideration?",
    "How does he compare to other candidates?",
    "Does position matter for MVP voting?",
  ],
  hostTakes: [
    {
      hostId: "host-001",
      position: HostPosition.PRO,
      talkingPoints: [
        "His offensive numbers are elite for a catcher",
        "He's been the best player on a playoff team",
        "Catcher is the hardest position - that matters",
        "His WAR is among the league leaders",
      ],
      keyQuote:
        "Cal Raleigh is having a historic season for a catcher. That alone makes him MVP-worthy.",
      predictedResponseTime: 90,
    },
    {
      hostId: "host-002",
      position: HostPosition.AGAINST,
      talkingPoints: [
        "There are players with better overall stats",
        "MVP usually goes to the best player, not the best at their position",
        "The Mariners aren't the best team in the AL",
        "Other candidates have more compelling cases",
      ],
      keyQuote:
        "He's having a great season, but MVP? There are players having better seasons.",
      predictedResponseTime: 85,
    },
    {
      hostId: "host-003",
      position: HostPosition.NEUTRAL,
      talkingPoints: [
        "He's definitely in the conversation",
        "The catcher position premium is real",
        "But MVP voters rarely reward catchers",
        "It's a close call either way",
      ],
      keyQuote:
        "He deserves to be in the conversation, but winning it? That's a tough ask.",
      predictedResponseTime: 75,
    },
  ],
  potentialCounterArguments: [
    "But he's the most valuable player to his team",
    "Catchers have won MVP before",
    "His defensive value adds to his case",
  ],
  factCheckPoints: [
    "Cal Raleigh's season stats: To be updated",
    "Mariners record: Playoff-bound",
    "Last catcher to win MVP: Buster Posey, 2012",
    "Other AL MVP candidates: Multiple",
  ],
  exitStrategy:
    'Pivot to: "Whether he wins MVP or not, Cal Raleigh has had an incredible season. What\'s next for him and the Mariners?"',
};

// ============================================================================
// SEGMENTS
// ============================================================================

// A BLOCK SEGMENTS
const aBlockColdOpen: ColdOpenSegment = {
  id: "segment-a1",
  type: SegmentType.COLD_OPEN,
  title: "Cold Open: Chiefs 0-2 - Is Will Worried?",
  estimatedDurationSeconds: 120,
  runOrder: 1,
  topic: mockTopics[0],
  hook: "For the first time in Patrick Mahomes' career, the Chiefs are 0-2. Will, are you worried?",
  teaseNextSegments: [
    "We'll debate if the Chiefs are in trouble",
    "GPT-5: Did it live up to the hype?",
    "Is Cal Raleigh the MVP?",
  ],
  participants: {
    hosts: ["host-001", "host-002", "host-003"],
  },
  mediaAssets: [
    {
      assetId: "media-001",
      timing: "intro",
      cuePoint: 5,
      required: true,
    },
    {
      assetId: "media-003",
      timing: "during",
      cuePoint: 45,
      required: true,
    },
  ],
  productionNotes: [
    "Start with dramatic music bed",
    "Quick cut highlights of Chiefs losses",
    "Show split screen of all three hosts",
  ],
  tensionLevel: TensionLevel.HIGH,
  commercialBreakAfter: false,
};

const aBlockMainDebate: MainDebateSegment = {
  id: "segment-a2",
  type: SegmentType.MAIN_DEBATE,
  title: "Main Debate: Chiefs 0-2 - Playoff Worries?",
  estimatedDurationSeconds: 780,
  runOrder: 2,
  topic: mockTopics[0],
  debate: chiefsDebateStructure,
  allowedOvertimeSeconds: 60,
  commercialBreakTiming: "peak_tension",
  participants: {
    hosts: ["host-001", "host-002", "host-003"],
  },
  mediaAssets: [
    {
      assetId: "media-006",
      timing: "during",
      cuePoint: 180,
      required: true,
    },
    {
      assetId: "media-008",
      timing: "background",
      required: false,
    },
  ],
  productionNotes: [
    "Let them go - this will get heated",
    "Have graphics ready for stats",
    "Camera 1 on Will for his reactions",
    "Break at the moment when they're debating",
  ],
  tensionLevel: TensionLevel.EXPLOSIVE,
  commercialBreakAfter: true,
};

// B BLOCK SEGMENTS
const bBlockGPT5Debate: MainDebateSegment = {
  id: "segment-b1",
  type: SegmentType.MAIN_DEBATE,
  title: "GPT-5: Did It Live Up to the Hype?",
  estimatedDurationSeconds: 600,
  runOrder: 1,
  topic: mockTopics[1],
  debate: gpt5DebateStructure,
  allowedOvertimeSeconds: 45,
  commercialBreakTiming: "natural_pause",
  participants: {
    hosts: ["host-001", "host-002", "host-003"],
  },
  mediaAssets: [
    {
      assetId: "media-004",
      timing: "intro",
      cuePoint: 0,
      required: true,
    },
    {
      assetId: "media-007",
      timing: "during",
      cuePoint: 180,
      required: true,
    },
  ],
  productionNotes: [
    "Transition from NFL to tech with quick graphic",
    "Jim will lead this segment - his expertise",
    "Keep it accessible but technical",
  ],
  tensionLevel: TensionLevel.HIGH,
  commercialBreakAfter: false,
};

const bBlockCalRaleighDebate: MainDebateSegment = {
  id: "segment-b2",
  type: SegmentType.MAIN_DEBATE,
  title: "Cal Raleigh: Is He This Year's MVP?",
  estimatedDurationSeconds: 480,
  runOrder: 2,
  topic: mockTopics[2],
  debate: calRaleighMVPStructure,
  allowedOvertimeSeconds: 45,
  commercialBreakTiming: "natural_pause",
  participants: {
    hosts: ["host-001", "host-002", "host-003"],
  },
  mediaAssets: [
    {
      assetId: "media-002",
      timing: "intro",
      cuePoint: 0,
      required: true,
    },
    {
      assetId: "media-005",
      timing: "during",
      cuePoint: 120,
      required: true,
    },
    {
      assetId: "media-009",
      timing: "background",
      required: false,
    },
  ],
  productionNotes: [
    "Transition from tech to baseball",
    "Show Cal Raleigh highlights early",
    "Stats graphics are key here",
  ],
  tensionLevel: TensionLevel.MEDIUM,
  commercialBreakAfter: true,
};

// C BLOCK SEGMENTS - Removed (not needed for 3 topics)

// D BLOCK SEGMENTS
const dBlockFinalWord: BaseSegment = {
  id: "segment-d1",
  type: SegmentType.FINAL_WORD,
  title: "Final Word: Tomorrow's Tease",
  estimatedDurationSeconds: 180,
  runOrder: 1,
  topic: mockTopics[0],
  participants: {
    hosts: ["host-001", "host-002", "host-003"],
  },
  mediaAssets: [],
  productionNotes: [
    "Each host gets 30 seconds for final thought",
    "Michael teases tomorrow",
    "End on a high note",
  ],
  tensionLevel: TensionLevel.LOW,
  commercialBreakAfter: false,
};

// ============================================================================
// BLOCKS
// ============================================================================

const aBlock: Block = {
  id: "block-a",
  type: BlockType.A_BLOCK,
  title: "A Block: Chiefs 0-2 Debate",
  estimatedDurationSeconds: 900,
  runOrder: 1,
  segments: [aBlockColdOpen, aBlockMainDebate],
  goals: [
    "Hook viewers with the most controversial topic",
    "Establish the show's energy and personality",
    "Get Will's honest take on the Chiefs",
  ],
  paceNotes: "Start EXPLOSIVE. This is the marquee debate. Let them cook.",
  commercialBreaks: [
    {
      afterSegmentId: "segment-a2",
      estimatedDurationSeconds: 180,
      sponsorshipSlot: "DraftKings",
    },
  ],
};

const bBlock: Block = {
  id: "block-b",
  type: BlockType.B_BLOCK,
  title: "B Block: GPT-5 + Cal Raleigh MVP",
  estimatedDurationSeconds: 1080,
  runOrder: 2,
  segments: [bBlockGPT5Debate, bBlockCalRaleighDebate],
  goals: [
    "Switch from NFL to tech to keep variety - showcase hybrid nature",
    "Cover GPT-5 release and implications - bridge sports and tech",
    "Debate Cal Raleigh's MVP case",
  ],
  paceNotes:
    "Transition from NFL to tech, then to baseball. Keep energy high. This block showcases the hybrid sports+tech nature of the show.",
  commercialBreaks: [
    {
      afterSegmentId: "segment-b2",
      estimatedDurationSeconds: 180,
      sponsorshipSlot: "FanDuel",
    },
  ],
};

const dBlock: Block = {
  id: "block-d",
  type: BlockType.D_BLOCK,
  title: "D Block: Final Word",
  estimatedDurationSeconds: 180,
  runOrder: 3,
  segments: [dBlockFinalWord],
  goals: [
    "Wrap up the show",
    "Tease tomorrow to bring viewers back",
    "End on high energy",
  ],
  paceNotes: "Quick wrap. Leave them wanting more.",
  commercialBreaks: [],
};

// ============================================================================
// COMPLETE SHOW
// ============================================================================

export const mockShow: Show = {
  id: "show-247",
  title: "The Hot Take Hour",
  episodeNumber: 247,
  airDate: new Date("2025-11-04T17:00:00Z"),
  estimatedDurationSeconds: 3600, // 60 minutes
  hosts: mockHosts,
  blocks: [aBlock, bBlock, dBlock],
  openingTeaser: {
    teasedTopics: [
      "Chiefs 0-2: Is Will worried?",
      "GPT-5: Did it live up to the hype?",
      "Cal Raleigh: Is he this year's MVP?",
    ],
    durationSeconds: 30,
    mediaAssets: ["media-001", "media-004"],
  },
  closingTeaser: {
    tomorrowsTopics: [
      "NFL Week 3 reactions",
      "More AI tech news",
      "MLB playoff race updates",
    ],
    cliffhangerQuestion:
      "Will the Chiefs turn it around? We'll have more analysis tomorrow!",
    durationSeconds: 45,
  },
  metadata: {
    producer: "Sarah Martinez",
    director: "David Kim",
    studio: "ESPN Studio A",
    season: 5,
    tags: ["nfl", "tech", "mlb", "debate", "sports-talk", "hybrid", "ai"],
  },
  status: "ready",
};

// ============================================================================
// CONTENT RULES FOR THIS SHOW
// ============================================================================

export const showContentRules = {
  maxDebateTimeSeconds: 900,
  minTopicVariety: 3,
  requiredTensionArc: [
    TensionLevel.EXPLOSIVE, // Start hot
    TensionLevel.HIGH, // Maintain
    TensionLevel.MEDIUM, // Cool down
    TensionLevel.MEDIUM, // Finish strong but not exhausting
  ],
  socialMediaIntegrationRequired: true,
  guestSlotsAvailable: 1,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function calculateTotalShowDuration(show: Show): number {
  let total = 0;

  // Opening teaser
  if (show.openingTeaser) {
    total += show.openingTeaser.durationSeconds;
  }

  // All blocks
  show.blocks.forEach((block) => {
    // Segments
    block.segments.forEach((segment) => {
      total += segment.estimatedDurationSeconds;
    });

    // Commercial breaks
    block.commercialBreaks.forEach((commercialBreak) => {
      total += commercialBreak.estimatedDurationSeconds;
    });
  });

  // Closing teaser
  if (show.closingTeaser) {
    total += show.closingTeaser.durationSeconds;
  }

  return total;
}

export function getSegmentsByType(show: Show, type: SegmentType): Segment[] {
  const segments: Segment[] = [];
  show.blocks.forEach((block) => {
    block.segments.forEach((segment) => {
      if (segment.type === type) {
        segments.push(segment);
      }
    });
  });
  return segments;
}

export function validateTensionArc(show: Show): boolean {
  const tensionLevels = show.blocks.map((block) => {
    // Get the highest tension level from segments in this block
    return Math.max(
      ...block.segments.map((seg) => {
        switch (seg.tensionLevel) {
          case TensionLevel.LOW:
            return 1;
          case TensionLevel.MEDIUM:
            return 2;
          case TensionLevel.HIGH:
            return 3;
          case TensionLevel.EXPLOSIVE:
            return 4;
          default:
            return 0;
        }
      })
    );
  });

  // Should start high and not drop too quickly
  return tensionLevels[0] >= 3 && tensionLevels[1] >= 2;
}

console.log(
  "Mock show duration:",
  calculateTotalShowDuration(mockShow),
  "seconds"
);
console.log("Tension arc valid:", validateTensionArc(mockShow));
