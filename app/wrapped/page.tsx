"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useConversations } from "@/context/ConversationContext";
import { StatCard, BigStat } from "@/components/stats/StatCard";
import { ActivityChart } from "@/components/charts/ActivityChart";
import { ModelPieChart } from "@/components/charts/ModelPieChart";
import {
  HourlyHeatmap,
  WeeklyHeatmap,
} from "@/components/charts/HourlyHeatmap";
import { ExportShare } from "@/components/ExportShare";
import {
  formatHour,
  formatDay,
  formatMonth,
  getModelDisplayName,
} from "@/lib/analytics";
import { format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Calendar,
  Clock,
  Zap,
  Award,
  TrendingUp,
  Home,
  Download,
  Share2,
  List,
  Flame,
} from "lucide-react";

interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  gradient: string;
}

const SLIDES: Slide[] = [
  {
    id: "intro",
    title: "Your Year with ChatGPT",
    gradient: "from-purple-600 via-pink-600 to-orange-500",
  },
  {
    id: "total-stats",
    title: "The Big Picture",
    gradient: "from-blue-600 to-purple-600",
  },
  {
    id: "messages",
    title: "Message Breakdown",
    gradient: "from-emerald-600 to-cyan-600",
  },
  {
    id: "activity",
    title: "Your Activity Timeline",
    gradient: "from-pink-600 to-rose-600",
  },
  {
    id: "peak-times",
    title: "When You Chat",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: "weekly",
    title: "Your Week",
    gradient: "from-indigo-600 to-purple-600",
  },
  {
    id: "models",
    title: "Your AI Models",
    gradient: "from-violet-600 to-purple-600",
  },
  {
    id: "streaks",
    title: "Your Streaks",
    gradient: "from-orange-500 to-red-600",
  },
  {
    id: "top-chats",
    title: "Epic Conversations",
    gradient: "from-cyan-600 to-blue-600",
  },
  {
    id: "words",
    title: "Word Count",
    gradient: "from-green-600 to-emerald-600",
  },
  {
    id: "summary",
    title: "Your 2024 Summary",
    gradient: "from-purple-600 via-pink-600 to-orange-500",
  },
];

export default function WrappedPage() {
  const router = useRouter();
  const { analytics, hasData, isLoading } = useConversations();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showExport, setShowExport] = useState(false);

  // Redirect if no data
  useEffect(() => {
    if (!isLoading && !hasData) {
      router.push("/");
    }
  }, [isLoading, hasData, router]);

  const nextSlide = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "Escape") {
        router.push("/");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  // Touch swipe handling
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  if (isLoading || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Prepare activity data for chart
  const activityData = Object.entries(analytics.timeStats.byDate)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const renderSlideContent = () => {
    const slide = SLIDES[currentSlide];

    switch (slide.id) {
      case "intro":
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-24 h-24 mb-8 rounded-3xl bg-white/10 backdrop-blur flex items-center justify-center"
            >
              <MessageSquare className="w-12 h-12 text-white" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-6xl font-black text-white mb-4"
            >
              Your Year with
              <br />
              <span className="gradient-text">ChatGPT</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-white/70 mb-8"
            >
              {analytics.firstConversation && analytics.lastConversation
                ? `${format(
                    analytics.firstConversation,
                    "MMM yyyy"
                  )} - ${format(analytics.lastConversation, "MMM yyyy")}`
                : "Your journey"}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-white/50 flex items-center gap-2"
            >
              Swipe or tap to continue <ChevronRight className="w-5 h-5" />
            </motion.p>
          </div>
        );

      case "total-stats":
        return (
          <div className="flex flex-col items-center justify-center h-full px-4">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl text-white/70 mb-8"
            >
              This year, you had...
            </motion.p>
            <BigStat
              label="Total Conversations"
              value={analytics.totalConversations}
              delay={0.3}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-center"
            >
              <p className="text-lg text-white/50">
                across {analytics.activeDays} active days
              </p>
            </motion.div>
          </div>
        );

      case "messages":
        return (
          <div className="flex flex-col items-center justify-center h-full px-4">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl text-white/70 mb-8"
            >
              That&apos;s a lot of messages...
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
              <StatCard
                title="Your Messages"
                value={analytics.totalUserMessages}
                icon={MessageSquare}
                delay={0.2}
                gradient="from-purple-500 to-pink-500"
                description="Questions asked"
              />
              <StatCard
                title="AI Responses"
                value={analytics.totalAssistantMessages}
                icon={Zap}
                delay={0.4}
                gradient="from-cyan-500 to-blue-500"
                description="Answers received"
              />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-lg text-white/50"
            >
              {analytics.totalMessages.toLocaleString()} total messages
              exchanged
            </motion.p>
          </div>
        );

      case "activity":
        return (
          <div className="flex flex-col items-center justify-center h-full px-4 w-full">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl text-white/70 mb-8"
            >
              Your conversation journey
            </motion.p>
            <div className="w-full max-w-3xl glass rounded-2xl p-6">
              <ActivityChart data={activityData} delay={0.3} />
            </div>
          </div>
        );

      case "peak-times":
        return (
          <div className="flex flex-col items-center justify-center h-full px-4">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl text-white mb-8"
            >
              Your peak chatting hour was...
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-4"
            >
              <span className="text-7xl md:text-9xl font-black text-white drop-shadow-lg">
                {formatHour(analytics.peakHour)}
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-white/80 text-lg"
            >
              <p>Your most active time of day</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-12 w-full max-w-2xl bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <p className="text-sm text-white/70 mb-4 text-center font-medium">
                Activity by hour
              </p>
              <HourlyHeatmap data={analytics.timeStats.hourly} delay={0.8} />
            </motion.div>
          </div>
        );

      case "weekly":
        return (
          <div className="flex flex-col items-center justify-center h-full px-4">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl text-white/70 mb-4"
            >
              Your favorite day to chat was...
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-black text-white mb-8"
            >
              {formatDay(analytics.peakDay)}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="w-full max-w-lg glass rounded-2xl p-6"
            >
              <WeeklyHeatmap data={analytics.timeStats.daily} delay={0.6} />
            </motion.div>
          </div>
        );

      case "models":
        return (
          <div className="flex flex-col items-center justify-center h-full px-4">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl text-white/70 mb-4"
            >
              Your favorite AI model was...
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-black gradient-text mb-8"
            >
              {analytics.favoriteModel
                ? getModelDisplayName(analytics.favoriteModel)
                : "Unknown"}
            </motion.h2>
            {analytics.modelStats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass rounded-2xl p-6"
              >
                <ModelPieChart data={analytics.modelStats} delay={0.6} />
              </motion.div>
            )}
          </div>
        );

      case "streaks":
        return (
          <div className="flex flex-col items-center justify-center h-full px-4">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl text-white/70 mb-4"
            >
              Your longest streak was...
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-4 mb-8"
            >
              <Flame className="w-16 h-16 text-orange-500" />
              <span className="text-7xl md:text-8xl font-black text-white">
                {analytics.streakStats.longestStreak}
              </span>
              <span className="text-2xl text-white/70">days</span>
            </motion.div>
            {analytics.streakStats.longestStreakStart &&
              analytics.streakStats.longestStreakEnd && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-lg text-white/50"
                >
                  {format(analytics.streakStats.longestStreakStart, "MMM d")} -{" "}
                  {format(
                    analytics.streakStats.longestStreakEnd,
                    "MMM d, yyyy"
                  )}
                </motion.p>
              )}
            {analytics.streakStats.currentStreak > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-8 px-6 py-3 glass rounded-xl"
              >
                <p className="text-white/70">
                  Current streak:{" "}
                  <span className="text-orange-400 font-bold">
                    {analytics.streakStats.currentStreak} days
                  </span>
                </p>
              </motion.div>
            )}
          </div>
        );

      case "top-chats":
        return (
          <div className="flex flex-col items-center justify-center h-full px-4 overflow-y-auto">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl text-white/70 mb-6"
            >
              Your most epic conversations
            </motion.p>
            <div className="w-full max-w-lg space-y-3">
              {analytics.topByMessages.slice(0, 5).map((item, index) => (
                <motion.div
                  key={item.conversation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  onClick={() =>
                    router.push(`/wrapped/${item.conversation.id}`)
                  }
                  className="glass rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {item.conversation.title}
                    </p>
                    <p className="text-sm text-white/50">{item.label}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/30" />
                </motion.div>
              ))}
            </div>
          </div>
        );

      case "words":
        return (
          <div className="flex flex-col items-center justify-center h-full px-4">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl text-white/70 mb-8"
            >
              You wrote...
            </motion.p>
            <BigStat
              label="Words"
              value={analytics.wordStats.totalUserWords}
              delay={0.2}
              gradient="from-green-400 to-emerald-500"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-4 text-lg text-white/50"
            >
              That&apos;s about{" "}
              {Math.round(analytics.wordStats.totalUserWords / 250)} pages!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-8 grid grid-cols-2 gap-4 w-full max-w-md"
            >
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-sm text-white/50 mb-1">Avg message</p>
                <p className="text-2xl font-bold text-white">
                  {Math.round(analytics.wordStats.averageUserMessageLength)}{" "}
                  words
                </p>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-sm text-white/50 mb-1">AI wrote</p>
                <p className="text-2xl font-bold text-white">
                  {analytics.wordStats.totalAssistantWords.toLocaleString()}{" "}
                  words
                </p>
              </div>
            </motion.div>
          </div>
        );

      case "summary":
        return (
          <div className="flex flex-col items-center justify-center h-full px-4 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className="w-20 h-20 mb-6 rounded-2xl bg-white/10 flex items-center justify-center"
            >
              <Award className="w-10 h-10 text-yellow-400" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-black text-white mb-8"
            >
              That&apos;s a wrap! 🎉
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-4 w-full max-w-md mb-8"
            >
              <div className="glass rounded-xl p-4">
                <p className="text-3xl font-bold text-white">
                  {analytics.totalConversations}
                </p>
                <p className="text-sm text-white/50">Conversations</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-3xl font-bold text-white">
                  {analytics.totalMessages.toLocaleString()}
                </p>
                <p className="text-sm text-white/50">Messages</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-3xl font-bold text-white">
                  {analytics.activeDays}
                </p>
                <p className="text-sm text-white/50">Active Days</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-3xl font-bold text-white">
                  {analytics.streakStats.longestStreak}
                </p>
                <p className="text-sm text-white/50">Day Streak</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <button
                onClick={() => router.push("/")}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
              >
                <Home className="w-5 h-5" />
                Home
              </button>
              <button
                onClick={() => setShowExport(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
              <button
                onClick={() => router.push("/wrapped/all")}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                <List className="w-5 h-5" />
                All Conversations
              </button>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${SLIDES[currentSlide].gradient} transition-all duration-500`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Navigation */}
      <div className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="p-2 rounded-full bg-white/10 backdrop-blur text-white hover:bg-white/20 transition-colors"
        >
          <Home className="w-5 h-5" />
        </button>
        {/* Progress dots */}
        <div className="flex gap-1.5">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-white w-6"
                  : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
        <div className="w-9" /> {/* Spacer for alignment */}
      </div>

      {/* Slide content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen pt-16 pb-24"
        >
          {renderSlideContent()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <div className="fixed bottom-8 left-4 right-4 flex justify-between items-center">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className={`p-3 rounded-full bg-white/10 backdrop-blur text-white transition-all ${
            currentSlide === 0
              ? "opacity-0 pointer-events-none"
              : "hover:bg-white/20"
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <p className="text-white/50 text-sm">
          {currentSlide + 1} / {SLIDES.length}
        </p>

        <button
          onClick={nextSlide}
          disabled={currentSlide === SLIDES.length - 1}
          className={`p-3 rounded-full bg-white/10 backdrop-blur text-white transition-all ${
            currentSlide === SLIDES.length - 1
              ? "opacity-0 pointer-events-none"
              : "hover:bg-white/20"
          }`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Export/Share Modal */}
      <ExportShare
        analytics={analytics}
        isOpen={showExport}
        onClose={() => setShowExport(false)}
      />
    </div>
  );
}
