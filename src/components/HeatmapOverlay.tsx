"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { LatencyData, ExchangeServer } from "../types";
import { latLonToVector3 } from "../lib/utils";

interface HeatmapOverlayProps {
  servers: ExchangeServer[];
  latencies: LatencyData[];
}

export default function HeatmapOverlay({
  servers,
  latencies,
}: HeatmapOverlayProps) {
  const heatmapData = useMemo(() => {
    const dataMap = new Map<string, number>();

    latencies.forEach((latency) => {
      const current = dataMap.get(latency.sourceId) || 0;
      dataMap.set(latency.sourceId, current + latency.latency);
    });

    return Array.from(dataMap.entries()).map(([serverId, totalLatency]) => {
      const server = servers.find((s) => s.id === serverId);
      if (!server) return null;

      const position = latLonToVector3(
        server.location.lat,
        server.location.lon,
        2.05
      );

      const avgLatency = totalLatency / latencies.length;
      const intensity = Math.min(1, avgLatency / 200);

      return { position, intensity };
    });
  }, [servers, latencies]);

  return (
    <group>
      {heatmapData.map(
        (data, index) =>
          data && (
            <mesh
              key={index}
              position={[data.position.x, data.position.y, data.position.z]}
            >
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshBasicMaterial
                color={new THREE.Color(data.intensity, 1 - data.intensity, 0)}
                transparent
                opacity={0.3}
              />
            </mesh>
          )
      )}
    </group>
  );
}
