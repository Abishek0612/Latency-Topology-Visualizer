"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { ExchangeServer, LatencyData } from "../types";
import { providerColors } from "../lib/data";

interface AdvancedAnalyticsProps {
  servers: ExchangeServer[];
  latencies: LatencyData[];
}

export default function AdvancedAnalytics({
  servers,
  latencies,
}: AdvancedAnalyticsProps) {
  const providerDistribution = useMemo(() => {
    const counts = { AWS: 0, GCP: 0, Azure: 0 };
    servers.forEach((server) => {
      counts[server.cloudProvider]++;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [servers]);

  const latencyByProvider = useMemo(() => {
    const data: { [key: string]: { total: number; count: number } } = {
      AWS: { total: 0, count: 0 },
      GCP: { total: 0, count: 0 },
      Azure: { total: 0, count: 0 },
    };

    latencies.forEach((latency) => {
      const server = servers.find((s) => s.id === latency.sourceId);
      if (server) {
        data[server.cloudProvider].total += latency.latency;
        data[server.cloudProvider].count++;
      }
    });

    return Object.entries(data).map(([provider, { total, count }]) => ({
      provider,
      avgLatency: count > 0 ? total / count : 0,
    }));
  }, [servers, latencies]);

  const performanceMetrics = useMemo(() => {
    const latencyValues = latencies.map((l) => l.latency);
    const avg = latencyValues.reduce((a, b) => a + b, 0) / latencyValues.length;

    return [
      { metric: "Availability", value: 99.9 },
      { metric: "Performance", value: Math.max(0, 100 - avg / 2) },
      { metric: "Reliability", value: 95 },
      { metric: "Scalability", value: 92 },
      { metric: "Security", value: 98 },
    ];
  }, [latencies]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
        Advanced Analytics
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Cloud Provider Distribution
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={providerDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {providerDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={providerColors[entry.name as "AWS" | "GCP" | "Azure"]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Average Latency by Provider
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={latencyByProvider}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="provider" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "0.5rem",
                }}
              />
              <Bar dataKey="avgLatency" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Performance Radar
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={performanceMetrics}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="metric" stroke="#9ca3af" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9ca3af" />
              <Radar
                name="Performance"
                dataKey="value"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
