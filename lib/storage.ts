import { get, set, del } from "idb-keyval";
import { Analytics, ParsedConversation, StoredData } from "./types";

const STORAGE_KEY = "gpt-wrapped-data";
const STORAGE_VERSION = 1;

/**
 * Save parsed data to IndexedDB
 */
export async function saveData(
  conversations: ParsedConversation[],
  analytics: Analytics
): Promise<void> {
  const data: StoredData = {
    conversations,
    analytics,
    uploadedAt: Date.now(),
    version: STORAGE_VERSION,
  };

  await set(STORAGE_KEY, data);
}

/**
 * Load data from IndexedDB
 */
export async function loadData(): Promise<StoredData | null> {
  try {
    const data = await get<StoredData>(STORAGE_KEY);

    if (!data) return null;

    // Check version compatibility
    if (data.version !== STORAGE_VERSION) {
      await clearData();
      return null;
    }

    // Rehydrate Date objects (they get serialized as strings)
    data.conversations = data.conversations.map((conv) => ({
      ...conv,
      createdAt: new Date(conv.createdAt),
      updatedAt: new Date(conv.updatedAt),
    }));

    if (data.analytics.firstConversation) {
      data.analytics.firstConversation = new Date(
        data.analytics.firstConversation
      );
    }
    if (data.analytics.lastConversation) {
      data.analytics.lastConversation = new Date(
        data.analytics.lastConversation
      );
    }
    if (data.analytics.streakStats.longestStreakStart) {
      data.analytics.streakStats.longestStreakStart = new Date(
        data.analytics.streakStats.longestStreakStart
      );
    }
    if (data.analytics.streakStats.longestStreakEnd) {
      data.analytics.streakStats.longestStreakEnd = new Date(
        data.analytics.streakStats.longestStreakEnd
      );
    }

    // Rehydrate conversations in analytics too
    data.analytics.conversations = data.analytics.conversations.map((conv) => ({
      ...conv,
      createdAt: new Date(conv.createdAt),
      updatedAt: new Date(conv.updatedAt),
    }));

    return data;
  } catch (error) {
    console.error("Error loading data from IndexedDB:", error);
    return null;
  }
}

/**
 * Clear stored data
 */
export async function clearData(): Promise<void> {
  await del(STORAGE_KEY);
}

/**
 * Check if data exists in storage
 */
export async function hasStoredData(): Promise<boolean> {
  try {
    const data = await get<StoredData>(STORAGE_KEY);
    return data !== null && data !== undefined;
  } catch {
    return false;
  }
}

/**
 * Get upload timestamp
 */
export async function getUploadTimestamp(): Promise<Date | null> {
  try {
    const data = await get<StoredData>(STORAGE_KEY);
    return data ? new Date(data.uploadedAt) : null;
  } catch {
    return null;
  }
}
