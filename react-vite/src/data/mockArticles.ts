import { Article } from "../types/article";

export const mockArticles: Article[] = [
  // Sports Articles
  {
    id: "1",
    title:
      "Lakers Pull Off Stunning Comeback Against Warriors in Overtime Thriller",
    summary:
      "LeBron James leads the Lakers to an incredible 20-point comeback victory over the Warriors in a game that went to double overtime.",
    content:
      "In what will go down as one of the most memorable games of the season, the Los Angeles Lakers...",
    author: "Mike Johnson",
    publishedAt: "2024-01-15T10:30:00Z",
    category: "sports",
    tags: ["NBA", "Lakers", "Warriors", "Basketball"],
    upvotes: 1247,
    comments: 89,
    readTime: 5,
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800",
  },
  {
    id: "2",
    title: "Chiefs Secure AFC Championship with Dominant Performance",
    summary:
      "Patrick Mahomes throws for 4 touchdowns as Kansas City advances to Super Bowl with a 35-17 victory.",
    content:
      "The Kansas City Chiefs are heading back to the Super Bowl after a commanding performance...",
    author: "Sarah Williams",
    publishedAt: "2024-01-14T18:45:00Z",
    category: "sports",
    tags: ["NFL", "Chiefs", "Super Bowl", "Football"],
    upvotes: 892,
    comments: 156,
    readTime: 4,
    featured: true,
    imageUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
  },
  {
    id: "3",
    title: "Messi Scores Hat-Trick in Inter Miami's 5-2 Victory",
    summary:
      "Lionel Messi continues his incredible form with three goals in Inter Miami's dominant win.",
    content:
      "Lionel Messi proved once again why he's considered one of the greatest players of all time...",
    author: "Carlos Rodriguez",
    publishedAt: "2024-01-13T21:15:00Z",
    category: "sports",
    tags: ["Soccer", "Messi", "Inter Miami", "MLS"],
    upvotes: 2156,
    comments: 234,
    readTime: 6,
    imageUrl:
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800",
  },
  {
    id: "4",
    title: "Tennis: Djokovic Advances to Australian Open Semifinals",
    summary:
      "World No. 1 Novak Djokovic continues his quest for a record 25th Grand Slam title.",
    content:
      "Novak Djokovic showed his championship pedigree in a hard-fought victory...",
    author: "Emma Thompson",
    publishedAt: "2024-01-12T14:20:00Z",
    category: "sports",
    tags: ["Tennis", "Djokovic", "Australian Open", "Grand Slam"],
    upvotes: 678,
    comments: 45,
    readTime: 3,
    imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800",
  },

  // Tech Articles
  {
    id: "5",
    title: "OpenAI Announces GPT-5 with Revolutionary Multimodal Capabilities",
    summary:
      "The next generation of AI models promises to understand and generate content across text, images, video, and audio.",
    content:
      "OpenAI has unveiled GPT-5, their most advanced AI model yet, featuring unprecedented multimodal capabilities...",
    author: "Alex Chen",
    publishedAt: "2024-01-15T09:00:00Z",
    category: "tech",
    tags: ["AI", "OpenAI", "GPT-5", "Machine Learning"],
    upvotes: 3421,
    comments: 567,
    readTime: 8,
    featured: true,
    imageUrl:
      "https://images.unsplash.com/photo-1677442136019-21780ccad005?w=800",
  },
  {
    id: "6",
    title: "Tesla's Full Self-Driving Beta Reaches 1 Million Miles Driven",
    summary:
      "Major milestone achieved as Tesla's autonomous driving technology continues to improve.",
    content:
      "Tesla has announced that their Full Self-Driving Beta has now been driven over 1 million miles...",
    author: "David Kim",
    publishedAt: "2024-01-14T16:30:00Z",
    category: "tech",
    tags: ["Tesla", "Autonomous Driving", "AI", "Electric Vehicles"],
    upvotes: 1892,
    comments: 234,
    readTime: 6,
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800",
  },
  {
    id: "7",
    title: "Y Combinator Winter 2024 Batch: 200+ Startups Raise $2.3B",
    summary:
      "The prestigious accelerator program showcases the next generation of tech companies.",
    content:
      "Y Combinator's Winter 2024 batch has concluded with impressive results, as 200+ startups...",
    author: "Jessica Park",
    publishedAt: "2024-01-13T11:45:00Z",
    category: "tech",
    tags: ["Y Combinator", "Startups", "Venture Capital", "Innovation"],
    upvotes: 1456,
    comments: 189,
    readTime: 7,
    imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800",
  },
  {
    id: "8",
    title: "Apple Vision Pro Pre-Orders Exceed 200,000 Units in First Day",
    summary:
      "Apple's mixed reality headset sees strong demand despite premium pricing.",
    content:
      "Apple Vision Pro has exceeded expectations with over 200,000 pre-orders in the first 24 hours...",
    author: "Ryan O'Connor",
    publishedAt: "2024-01-12T08:15:00Z",
    category: "tech",
    tags: ["Apple", "Vision Pro", "Mixed Reality", "AR/VR"],
    upvotes: 2789,
    comments: 445,
    readTime: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1592478411213-6153e4c4c8f0?w=800",
  },
  {
    id: "9",
    title: "SpaceX Successfully Launches 50 Starlink Satellites in Record Time",
    summary:
      "Elon Musk's space company continues to expand its satellite internet constellation.",
    content:
      "SpaceX has successfully launched another batch of 50 Starlink satellites, bringing the total...",
    author: "Maria Garcia",
    publishedAt: "2024-01-11T19:30:00Z",
    category: "tech",
    tags: ["SpaceX", "Starlink", "Satellites", "Space Technology"],
    upvotes: 1234,
    comments: 78,
    readTime: 4,
    imageUrl:
      "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800",
  },
  {
    id: "10",
    title: "Microsoft Copilot Integration Reaches 1 Million Enterprise Users",
    summary:
      "AI-powered productivity tools are transforming how businesses work.",
    content:
      "Microsoft has announced that their Copilot AI assistant has reached 1 million enterprise users...",
    author: "Tom Wilson",
    publishedAt: "2024-01-10T13:20:00Z",
    category: "tech",
    tags: ["Microsoft", "Copilot", "AI", "Productivity"],
    upvotes: 987,
    comments: 123,
    readTime: 5,
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
  },
];

export const categories = [
  {
    id: "sports",
    name: "Sports",
    description: "Latest news from the world of sports",
    icon: "🏈",
    color: "bg-blue-500",
  },
  {
    id: "tech",
    name: "Tech",
    description: "Technology and startup news",
    icon: "💻",
    color: "bg-green-500",
  },
];
