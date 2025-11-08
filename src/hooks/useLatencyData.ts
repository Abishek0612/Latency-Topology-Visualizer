"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { LatencyData, ExchangeServer } from "../types";
import { LatencySimulator } from "../lib/latencySimulator";

export function useLatencyData(servers: ExchangeServer[]) {
  const simulatorRef = useRef<LatencySimulator | null>(null);
  const intervalRef = useRef<(() => void) | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [latencies, setLatencies] = useState<LatencyData[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    if (!simulatorRef.current && typeof window !== "undefined") {
      simulatorRef.current = new LatencySimulator(servers, 5000);
    }

    if (simulatorRef.current) {
      setLatencies(simulatorRef.current.getAllLatencies());

      const cleanup = simulatorRef.current.startAutoUpdate((newLatencies) => {
        if (!isPaused) {
          setLatencies(newLatencies);
        }
      });

      intervalRef.current = cleanup;

      return () => {
        if (intervalRef.current) {
          intervalRef.current();
        }
      };
    }
  }, [servers, isPaused]);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
    if (simulatorRef.current) {
      setLatencies(simulatorRef.current.getAllLatencies());
    }
  }, []);

  const getLatency = useCallback((sourceId: string, targetId: string) => {
    if (simulatorRef.current) {
      return simulatorRef.current.getLatency(sourceId, targetId);
    }
    return 0;
  }, []);

  return { latencies, getLatency, mounted, pause, resume, isPaused };
}
