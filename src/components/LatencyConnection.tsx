"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ExchangeServer } from "../types";
import { latLonToVector3, getLatencyColor } from "../lib/utils";

interface LatencyConnectionProps {
  source: ExchangeServer;
  target: ExchangeServer;
  latency: number;
}

export default function LatencyConnection({
  source,
  target,
  latency,
}: LatencyConnectionProps) {
  const lineRef = useRef<THREE.Line>(null);

  const sourcePos = latLonToVector3(
    source.location.lat,
    source.location.lon,
    2.02
  );
  const targetPos = latLonToVector3(
    target.location.lat,
    target.location.lon,
    2.02
  );

  const { points, color } = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(sourcePos.x, sourcePos.y, sourcePos.z),
      new THREE.Vector3(
        (sourcePos.x + targetPos.x) / 2,
        (sourcePos.y + targetPos.y) / 2 + 0.3,
        (sourcePos.z + targetPos.z) / 2
      ),
      new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z)
    );

    const points = curve.getPoints(50);
    const color = getLatencyColor(latency);

    return { points, color };
  }, [sourcePos, targetPos, latency]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  useFrame(({ clock }) => {
    if (lineRef.current && lineRef.current.material) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.3 + Math.sin(clock.getElapsedTime() * 2) * 0.2;
    }
  });

  return (
    <primitive
      object={
        new THREE.Line(
          geometry,
          new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.4,
          })
        )
      }
      ref={lineRef}
    />
  );
}
