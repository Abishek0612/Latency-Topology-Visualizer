"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { ExchangeServer, CloudRegion, LatencyData } from "../types";
import ServerMarker from "./ServerMarker";
import LatencyConnection from "./LatencyConnection";
import RegionMarker from "./RegionMarker";
import GlobeControls from "./GlobeControls";

interface GlobeProps {
  servers: ExchangeServer[];
  regions: CloudRegion[];
  latencies: LatencyData[];
  filters: {
    showRealTime: boolean;
    showRegions: boolean;
  };
  onServerClick: (server: ExchangeServer) => void;
}

function ProceduralEarth() {
  const oceanRef = useRef<THREE.Mesh>(null);
  const landRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (oceanRef.current) {
      oceanRef.current.rotation.y += 0.001;
    }
    if (landRef.current) {
      landRef.current.rotation.y += 0.001;
    }
  });

  const landGeometry = new THREE.IcosahedronGeometry(2, 4);
  const positions = landGeometry.attributes.position.array;

  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];

    const noise = Math.sin(x * 3) * Math.cos(y * 3) * Math.sin(z * 3);
    const scale = 1 + noise * 0.02;

    positions[i] *= scale;
    positions[i + 1] *= scale;
    positions[i + 2] *= scale;
  }

  landGeometry.attributes.position.needsUpdate = true;
  landGeometry.computeVertexNormals();

  return (
    <group>
      <mesh ref={oceanRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          color="#0c4a6e"
          roughness={0.6}
          metalness={0.3}
          emissive="#082f49"
          emissiveIntensity={0.2}
        />
      </mesh>

      <mesh ref={landRef} geometry={landGeometry}>
        <meshStandardMaterial
          color="#15803d"
          roughness={0.8}
          metalness={0.1}
          emissive="#14532d"
          emissiveIntensity={0.1}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[2.01, 64, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.05}
          wireframe
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[2.15, 64, 64]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

export default function Globe({
  servers,
  regions,
  latencies,
  filters,
  onServerClick,
}: GlobeProps) {
  const controlsRef = useRef<any>(null);

  const handleZoomIn = () => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      const currentDistance = camera.position.length();
      const minDistance = controlsRef.current.minDistance;
      const newDistance = Math.max(minDistance, currentDistance - 1);
      camera.position.setLength(newDistance);
      controlsRef.current.update();
    }
  };

  const handleZoomOut = () => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      const currentDistance = camera.position.length();
      const maxDistance = controlsRef.current.maxDistance;
      const newDistance = Math.min(maxDistance, currentDistance + 1);
      camera.position.setLength(newDistance);
      controlsRef.current.update();
    }
  };

  return (
    <div className="w-full h-full relative bg-black">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <color attach="background" args={["#000000"]} />

        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 3, 5]} intensity={1.5} />
        <pointLight position={[-5, -3, -5]} intensity={0.5} color="#4a90e2" />

        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />

        <ProceduralEarth />

        {servers.map((server) => (
          <ServerMarker
            key={server.id}
            server={server}
            onClick={onServerClick}
          />
        ))}

        {filters.showRegions &&
          regions.map((region) => (
            <RegionMarker key={region.id} region={region} />
          ))}

        {filters.showRealTime &&
          latencies.slice(0, 20).map((latency) => {
            const source = servers.find((s) => s.id === latency.sourceId);
            const target = servers.find((s) => s.id === latency.targetId);
            if (source && target) {
              return (
                <LatencyConnection
                  key={latency.id}
                  source={source}
                  target={target}
                  latency={latency.latency}
                />
              );
            }
            return null;
          })}

        <OrbitControls
          ref={controlsRef}
          enablePan
          enableZoom
          enableRotate
          minDistance={4}
          maxDistance={15}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>

      <GlobeControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
    </div>
  );
}
