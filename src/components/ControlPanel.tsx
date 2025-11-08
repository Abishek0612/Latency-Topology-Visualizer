"use client";

import { Search, Filter, Eye, EyeOff, Cloud } from "lucide-react";
import { Filters, TimeRange } from "../types";
import { providerColors } from "../lib/data";

interface ControlPanelProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function ControlPanel({
  filters,
  onFiltersChange,
  timeRange,
  onTimeRangeChange,
  searchQuery,
  onSearchChange,
}: ControlPanelProps) {
  const toggleProvider = (provider: "AWS" | "GCP" | "Azure") => {
    const newProviders = filters.cloudProviders.includes(provider)
      ? filters.cloudProviders.filter((p) => p !== provider)
      : [...filters.cloudProviders, provider];
    onFiltersChange({ ...filters, cloudProviders: newProviders });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Filter size={20} />
          Control Panel
        </h2>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Search size={16} />
          Search Exchange
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or location..."
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Cloud size={16} />
          Cloud Providers
        </label>
        <div className="space-y-2">
          {(["AWS", "GCP", "Azure"] as const).map((provider) => (
            <button
              key={provider}
              onClick={() => toggleProvider(provider)}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${
                filters.cloudProviders.includes(provider)
                  ? "bg-opacity-20 border-2"
                  : "bg-gray-100 dark:bg-gray-700 border-2 border-transparent opacity-50"
              }`}
              style={{
                backgroundColor: filters.cloudProviders.includes(provider)
                  ? `${providerColors[provider]}20`
                  : undefined,
                borderColor: filters.cloudProviders.includes(provider)
                  ? providerColors[provider]
                  : undefined,
              }}
            >
              {provider}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Eye size={16} />
          Visualization Layers
        </label>
        <div className="space-y-2">
          <button
            onClick={() =>
              onFiltersChange({
                ...filters,
                showRealTime: !filters.showRealTime,
              })
            }
            className={`w-full px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-between ${
              filters.showRealTime
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            <span>Real-time Connections</span>
            {filters.showRealTime ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>

          <button
            onClick={() =>
              onFiltersChange({ ...filters, showRegions: !filters.showRegions })
            }
            className={`w-full px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-between ${
              filters.showRegions
                ? "bg-purple-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            <span>Cloud Regions</span>
            {filters.showRegions ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Time Range
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(["1h", "24h", "7d", "30d"] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => onTimeRangeChange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeRange === range
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
