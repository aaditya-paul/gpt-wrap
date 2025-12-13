"use client";

import React from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon?: LucideIcon;
  description?: string;
  delay?: number;
  gradient?: string;
  decimals?: number;
}

export function StatCard({
  title,
  value,
  suffix = "",
  prefix = "",
  icon: Icon,
  description,
  delay = 0,
  gradient = "from-purple-500 to-pink-500",
  decimals = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gray-800/50 border border-gray-700/50 p-6"
    >
      {/* Gradient background effect */}
      <div
        className={`absolute inset-0 opacity-5 bg-gradient-to-br ${gradient}`}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            {title}
          </p>
          {Icon && (
            <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient}`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-white">
            {prefix}
            <CountUp
              end={value}
              duration={2}
              delay={delay}
              separator=","
              decimals={decimals}
            />
            {suffix}
          </span>
        </div>

        {description && (
          <p className="mt-2 text-sm text-gray-500">{description}</p>
        )}
      </div>
    </motion.div>
  );
}

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  delay?: number;
  className?: string;
  decimals?: number;
}

export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 2,
  delay = 0,
  className = "text-6xl font-bold text-white",
  decimals = 0,
}: AnimatedCounterProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className={className}
    >
      {prefix}
      <CountUp
        end={value}
        duration={duration}
        delay={delay}
        separator=","
        decimals={decimals}
      />
      {suffix}
    </motion.span>
  );
}

interface BigStatProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  delay?: number;
  gradient?: string;
}

export function BigStat({
  label,
  value,
  suffix = "",
  prefix = "",
  delay = 0,
  gradient = "from-purple-400 via-pink-400 to-orange-400",
}: BigStatProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="text-center"
    >
      <p className="text-lg text-gray-400 mb-2">{label}</p>
      <span
        className={`text-7xl md:text-8xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
      >
        {prefix}
        <CountUp end={value} duration={2.5} delay={delay + 0.2} separator="," />
        {suffix}
      </span>
    </motion.div>
  );
}
