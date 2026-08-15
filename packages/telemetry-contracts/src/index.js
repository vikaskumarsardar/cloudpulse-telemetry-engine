/**
 * Shared Telemetry Contracts & Schemas (ES Module).
 */

export const WS_EVENT_TYPES = {
  INITIAL_STATE: "INITIAL_STATE",
  METRIC_TICK: "METRIC_TICK"
};

export const EVENT_TYPES = {
  NEW_MESSAGE: "new_message",
  USER_TYPING: "user_typing",
  WEBRTC_SIGNAL: "webrtc_signal",
  SYSTEM_ALERT: "system_alert"
};

export const LOG_LEVELS = {
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR"
};

export const SYSTEM_HEALTH_STATUS = {
  HEALTHY: "HEALTHY",
  DEGRADED: "DEGRADED",
  DOWN: "DOWN"
};

/**
 * Creates a normalized metric point object.
 */
export function createMetricPoint(throughput, p50Latency, p95Latency, p99Latency, outboxLag = 0) {
  const now = new Date();
  const timestamp = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

  return {
    timestamp,
    throughput: Math.max(0, parseInt(throughput, 10) || 0),
    p50Latency: Math.max(0, parseInt(p50Latency, 10) || 0),
    p95Latency: Math.max(0, parseInt(p95Latency, 10) || 0),
    p99Latency: Math.max(0, parseInt(p99Latency, 10) || 0),
    outboxLag: Math.max(0, parseInt(outboxLag, 10) || 0)
  };
}

/**
 * Validates whether an incoming metric payload is well-formed.
 */
export function isMetricPayloadValid(payload) {
  const isInvalidObjectPayload = !payload || typeof payload !== "object";
  if (isInvalidObjectPayload) return false;

  const isThroughputValidNumber = typeof payload.throughput === "number" && payload.throughput >= 0;
  return isThroughputValidNumber;
}
