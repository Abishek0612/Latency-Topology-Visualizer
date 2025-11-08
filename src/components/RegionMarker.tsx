"use client";

import { useState } from "react";
import { Circle, Html } from "@react-three/drei";
import { CloudRegion } from "../types";
import { latLonToVector3 } from "../lib/utils";
import { providerColors } from "../lib/data";

interface RegionMarkerProps {
  region: CloudRegion;
}

export default function RegionMarker({ region }: RegionMarkerProps) {
  const [hovered, setHovered] = useState(false);

  const position = latLonToVector3(
    region.location.lat,
    region.location.lon,
    2.01
  );

  const color = providerColors[region.provider];

  return (
    <group>
      <Circle
        position={[position.x, position.y, position.z]}
        args={[0.08, 32]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshBasicMaterial color={color} transparent opacity={0.2} side={2} />
      </Circle>

      {hovered && (
        <Html position={[position.x, position.y, position.z]} center>
          <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap border border-gray-700">
            <div className="font-bold">{region.name}</div>
            <div className="text-gray-300">{region.provider}</div>
            <div className="text-gray-400 text-xs mt-1">
              Region: {region.code}
            </div>
            <div className="text-gray-400 text-xs">
              Servers: {region.serverCount}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
