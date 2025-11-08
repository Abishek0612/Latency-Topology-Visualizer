import { ExchangeServer, LatencyData, Filters, ViewMode } from "../types";

interface ExportDataParams {
  viewMode: ViewMode;
  filteredServers: ExchangeServer[];
  latencies: LatencyData[];
  filters: Filters;
}

export function exportLatencyReport({
  viewMode,
  filteredServers,
  latencies,
  filters,
}: ExportDataParams) {
  const data = {
    timestamp: new Date().toISOString(),
    viewMode,
    servers: filteredServers,
    latencies: latencies,
    metrics: {
      avgLatency:
        latencies.length > 0
          ? latencies.reduce((sum, l) => sum + l.latency, 0) / latencies.length
          : 0,
      minLatency:
        latencies.length > 0 ? Math.min(...latencies.map((l) => l.latency)) : 0,
      maxLatency:
        latencies.length > 0 ? Math.max(...latencies.map((l) => l.latency)) : 0,
      totalConnections: latencies.length,
      totalServers: filteredServers.length,
    },
    filters: {
      cloudProviders: filters.cloudProviders,
      showRealTime: filters.showRealTime,
      showRegions: filters.showRegions,
    },
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `latency-report-${
    new Date().toISOString().split("T")[0]
  }-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
