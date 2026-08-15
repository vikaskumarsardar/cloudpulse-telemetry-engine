"use client";

import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { MetricPoint } from "@/types/telemetry";
import { CHART_COLORS, SLA_THRESHOLDS } from "@/constants/theme";

interface LatencyChartProps {
  data: MetricPoint[];
}

function LatencyTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const p99 = payload.find((p: any) => p.dataKey === "p99Latency")?.value || 0;
    const isElevated = p99 > SLA_THRESHOLDS.LATENCY_WARNING_MS;

    return (
      <div className="glass-card rounded-lg p-3 text-xs shadow-xl border border-slate-200 dark:border-zinc-700 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md">
        <div className="flex items-center justify-between gap-4 pb-1 border-b border-slate-200 dark:border-zinc-800">
          <span className="font-bold text-slate-900 dark:text-zinc-100">Time: {label}</span>
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isElevated ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"}`}>
            {isElevated ? "Elevated SLA" : "Normal SLA"}
          </span>
        </div>
        <div className="mt-2 space-y-1 font-mono">
          <p className="text-emerald-600 dark:text-emerald-400">p50 Median: {payload[0]?.value} ms</p>
          <p className="text-purple-600 dark:text-purple-400">p95 SLA: {payload[1]?.value} ms</p>
          <p className="text-amber-600 dark:text-amber-400">p99 Tail: {payload[2]?.value} ms</p>
        </div>
      </div>
    );
  }
  return null;
}

export function LatencyChart({ data }: LatencyChartProps) {
  return (
    <div
      role="region"
      aria-label="Latency Percentile Spectrum Line Chart"
      className="h-72 w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="timestamp" stroke="#71717a" fontSize={11} tickLine={false} />
          <YAxis stroke="#71717a" fontSize={11} tickLine={false} unit="ms" />
          <Tooltip content={<LatencyTooltip />} />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
          <Line type="monotone" dataKey="p50Latency" name="p50 Median" stroke={CHART_COLORS.LATENCY.P50} strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="p95Latency" name="p95 SLA" stroke={CHART_COLORS.LATENCY.P95} strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="p99Latency" name="p99 Tail" stroke={CHART_COLORS.LATENCY.P99} strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
