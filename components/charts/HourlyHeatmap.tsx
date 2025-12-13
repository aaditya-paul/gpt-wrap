"use client";

import React from "react";
import { motion } from "framer-motion";
import { formatHour } from "@/lib/analytics";

interface HourlyHeatmapProps {
  data: number[];
  delay?: number;
}

export function HourlyHeatmap({ data, delay = 0 }: HourlyHeatmapProps) {
  const max = Math.max(...data);

  const getOpacity = (value: number) => {
    if (max === 0) return 0.1;
    return 0.1 + (value / max) * 0.9;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="w-full"
    >
      <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
        {data.map((value, hour) => (
          <motion.div
            key={hour}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + hour * 0.02, duration: 0.3 }}
            className="relative group"
          >
            <div
              className="aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-transform hover:scale-110"
              style={{
                backgroundColor: `rgba(168, 85, 247, ${getOpacity(value)})`,
              }}
            >
              <span className="text-white/70">{hour}</span>
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-gray-700">
              <div className="font-medium">{formatHour(hour)}</div>
              <div className="text-gray-400">{value} conversations</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          {[0.1, 0.3, 0.5, 0.7, 0.9].map((opacity) => (
            <div
              key={opacity}
              className="w-4 h-4 rounded"
              style={{ backgroundColor: `rgba(168, 85, 247, ${opacity})` }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </motion.div>
  );
}

interface WeeklyHeatmapProps {
  data: number[];
  delay?: number;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function WeeklyHeatmap({ data, delay = 0 }: WeeklyHeatmapProps) {
  const max = Math.max(...data);

  const getOpacity = (value: number) => {
    if (max === 0) return 0.1;
    return 0.1 + (value / max) * 0.9;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="grid grid-cols-7 gap-3">
        {data.map((value, day) => (
          <motion.div
            key={day}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + day * 0.05, duration: 0.3 }}
            className="flex flex-col items-center gap-2"
          >
            <div
              className="w-full aspect-square rounded-xl flex items-center justify-center text-lg font-bold transition-transform hover:scale-105"
              style={{
                backgroundColor: `rgba(236, 72, 153, ${getOpacity(value)})`,
              }}
            >
              <span className="text-white">{value}</span>
            </div>
            <span className="text-xs text-gray-400">{DAYS[day]}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
