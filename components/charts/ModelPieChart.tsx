"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { getModelDisplayName } from "@/lib/analytics";
import { ModelStats } from "@/lib/types";

const COLORS = [
  "#a855f7", // purple
  "#ec4899", // pink
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#8b5cf6", // violet
];

interface ModelPieChartProps {
  data: ModelStats[];
  delay?: number;
}

export function ModelPieChart({ data, delay = 0 }: ModelPieChartProps) {
  const chartData = data.slice(0, 8).map((item) => ({
    ...item,
    displayName: getModelDisplayName(item.name),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="w-full"
    >
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="count"
                animationBegin={delay * 1000}
                animationDuration={1000}
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "0.75rem",
                  color: "#fff",
                }}
                formatter={(value: number, name: string) => [
                  `${value} conversations`,
                  getModelDisplayName(name),
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-2">
          {chartData.map((item, index) => (
            <div key={item.name} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm text-gray-300">{item.displayName}</span>
              <span className="text-sm text-gray-500">
                ({item.percentage.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
