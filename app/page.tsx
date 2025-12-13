"use client";

import { useConversations } from "@/context/ConversationContext";
import { FileUpload } from "@/components/FileUpload";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Sparkles,
  BarChart3,
  Trash2,
  Info,
  Shield,
  FileText,
  Github,
  Twitter,
  Linkedin,
  Mail,
} from "lucide-react";
import Footer from "@/components/footer";

export default function Home() {
  const { hasData, isLoading, error, processFile, clearAllData, analytics } =
    useConversations();
  const router = useRouter();

  // If user already has data, show option to continue or upload new
  useEffect(() => {
    // Auto-redirect to wrapped if data exists and not loading
    // Uncomment the next line if you want auto-redirect:
    // if (hasData && !isLoading) router.push("/wrapped");
  }, [hasData, isLoading, router]);

  const handleFileSelect = async (file: File) => {
    await processFile(file);
    router.push("/wrapped");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-grid relative overflow-hidden flex flex-col">
      {/* Background effects */}
      <div className="absolute inset-0 bg-radial pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-16">
        {/* Logo / Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 animate-float"
          >
            <MessageSquare className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black mb-4">
            <span className="gradient-text">GPT Wrapped</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-md mx-auto">
            Discover your ChatGPT story. Your year with AI, beautifully
            visualized.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {[
            { icon: Sparkles, label: "Wrapped Experience" },
            { icon: BarChart3, label: "Deep Analytics" },
            { icon: MessageSquare, label: "Chat Analysis" },
          ].map(({ icon: Icon, label }, index) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700/50 text-sm text-gray-300"
            >
              <Icon className="w-4 h-4 text-purple-400" />
              {label}
            </div>
          ))}
        </motion.div>

        {/* Conditional content based on data state */}
        {hasData && !isLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl mx-auto"
          >
            {/* Show existing data summary */}
            <div className="glass rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Welcome back! 👋
              </h2>
              <p className="text-gray-400 mb-4">
                You have {analytics?.totalConversations.toLocaleString()}{" "}
                conversations loaded.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => router.push("/wrapped")}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
                >
                  <Sparkles className="w-5 h-5" />
                  View Your Wrapped
                </button>
                <button
                  onClick={clearAllData}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 text-gray-300 font-medium rounded-xl hover:bg-gray-700 transition-colors border border-gray-700"
                >
                  <Trash2 className="w-5 h-5" />
                  Clear Data
                </button>
              </div>
            </div>

            <div className="text-center text-gray-500 text-sm">
              Or upload a new file to replace your data
            </div>

            <div className="mt-4">
              <FileUpload
                onFileSelect={handleFileSelect}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </motion.div>
        ) : (
          <FileUpload
            onFileSelect={handleFileSelect}
            isLoading={isLoading}
            error={error}
          />
        )}

        {/* Navigation Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex flex-wrap justify-center gap-6"
        >
          <Link
            href="/about"
            className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors text-sm"
          >
            <Info className="w-4 h-4" />
            About
          </Link>
          <Link
            href="/privacy"
            className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors text-sm"
          >
            <Shield className="w-4 h-4" />
            Privacy
          </Link>
          <Link
            href="/terms"
            className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors text-sm"
          >
            <FileText className="w-4 h-4" />
            Terms
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
