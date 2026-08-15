const { createMetricPoint } = require("@app/telemetry-contracts");

// In-Memory Rolling History Buffer (Max 60 points = 5 minutes of 5-second ticks)
const MAX_HISTORY_POINTS = 60;
const history = [];

// Seed initial history points
for (let i = 10; i >= 1; i--) {
  const pastTime = new Date(Date.now() - i * 5000);
  const timeStr = `${String(pastTime.getHours()).padStart(2, "0")}:${String(pastTime.getMinutes()).padStart(2, "0")}:${String(pastTime.getSeconds()).padStart(2, "0")}`;
  history.push({
    timestamp: timeStr,
    throughput: 1200 + Math.floor(Math.random() * 400),
    p50Latency: 12 + Math.floor(Math.random() * 6),
    p95Latency: 30 + Math.floor(Math.random() * 15),
    p99Latency: 50 + Math.floor(Math.random() * 30),
    outboxLag: Math.floor(Math.random() * 3)
  });
}

/**
 * Pushes a new metric point to rolling history.
 */
function recordMetricPoint(throughput, p50Latency, p95Latency, p99Latency, outboxLag) {
  const point = createMetricPoint(throughput, p50Latency, p95Latency, p99Latency, outboxLag);
  history.push(point);
  if (history.length > MAX_HISTORY_POINTS) {
    history.shift();
  }
  return point;
}

/**
 * Returns current rolling history array.
 */
function getMetricsHistory() {
  return [...history];
}

/**
 * Generates a dynamic metric tick simulating real system metrics.
 */
function generateDynamicTick() {
  const baseThroughput = 1350 + Math.floor(Math.sin(Date.now() / 5000) * 350);
  const p50 = 12 + Math.floor(Math.random() * 5);
  const p95 = 32 + Math.floor(Math.random() * 12);
  const p99 = 55 + Math.floor(Math.random() * 25);
  const lag = Math.floor(Math.random() * 4);

  return recordMetricPoint(baseThroughput, p50, p95, p99, lag);
}

module.exports = {
  recordMetricPoint,
  getMetricsHistory,
  generateDynamicTick
};
