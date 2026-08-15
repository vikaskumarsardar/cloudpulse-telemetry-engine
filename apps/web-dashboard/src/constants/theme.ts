/**
 * Theme & Telemetry Design System Constants.
 * Centralized design tokens, chart color palettes, and threshold limits.
 * Eliminates magic strings and numbers across the dashboard components.
 */

export const CHART_COLORS = {
  THROUGHPUT: {
    STROKE: "#3b82f6",
    GRADIENT_START: "#06b6d4",
    GRADIENT_END: "#3b82f6"
  },
  LATENCY: {
    P50: "#10b981", // Emerald Green
    P95: "#9333ea", // Vibrant Purple
    P99: "#f59e0b"  // Amber Warning
  },
  RESOURCES: [
    { name: "PostgreSQL Outbox", color: "#3b82f6" },
    { name: "Debezium CDC", color: "#06b6d4" },
    { name: "Kafka Broker", color: "#9333ea" },
    { name: "Socket Gateway", color: "#10b981" }
  ]
} as const;

export const SLA_THRESHOLDS = {
  LATENCY_WARNING_MS: 50,
  LATENCY_CRITICAL_MS: 100,
  OUTBOX_LAG_MAX_MS: 5
} as const;

export const ANIMATION_DURATION_MS = 300;
