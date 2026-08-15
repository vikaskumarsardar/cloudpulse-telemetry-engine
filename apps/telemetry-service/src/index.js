const express = require("express");
const http = require("http");
const cors = require("cors");
const { getHistoryHandler, postMetricsHandler, getHealthHandler } = require("./controllers/telemetryController");
const { initWebSocketServer, closeWebSocketServer, broadcastToClients } = require("./ws/telemetryStream");
const { initKafkaConsumer, disconnectKafkaConsumer } = require("./services/kafkaConsumer");

const PORT = process.env.PORT || 4001;
const app = express();

app.use(cors());
app.use(express.json());

// HTTP API Routes
app.get("/api/v1/health", getHealthHandler);
app.get("/api/v1/metrics/history", getHistoryHandler);
app.post("/api/v1/metrics", postMetricsHandler);

// Create HTTP server
const server = http.createServer(app);

// Attach WebSocket Server
initWebSocketServer(server);

// Start Passive Kafka CDC Consumer in background
initKafkaConsumer(broadcastToClients).catch((err) => {
  console.warn("[Kafka Init] Passive listener deferred:", err.message);
});

server.listen(PORT, () => {
  console.log(`🚀 Telemetry Microservice running at http://localhost:${PORT}`);
  console.log(`⚡ WebSocket Stream ready at ws://localhost:${PORT}/ws/telemetry`);
});

// Graceful Shutdown
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

async function shutdown() {
  console.log("\n[Telemetry Service] Shutting down gracefully...");
  await disconnectKafkaConsumer();
  closeWebSocketServer();
  server.close(() => {
    console.log("[Telemetry Service] Stopped.");
    process.exit(0);
  });
}
