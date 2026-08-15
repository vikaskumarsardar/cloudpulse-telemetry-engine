"use client";

import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { MetricPoint } from "@/types/telemetry";
import { CHART_COLORS } from "@/constants/theme";

interface ThroughputChartProps {
  data: MetricPoint[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg p-3 text-xs shadow-xl border border-slate-200 dark:border-zinc-700 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md">
        <p className="font-bold text-slate-900 dark:text-zinc-100">Timestamp: {label}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-500" />
          <span className="font-semibold text-slate-700 dark:text-zinc-300">Throughput:</span>
          <span className="font-extrabold text-cyan-600 dark:text-cyan-400">
            {payload[0].value.toLocaleString()} req/s
          </span>
        </div>
      </div>
    );
  }
  return null;
}

export function ThroughputChart({ data }: ThroughputChartProps) {
  return (
    <div
      role="region"
      aria-label="Throughput Area Chart"
      className="h-72 w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="throughputGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.THROUGHPUT.GRADIENT_START} stopOpacity={0.35} />
              <stop offset="95%" stopColor={CHART_COLORS.THROUGHPUT.GRADIENT_END} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="timestamp" stroke="#71717a" fontSize={11} tickLine={false} />
          <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="throughput"
            stroke={CHART_COLORS.THROUGHPUT.STROKE}
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#throughputGrad)"
            name="Throughput (req/s)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
