"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { MetricCard } from "@/components/ui/MetricCard";
import { ThroughputChart } from "@/components/charts/ThroughputChart";
import { LatencyChart } from "@/components/charts/LatencyChart";
import { EventDistributionChart } from "@/components/charts/EventDistributionChart";
import { LiveLogConsole } from "@/components/console/LiveLogConsole";
import { ServiceHealthCards } from "@/components/health/ServiceHealthCards";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import { useTelemetrySocket } from "@/hooks/useTelemetrySocket";
import {
  MOCK_METRIC_SERIES,
  MOCK_RESOURCE_DISTRIBUTION,
  MOCK_LOG_EVENTS,
  MOCK_SERVICES_HEALTH
} from "@/lib/mockData";
import { Activity, Clock, Zap, Cpu, Radio } from "lucide-react";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { isConnected, metrics, latestMetric, logs } = useTelemetrySocket();

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartMetrics = metrics.length > 0 ? metrics : MOCK_METRIC_SERIES;
  const consoleLogs = logs.length > 0 ? logs : MOCK_LOG_EVENTS;

  const currentThroughput = latestMetric ? `${latestMetric.throughput.toLocaleString()} req/s` : "1,480 req/s";
  const currentP95 = latestMetric ? `${latestMetric.p95Latency} ms` : "37 ms";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">
      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <div className="flex flex-1 min-w-0">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />

        <main className="flex-1 p-3 sm:p-6 space-y-4 sm:space-y-6 min-w-0 overflow-y-auto overflow-x-hidden">
          {!mounted ? (
            <DashboardSkeleton />
          ) : (
            <>
              {/* Top Bar Controls & Live Connection Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
                      Microservices Telemetry Engine
                    </h2>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                        isConnected
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 animate-pulse"
                      }`}
                    >
                      <Radio className="h-3 w-3" />
                      {isConnected ? "Live Stream (ws://4001)" : "Connecting Stream..."}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-zinc-400">
                    Real-Time SLA Latencies & Ingestion Monitoring
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    aria-label="Select Telemetry Aggregation Window"
                    className="h-9 w-full sm:w-auto rounded-lg border border-slate-200 dark:border-zinc-800 bg-card px-3 text-xs font-semibold text-slate-900 dark:text-zinc-100 focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <option value="live">Live Stream (2s Tick Window)</option>
                    <option value="15m">Last 15 Minutes</option>
                    <option value="1h">Last 1 Hour</option>
                    <option value="24h">Last 24 Hours</option>
                  </select>
                </div>
              </div>

              {/* KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <MetricCard
                  title="Throughput Rate"
                  value={currentThroughput}
                  change="+14.2%"
                  isPositive={true}
                  icon={<Zap className="h-4 w-4 text-blue-500" />}
                  subtitle="PostgreSQL Outbox CDC ingestion"
                  sparklineData={chartMetrics.slice(-6).map((m) => m.throughput)}
                />
                <MetricCard
                  title="p95 SLA Latency"
                  value={currentP95}
                  change="-4.1 ms"
                  isPositive={true}
                  icon={<Clock className="h-4 w-4 text-purple-500" />}
                  subtitle="E2E WebSocket broadcast delivery"
                  sparklineData={chartMetrics.slice(-6).map((m) => m.p95Latency)}
                />
                <MetricCard
                  title="Kafka Partition Lag"
                  value={`${latestMetric ? latestMetric.outboxLag : 0} ms`}
                  change="Optimal"
                  isPositive={true}
                  icon={<Activity className="h-4 w-4 text-emerald-500" />}
                  subtitle="Topic: dbserver1.public.outbox"
                  sparklineData={chartMetrics.slice(-6).map((m) => m.outboxLag)}
                />
                <MetricCard
                  title="Active Connections"
                  value="1,024"
                  change="0 Evicted"
                  isPositive={true}
                  icon={<Cpu className="h-4 w-4 text-amber-500" />}
                  subtitle="Socket Gateway writeBuffer healthy"
                  sparklineData={[900, 950, 980, 1000, 1012, 1024]}
                />
              </div>

              {/* Recharts Analytics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 min-w-0">
                <div className="lg:col-span-2 glass-card rounded-xl p-4 sm:p-5 shadow-sm shadow-slate-200/50 dark:shadow-black/40 min-w-0">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800 mb-4">
                    <div>
                      <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                        Throughput Rate (Requests / sec)
                      </h3>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                        Live PostgreSQL Outbox CDC stream
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      CDC Stream
                    </span>
                  </div>
                  <ThroughputChart data={chartMetrics} />
                </div>

                <div className="glass-card rounded-xl p-4 sm:p-5 shadow-sm shadow-slate-200/50 dark:shadow-black/40 min-w-0">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800 mb-4">
                    <div>
                      <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                        Resource Allocations
                      </h3>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                        Cluster component share
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                      Cluster Topology
                    </span>
                  </div>
                  <EventDistributionChart data={MOCK_RESOURCE_DISTRIBUTION} />
                </div>
              </div>

              {/* Latency Spectrum Chart */}
              <div className="glass-card rounded-xl p-4 sm:p-5 shadow-sm shadow-slate-200/50 dark:shadow-black/40 min-w-0">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800 mb-4">
                  <div>
                    <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                      Latency Percentile Spectrum (p50 / p95 / p99)
                    </h3>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                      Comparing median vs 95th/99th percentile tail latencies
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    SLA Compliance
                  </span>
                </div>
                <LatencyChart data={chartMetrics} />
              </div>

              {/* Lower Section: Live Console & Health */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 min-w-0">
                <div className="lg:col-span-2 min-w-0">
                  <LiveLogConsole logs={consoleLogs} />
                </div>

                <div className="glass-card rounded-xl p-4 sm:p-5 shadow-sm shadow-slate-200/50 dark:shadow-black/40 min-w-0">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800 mb-4">
                    <div>
                      <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                        Service Health Grid
                      </h3>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                        Microservice cluster status
                      </p>
                    </div>
                  </div>
                  <ServiceHealthCards services={MOCK_SERVICES_HEALTH} />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
