# Telemetry Microservice (`telemetry-service`)

High-Throughput Telemetry Ingestion Microservice & Real-Time WebSocket Broadcast Engine.

---

## 📡 Passive Kafka CDC Integration

The microservice includes a **Passive Kafka Consumer (`kafkajs`)** that listens asynchronously to Debezium Write-Ahead Log (WAL) outbox events on topic `dbserver1.public.outbox`.

### ⚙️ Environment Variables

| Variable Name | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `4001` | Express & WebSocket HTTP server port |
| `KAFKA_BROKERS` | `localhost:9092` | Comma-separated Kafka KRaft broker addresses |
| `KAFKA_TOPIC_OUTBOX` | `dbserver1.public.outbox` | Topic name for transactional outbox CDC events |

### 🛡️ Automatic Fallback Mode
If Kafka brokers are offline or unreachable during local UI development, `telemetry-service` logs a warning and automatically operates in **standalone dynamic tick simulation mode** so local development is never blocked.

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

Run Node.js native unit tests (`node:test`):

```bash
npm test
```
