import { type ClassValue, clsx } from "clsx";
import { LatencyRange } from "../types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return { x, y, z };
}

export function getLatencyRange(latency: number): LatencyRange {
  if (latency < 50) return "low";
  if (latency < 150) return "medium";
  return "high";
}

export function getLatencyColor(latency: number): string {
  const range = getLatencyRange(latency);
  const colors = {
    low: "#10b981",
    medium: "#f59e0b",
    high: "#ef4444",
  };
  return colors[range];
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function estimateLatency(distanceKm: number): number {
  const baseLatency = 5;
  const latencyPerKm = 0.01;
  const jitter = Math.random() * 10 - 5;
  return Math.max(1, baseLatency + distanceKm * latencyPerKm + jitter);
}

export function formatLatency(latency: number): string {
  return `${latency.toFixed(1)}ms`;
}

export function generateHistoricalData(hours: number) {
  const data = [];
  const now = Date.now();
  const interval = (hours * 60 * 60 * 1000) / 100;

  for (let i = 0; i < 100; i++) {
    const timestamp = now - (100 - i) * interval;
    const baseLatency = 50 + Math.random() * 50;
    const latency = baseLatency + Math.sin(i / 10) * 20;
    data.push({
      timestamp,
      latency: Math.max(1, latency),
      min: Math.max(1, latency - 10),
      max: latency + 10,
      avg: latency,
    });
  }

  return data;
}
