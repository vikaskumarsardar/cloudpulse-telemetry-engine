const { getMetricsHistory, recordMetricPoint } = require("../services/metricsAggregator");
const { isMetricPayloadValid } = require("@app/telemetry-contracts");

/**
 * GET /api/v1/metrics/history
 * Returns the rolling time-series metric data points.
 */
function getHistoryHandler(req, res) {
  const history = getMetricsHistory();
  res.json({
    status: "success",
    count: history.length,
    data: history
  });
}

/**
 * POST /api/v1/metrics
 * Accepts an incoming telemetry metric payload from external microservices.
 */
function postMetricsHandler(req, res) {
  const payload = req.body;
  if (!isMetricPayloadValid(payload)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid metric payload format"
    });
  }

  const newPoint = recordMetricPoint(
    payload.throughput,
    payload.p50Latency || 15,
    payload.p95Latency || 35,
    payload.p99Latency || 60,
    payload.outboxLag || 0
  );

  res.status(201).json({
    status: "success",
    data: newPoint
  });
}

/**
 * GET /api/v1/health
 * Returns service health status.
 */
function getHealthHandler(req, res) {
  res.json({
    status: "healthy",
    service: "telemetry-service",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime())
  });
}

module.exports = {
  getHistoryHandler,
  postMetricsHandler,
  getHealthHandler
};
