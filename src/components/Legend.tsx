"use client";

import { providerColors, latencyColors } from "../lib/data";

export default function Legend() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Cloud Providers
        </h3>
        <div className="space-y-1">
          {Object.entries(providerColors).map(([provider, color]) => (
            <div key={provider} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {provider}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Latency Ranges
        </h3>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: latencyColors.low }}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Low (&lt; 50ms)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: latencyColors.medium }}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Medium (50-150ms)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: latencyColors.high }}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              High (&gt; 150ms)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
