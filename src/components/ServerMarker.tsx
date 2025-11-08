"use client";

import { useRef, useState } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { ExchangeServer } from "../types";
import { latLonToVector3 } from "../lib/utils";

interface ServerMarkerProps {
  server: ExchangeServer;
  onClick: (server: ExchangeServer) => void;
}

const providerColors = {
  AWS: "#FF9900",
  GCP: "#4285F4",
  Azure: "#0078D4",
};

function PinMarker({ color, hovered }: { color: string; hovered: boolean }) {
  const pinRef = useRef<THREE.Group>(null);

  const pinGeometry = new THREE.ConeGeometry(0.03, 0.08, 8);
  const sphereGeometry = new THREE.SphereGeometry(0.025, 16, 16);

  return (
    <group ref={pinRef}>
      <mesh position={[0, 0.04, 0]} rotation={[0, 0, 0]}>
        <primitive object={pinGeometry} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 2 : 1}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 0.08, 0]}>
        <primitive object={sphereGeometry} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 2 : 1}
          toneMapped={false}
        />
      </mesh>

      {hovered && (
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.01, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}

export default function ServerMarker({ server, onClick }: ServerMarkerProps) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  const position = latLonToVector3(
    server.location.lat,
    server.location.lon,
    2.05
  );

  const color = providerColors[server.cloudProvider];

  const normalVector = new THREE.Vector3(
    position.x,
    position.y,
    position.z
  ).normalize();
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normalVector);

  return (
    <group
      ref={groupRef}
      position={[position.x, position.y, position.z]}
      quaternion={quaternion}
      onClick={(e) => {
        e.stopPropagation();
        onClick(server);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      <PinMarker color={color} hovered={hovered} />

      {hovered && (
        <Html
          position={[0, 0.15, 0]}
          center
          distanceFactor={5}
          style={{ pointerEvents: "none" }}
        >
          <div className="bg-gray-900/95 backdrop-blur-sm text-white px-4 py-3 rounded-lg shadow-2xl text-sm whitespace-nowrap border border-gray-700 animate-fadeIn">
            <div className="font-bold text-base mb-1">{server.name}</div>
            <div className="text-gray-300">
              📍 {server.location.city}, {server.location.country}
            </div>
            <div className="text-gray-400 text-xs mt-2 flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              {server.cloudProvider} - {server.region}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
