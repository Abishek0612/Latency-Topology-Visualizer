"use client";

import { Activity, Zap, Server, TrendingUp } from "lucide-react";
import { LatencyData } from "@/types";
import { useMemo, useState, useEffect } from "react";

interface PerformanceMetricsProps {
  latencies: LatencyData[];
}

export default function PerformanceMetrics({
  latencies,
}: PerformanceMetricsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const metrics = useMemo(() => {
    if (latencies.length === 0) {
      return {
        avgLatency: 0,
        minLatency: 0,
        maxLatency: 0,
        activeConnections: 0,
      };
    }

    const latencyValues = latencies.map((l) => l.latency);
    return {
      avgLatency:
        latencyValues.reduce((a, b) => a + b, 0) / latencyValues.length,
      minLatency: Math.min(...latencyValues),
      maxLatency: Math.max(...latencyValues),
      activeConnections: latencies.length,
    };
  }, [latencies]);

  const metricCards = [
    {
      icon: Activity,
      label: "Avg Latency",
      value: `${metrics.avgLatency.toFixed(1)}ms`,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Zap,
      label: "Min Latency",
      value: `${metrics.minLatency.toFixed(1)}ms`,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: TrendingUp,
      label: "Max Latency",
      value: `${metrics.maxLatency.toFixed(1)}ms`,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      icon: Server,
      label: "Active Connections",
      value: metrics.activeConnections.toString(),
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  if (!mounted) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg w-12 h-12" />
              <div className="flex-1">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metricCards.map((metric, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4"
        >
          <div className="flex items-center gap-3">
            <div className={`${metric.bgColor} p-3 rounded-lg`}>
              <metric.icon className={metric.color} size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {metric.label}
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {metric.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
