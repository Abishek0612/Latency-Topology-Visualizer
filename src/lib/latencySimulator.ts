import { LatencyData, ExchangeServer } from "../types";
import { calculateDistance, estimateLatency } from "./utils";

export class LatencySimulator {
  private servers: ExchangeServer[];
  private latencyMap: Map<string, number>;
  private updateInterval: number;

  constructor(servers: ExchangeServer[], updateInterval: number = 5000) {
    this.servers = servers;
    this.latencyMap = new Map();
    this.updateInterval = updateInterval;
    this.initializeLatencies();
  }

  private initializeLatencies() {
    for (let i = 0; i < this.servers.length; i++) {
      for (let j = i + 1; j < this.servers.length; j++) {
        const source = this.servers[i];
        const target = this.servers[j];
        const distance = calculateDistance(
          source.location.lat,
          source.location.lon,
          target.location.lat,
          target.location.lon
        );
        const latency = estimateLatency(distance);
        const key = `${source.id}-${target.id}`;
        this.latencyMap.set(key, latency);
      }
    }
  }

  public getLatency(sourceId: string, targetId: string): number {
    const key = `${sourceId}-${targetId}`;
    const reverseKey = `${targetId}-${sourceId}`;
    return this.latencyMap.get(key) || this.latencyMap.get(reverseKey) || 0;
  }

  public getAllLatencies(): LatencyData[] {
    const latencies: LatencyData[] = [];
    const timestamp = Date.now();

    this.latencyMap.forEach((latency, key) => {
      const [sourceId, targetId] = key.split("-");
      latencies.push({
        id: key,
        sourceId,
        targetId,
        latency,
        timestamp,
      });
    });

    return latencies;
  }

  public updateLatencies() {
    this.latencyMap.forEach((latency, key) => {
      const variation = (Math.random() - 0.5) * 10;
      const newLatency = Math.max(1, latency + variation);
      this.latencyMap.set(key, newLatency);
    });
  }

  public startAutoUpdate(callback: (latencies: LatencyData[]) => void) {
    const interval = setInterval(() => {
      this.updateLatencies();
      callback(this.getAllLatencies());
    }, this.updateInterval);

    return () => clearInterval(interval);
  }
}
