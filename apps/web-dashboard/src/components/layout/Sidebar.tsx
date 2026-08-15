"use client";

import React from "react";
import { LayoutDashboard, Activity, Terminal, ShieldCheck, X } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ activeTab, setActiveTab, isMobileOpen, onMobileClose }: SidebarProps) {
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "analytics", label: "Telemetry SLA", icon: Activity },
    { id: "logs", label: "Live CDC Stream", icon: Terminal, badge: "Live 🔴" },
    { id: "health", label: "Services Health", icon: ShieldCheck },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    if (onMobileClose) onMobileClose();
  };

  const navContent = (
    <div className="flex flex-col justify-between h-full p-4">
      <nav className="space-y-1.5" aria-label="Dashboard views">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            Navigation
          </span>
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="md:hidden text-slate-400 dark:text-zinc-400 hover:text-foreground"
              aria-label="Close navigation sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              aria-current={isActive ? "page" : undefined}
              className={`flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 ${
                isActive
                  ? "bg-blue-600/10 text-blue-600 dark:text-blue-400 border-l-2 border-blue-600 dark:border-blue-500 shadow-xs"
                  : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 dark:border-zinc-800/80 pt-4">
        <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/40 p-3.5 text-xs text-slate-500 dark:text-zinc-400">
          <p className="font-bold text-slate-900 dark:text-zinc-200">Cluster: Monorepo K8s</p>
          <p className="mt-0.5 text-[11px] text-slate-400 dark:text-zinc-500">Region: us-east-1 (Local)</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        aria-label="Main Navigation Sidebar"
        className="w-64 border-r border-slate-200 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-950/50 hidden md:flex flex-col min-h-[calc(100vh-4rem)] backdrop-blur-md shrink-0"
      >
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onMobileClose}
            aria-hidden="true"
          />
          <aside className="relative w-64 max-w-[80vw] bg-background border-r border-border h-full z-10 shadow-2xl">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
