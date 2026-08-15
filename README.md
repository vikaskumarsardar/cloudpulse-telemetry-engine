# CloudPulse Telemetry Engine ⚡

> **High-Throughput Microservice Observability & Real-Time Telemetry Dashboard Engine**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org/)
[![Kafka](https://img.shields.io/badge/Kafka-KRaft-red?logo=apachekafka)](https://kafka.apache.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**CloudPulse Telemetry Engine** is an enterprise-grade monorepo telemetry engine designed to passively monitor transactional Change Data Capture (CDC) outbox pipelines, $p_{50}/p_{95}/p_{99}$ SLA percentiles, and partition lag across microservices with **0ms user latency overhead**.

---

## 🏛️ System Architecture

```
[PostgreSQL Outbox DB] ──► [Debezium CDC] ──► [Kafka Topic: dbserver1.public.outbox]
                                                         │
                                       ┌─────────────────┴─────────────────┐
                                       ▼                                   ▼
                              [socket-gateway]                   [telemetry-service]
                              (Chat Delivery)                    (Passive Consumer &
                                                                  SLA Latency Engine)
                                                                           │
                                                                           │ ws://localhost:4001
                                                                           ▼
                                                                 [web-dashboard (Next.js 14)]
```

---

## 🚀 Key Features

* **Passive Kafka CDC Ingestion**: Consumes Debezium WAL outbox topics (`dbserver1.public.outbox`) asynchronously to compute exact millisecond ingestion latencies ($T_{\text{now}} - T_{\text{db}}$) with **zero performance impact** on the main chat pipeline.
* **$p_{50} / p_{95} / p_{99}$ SLA Latency Percentiles**: Calculates rolling median ($p_{50}$), SLA breach ($p_{95}$), and tail latency ($p_{99}$) metrics every 2 seconds.
* **Vercel/Linear Glassmorphic UI**: Built with Next.js 14 App Router, Recharts, TailwindCSS, and Shadcn UI components.
* **WCAG AAA Accessibility (POUR)**: High contrast ratios, native ARIA landmarks, `sr-only` table captions, and focus rings (`focus-visible:ring-2`).
* **Dual ESM & CommonJS Package Exports**: Shared contract package (`@app/telemetry-contracts`) supporting both Next.js Fast Refresh HMR (ESM) and Node.js microservices (`require()`).

---

## 📁 Repository Structure

```
cloudpulse-telemetry-engine/
├── apps/
│   ├── telemetry-service/      # Express HTTP API & WebSocket Broadcast Server (Port 4001)
│   └── web-dashboard/          # Next.js 14 App Router Visualization Dashboard (Port 3001)
├── packages/
│   └── telemetry-contracts/    # Shared DTO schemas, event enums & dual ESM/CommonJS exports
├── package.json
└── README.md
```

---

## 🛠️ Quick Start

### 1. Installation

```bash
npm install
```

### 2. Run Telemetry Microservice (Port 4001)

```bash
npm run start:telemetry
```

### 3. Run Web Dashboard (Port 3001)

```bash
npm run dev:dashboard
```

Open [http://localhost:3001](http://localhost:3001) in your browser to view the real-time telemetry stream!

---

## 🧪 Testing

Run native Node.js unit tests (`node:test`):

```bash
npm run test:telemetry
```

```
▶ Telemetry Contracts Suite
  ✔ should validate metric payload schema correctly
  ✔ should format metric points with valid timestamp
✔ Telemetry Contracts Suite (3.3ms)
▶ Metrics Aggregator Service Suite
  ✔ should record new metric points to rolling history buffer
✔ Metrics Aggregator Service Suite (0.6ms)
▶ Passive Kafka CDC Consumer Suite
  ✔ should parse Debezium CDC envelope JSON buffer correctly
  ✔ should return fallback status when Kafka broker is offline
✔ Passive Kafka CDC Consumer Suite (0.9ms)

ℹ 5 tests passed (212ms)
```

---

## 📜 License

MIT License - Created by [swapan kumar sardar](https://github.com/vikaskumarsardar).
