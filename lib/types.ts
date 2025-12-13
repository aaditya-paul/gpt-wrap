// ChatGPT Export Data Types

export interface Author {
  role: "user" | "assistant" | "system" | "tool";
  name?: string;
  metadata: Record<string, unknown>;
}

export interface MessageContent {
  content_type: string;
  parts?: string[] | null;
  text?: string;
  result?: string;
}

export interface MessageMetadata {
  model_slug?: string;
  invoked_plugin?: {
    namespace: string;
  };
  is_user_system_message?: boolean;
  user_context_message_data?: Record<string, unknown>;
  finish_details?: {
    type: string;
    stop?: string;
  };
  citations?: unknown[];
  gizmo_id?: string;
  [key: string]: unknown;
}

export interface Message {
  id: string;
  author: Author;
  create_time: number | null;
  update_time: number | null;
  content: MessageContent;
  status: string;
  end_turn: boolean | null;
  weight: number;
  metadata: MessageMetadata;
  recipient: string;
}

export interface Node {
  id: string;
  message: Message | null;
  parent: string | null;
  children: string[];
}

export interface Conversation {
  title: string;
  create_time: number;
  update_time: number;
  mapping: Record<string, Node>;
  moderation_results: unknown[];
  current_node: string;
  plugin_ids: string[] | null;
  conversation_id: string;
  conversation_template_id?: string;
  id?: string;
  gizmo_id?: string;
  is_archived?: boolean;
  safe_urls?: string[];
  default_model_slug?: string;
}

export type ConversationExport = Conversation[];

// Parsed/Processed Types

export interface ParsedMessage {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  timestamp: number | null;
  model?: string;
  wordCount: number;
  charCount: number;
}

export interface ParsedConversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: ParsedMessage[];
  userMessages: ParsedMessage[];
  assistantMessages: ParsedMessage[];
  totalWords: number;
  totalChars: number;
  models: string[];
  plugins: string[];
  duration: number; // in milliseconds
  isArchived: boolean;
}

// Analytics Types

export interface TimeStats {
  hourly: number[]; // 24 hours
  daily: number[]; // 7 days (0 = Sunday)
  monthly: number[]; // 12 months
  byDate: Record<string, number>; // YYYY-MM-DD -> count
}

export interface ModelStats {
  name: string;
  count: number;
  percentage: number;
}

export interface ConversationLengthStats {
  shortest: ParsedConversation | null;
  longest: ParsedConversation | null;
  average: number;
  median: number;
}

export interface WordStats {
  totalUserWords: number;
  totalAssistantWords: number;
  averageUserMessageLength: number;
  averageAssistantMessageLength: number;
  longestUserMessage: ParsedMessage | null;
  longestAssistantMessage: ParsedMessage | null;
}

export interface TopConversation {
  conversation: ParsedConversation;
  metric: number;
  label: string;
}

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  longestStreakStart: Date | null;
  longestStreakEnd: Date | null;
}

export interface Analytics {
  // Overview
  totalConversations: number;
  totalMessages: number;
  totalUserMessages: number;
  totalAssistantMessages: number;

  // Time range
  firstConversation: Date | null;
  lastConversation: Date | null;
  activeDays: number;

  // Time distribution
  timeStats: TimeStats;
  peakHour: number;
  peakDay: number; // 0-6
  peakMonth: number; // 0-11

  // Models
  modelStats: ModelStats[];
  favoriteModel: string | null;

  // Conversation stats
  conversationLengthStats: ConversationLengthStats;

  // Word stats
  wordStats: WordStats;

  // Streaks
  streakStats: StreakStats;

  // Top conversations
  topByMessages: TopConversation[];
  topByWords: TopConversation[];

  // Plugins
  pluginsUsed: string[];
  pluginUsageCount: number;

  // Custom GPTs
  customGPTsUsed: string[];
  customGPTCount: number;

  // Raw data reference
  conversations: ParsedConversation[];
}

// Storage Types

export interface StoredData {
  conversations: ParsedConversation[];
  analytics: Analytics;
  uploadedAt: number;
  version: number;
}
