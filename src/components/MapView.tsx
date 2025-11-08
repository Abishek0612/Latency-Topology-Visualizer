"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ExchangeServer, LatencyData } from "../types";
import MapMarker from "./MapMarker";
import { getLatencyColor } from "../lib/utils";

interface MapViewProps {
  servers: ExchangeServer[];
  latencies: LatencyData[];
  filters: {
    showRealTime: boolean;
    showRegions: boolean;
  };
  onServerClick: (server: ExchangeServer) => void;
}

export default function MapView({
  servers,
  latencies,
  filters,
  onServerClick,
}: MapViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Map...</p>
        </div>
      </div>
    );
  }

  const connectionLines = filters.showRealTime
    ? latencies
        .slice(0, 20)
        .map((latency) => {
          const source = servers.find((s) => s.id === latency.sourceId);
          const target = servers.find((s) => s.id === latency.targetId);

          if (source && target) {
            return {
              positions: [
                [source.location.lat, source.location.lon] as [number, number],
                [target.location.lat, target.location.lon] as [number, number],
              ],
              color: getLatencyColor(latency.latency),
              latency: latency.latency,
            };
          }
          return null;
        })
        .filter(Boolean)
    : [];

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      className="w-full h-full rounded-lg"
      style={{ background: "#0a0a0a" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {connectionLines.map((line, index) =>
        line ? (
          <Polyline
            key={index}
            positions={line.positions}
            pathOptions={{
              color: line.color,
              weight: 2,
              opacity: 0.6,
              dashArray: "5, 10",
            }}
          />
        ) : null
      )}

      {servers.map((server) => (
        <MapMarker key={server.id} server={server} onClick={onServerClick} />
      ))}
    </MapContainer>
  );
}
