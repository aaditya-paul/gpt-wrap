"use client";

import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string | ReactNode;
  backHref?: string;
  showHome?: boolean;
  rightContent?: ReactNode;
}

export function Header({
  title,
  subtitle,
  backHref,
  showHome = false,
  rightContent,
}: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-gray-800/50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          {(backHref !== undefined || !showHome) && (
            <button
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          )}
          {showHome && backHref === undefined && (
            <button
              onClick={() => router.push("/")}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Go home"
            >
              <Home className="w-5 h-5 text-white" />
            </button>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-white truncate">
              {title}
            </h1>
            {subtitle && (
              <div className="text-sm text-gray-400">{subtitle}</div>
            )}
          </div>

          {rightContent && <div className="flex-shrink-0">{rightContent}</div>}
        </div>
      </div>
    </div>
  );
}

interface HeaderWithSearchProps extends HeaderProps {
  children?: ReactNode;
}

export function HeaderWithSearch({
  title,
  subtitle,
  backHref,
  showHome,
  rightContent,
  children,
}: HeaderWithSearchProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-gray-800/50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center gap-4 mb-4">
          {(backHref !== undefined || !showHome) && (
            <button
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          )}
          {showHome && backHref === undefined && (
            <button
              onClick={() => router.push("/")}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Go home"
            >
              <Home className="w-5 h-5 text-white" />
            </button>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white">{title}</h1>
            {subtitle && (
              <span className="text-sm text-gray-400">{subtitle}</span>
            )}
          </div>

          {rightContent && <div className="flex-shrink-0">{rightContent}</div>}
        </div>

        {children}
      </div>
    </div>
  );
}
