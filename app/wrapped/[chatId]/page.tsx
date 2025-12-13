"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useConversations } from "@/context/ConversationContext";
import { Header } from "@/components/Header";
import { AISummary } from "@/components/AISummary";
import { AIInsightsChat } from "@/components/AIInsightsChat";
import { getModelDisplayName } from "@/lib/analytics";
import { format } from "date-fns";
import {
  ArrowLeft,
  MessageSquare,
  User,
  Bot,
  Clock,
  Cpu,
  FileText,
} from "lucide-react";

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { conversations, isLoading } = useConversations();
  const chatId = params.chatId as string;

  const conversation = useMemo(() => {
    return conversations.find((c) => c.id === chatId);
  }, [conversations, chatId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] px-4">
        <h1 className="text-2xl font-bold text-white mb-4">
          Conversation not found
        </h1>
        <button
          onClick={() => router.push("/wrapped")}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Wrapped
        </button>
      </div>
    );
  }

  const durationMinutes = Math.round(conversation.duration / 1000 / 60);

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-grid">
      <Header
        title={conversation.title}
        subtitle={format(conversation.createdAt, "MMMM d, yyyy")}
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">Messages</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {conversation.messages.length}
            </p>
          </div>

          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 text-pink-400 mb-2">
              <FileText className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">Words</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {conversation.totalWords.toLocaleString()}
            </p>
          </div>

          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">Duration</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {durationMinutes > 0 ? `${durationMinutes}m` : "<1m"}
            </p>
          </div>

          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <Cpu className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">Model</span>
            </div>
            <p className="text-lg font-bold text-white truncate">
              {conversation.models.length > 0
                ? getModelDisplayName(conversation.models[0])
                : "Unknown"}
            </p>
          </div>
        </motion.div>

        {/* AI Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 items-start min-h-24">
          <AISummary
            messages={conversation.messages.map((m) => ({
              role: m.role,
              content: m.content,
            }))}
            title={conversation.title}
          />
          <AIInsightsChat
            conversationMessages={conversation.messages.map((m) => ({
              role: m.role,
              content: m.content,
            }))}
            title={conversation.title}
          />
        </div>

        {/* Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-white mb-4">
            Message Breakdown
          </h2>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-400">You</span>
              </div>
              <p className="text-3xl font-bold text-white">
                {conversation.userMessages.length}
              </p>
              <p className="text-sm text-gray-500">
                {conversation.userMessages
                  .reduce((sum, m) => sum + m.wordCount, 0)
                  .toLocaleString()}{" "}
                words
              </p>
            </div>
            <div className="w-px bg-gray-700" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-gray-400">ChatGPT</span>
              </div>
              <p className="text-3xl font-bold text-white">
                {conversation.assistantMessages.length}
              </p>
              <p className="text-sm text-gray-500">
                {conversation.assistantMessages
                  .reduce((sum, m) => sum + m.wordCount, 0)
                  .toLocaleString()}{" "}
                words
              </p>
            </div>
          </div>

          {/* Visual bar */}
          <div className="h-2 rounded-full bg-gray-700 overflow-hidden flex">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
              style={{
                width: `${
                  (conversation.userMessages.length /
                    conversation.messages.length) *
                  100
                }%`,
              }}
            />
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
              style={{
                width: `${
                  (conversation.assistantMessages.length /
                    conversation.messages.length) *
                  100
                }%`,
              }}
            />
          </div>
        </motion.div>

        {/* Conversation Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">
            Conversation Preview
          </h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {conversation.messages.slice(0, 20).map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: message.role === "user" ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
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
                    <User className="w-4 h-4 text-purple-400" />
                  ) : (
                    <Bot className="w-4 h-4 text-cyan-400" />
                  )}
                </div>
                <div
                  className={`flex-1 max-w-[80%] rounded-2xl p-4 ${
                    message.role === "user"
                      ? "bg-purple-500/10 border border-purple-500/20"
                      : "bg-gray-800/50 border border-gray-700/50"
                  }`}
                >
                  <p className="text-sm text-gray-300 whitespace-pre-wrap line-clamp-6">
                    {message.content}
                  </p>
                  {message.content.length > 500 && (
                    <p className="text-xs text-gray-500 mt-2">
                      ... {message.wordCount} words total
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
            {conversation.messages.length > 20 && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">
                  + {conversation.messages.length - 20} more messages
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
