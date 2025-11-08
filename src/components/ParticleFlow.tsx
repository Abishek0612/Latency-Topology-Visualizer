"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ExchangeServer } from "../types";
import { latLonToVector3 } from "../lib/utils";

interface ParticleFlowProps {
  servers: ExchangeServer[];
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function ParticleFlow({ servers }: ParticleFlowProps) {
  const particlesRef = useRef<THREE.Points>(null);

  const particleData = useMemo(() => {
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const serverIndex = Math.floor(seededRandom(i * 12345) * servers.length);
      const server = servers[Math.min(serverIndex, servers.length - 1)];

      const heightOffset = seededRandom(i * 54321) * 0.5;
      const pos = latLonToVector3(
        server.location.lat,
        server.location.lon,
        2.1 + heightOffset
      );

      positions[i * 3] = pos.x;
      positions[i * 3 + 1] = pos.y;
      positions[i * 3 + 2] = pos.z;

      colors[i * 3] = seededRandom(i * 11111);
      colors[i * 3 + 1] = seededRandom(i * 22222);
      colors[i * 3 + 2] = seededRandom(i * 33333);

      sizes[i] = seededRandom(i * 44444) * 2 + 1;
    }

    return { positions, colors, sizes, count: particleCount };
  }, [servers]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(particleData.positions, 3)
    );
    geo.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(particleData.colors, 3)
    );
    geo.setAttribute(
      "size",
      new THREE.Float32BufferAttribute(particleData.sizes, 1)
    );
    return geo;
  }, [particleData]);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(clock.getElapsedTime() + i) * 0.001;
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.rotation.y += 0.0002;
    }
  });

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.01}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}
