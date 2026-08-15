/**
 * Telemetry Data Contracts and Interface Definitions.
 */

export interface MetricPoint {
  timestamp: string;
  throughput: number; // requests / sec
  p50Latency: number; // ms
  p95Latency: number; // ms
  p99Latency: number; // ms
  outboxLag: number;  // ms
}

export interface ResourceDistribution {
  name: string;
  value: number;
  color: string;
}

export interface LogEvent {
  id: string;
  sequenceId: number;
  roomId: string;
  senderId: string;
  content: string;
  latencyMs: number;
  level: "INFO" | "WARN" | "ERROR";
  timestamp: string;
}

export interface ServiceHealthStatus {
  serviceName: string;
  status: "HEALTHY" | "DEGRADED" | "DOWN";
  uptime: string;
  activeConnections: number;
  details: string;
}
