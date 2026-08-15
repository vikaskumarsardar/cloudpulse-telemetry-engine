const { WebSocketServer } = require("ws");
const { WS_EVENT_TYPES } = require("@app/telemetry-contracts");
const { generateDynamicTick, getMetricsHistory } = require("../services/metricsAggregator");

let wss = null;
let broadcastInterval = null;

/**
 * Helper to generate backend CDC log event payloads.
 */
function createCdcLogEvent(tick) {
  const senders = ["alice", "bob", "charlie", "diana"];
  const randomSender = senders[Math.floor(Math.random() * senders.length)];
  const seq = Math.floor(1000 + Math.random() * 9000);

  const isHighLatency = tick.p95Latency > 45;

  return {
    id: `log_${Date.now()}_${seq}`,
    timestamp: tick.timestamp,
    sequenceId: seq,
    roomId: "room_general",
    senderId: `user_${randomSender}`,
    content: `CDC outbox message ingested & delivered via WebSocket (throughput: ${tick.throughput} req/s)`,
    latencyMs: tick.p95Latency,
    level: isHighLatency ? "WARN" : "INFO"
  };
}

/**
 * Broadcasts a payload object to all connected WebSocket clients.
 */
function broadcastToClients(payloadObject) {
  const hasNoActiveClients = !wss || wss.clients.size === 0;
  if (hasNoActiveClients) return;

  const payloadString = JSON.stringify(payloadObject);

  wss.clients.forEach((client) => {
    const isSocketOpen = client.readyState === 1; // WebSocket.OPEN
    if (isSocketOpen) {
      client.send(payloadString);
    }
  });
}

/**
 * Initializes WebSocket Broadcast Server on top of HTTP server.
 */
function initWebSocketServer(server) {
  wss = new WebSocketServer({ server, path: "/ws/telemetry" });

  wss.on("connection", (ws, req) => {
    console.log(`[WebSocket] Client connected from ${req.socket.remoteAddress}`);

    // Send initial history state to newly connected client
    ws.send(JSON.stringify({
      type: WS_EVENT_TYPES.INITIAL_STATE,
      data: getMetricsHistory()
    }));

    ws.on("close", () => {
      console.log("[WebSocket] Client disconnected");
    });

    ws.on("error", (err) => {
      console.error("[WebSocket] Connection error:", err.message);
    });
  });

  // Start 2-second real-time metric broadcast tick
  broadcastInterval = setInterval(() => {
    const tick = generateDynamicTick();
    const logEvent = createCdcLogEvent(tick);

    broadcastToClients({
      type: WS_EVENT_TYPES.METRIC_TICK,
      data: tick,
      logEvent: logEvent
    });
  }, 2000);

  return wss;
}

/**
 * Gracefully shuts down WebSocket server.
 */
function closeWebSocketServer() {
  if (broadcastInterval) clearInterval(broadcastInterval);
  if (wss) wss.close();
}

module.exports = {
  initWebSocketServer,
  closeWebSocketServer,
  broadcastToClients
};
