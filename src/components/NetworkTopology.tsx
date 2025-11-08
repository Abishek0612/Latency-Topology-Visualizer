"use client";

import { useMemo } from "react";
import { ExchangeServer, LatencyData } from "../types";

interface NetworkTopologyProps {
  servers: ExchangeServer[];
  latencies: LatencyData[];
}

export default function NetworkTopology({
  servers,
  latencies,
}: NetworkTopologyProps) {
  const topology = useMemo(() => {
    const connectionCount: { [key: string]: number } = {};
    const links: { source: string; target: string; latency: number }[] = [];

    servers.forEach((server) => {
      connectionCount[server.id] = 0;
    });

    latencies.forEach((latency) => {
      if (connectionCount[latency.sourceId] !== undefined) {
        connectionCount[latency.sourceId]++;
      }
      if (connectionCount[latency.targetId] !== undefined) {
        connectionCount[latency.targetId]++;
      }
      links.push({
        source: latency.sourceId,
        target: latency.targetId,
        latency: latency.latency,
      });
    });

    return { connectionCount, links };
  }, [servers, latencies]);

  const topServers = useMemo(() => {
    return Object.entries(topology.connectionCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id, connections]) => {
        const server = servers.find((s) => s.id === id);
        return { server, connections };
      })
      .filter(({ server }) => server !== undefined);
  }, [topology, servers]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Network Topology
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-3">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              Total Nodes
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {Object.keys(topology.connectionCount).length}
            </p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500 rounded-lg p-3">
            <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
              Total Connections
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {topology.links.length}
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
            Most Connected Servers
          </h4>
          <div className="space-y-2">
            {topServers.map(
              ({ server, connections }) =>
                server && (
                  <div
                    key={server.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {server.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        {server.location.city}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-blue-500">
                        {connections}
                      </span>
                      <span className="text-xs text-gray-500">connections</span>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
