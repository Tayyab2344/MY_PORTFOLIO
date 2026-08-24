"use client";

import React, { useState, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { VisitorLocation } from "@/lib/visitorStore";
import { latLngToVector3 } from "./GlobeSphere";

interface VisitorMarkersProps {
  visitors: VisitorLocation[];
  globeRadius?: number;
  maxMarkers?: number;
}

interface ClusteredMarker {
  id: string;
  lat: number;
  lng: number;
  position: [number, number, number];
  city: string;
  country: string;
  count: number;
  isCurrentVisitor: boolean;
}

export default function VisitorMarkers({
  visitors,
  globeRadius = 2,
  maxMarkers = 75,
}: VisitorMarkersProps) {
  const { camera } = useThree();
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);
  const pulseGroupRef = useRef<THREE.Group>(null);

  // Animate marker pulses smoothly on each frame
  useFrame(({ clock }) => {
    if (!pulseGroupRef.current) return;
    const t = clock.getElapsedTime();
    const scale = 1 + Math.sin(t * 3) * 0.25;
    
    pulseGroupRef.current.children.forEach((child) => {
      const pulseRing = child.getObjectByName("pulseRing");
      if (pulseRing) {
        pulseRing.scale.set(scale, scale, scale);
      }
    });
  });

  // Calculate dynamic clusters based on camera distance (zoom level)
  const clusters = useMemo(() => {
    const camDist = camera.position.length();
    
    // Clustering threshold: larger threshold when zoomed out, smaller when zoomed in
    const clusterDistThreshold = Math.max(0.08, Math.min(0.4, (camDist - 2.5) * 0.08));
    const markerRadius = globeRadius * 1.025;

    const itemsToProcess = visitors.slice(0, maxMarkers);
    const clusterList: ClusteredMarker[] = [];

    itemsToProcess.forEach((v) => {
      const pos = latLngToVector3(v.lat, v.lng, markerRadius);
      const vVec = new THREE.Vector3(...pos);

      // Check if point belongs to an existing cluster
      let foundCluster = false;
      for (const cl of clusterList) {
        const clVec = new THREE.Vector3(...cl.position);
        if (vVec.distanceTo(clVec) < clusterDistThreshold) {
          cl.count += 1;
          if (v.isCurrentVisitor) cl.isCurrentVisitor = true;
          foundCluster = true;
          break;
        }
      }

      if (!foundCluster) {
        clusterList.push({
          id: v.id,
          lat: v.lat,
          lng: v.lng,
          position: pos,
          city: v.city,
          country: v.country,
          count: 1,
          isCurrentVisitor: !!v.isCurrentVisitor,
        });
      }
    });

    return clusterList;
  }, [visitors, maxMarkers, globeRadius, camera.position]);

  return (
    <group ref={pulseGroupRef}>
      {clusters.map((cluster) => {
        const isHovered = activeTooltipId === cluster.id;
        const isUser = cluster.isCurrentVisitor;
        const markerColor = isUser ? "#F5F1E8" : "#9C2B3A";

        return (
          <group key={cluster.id} position={cluster.position}>
            {/* Core Marker Point */}
            <mesh
              onPointerOver={(e) => {
                e.stopPropagation();
                setActiveTooltipId(cluster.id);
              }}
              onPointerOut={() => setActiveTooltipId(null)}
              onClick={(e) => {
                e.stopPropagation();
                setActiveTooltipId(activeTooltipId === cluster.id ? null : cluster.id);
              }}
            >
              <sphereGeometry args={[isUser ? 0.045 : 0.035, 16, 16]} />
              <meshBasicMaterial color={markerColor} />
            </mesh>

            {/* Glowing Emissive Pulse Aura Ring */}
            <mesh name="pulseRing">
              <ringGeometry args={[0.04, 0.075, 24]} />
              <meshBasicMaterial
                color={markerColor}
                transparent
                opacity={0.5}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Cluster count badge if multiple markers are aggregated */}
            {cluster.count > 1 && (
              <Html distanceFactor={8} position={[0, 0.08, 0]} center>
                <div className="bg-[#9C2B3A] text-[#F5F1E8] font-mono text-[9px] px-1 py-0.2 rounded-full border border-[#F5F1E8]/30 shadow-md pointer-events-none select-none">
                  +{cluster.count}
                </div>
              </Html>
            )}

            {/* Interactive Tooltip Badge on Hover or Click */}
            {isHovered && (
              <Html distanceFactor={6} position={[0, 0.14, 0]} center>
                <div className="bg-[#0B0F19]/95 text-[#F5F1E8] border border-[#9C2B3A] p-2 rounded shadow-2xl backdrop-blur-md font-mono text-xs select-none whitespace-nowrap min-w-[120px] pointer-events-none z-50 animate-in fade-in duration-200">
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className={`w-2 h-2 rounded-full ${isUser ? "bg-[#F5F1E8] animate-ping" : "bg-[#9C2B3A]"}`} />
                    <span className="font-semibold text-[#F5F1E8]">
                      {cluster.city}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#8B92A8] flex justify-between items-center">
                    <span>{cluster.country}</span>
                    <span className="text-[#9C2B3A] ml-2 uppercase">
                      {isUser ? "YOU" : "ACTIVE"}
                    </span>
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}
