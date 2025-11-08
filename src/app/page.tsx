"use client";

import dynamic from "next/dynamic";
import { Moon, Sun, Download, Play, Pause } from "lucide-react";
import { useLatencyData } from "../hooks/useLatencyData";
import { useTheme } from "../hooks/useTheme";
import { useVisualizerState } from "../hooks/useVisualizerState";
import { exportLatencyReport } from "../lib/exportData";
import ViewToggle from "../components/ViewToggle";
import ControlPanel from "../components/ControlPanel";
import LatencyChart from "../components/LatencyChart";
import Legend from "../components/Legend";
import PerformanceMetrics from "../components/PerformanceMetrics";
import NetworkTopology from "../components/NetworkTopology";
import ArbitrageDetector from "../components/ArbitrageDetector";
import AlertSystem from "../components/AlertSystem";
import AdvancedAnalytics from "../components/AdvancedAnalytics";
import AIInsights from "../components/AIInsights";
import { enhancedExchangeServers } from "../lib/enhancedData";

const Globe = dynamic(() => import("../components/Globe"), { ssr: false });
const MapView = dynamic(() => import("../components/MapView"), { ssr: false });

export default function Home() {
  const { theme, toggleTheme, mounted: themeM } = useTheme();
  const { latencies, mounted, pause, resume } = useLatencyData(
    enhancedExchangeServers
  );

  const {
    viewMode,
    filters,
    timeRange,
    searchQuery,
    selectedServer,
    targetServer,
    isPaused,
    showTransition,
    filteredServers,
    filteredRegions,
    setTimeRange,
    setSearchQuery,
    setIsPaused,
    handleServerClick,
    handleFiltersChange,
    handleViewChange,
  } = useVisualizerState();

  const handlePauseToggle = () => {
    if (isPaused) {
      resume();
    } else {
      pause();
    }
    setIsPaused(!isPaused);
  };

  const handleExport = () => {
    exportLatencyReport({
      viewMode,
      filteredServers,
      latencies,
      filters,
    });
  };

  if (!mounted || !themeM) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Loading Visualizer...
          </h2>
          <p className="text-gray-400">
            Initializing latency monitoring system
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto p-4 space-y-4">
        <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Latency Topology Visualizer
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              AI-Powered Real-time Cryptocurrency Exchange Monitoring
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <ViewToggle
              currentView={viewMode}
              onViewChange={handleViewChange}
            />
            <AlertSystem servers={filteredServers} latencies={latencies} />
            <button
              onClick={handlePauseToggle}
              className={`p-3 rounded-lg transition-all flex items-center gap-2 ${
                isPaused
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-yellow-500 hover:bg-yellow-600"
              } text-white`}
            >
              {isPaused ? <Play size={20} /> : <Pause size={20} />}
            </button>
            <button
              onClick={handleExport}
              className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg"
            >
              <Download size={20} />
            </button>
            <button
              onClick={toggleTheme}
              className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        <PerformanceMetrics latencies={latencies} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1 space-y-4">
            <ControlPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <Legend />
            <AIInsights latencies={latencies} />
          </div>

          <div className="lg:col-span-3 space-y-4">
            <div
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden h-[600px] relative ${
                showTransition ? "opacity-50" : "opacity-100"
              } transition-opacity duration-500`}
            >
              {viewMode === "globe" ? (
                <Globe
                  servers={filteredServers}
                  regions={filteredRegions}
                  latencies={latencies}
                  filters={filters}
                  onServerClick={handleServerClick}
                />
              ) : (
                <MapView
                  servers={filteredServers}
                  latencies={latencies}
                  filters={filters}
                  onServerClick={handleServerClick}
                />
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ArbitrageDetector
                servers={filteredServers}
                latencies={latencies}
              />
              <NetworkTopology
                servers={filteredServers}
                latencies={latencies}
              />
            </div>

            {selectedServer && targetServer && (
              <LatencyChart
                timeRange={timeRange}
                sourceServer={selectedServer.name}
                targetServer={targetServer.name}
              />
            )}

            <AdvancedAnalytics
              servers={filteredServers}
              latencies={latencies}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
