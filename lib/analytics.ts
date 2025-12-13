import {
  format,
  differenceInDays,
  eachDayOfInterval,
  getHours,
  getDay,
  getMonth,
} from "date-fns";
import {
  Analytics,
  ConversationLengthStats,
  ModelStats,
  ParsedConversation,
  ParsedMessage,
  StreakStats,
  TimeStats,
  TopConversation,
  WordStats,
} from "./types";

/**
 * Calculate time-based statistics
 */
function calculateTimeStats(conversations: ParsedConversation[]): TimeStats {
  const hourly = new Array(24).fill(0);
  const daily = new Array(7).fill(0);
  const monthly = new Array(12).fill(0);
  const byDate: Record<string, number> = {};

  for (const conv of conversations) {
    const date = conv.createdAt;
    const hour = getHours(date);
    const day = getDay(date);
    const month = getMonth(date);
    const dateKey = format(date, "yyyy-MM-dd");

    hourly[hour]++;
    daily[day]++;
    monthly[month]++;
    byDate[dateKey] = (byDate[dateKey] || 0) + 1;
  }

  return { hourly, daily, monthly, byDate };
}

/**
 * Calculate model usage statistics
 */
function calculateModelStats(
  conversations: ParsedConversation[]
): ModelStats[] {
  const modelCounts: Record<string, number> = {};
  let totalWithModel = 0;

  for (const conv of conversations) {
    for (const model of conv.models) {
      modelCounts[model] = (modelCounts[model] || 0) + 1;
      totalWithModel++;
    }
  }

  return Object.entries(modelCounts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalWithModel > 0 ? (count / totalWithModel) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Calculate conversation length statistics
 */
function calculateConversationLengthStats(
  conversations: ParsedConversation[]
): ConversationLengthStats {
  if (conversations.length === 0) {
    return {
      shortest: null,
      longest: null,
      average: 0,
      median: 0,
    };
  }

  const sorted = [...conversations].sort(
    (a, b) => a.messages.length - b.messages.length
  );

  const lengths = sorted.map((c) => c.messages.length);
  const average = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const median =
    lengths.length % 2 === 0
      ? (lengths[lengths.length / 2 - 1] + lengths[lengths.length / 2]) / 2
      : lengths[Math.floor(lengths.length / 2)];

  return {
    shortest: sorted[0],
    longest: sorted[sorted.length - 1],
    average,
    median,
  };
}

/**
 * Calculate word statistics
 */
function calculateWordStats(conversations: ParsedConversation[]): WordStats {
  let totalUserWords = 0;
  let totalAssistantWords = 0;
  let userMessageCount = 0;
  let assistantMessageCount = 0;
  let longestUserMessage: ParsedMessage | null = null;
  let longestAssistantMessage: ParsedMessage | null = null;

  for (const conv of conversations) {
    for (const msg of conv.userMessages) {
      totalUserWords += msg.wordCount;
      userMessageCount++;
      if (!longestUserMessage || msg.wordCount > longestUserMessage.wordCount) {
        longestUserMessage = msg;
      }
    }

    for (const msg of conv.assistantMessages) {
      totalAssistantWords += msg.wordCount;
      assistantMessageCount++;
      if (
        !longestAssistantMessage ||
        msg.wordCount > longestAssistantMessage.wordCount
      ) {
        longestAssistantMessage = msg;
      }
    }
  }

  return {
    totalUserWords,
    totalAssistantWords,
    averageUserMessageLength:
      userMessageCount > 0 ? totalUserWords / userMessageCount : 0,
    averageAssistantMessageLength:
      assistantMessageCount > 0
        ? totalAssistantWords / assistantMessageCount
        : 0,
    longestUserMessage,
    longestAssistantMessage,
  };
}

/**
 * Calculate usage streaks
 */
function calculateStreakStats(
  conversations: ParsedConversation[]
): StreakStats {
  if (conversations.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      longestStreakStart: null,
      longestStreakEnd: null,
    };
  }

  // Get unique dates
  const uniqueDates = new Set<string>();
  for (const conv of conversations) {
    uniqueDates.add(format(conv.createdAt, "yyyy-MM-dd"));
  }

  const sortedDates = Array.from(uniqueDates).sort();
  if (sortedDates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      longestStreakStart: null,
      longestStreakEnd: null,
    };
  }

  let longestStreak = 1;
  let longestStreakStart = sortedDates[0];
  let longestStreakEnd = sortedDates[0];
  let currentStreakLength = 1;
  let currentStreakStart = sortedDates[0];

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currDate = new Date(sortedDates[i]);
    const diff = differenceInDays(currDate, prevDate);

    if (diff === 1) {
      currentStreakLength++;
    } else {
      if (currentStreakLength > longestStreak) {
        longestStreak = currentStreakLength;
        longestStreakStart = currentStreakStart;
        longestStreakEnd = sortedDates[i - 1];
      }
      currentStreakLength = 1;
      currentStreakStart = sortedDates[i];
    }
  }

  // Check final streak
  if (currentStreakLength > longestStreak) {
    longestStreak = currentStreakLength;
    longestStreakStart = currentStreakStart;
    longestStreakEnd = sortedDates[sortedDates.length - 1];
  }

  // Calculate current streak (from today backwards)
  const today = format(new Date(), "yyyy-MM-dd");
  let currentStreak = 0;
  const dateSet = new Set(sortedDates);

  // Start from today and go backwards
  const daysToCheck = eachDayOfInterval({
    start: new Date(sortedDates[0]),
    end: new Date(),
  }).reverse();

  let foundToday = false;
  for (const day of daysToCheck) {
    const dateStr = format(day, "yyyy-MM-dd");
    if (!foundToday) {
      if (dateSet.has(dateStr)) {
        foundToday = true;
        currentStreak = 1;
      } else if (dateStr === today) {
        continue; // Today might not have activity yet
      } else {
        break;
      }
    } else {
      if (dateSet.has(dateStr)) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  return {
    currentStreak,
    longestStreak,
    longestStreakStart: new Date(longestStreakStart),
    longestStreakEnd: new Date(longestStreakEnd),
  };
}

/**
 * Get top conversations by various metrics
 */
function getTopConversations(
  conversations: ParsedConversation[],
  limit: number = 5
): { byMessages: TopConversation[]; byWords: TopConversation[] } {
  const byMessages = [...conversations]
    .sort((a, b) => b.messages.length - a.messages.length)
    .slice(0, limit)
    .map((conv) => ({
      conversation: conv,
      metric: conv.messages.length,
      label: `${conv.messages.length} messages`,
    }));

  const byWords = [...conversations]
    .sort((a, b) => b.totalWords - a.totalWords)
    .slice(0, limit)
    .map((conv) => ({
      conversation: conv,
      metric: conv.totalWords,
      label: `${conv.totalWords.toLocaleString()} words`,
    }));

  return { byMessages, byWords };
}

/**
 * Calculate all analytics from parsed conversations
 */
export function calculateAnalytics(
  conversations: ParsedConversation[]
): Analytics {
  const totalMessages = conversations.reduce(
    (sum, c) => sum + c.messages.length,
    0
  );
  const totalUserMessages = conversations.reduce(
    (sum, c) => sum + c.userMessages.length,
    0
  );
  const totalAssistantMessages = conversations.reduce(
    (sum, c) => sum + c.assistantMessages.length,
    0
  );

  const timeStats = calculateTimeStats(conversations);
  const modelStats = calculateModelStats(conversations);
  const conversationLengthStats =
    calculateConversationLengthStats(conversations);
  const wordStats = calculateWordStats(conversations);
  const streakStats = calculateStreakStats(conversations);
  const { byMessages, byWords } = getTopConversations(conversations);

  // Find peak times
  const peakHour = timeStats.hourly.indexOf(Math.max(...timeStats.hourly));
  const peakDay = timeStats.daily.indexOf(Math.max(...timeStats.daily));
  const peakMonth = timeStats.monthly.indexOf(Math.max(...timeStats.monthly));

  // Collect plugins
  const allPlugins = new Set<string>();
  for (const conv of conversations) {
    for (const plugin of conv.plugins) {
      allPlugins.add(plugin);
    }
  }

  // Collect custom GPTs (gizmo_id in metadata)
  const customGPTs = new Set<string>();
  for (const conv of conversations) {
    // Check if conversation used a custom GPT
    const firstAssistantMsg = conv.assistantMessages[0];
    if (firstAssistantMsg?.model?.includes("gpt-4-gizmo")) {
      customGPTs.add(conv.title);
    }
  }

  // Calculate active days
  const activeDays = Object.keys(timeStats.byDate).length;

  // Date range
  const sortedConversations = [...conversations].sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
  );
  const firstConversation =
    sortedConversations.length > 0 ? sortedConversations[0].createdAt : null;
  const lastConversation =
    sortedConversations.length > 0
      ? sortedConversations[sortedConversations.length - 1].createdAt
      : null;

  return {
    totalConversations: conversations.length,
    totalMessages,
    totalUserMessages,
    totalAssistantMessages,

    firstConversation,
    lastConversation,
    activeDays,

    timeStats,
    peakHour,
    peakDay,
    peakMonth,

    modelStats,
    favoriteModel: modelStats.length > 0 ? modelStats[0].name : null,

    conversationLengthStats,
    wordStats,
    streakStats,

    topByMessages: byMessages,
    topByWords: byWords,

    pluginsUsed: Array.from(allPlugins),
    pluginUsageCount: allPlugins.size,

    customGPTsUsed: Array.from(customGPTs),
    customGPTCount: customGPTs.size,

    conversations,
  };
}

/**
 * Format hour for display
 */
export function formatHour(hour: number): string {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
}

/**
 * Format day for display
 */
export function formatDay(day: number): string {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day];
}

/**
 * Format month for display
 */
export function formatMonth(month: number): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[month];
}

/**
 * Get model display name
 */
export function getModelDisplayName(modelSlug: string): string {
  const modelNames: Record<string, string> = {
    "gpt-4": "GPT-4",
    "gpt-4o": "GPT-4o",
    "gpt-4o-mini": "GPT-4o Mini",
    "gpt-4-turbo": "GPT-4 Turbo",
    "gpt-4-browsing": "GPT-4 (Browse)",
    "gpt-4-code-interpreter": "GPT-4 (Code)",
    "gpt-4-plugins": "GPT-4 (Plugins)",
    "gpt-4-gizmo": "Custom GPT",
    "gpt-3.5-turbo": "GPT-3.5 Turbo",
    "text-davinci-002-render-sha": "GPT-3.5",
    "o1-preview": "o1 Preview",
    "o1-mini": "o1 Mini",
  };

  // Check for partial matches
  for (const [key, name] of Object.entries(modelNames)) {
    if (modelSlug.includes(key)) return name;
  }

  return modelSlug;
}
