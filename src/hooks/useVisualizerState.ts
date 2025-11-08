"use client";

import { useState, useMemo } from "react";
import { Filters, TimeRange, ExchangeServer, ViewMode } from "../types";
import {
  enhancedExchangeServers,
  enhancedCloudRegions,
} from "../lib/enhancedData";

export function useVisualizerState() {
  const [viewMode, setViewMode] = useState<ViewMode>("globe");
  const [filters, setFilters] = useState<Filters>({
    exchanges: [],
    cloudProviders: ["AWS", "GCP", "Azure"],
    latencyRange: null,
    showRealTime: true,
    showHistorical: false,
    showRegions: true,
  });

  const [timeRange, setTimeRange] = useState<TimeRange>("24h");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServer, setSelectedServer] = useState<ExchangeServer | null>(
    null
  );
  const [targetServer, setTargetServer] = useState<ExchangeServer | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showTransition, setShowTransition] = useState(false);

  const filteredServers = useMemo(() => {
    return enhancedExchangeServers.filter((server) => {
      if (
        filters.cloudProviders.length > 0 &&
        !filters.cloudProviders.includes(server.cloudProvider)
      ) {
        return false;
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          server.name.toLowerCase().includes(query) ||
          server.location.city.toLowerCase().includes(query) ||
          server.location.country.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [filters, searchQuery]);

  const filteredRegions = useMemo(() => {
    return enhancedCloudRegions.filter((region) =>
      filters.cloudProviders.includes(region.provider)
    );
  }, [filters]);

  const handleServerClick = (server: ExchangeServer) => {
    if (!selectedServer) {
      setSelectedServer(server);
    } else if (!targetServer && server.id !== selectedServer.id) {
      setTargetServer(server);
    } else {
      setSelectedServer(server);
      setTargetServer(null);
    }
  };

  const handleFiltersChange = (newFilters: Filters) => {
    setShowTransition(true);
    setFilters(newFilters);
    setTimeout(() => setShowTransition(false), 300);
  };

  const handleViewChange = (view: ViewMode) => {
    setShowTransition(true);
    setViewMode(view);
    setTimeout(() => setShowTransition(false), 500);
  };

  return {
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
    setViewMode,
    setFilters,
    setTimeRange,
    setSearchQuery,
    setSelectedServer,
    setTargetServer,
    setIsPaused,
    handleServerClick,
    handleFiltersChange,
    handleViewChange,
  };
}
