"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { Analytics, ParsedConversation, ConversationExport } from "@/lib/types";
import {
  parseConversationExport,
  validateConversationExport,
} from "@/lib/parser";
import { calculateAnalytics } from "@/lib/analytics";
import { saveData, loadData, clearData } from "@/lib/storage";

interface ConversationContextType {
  // Data
  conversations: ParsedConversation[];
  analytics: Analytics | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  processFile: (file: File) => Promise<void>;
  processData: (data: ConversationExport) => Promise<void>;
  clearAllData: () => Promise<void>;

  // State
  hasData: boolean;
  uploadedAt: Date | null;
}

const ConversationContext = createContext<ConversationContextType | null>(null);

export function useConversations() {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error(
      "useConversations must be used within a ConversationProvider"
    );
  }
  return context;
}

interface ConversationProviderProps {
  children: ReactNode;
}

export function ConversationProvider({ children }: ConversationProviderProps) {
  const [conversations, setConversations] = useState<ParsedConversation[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadedAt, setUploadedAt] = useState<Date | null>(null);

  // Load data from IndexedDB on mount
  useEffect(() => {
    async function loadStoredData() {
      try {
        const stored = await loadData();
        if (stored) {
          setConversations(stored.conversations);
          setAnalytics(stored.analytics);
          setUploadedAt(new Date(stored.uploadedAt));
        }
      } catch (err) {
        console.error("Error loading stored data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredData();
  }, []);

  const processData = useCallback(async (data: ConversationExport) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate the data structure
      if (!validateConversationExport(data)) {
        throw new Error(
          "Invalid file format. Please upload a valid ChatGPT conversations.json export."
        );
      }

      // Parse conversations
      const parsed = parseConversationExport(data);

      if (parsed.length === 0) {
        throw new Error(
          "No conversations found in the export. The file might be empty."
        );
      }

      // Calculate analytics
      const analyticsData = calculateAnalytics(parsed);

      // Save to IndexedDB
      await saveData(parsed, analyticsData);

      // Update state
      setConversations(parsed);
      setAnalytics(analyticsData);
      setUploadedAt(new Date());
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to process file";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const processFile = useCallback(
    async (file: File) => {
      setIsLoading(true);
      setError(null);

      try {
        // Read file
        const text = await file.text();
        let data: ConversationExport;

        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(
            "Invalid JSON file. Please make sure the file is valid JSON."
          );
        }

        await processData(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to process file";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [processData]
  );

  const clearAllData = useCallback(async () => {
    await clearData();
    setConversations([]);
    setAnalytics(null);
    setUploadedAt(null);
    setError(null);
  }, []);

  const value: ConversationContextType = {
    conversations,
    analytics,
    isLoading,
    error,
    processFile,
    processData,
    clearAllData,
    hasData: conversations.length > 0,
    uploadedAt,
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
}
