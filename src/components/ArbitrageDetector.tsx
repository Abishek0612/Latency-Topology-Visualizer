"use client";

import { useState, useEffect } from "react";
import { TrendingUp, AlertTriangle, DollarSign, Zap } from "lucide-react";
import { ArbitrageOpportunity } from "../types/enhanced";
import { ExchangeServer, LatencyData } from "../types";

interface ArbitrageDetectorProps {
  servers: ExchangeServer[];
  latencies: LatencyData[];
}

export default function ArbitrageDetector({
  servers,
  latencies,
}: ArbitrageDetectorProps) {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>(
    []
  );

  useEffect(() => {
    const detectOpportunities = () => {
      const newOpportunities: ArbitrageOpportunity[] = [];

      const validLatencies = latencies.filter(
        (l) => l.latency > 0 && l.latency < 200
      );

      validLatencies.slice(0, 15).forEach((latency) => {
        const source = servers.find((s) => s.id === latency.sourceId);
        const target = servers.find((s) => s.id === latency.targetId);

        if (source && target && source.id !== target.id) {
          const baseProfit = 150 + Math.abs(Math.sin(latency.latency) * 500);
          const latencyPenalty = latency.latency * 0.3;
          const profit = Math.max(0, baseProfit - latencyPenalty);

          const risk =
            latency.latency < 50
              ? "low"
              : latency.latency < 100
              ? "medium"
              : "high";

          if (profit > 50) {
            newOpportunities.push({
              id: `${source.id}-${target.id}`,
              sourceExchange: source.name,
              targetExchange: target.name,
              profit: profit,
              latency: latency.latency,
              risk: risk as "low" | "medium" | "high",
              timestamp: Date.now(),
            });
          }
        }
      });

      const uniqueOpportunities = newOpportunities
        .reduce((acc, curr) => {
          const exists = acc.find(
            (o) =>
              o.sourceExchange === curr.sourceExchange &&
              o.targetExchange === curr.targetExchange
          );
          if (!exists) {
            acc.push(curr);
          }
          return acc;
        }, [] as ArbitrageOpportunity[])
        .sort((a, b) => b.profit - a.profit)
        .slice(0, 5);

      setOpportunities(uniqueOpportunities);
    };

    detectOpportunities();
    const interval = setInterval(detectOpportunities, 8000);

    return () => clearInterval(interval);
  }, [servers, latencies]);

  const riskColors = {
    low: "text-green-500 bg-green-500/10 border-green-500",
    medium: "text-yellow-500 bg-yellow-500/10 border-yellow-500",
    high: "text-red-500 bg-red-500/10 border-red-500",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp size={20} className="text-green-500" />
          Arbitrage Opportunities
        </h3>
        <div
          className={`px-3 py-1 rounded-full border ${
            opportunities.length > 0
              ? "bg-green-500/10 border-green-500"
              : "bg-gray-500/10 border-gray-500"
          }`}
        >
          <span
            className={`text-sm font-medium ${
              opportunities.length > 0 ? "text-green-500" : "text-gray-500"
            }`}
          >
            {opportunities.length} Active
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {opportunities.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <AlertTriangle className="mx-auto mb-2" size={40} />
            <p>No arbitrage opportunities detected</p>
            <p className="text-xs mt-1">Checking every 8 seconds...</p>
          </div>
        ) : (
          opportunities.map((opp) => (
            <div
              key={opp.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {opp.sourceExchange}
                    </span>
                    <Zap size={14} className="text-blue-500" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {opp.targetExchange}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Latency: {opp.latency.toFixed(1)}ms
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                        riskColors[opp.risk]
                      }`}
                    >
                      {opp.risk} risk
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-green-500 font-bold text-xl">
                    <DollarSign size={18} />
                    {opp.profit.toFixed(2)}
                  </div>
                  <span className="text-xs text-gray-500">Est. Profit</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
