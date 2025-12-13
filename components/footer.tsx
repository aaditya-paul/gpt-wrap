import React from "react";
import Link from "next/link";
import {
  Github,
  Instagram,
  Linkedin,
  Mail,
  MessageSquare,
  Twitter,
} from "lucide-react";
function Footer() {
  return (
    <footer className="relative z-10 border-t border-gray-800 bg-[#0a0a0a]/80 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">GPT Wrapped</p>
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} All rights reserved
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 mr-2">Connect:</span>
            <a
              href="https://github.com/aaditya-paul"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://www.instagram.com/__the.frustrated.guy__/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/aaditya-paul"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:aadityapaul2006@gmail.com"
              className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <Link
              href="/about"
              className="hover:text-purple-400 transition-colors"
            >
              About
            </Link>
            <Link
              href="/privacy"
              className="hover:text-purple-400 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-purple-400 transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
