"use client";

import { useMemo } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { TimeRange } from "../types";
import { generateHistoricalData } from "../lib/utils";

interface LatencyChartProps {
  timeRange: TimeRange;
  sourceServer: string;
  targetServer: string;
}

export default function LatencyChart({
  timeRange,
  sourceServer,
  targetServer,
}: LatencyChartProps) {
  const data = useMemo(() => {
    const hours = {
      "1h": 1,
      "24h": 24,
      "7d": 168,
      "30d": 720,
    }[timeRange];

    return generateHistoricalData(hours);
  }, [timeRange]);

  const stats = useMemo(() => {
    const latencies = data.map((d) => d.latency);
    return {
      min: Math.min(...latencies).toFixed(1),
      max: Math.max(...latencies).toFixed(1),
      avg: (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(1),
    };
  }, [data]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Historical Latency: {sourceServer} → {targetServer}
        </h3>
        <div className="flex gap-4 mt-2 text-sm">
          <span className="text-green-600 dark:text-green-400">
            Min: {stats.min}ms
          </span>
          <span className="text-blue-600 dark:text-blue-400">
            Avg: {stats.avg}ms
          </span>
          <span className="text-red-600 dark:text-red-400">
            Max: {stats.max}ms
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) =>
              new Date(value).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            }
            stroke="#9ca3af"
          />
          <YAxis
            stroke="#9ca3af"
            label={{
              value: "Latency (ms)",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "0.5rem",
            }}
            labelFormatter={(value) => new Date(value).toLocaleString()}
            formatter={(value: number) => [`${value.toFixed(1)}ms`, "Latency"]}
          />
          <Area
            type="monotone"
            dataKey="latency"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorLatency)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
