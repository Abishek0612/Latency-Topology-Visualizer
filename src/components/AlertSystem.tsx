"use client";

import { useState, useEffect } from "react";
import { Bell, BellRing, X, AlertCircle } from "lucide-react";
import { LatencyAlert } from "../types/enhanced";
import { ExchangeServer, LatencyData } from "../types";

interface AlertSystemProps {
  servers: ExchangeServer[];
  latencies: LatencyData[];
}

export default function AlertSystem({ servers, latencies }: AlertSystemProps) {
  const [alerts, setAlerts] = useState<LatencyAlert[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [threshold, setThreshold] = useState(150);

  useEffect(() => {
    const checkAlerts = () => {
      const newAlerts: LatencyAlert[] = [];

      latencies.forEach((latency) => {
        const server = servers.find((s) => s.id === latency.sourceId);

        if (server && latency.latency > threshold) {
          const severity =
            latency.latency > threshold * 1.5 ? "critical" : "warning";

          newAlerts.push({
            id: `${latency.id}-${Date.now()}`,
            serverId: server.id,
            serverName: server.name,
            latency: latency.latency,
            threshold,
            severity: severity as "warning" | "critical",
            timestamp: Date.now(),
          });
        }
      });

      if (newAlerts.length > 0) {
        setAlerts((prev) => [...newAlerts, ...prev].slice(0, 20));
      }
    };

    checkAlerts();
    const interval = setInterval(checkAlerts, 5000);

    return () => clearInterval(interval);
  }, [servers, latencies, threshold]);

  const clearAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const unreadCount = alerts.filter((a) => a.severity === "critical").length;

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        {alerts.length > 0 ? (
          <BellRing size={24} className="text-red-500 animate-pulse" />
        ) : (
          <Bell size={24} className="text-gray-600 dark:text-gray-400" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-[500px] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Latency Alerts
              </h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400">
                Alert Threshold (ms)
              </label>
              <input
                type="range"
                min="50"
                max="300"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full mt-1"
              />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {threshold}ms
              </span>
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {alerts.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <AlertCircle className="mx-auto mb-2" size={40} />
                <p>No alerts</p>
              </div>
            ) : (
              <div className="p-2">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`mb-2 p-3 rounded-lg border ${
                      alert.severity === "critical"
                        ? "bg-red-500/10 border-red-500"
                        : "bg-yellow-500/10 border-yellow-500"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertCircle
                            size={16}
                            className={
                              alert.severity === "critical"
                                ? "text-red-500"
                                : "text-yellow-500"
                            }
                          />
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {alert.serverName}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Latency: {alert.latency.toFixed(1)}ms (Threshold:{" "}
                          {alert.threshold}ms)
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <button
                        onClick={() => clearAlert(alert.id)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
