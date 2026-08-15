import React from "react";
import { Card } from "./Card";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  subtitle?: string;
  sparklineData?: number[];
}

export function MetricCard({
  title,
  value,
  change,
  isPositive = true,
  icon,
  subtitle,
  sparklineData = [30, 45, 35, 60, 55, 75, 70, 90]
}: MetricCardProps) {
  // Generate SVG path for sparkline
  const max = Math.max(...sparklineData);
  const min = Math.min(...sparklineData);
  const points = sparklineData
    .map((val, i) => {
      const x = (i / (sparklineData.length - 1)) * 120;
      const y = 30 - ((val - min) / (max - min || 1)) * 25;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <Card role="region" ariaLabel={`${title} Metric Card`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
          {title}
        </span>
        {icon && <div className="text-slate-400 dark:text-zinc-400">{icon}</div>}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
          {value}
        </div>
        {change && (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
              isPositive
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                : "bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30"
            }`}
          >
            {change}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-zinc-800/60">
        {subtitle && <p className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">{subtitle}</p>}
        
        {/* Mini Sparkline SVG */}
        <div className="w-20 h-6">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 120 30">
            <polyline
              fill="none"
              stroke={isPositive ? "#10b981" : "#f43f5e"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </Card>
  );
}
