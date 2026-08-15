"use client";

import React, { useState } from "react";
import { LogEvent } from "@/types/telemetry";
import { Search, Terminal, Filter, XCircle } from "lucide-react";

interface LiveLogConsoleProps {
  logs: LogEvent[];
}

export function LiveLogConsole({ logs }: LiveLogConsoleProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.senderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.roomId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === "ALL" || log.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div
      role="region"
      aria-label="Live CDC Outbox Log Stream"
      className="glass-card rounded-xl p-5 shadow-sm shadow-slate-200/50 dark:shadow-black/40"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
            <Terminal className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-zinc-100">Live CDC Outbox Log Console</h3>
            <p className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">Streaming Change Data Capture Outbox events</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Accessible Search Input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 dark:text-zinc-500" aria-hidden="true" />
            <input
              type="text"
              aria-label="Search live CDC outbox logs"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 w-48 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 pl-8 pr-7 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus-visible:ring-2 focus-visible:ring-blue-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                aria-label="Clear log search"
                className="absolute right-2 top-2.5 text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300"
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Accessible Level Filter Dropdown */}
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-500" aria-hidden="true" />
            <select
              aria-label="Filter logs by level"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 px-2.5 text-xs text-slate-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-blue-500 font-semibold"
            >
              <option value="ALL">All Levels</option>
              <option value="INFO">INFO</option>
              <option value="WARN">WARN</option>
              <option value="ERROR">ERROR</option>
            </select>
          </div>
        </div>
      </div>

      {/* Accessible Virtualized Log Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <caption className="sr-only">Live CDC Outbox Log Stream Data Table</caption>
          <thead className="border-b border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-bold text-[11px]">
            <tr>
              <th scope="col" className="py-2.5 px-3">Timestamp</th>
              <th scope="col" className="py-2.5 px-3">Seq ID</th>
              <th scope="col" className="py-2.5 px-3">Room ID</th>
              <th scope="col" className="py-2.5 px-3">Sender ID</th>
              <th scope="col" className="py-2.5 px-3">Latency</th>
              <th scope="col" className="py-2.5 px-3">Content Payload</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 font-mono">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-100/60 dark:hover:bg-zinc-800/40 transition-colors">
                <td className="py-2.5 px-3 text-slate-500 dark:text-zinc-400 font-medium">{log.timestamp}</td>
                <td className="py-2.5 px-3 text-blue-600 dark:text-blue-400 font-bold">#{log.sequenceId}</td>
                <td className="py-2.5 px-3 text-slate-700 dark:text-zinc-300 font-medium">{log.roomId}</td>
                <td className="py-2.5 px-3 text-purple-600 dark:text-purple-400 font-semibold">{log.senderId}</td>
                <td className="py-2.5 px-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.latencyMs > 50
                        ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                        : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                    }`}
                  >
                    {log.latencyMs} ms
                  </span>
                </td>
                <td className="py-2.5 px-3 text-slate-800 dark:text-zinc-300 truncate max-w-xs">{log.content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
