"use client";

import React from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import Link from "next/link";
import {
  MessageSquare,
  Github,
  Heart,
  Sparkles,
  Lock,
  Zap,
  BarChart3,
  Share2,
} from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: Sparkles,
      title: "Wrapped Experience",
      description: "Beautiful animated slides showcasing your ChatGPT journey",
      color: "text-purple-400",
    },
    {
      icon: BarChart3,
      title: "Deep Analytics",
      description:
        "Comprehensive stats on messages, words, models, and time patterns",
      color: "text-cyan-400",
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "All data stays in your browser - nothing is ever uploaded",
      color: "text-emerald-400",
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "No waiting - analysis happens in real-time in your browser",
      color: "text-amber-400",
    },
    {
      icon: Share2,
      title: "Share Your Stats",
      description: "Export beautiful share cards to show off your AI journey",
      color: "text-pink-400",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-grid">
      <Header title="About" backHref="/" />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Hero */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500"
            >
              <MessageSquare className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-4xl font-black mb-4">
              <span className="gradient-text">GPT Wrapped</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-md mx-auto">
              Your year with ChatGPT, beautifully visualized. Like Spotify
              Wrapped, but for your AI conversations.
            </p>
          </div>

          {/* Features */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-6 text-center">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="glass rounded-xl p-5"
                >
                  <feature.icon className={`w-6 h-6 ${feature.color} mb-3`} />
                  <h3 className="font-medium text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              How It Works
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-white">Export Your Data</h3>
                  <p className="text-sm text-gray-400">
                    Go to ChatGPT → Settings → Data controls → Export data
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0 text-pink-400 font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-white">Upload Your File</h3>
                  <p className="text-sm text-gray-400">
                    Extract the zip and upload conversations.json
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 text-cyan-400 font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-white">Enjoy Your Wrapped</h3>
                  <p className="text-sm text-gray-400">
                    Explore your stats, share your favorites!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Open Source */}
          <section className="glass rounded-2xl p-6 text-center">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center justify-center gap-2">
              <Heart className="w-5 h-5 text-red-400" />
              Open Source
            </h2>
            <p className="text-gray-400 mb-4">
              GPT Wrapped is free and open source. Contributions are welcome!
            </p>
            <a
              href="https://github.com/gpt-wrap"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
            >
              <Github className="w-5 h-5" />
              View on GitHub
            </a>
          </section>

          {/* Footer Links */}
          <div className="flex justify-center gap-6 pt-4">
            <Link
              href="/privacy"
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              Terms & Conditions
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
