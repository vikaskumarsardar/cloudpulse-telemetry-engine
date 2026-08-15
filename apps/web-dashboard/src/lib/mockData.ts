import { MetricPoint, ResourceDistribution, LogEvent, ServiceHealthStatus } from "@/types/telemetry";

/**
 * Realistic Mock Data Fixtures for Sprint 1 UI Shell MVP.
 */

export const MOCK_METRIC_SERIES: MetricPoint[] = [
  { timestamp: "03:40", throughput: 920, p50Latency: 12, p95Latency: 32, p99Latency: 55, outboxLag: 0 },
  { timestamp: "03:41", throughput: 1100, p50Latency: 14, p95Latency: 35, p99Latency: 58, outboxLag: 1 },
  { timestamp: "03:42", throughput: 1350, p50Latency: 15, p95Latency: 38, p99Latency: 62, outboxLag: 2 },
  { timestamp: "03:43", throughput: 1680, p50Latency: 18, p95Latency: 45, p99Latency: 85, outboxLag: 5 },
  { timestamp: "03:44", throughput: 1420, p50Latency: 16, p95Latency: 39, p99Latency: 68, outboxLag: 1 },
  { timestamp: "03:45", throughput: 1250, p50Latency: 13, p95Latency: 34, p99Latency: 54, outboxLag: 0 },
  { timestamp: "03:46", throughput: 1540, p50Latency: 17, p95Latency: 42, p99Latency: 72, outboxLag: 3 },
  { timestamp: "03:47", throughput: 1890, p50Latency: 22, p95Latency: 52, p99Latency: 98, outboxLag: 8 },
  { timestamp: "03:48", throughput: 1610, p50Latency: 19, p95Latency: 44, p99Latency: 79, outboxLag: 2 },
  { timestamp: "03:49", throughput: 1480, p50Latency: 15, p95Latency: 37, p99Latency: 61, outboxLag: 0 },
];

export const MOCK_RESOURCE_DISTRIBUTION: ResourceDistribution[] = [
  { name: "PostgreSQL Outbox", value: 35, color: "#3b82f6" },
  { name: "Debezium CDC", value: 25, color: "#06b6d4" },
  { name: "Kafka Broker", value: 20, color: "#8b5cf6" },
  { name: "Socket Gateway", value: 20, color: "#10b981" },
];

export const MOCK_LOG_EVENTS: LogEvent[] = [
  { id: "log_101", sequenceId: 1042, roomId: "room_general", senderId: "user_alice", content: "High-throughput test message", latencyMs: 28, level: "INFO", timestamp: "03:49:58" },
  { id: "log_102", sequenceId: 1043, roomId: "room_general", senderId: "user_bob", content: "CDC outbox transaction committed", latencyMs: 31, level: "INFO", timestamp: "03:49:59" },
  { id: "log_103", sequenceId: 1044, roomId: "room_finance", senderId: "user_charlie", content: "Kafka consumer offset committed", latencyMs: 25, level: "INFO", timestamp: "03:50:00" },
  { id: "log_104", sequenceId: 1045, roomId: "room_general", senderId: "system_monitor", content: "Garbage collection execution trigger", latencyMs: 82, level: "WARN", timestamp: "03:50:01" },
  { id: "log_105", sequenceId: 1046, roomId: "room_devops", senderId: "user_diana", content: "Socket writeBuffer cleared", latencyMs: 19, level: "INFO", timestamp: "03:50:02" },
];

export const MOCK_SERVICES_HEALTH: ServiceHealthStatus[] = [
  { serviceName: "PostgreSQL DB", status: "HEALTHY", uptime: "99.99%", activeConnections: 14, details: "Pool healthy (max 20)" },
  { serviceName: "Debezium CDC", status: "HEALTHY", uptime: "99.95%", activeConnections: 2, details: "Outbox connector streaming" },
  { serviceName: "Kafka Cluster", status: "HEALTHY", uptime: "100.0%", activeConnections: 6, details: "0 partition lag" },
  { serviceName: "Socket Gateway", status: "HEALTHY", uptime: "99.98%", activeConnections: 1024, details: "Eviction monitor running" },
];
