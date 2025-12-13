"use client";

import React from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Shield, Lock, Eye, Server, Trash2, Mail } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-grid">
      <Header title="Privacy Policy" backHref="/" />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Your Privacy Matters
            </h1>
            <p className="text-gray-400">Last updated: December 13, 2025</p>
          </div>

          {/* Key Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="glass rounded-xl p-4 text-center">
              <Lock className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm text-white font-medium">100% Client-Side</p>
              <p className="text-xs text-gray-500">No server uploads</p>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <Eye className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-sm text-white font-medium">No Tracking</p>
              <p className="text-xs text-gray-500">Zero analytics</p>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <Trash2 className="w-6 h-6 text-pink-400 mx-auto mb-2" />
              <p className="text-sm text-white font-medium">You Control Data</p>
              <p className="text-xs text-gray-500">Delete anytime</p>
            </div>
          </div>

          {/* Sections */}
          <section className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 text-purple-400" />
              Data Processing
            </h2>
            <div className="space-y-3 text-gray-300 text-sm">
              <p>
                <strong className="text-white">
                  GPT Wrapped processes all your data entirely in your browser.
                </strong>{" "}
                Your ChatGPT conversation export file never leaves your device.
              </p>
              <p>
                When you upload your{" "}
                <code className="text-purple-400">conversations.json</code>{" "}
                file, it is:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
                <li>Parsed and analyzed using JavaScript in your browser</li>
                <li>Stored locally in your browser&apos;s IndexedDB storage</li>
                <li>Never transmitted to any server or third party</li>
                <li>Never stored on our servers (we don&apos;t have any!)</li>
              </ul>
            </div>
          </section>

          <section className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Data Storage
            </h2>
            <div className="space-y-3 text-gray-300 text-sm">
              <p>
                Your data is stored locally using IndexedDB, a browser-based
                storage system. This means:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
                <li>Data persists only in your browser</li>
                <li>
                  Clearing browser data will remove all stored information
                </li>
                <li>You can manually delete data anytime from the home page</li>
                <li>Data is not synced across devices or browsers</li>
              </ul>
            </div>
          </section>

          <section className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Third-Party Services
            </h2>
            <div className="space-y-3 text-gray-300 text-sm">
              <p>
                GPT Wrapped does not use any third-party analytics, tracking, or
                advertising services. We do not:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
                <li>Use Google Analytics or similar tracking tools</li>
                <li>Display advertisements</li>
                <li>Share data with any third parties</li>
                <li>Use cookies for tracking purposes</li>
              </ul>
            </div>
          </section>

          <section className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-cyan-400" />
              Contact
            </h2>
            <p className="text-gray-300 text-sm">
              If you have any questions about this Privacy Policy, please open
              an issue on our GitHub repository.
            </p>
          </section>
        </motion.div>
      </main>
    </div>
  );
}
