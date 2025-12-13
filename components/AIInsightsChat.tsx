"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  MessageCircle,
  Send,
  Loader2,
  X,
  Sparkles,
  Heart,
  Lightbulb,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface InsightData {
  summary: string;
  mentalHealthInsights: string;
  conversationStyle: string;
  suggestedQuestions: string[];
}

interface AIInsightsChatProps {
  conversationMessages: { role: string; content: string }[];
  title: string;
}

export function AIInsightsChat({
  conversationMessages,
  title,
}: AIInsightsChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cachedContext, setCachedContext] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeConversation = async () => {
    if (insights) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversationMessages, title }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze");
      }

      setInsights(data);

      // Add initial assistant message
      setMessages([
        {
          id: "intro",
          role: "assistant",
          content: `I've analyzed your conversation "${title}". Here's what I noticed:\n\n${data.summary}\n\nFeel free to ask me anything about your conversation, your patterns, or what I observed!`,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (!insights) {
      analyzeConversation();
    }
  };

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      // Build chat history for API (exclude the intro message for cleaner context)
      const chatHistory = messages
        .filter((m) => m.id !== "intro")
        .map((m) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }],
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationMessages,
          title,
          chatHistory,
          userMessage: text,
          cachedContext,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      // Cache context for future messages
      if (data.context) {
        setCachedContext(data.context);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={handleOpen}
        className="w-full glass rounded-2xl p-4 flex items-center gap-4 hover:bg-white/5 transition-colors group"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
            AI Insights & Chat
          </h3>
          <p className="text-sm text-gray-400">
            Analyze your patterns, thought process & more
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              className="relative w-full sm:max-w-2xl h-[85vh] sm:h-[80vh] sm:rounded-2xl bg-[#0a0a0a] border border-gray-800 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-white">AI Insights</h2>
                    <p className="text-xs text-gray-400 truncate max-w-[200px]">
                      Analyzing: {title}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center animate-pulse">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-400">
                      Analyzing your conversation...
                    </p>
                    <p className="text-xs text-gray-500">
                      This may take a moment
                    </p>
                  </div>
                ) : error && messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <AlertCircle className="w-12 h-12 text-red-400" />
                    <p className="text-red-300">{error}</p>
                    <button
                      onClick={analyzeConversation}
                      className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Insights Cards */}
                    {insights && messages.length === 1 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        <div className="p-4 bg-gradient-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/20 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Heart className="w-4 h-4 text-pink-400" />
                            <span className="text-sm font-medium text-pink-300">
                              Mental State
                            </span>
                          </div>
                          <p className="text-sm text-gray-300">
                            {insights.mentalHealthInsights}
                          </p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="w-4 h-4 text-amber-400" />
                            <span className="text-sm font-medium text-amber-300">
                              Your Style
                            </span>
                          </div>
                          <p className="text-sm text-gray-300">
                            {insights.conversationStyle}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Messages */}
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${
                          message.role === "user" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.role === "user"
                              ? "bg-purple-500/20"
                              : "bg-cyan-500/20"
                          }`}
                        >
                          {message.role === "user" ? (
                            <MessageCircle className="w-4 h-4 text-purple-400" />
                          ) : (
                            <Sparkles className="w-4 h-4 text-cyan-400" />
                          )}
                        </div>
                        <div
                          className={`flex-1 max-w-[85%] rounded-2xl p-4 ${
                            message.role === "user"
                              ? "bg-purple-500/10 border border-purple-500/20"
                              : "bg-gray-800/50 border border-gray-700/50"
                          }`}
                        >
                          <p className="text-sm text-gray-200 whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </div>
                      </motion.div>
                    ))}

                    {/* Loading indicator */}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                          <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                        </div>
                        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4">
                          <div className="flex gap-1">
                            <div
                              className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            />
                            <div
                              className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            />
                            <div
                              className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Suggested Questions */}
                    {insights && messages.length === 1 && (
                      <div className="pt-4">
                        <p className="text-xs text-gray-500 mb-2">
                          Suggested questions:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {insights.suggestedQuestions.map((q, i) => (
                            <button
                              key={i}
                              onClick={() => sendMessage(q)}
                              className="px-3 py-1.5 text-sm bg-gray-800/50 border border-gray-700/50 rounded-full text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input */}
              {!isAnalyzing && (
                <div className="p-4 border-t border-gray-800">
                  {error && messages.length > 0 && (
                    <div className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-xs text-red-300">{error}</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask about your patterns, thoughts, style..."
                      className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                      disabled={isLoading}
                    />
                    <button
                      onClick={() => sendMessage()}
                      disabled={!input.trim() || isLoading}
                      className="px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
