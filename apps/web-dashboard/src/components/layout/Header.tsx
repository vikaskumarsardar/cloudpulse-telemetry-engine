"use client";

import React, { useState, useEffect } from "react";
import { Activity, Sun, Moon, Menu, X } from "lucide-react";

interface HeaderProps {
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export function Header({ onMobileMenuToggle, isMobileMenuOpen }: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [isDark, mounted]);

  const isDarkModeActive = mounted && isDark;

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 px-4 sm:px-6 backdrop-blur-xl shadow-xs">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Menu Button */}
        <button
          type="button"
          onClick={onMobileMenuToggle}
          aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
          className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30">
          <Activity className="h-5 w-5 animate-pulse" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">CloudPulse</h1>
          <p className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-zinc-400">Microservices Telemetry Engine</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Live System Status Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 sm:px-3.5 py-1 text-[11px] sm:text-xs font-bold text-emerald-700 dark:text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" aria-hidden="true" />
          <span className="hidden xs:inline">System Healthy</span>
          <span className="xs:hidden">Healthy</span>
        </div>

        {/* Dark/Light Mode Button */}
        <button
          type="button"
          onClick={() => setIsDark(!isDark)}
          aria-label={isDarkModeActive ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-zinc-100 focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {isDarkModeActive ? (
            <Sun className="h-4 w-4 text-amber-400" aria-hidden="true" />
          ) : (
            <Moon className="h-4 w-4 text-blue-600" aria-hidden="true" />
          )}
        </button>
      </div>
    </header>
  );
}
