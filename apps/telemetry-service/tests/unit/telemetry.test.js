const { describe, it } = require("node:test");
const assert = require("node:assert");
const { recordMetricPoint, getMetricsHistory } = require("../../src/services/metricsAggregator");
const { isMetricPayloadValid, createMetricPoint } = require("@app/telemetry-contracts");
const { parseCdcPayload, getKafkaStatus } = require("../../src/services/kafkaConsumer");

describe("Telemetry Contracts Suite", () => {
  it("should validate metric payload schema correctly", () => {
    assert.strictEqual(isMetricPayloadValid({ throughput: 1500 }), true);
    assert.strictEqual(isMetricPayloadValid({ throughput: -10 }), false);
    assert.strictEqual(isMetricPayloadValid(null), false);
    assert.strictEqual(isMetricPayloadValid("invalid"), false);
  });

  it("should format metric points with valid timestamp", () => {
    const point = createMetricPoint(1200, 15, 35, 60, 2);
    assert.strictEqual(point.throughput, 1200);
    assert.strictEqual(point.p50Latency, 15);
    assert.strictEqual(point.p95Latency, 35);
    assert.strictEqual(point.p99Latency, 60);
    assert.strictEqual(point.outboxLag, 2);
    assert.strictEqual(typeof point.timestamp, "string");
  });
});

describe("Metrics Aggregator Service Suite", () => {
  it("should record new metric points to rolling history buffer", () => {
    const initialCount = getMetricsHistory().length;
    const newPoint = recordMetricPoint(1800, 20, 40, 75, 1);
    
    const updatedHistory = getMetricsHistory();
    assert.strictEqual(updatedHistory.length, initialCount + 1);
    assert.strictEqual(updatedHistory[updatedHistory.length - 1].throughput, 1800);
  });
});

describe("Passive Kafka CDC Consumer Suite", () => {
  it("should parse Debezium CDC envelope JSON buffer correctly", () => {
    const mockEnvelope = Buffer.from(JSON.stringify({
      payload: {
        after: {
          id: "out_101",
          aggregate_id: "room_general",
          created_at: "2026-08-15T09:28:00.000Z"
        }
      }
    }));

    const parsed = parseCdcPayload(mockEnvelope);
    assert.notStrictEqual(parsed, null);
    assert.strictEqual(parsed.id, "out_101");
    assert.strictEqual(parsed.aggregate_id, "room_general");
  });

  it("should return fallback status when Kafka broker is offline", () => {
    const status = getKafkaStatus();
    assert.strictEqual(typeof status.isConnected, "boolean");
    assert.strictEqual(Array.isArray(status.brokers), true);
  });
});
