"use client";

import { useState, useEffect, useRef } from "react";
import { MetricPoint, LogEvent } from "@/types/telemetry";
import { WS_EVENT_TYPES } from "@app/telemetry-contracts";

const TELEMETRY_WS_URL = process.env.NEXT_PUBLIC_TELEMETRY_WS_URL || "ws://localhost:4001/ws/telemetry";
const MAX_ROLLING_POINTS = 30;

export function useTelemetrySocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [metrics, setMetrics] = useState<MetricPoint[]>([]);
  const [latestMetric, setLatestMetric] = useState<MetricPoint | null>(null);
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function connect() {
      try {
        const ws = new WebSocket(TELEMETRY_WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
          setIsConnected(true);
          console.log("[WebSocket] Connected to Telemetry Stream:", TELEMETRY_WS_URL);
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);

            switch (message.type) {
              case WS_EVENT_TYPES.INITIAL_STATE: {
                if (Array.isArray(message.data)) {
                  setMetrics(message.data.slice(-MAX_ROLLING_POINTS));
                  if (message.data.length > 0) {
                    setLatestMetric(message.data[message.data.length - 1]);
                  }
                }
                break;
              }

              case WS_EVENT_TYPES.METRIC_TICK: {
                if (message.data) {
                  const newTick: MetricPoint = message.data;
                  setLatestMetric(newTick);

                  setMetrics((prev) => {
                    const updated = [...prev, newTick];
                    return updated.slice(-MAX_ROLLING_POINTS);
                  });

                  if (message.logEvent) {
                    const backendLog: LogEvent = message.logEvent;
                    setLogs((prev) => [backendLog, ...prev.slice(0, 19)]);
                  }
                }
                break;
              }

              default:
                console.warn("[WebSocket] Unhandled message type:", message.type);
            }
          } catch (err) {
            console.error("[WebSocket] Message parsing error:", err);
          }
        };

        ws.onclose = () => {
          setIsConnected(false);
          console.warn("[WebSocket] Connection closed. Reconnecting in 3s...");
          reconnectTimerRef.current = setTimeout(connect, 3000);
        };

        ws.onerror = (err) => {
          console.error("[WebSocket] Stream error:", err);
          ws.close();
        };
      } catch (err) {
        console.error("[WebSocket] Setup error:", err);
        reconnectTimerRef.current = setTimeout(connect, 3000);
      }
    }

    connect();

    return () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  return {
    isConnected,
    metrics,
    latestMetric,
    logs
  };
}
