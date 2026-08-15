# Telemetry Microservice (`telemetry-service`)

High-Throughput Telemetry Ingestion Microservice & Real-Time WebSocket Broadcast Engine.

---

## 🔌 API Specification

### HTTP API Endpoints

* **`GET /api/v1/health`**
  * Returns microservice status and passive Kafka consumer connection state.
* **`GET /api/v1/metrics/history`**
  * Returns rolling history buffer (last 60 metric points).
* **`POST /api/v1/metrics`**
  * Ingests custom telemetry metric point payload.

### WebSocket Stream

* **Endpoint:** `ws://localhost:4001/ws/telemetry`
* **Event Types:**
  * `INITIAL_STATE`: Pushes rolling history buffer on client connection.
  * `METRIC_TICK`: Broadcasts real-time 2-second metric tick & live CDC outbox log event.

---

## 🧪 Testing

```bash
npm test
```
