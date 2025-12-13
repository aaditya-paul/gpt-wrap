"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useConversations } from "@/context/ConversationContext";
import { HeaderWithSearch } from "@/components/Header";
import { getModelDisplayName } from "@/lib/analytics";
import { format } from "date-fns";
import {
  Search,
  MessageSquare,
  Calendar,
  SortAsc,
  SortDesc,
} from "lucide-react";

type SortBy = "date" | "messages" | "words";
type SortOrder = "asc" | "desc";

export default function AllConversationsPage() {
  const router = useRouter();
  const { conversations, isLoading } = useConversations();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const filteredConversations = useMemo(() => {
    let result = [...conversations];

    // Filter by search
    if (search) {
      const query = search.toLowerCase();
      result = result.filter((c) => c.title.toLowerCase().includes(query));
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case "messages":
          comparison = a.messages.length - b.messages.length;
          break;
        case "words":
          comparison = a.totalWords - b.totalWords;
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [conversations, search, sortBy, sortOrder]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-grid">
      <HeaderWithSearch
        title="All Conversations"
        subtitle={`(${conversations.length})`}
        backHref="/wrapped"
      >
        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="date">Date</option>
              <option value="messages">Messages</option>
              <option value="words">Words</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors"
            >
              {sortOrder === "asc" ? (
                <SortAsc className="w-5 h-5" />
              ) : (
                <SortDesc className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </HeaderWithSearch>

      {/* Conversation List */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-2">
          {filteredConversations.map((conversation, index) => (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.02, 0.5) }}
              onClick={() => router.push(`/wrapped/${conversation.id}`)}
              className="glass rounded-xl p-4 cursor-pointer hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-colors">
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white truncate group-hover:text-purple-300 transition-colors">
                    {conversation.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(conversation.createdAt, "MMM d, yyyy")}
                    </span>
                    <span>{conversation.messages.length} messages</span>
                    <span>
                      {conversation.totalWords.toLocaleString()} words
                    </span>
                    {conversation.models.length > 0 && (
                      <span className="text-purple-400/70">
                        {getModelDisplayName(conversation.models[0])}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredConversations.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">No conversations found</p>
          </div>
        )}
      </main>
    </div>
  );
}
