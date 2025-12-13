"use client";

import React from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { FileText, AlertTriangle, Scale, Ban, RefreshCw } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-grid">
      <Header title="Terms & Conditions" backHref="/" />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Terms & Conditions
            </h1>
            <p className="text-gray-400">Last updated: December 13, 2025</p>
          </div>

          {/* Sections */}
          <section className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-400" />
              Acceptance of Terms
            </h2>
            <div className="space-y-3 text-gray-300 text-sm">
              <p>
                By accessing and using GPT Wrapped, you accept and agree to be
                bound by the terms and conditions outlined here. If you do not
                agree to these terms, please do not use this service.
              </p>
            </div>
          </section>

          <section className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Description of Service
            </h2>
            <div className="space-y-3 text-gray-300 text-sm">
              <p>
                GPT Wrapped is a free, open-source tool that analyzes your
                ChatGPT conversation export data to generate visual statistics
                and insights, similar to Spotify Wrapped.
              </p>
              <p>The service:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
                <li>Processes data entirely in your browser</li>
                <li>Does not require account creation</li>
                <li>Does not store data on external servers</li>
                <li>Is provided free of charge</li>
              </ul>
            </div>
          </section>

          <section className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Disclaimer
            </h2>
            <div className="space-y-3 text-gray-300 text-sm">
              <p>
                GPT Wrapped is provided &quot;as is&quot; without any
                warranties, express or implied. We do not guarantee:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
                <li>Accuracy of the analytics or statistics generated</li>
                <li>Compatibility with all ChatGPT export formats</li>
                <li>Uninterrupted or error-free operation</li>
                <li>Fitness for any particular purpose</li>
              </ul>
            </div>
          </section>

          <section className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              User Responsibilities
            </h2>
            <div className="space-y-3 text-gray-300 text-sm">
              <p>You are responsible for:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
                <li>
                  Ensuring you have the right to use and analyze your ChatGPT
                  data
                </li>
                <li>Maintaining the security of your own devices and data</li>
                <li>
                  Any content you choose to share or export from this service
                </li>
              </ul>
            </div>
          </section>

          <section className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Ban className="w-5 h-5 text-red-400" />
              Limitations of Liability
            </h2>
            <div className="space-y-3 text-gray-300 text-sm">
              <p>
                In no event shall GPT Wrapped or its creators be liable for any
                indirect, incidental, special, consequential, or punitive
                damages resulting from your use of or inability to use the
                service.
              </p>
            </div>
          </section>

          <section className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-cyan-400" />
              Changes to Terms
            </h2>
            <div className="space-y-3 text-gray-300 text-sm">
              <p>
                We reserve the right to modify these terms at any time.
                Continued use of the service after any changes constitutes
                acceptance of the new terms.
              </p>
            </div>
          </section>

          <section className="glass rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Intellectual Property
            </h2>
            <div className="space-y-3 text-gray-300 text-sm">
              <p>
                GPT Wrapped is not affiliated with, endorsed by, or sponsored by
                OpenAI. ChatGPT is a trademark of OpenAI. The
                &quot;Wrapped&quot; concept is inspired by Spotify Wrapped but
                is not affiliated with Spotify.
              </p>
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  );
}
