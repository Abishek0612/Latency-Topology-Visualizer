export interface ArbitrageOpportunity {
  id: string;
  sourceExchange: string;
  targetExchange: string;
  profit: number;
  latency: number;
  risk: "low" | "medium" | "high";
  timestamp: number;
}

export interface LatencyAlert {
  id: string;
  serverId: string;
  serverName: string;
  latency: number;
  threshold: number;
  severity: "warning" | "critical";
  timestamp: number;
}

export interface TradingVolume {
  exchangeId: string;
  volume: number;
  change24h: number;
}

export interface LatencyPrediction {
  serverId: string;
  currentLatency: number;
  predictedLatency: number;
  confidence: number;
  trend: "increasing" | "decreasing" | "stable";
}

export interface RiskScore {
  overall: number;
  latency: number;
  stability: number;
  connectivity: number;
}
