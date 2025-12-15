"use client";

import React, { useRef, useState } from "react";
import { toPng, toJpeg } from "html-to-image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Share2,
  X,
  Image,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { Analytics } from "@/lib/types";
import { format } from "date-fns";

interface ExportShareProps {
  analytics: Analytics;
  isOpen: boolean;
  onClose: () => void;
}

export function ExportShare({ analytics, isOpen, onClose }: ExportShareProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (type: "png" | "jpeg") => {
    if (!cardRef.current) return;

    setIsExporting(true);
    try {
      const dataUrl =
        type === "png"
          ? await toPng(cardRef.current, { quality: 1, pixelRatio: 2 })
          : await toJpeg(cardRef.current, { quality: 0.95, pixelRatio: 2 });

      const link = document.createElement("a");
      link.download = `gpt-wrapped-${Date.now()}.${type}`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current || !navigator.share) return;

    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "gpt-wrapped.png", { type: "image/png" });

      await navigator.share({
        title: "My GPT Wrapped",
        text: `I had ${analytics.totalConversations} conversations with ChatGPT! Check out your stats.`,
        files: [file],
      });
    } catch (error) {
      console.error("Share failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Share Card */}
            <div
              ref={cardRef}
              className="rounded-3xl overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-1"
            >
              <div className="bg-[#0a0a0a] rounded-[22px] p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-black text-white mb-2">
                    My GPT Wrapped
                  </h2>
                  {analytics.firstConversation &&
                    analytics.lastConversation && (
                      <p className="text-sm text-gray-400">
                        {format(analytics.firstConversation, "MMM yyyy")} -{" "}
                        {format(analytics.lastConversation, "MMM yyyy")}
                      </p>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-2xl p-4 text-center">
                    <p className="text-3xl font-bold text-white">
                      {analytics.totalConversations}
                    </p>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">
                      Conversations
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-pink-500/20 to-pink-500/5 rounded-2xl p-4 text-center">
                    <p className="text-3xl font-bold text-white">
                      {analytics.totalMessages.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">
                      Messages
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 rounded-2xl p-4 text-center">
                    <p className="text-3xl font-bold text-white">
                      {analytics.activeDays}
                    </p>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">
                      Active Days
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500/20 to-orange-500/5 rounded-2xl p-4 text-center">
                    <p className="text-3xl font-bold text-white">
                      {analytics.streakStats.longestStreak}
                    </p>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">
                      Day Streak
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    {analytics.wordStats.totalUserWords.toLocaleString()} words
                    written
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex justify-center items-center">
                      <MessageSquare className="w-4 h-14 text-white" />
                    </div>

                    <span className="text-sm font-medium gradient-text">
                      GPT Wrapped
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Export Actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleExport("png")}
                disabled={isExporting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                {isExporting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Image className="w-5 h-5" />
                )}
                Save as PNG
              </button>
              <button
                onClick={() => handleExport("jpeg")}
                disabled={isExporting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                {isExporting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
                Save as JPEG
              </button>
              {typeof navigator !== "undefined" && "share" in navigator && (
                <button
                  onClick={handleShare}
                  disabled={isExporting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isExporting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Share2 className="w-5 h-5" />
                  )}
                  Share
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
