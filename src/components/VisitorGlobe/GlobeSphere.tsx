"use client";

import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { generateLandDotCoordinates } from "./landData";
import { AtmosphereShader } from "./AtmosphereShader";

export function latLngToVector3(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return [x, y, z];
}

interface GlobeSphereProps {
  radius?: number;
}

export default function GlobeSphere({ radius = 2 }: GlobeSphereProps) {
  const instancedDotsRef = useRef<THREE.InstancedMesh>(null);

  // 1. Generate continent land dot positions for InstancedMesh
  const landDots = useMemo(() => generateLandDotCoordinates(3.2, 3.2), []);

  // Update InstancedMesh matrices once on mount
  useEffect(() => {
    if (!instancedDotsRef.current) return;
    const dummy = new THREE.Object3D();
    const dotRadius = radius * 1.003;

    landDots.forEach(([lat, lng], i) => {
      const [x, y, z] = latLngToVector3(lat, lng, dotRadius);
      dummy.position.set(x, y, z);
      
      // Orient dot normal vector outwards from globe center
      dummy.lookAt(0, 0, 0);
      dummy.scale.set(0.014, 0.014, 0.014);
      dummy.updateMatrix();
      instancedDotsRef.current?.setMatrixAt(i, dummy.matrix);
    });

    instancedDotsRef.current.instanceMatrix.needsUpdate = true;
  }, [landDots, radius]);

  // 2. Generate graticule wireframe line segments geometry (Single BufferGeometry for LineSegments)
  const graticuleGeometry = useMemo(() => {
    const positions: number[] = [];
    const gridRadius = radius * 1.001;

    // Latitudes (every 30 deg)
    for (let lat = -60; lat <= 60; lat += 30) {
      for (let lng = -180; lng < 180; lng += 5) {
        const [x1, y1, z1] = latLngToVector3(lat, lng, gridRadius);
        const [x2, y2, z2] = latLngToVector3(lat, lng + 5, gridRadius);
        positions.push(x1, y1, z1, x2, y2, z2);
      }
    }

    // Longitudes (every 30 deg)
    for (let lng = -180; lng < 180; lng += 30) {
      for (let lat = -90; lat < 90; lat += 5) {
        const [x1, y1, z1] = latLngToVector3(lat, lng, gridRadius);
        const [x2, y2, z2] = latLngToVector3(lat + 5, lng, gridRadius);
        positions.push(x1, y1, z1, x2, y2, z2);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, [radius]);

  // 3. Atmosphere Fresnel Shader Material
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: AtmosphereShader.vertexShader,
      fragmentShader: AtmosphereShader.fragmentShader,
      uniforms: THREE.UniformsUtils.clone(AtmosphereShader.uniforms),
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
  }, []);

  return (
    <group>
      {/* Base Globe Body Sphere (Near-black navy #0B0F19) */}
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          color="#0B0F19"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Graticule Latitude/Longitude Wireframe Lines (#9C2B3A) - High-performance LineSegments */}
      <lineSegments geometry={graticuleGeometry}>
        <lineBasicMaterial color="#9C2B3A" transparent opacity={0.2} />
      </lineSegments>

      {/* Dot-Matrix Landmass Continents Pattern (#8B92A8) */}
      <instancedMesh
        ref={instancedDotsRef}
        args={[undefined, undefined, landDots.length]}
      >
        <circleGeometry args={[1, 8]} />
        <meshBasicMaterial
          color="#8B92A8"
          transparent
          opacity={0.65}
          side={THREE.DoubleSide}
        />
      </instancedMesh>

      {/* Rim Atmospheric Glow Mesh */}
      <mesh material={atmosphereMaterial}>
        <sphereGeometry args={[radius * 1.15, 48, 48]} />
      </mesh>
    </group>
  );
}
