export interface ExchangeServer {
  id: string;
  name: string;
  location: {
    city: string;
    country: string;
    lat: number;
    lon: number;
  };
  cloudProvider: "AWS" | "GCP" | "Azure";
  region: string;
}

export type ViewMode = "globe" | "map";

export interface CloudRegion {
  id: string;
  provider: "AWS" | "GCP" | "Azure";
  name: string;
  code: string;
  location: {
    lat: number;
    lon: number;
  };
  serverCount: number;
}

export interface LatencyData {
  id: string;
  sourceId: string;
  targetId: string;
  latency: number;
  timestamp: number;
}

export interface HistoricalLatency {
  timestamp: number;
  latency: number;
  min: number;
  max: number;
  avg: number;
}

export type LatencyRange = "low" | "medium" | "high";
export type TimeRange = "1h" | "24h" | "7d" | "30d";
export type Theme = "dark" | "light";

export interface Filters {
  exchanges: string[];
  cloudProviders: ("AWS" | "GCP" | "Azure")[];
  latencyRange: LatencyRange | null;
  showRealTime: boolean;
  showHistorical: boolean;
  showRegions: boolean;
}
