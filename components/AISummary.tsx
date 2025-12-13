"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface AISummaryProps {
  messages: { role: string; content: string }[];
  title: string;
}

export function AISummary({ messages, title }: AISummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryInfo, setRetryInfo] = useState<string | null>(null);

  const generateSummary = async (retryCount = 0) => {
    if (summary) {
      setIsExpanded(!isExpanded);
      return;
    }

    setIsLoading(true);
    setError(null);

    const maxRetries = 3;
    const baseDelay = 2000;

    try {
      // Add delay for retries
      if (retryCount > 0) {
        const delay = baseDelay * Math.pow(2, retryCount - 1);
        setRetryInfo(`Rate limited. Retrying in ${delay / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        setRetryInfo(null);
      }

      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, title }),
      });

      // Handle rate limiting with retry
      if (response.status === 429 && retryCount < maxRetries) {
        setIsLoading(false);
        generateSummary(retryCount + 1);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate summary");
      }

      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
      setRetryInfo(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl overflow-hidden h-full"
    >
      <button
        onClick={() => generateSummary()}
        disabled={isLoading}
        className="w-full p-4 flex items-center gap-4 hover:bg-white/5 transition-colors group"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
          {isLoading ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : (
            <Sparkles className="w-6 h-6 text-white" />
          )}
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
            AI Summary
          </h3>
          <p className="text-sm text-gray-400">
            {retryInfo
              ? retryInfo
              : summary
              ? "Powered by Gemini"
              : "Click to generate context"}
          </p>
        </div>
        {summary ? (
          isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
        )}
      </button>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-4"
          >
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          </motion.div>
        )}

        {summary && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-4"
          >
            <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
              <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                {summary}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
