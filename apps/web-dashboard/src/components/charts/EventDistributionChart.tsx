"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ResourceDistribution } from "@/types/telemetry";

interface EventDistributionChartProps {
  data: ResourceDistribution[];
}

export function EventDistributionChart({ data }: EventDistributionChartProps) {
  return (
    <div
      role="region"
      aria-label="Cluster Resource Distribution Donut Chart"
      className="h-72 w-full flex flex-col justify-between"
    >
      <div className="relative h-52 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                borderColor: "#27272a",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#f4f4f5"
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Donut Metric Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">1.48k</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">req/sec</span>
        </div>
      </div>

      {/* Custom Right/Bottom Legend Column */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-zinc-800 text-xs">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-slate-600 dark:text-zinc-400 truncate">{item.name}</span>
            <span className="font-bold text-slate-900 dark:text-zinc-200 ml-auto">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
