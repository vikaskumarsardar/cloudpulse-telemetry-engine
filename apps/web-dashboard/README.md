# CloudPulse Web Dashboard (`web-dashboard`)

Next.js 14 App Router Telemetry Visualization Dashboard.

---

## 🎨 UI Features

* **Vercel & Linear Glassmorphic Design**: Dark/light theme support, glass-card backdrop blur effects, and smooth CSS transitions.
* **Real-Time WebSocket Integration**: Custom React hook (`useTelemetrySocket`) connecting to `ws://localhost:4001/ws/telemetry`.
* **Interactive Charts**: Recharts AreaChart for throughput rates, Latency LineChart for $p_{50}/p_{95}/p_{99}$ percentiles, and Resource Donut Chart.
* **Streaming Log Console**: Real-time CDC outbox log streaming with search & level filtering.
* **WCAG AAA Compliance**: High contrast ratios, aria-labels, and keyboard navigation rings.

---

## 🛠️ Development

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.
