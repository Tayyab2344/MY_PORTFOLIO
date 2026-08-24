"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { generateLandDotCoordinates } from "./landData";
import { AtmosphereShader } from "./AtmosphereShader";

export function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Major Global Telemetry Nodes
export const GLOBAL_NODES = [
  { id: "sf", name: "San Francisco", lat: 37.7749, lng: -122.4194 },
  { id: "ldn", name: "London", lat: 51.5074, lng: -0.1278 },
  { id: "tok", name: "Tokyo", lat: 35.6762, lng: 139.6503 },
  { id: "fra", name: "Frankfurt", lat: 50.1109, lng: 8.6821 },
  { id: "syd", name: "Sydney", lat: -33.8688, lng: 151.2093 },
  { id: "sg", name: "Singapore", lat: 1.3521, lng: 103.8198 },
];

interface EarthGlobeCanvasProps {
  isReducedMotion?: boolean;
  mousePos?: { x: number; y: number };
}

// Sleek 3D Aerodynamic Aircraft Silhouette Component
function SleekAircraftMesh() {
  return (
    <group scale={[0.85, 0.85, 0.85]}>
      {/* Tapered Main Fuselage Body */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.008, 0.024, 0.2, 12]} />
        <meshStandardMaterial
          color="#F5F1E8"
          emissive="#7A1F2B"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Swept Main Wings */}
      <mesh position={[0, 0, 0.01]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.24, 0.004, 0.05]} />
        <meshStandardMaterial
          color="#F5F1E8"
          emissive="#9C2B3A"
          emissiveIntensity={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Wingtip Beacon Lights */}
      <mesh position={[-0.12, 0, 0.01]}>
        <sphereGeometry args={[0.008, 8, 8]} />
        <meshBasicMaterial color="#9C2B3A" />
      </mesh>
      <mesh position={[0.12, 0, 0.01]}>
        <sphereGeometry args={[0.008, 8, 8]} />
        <meshBasicMaterial color="#F5F1E8" />
      </mesh>

      {/* Horizontal Tail Stabilizers */}
      <mesh position={[0, 0, -0.08]}>
        <boxGeometry args={[0.09, 0.003, 0.03]} />
        <meshStandardMaterial color="#8B92A8" roughness={0.4} />
      </mesh>

      {/* Vertical Tail Fin */}
      <mesh position={[0, 0.02, -0.085]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.003, 0.04, 0.03]} />
        <meshStandardMaterial color="#9C2B3A" emissive="#7A1F2B" emissiveIntensity={0.9} />
      </mesh>

      {/* Exhaust Particle Trail */}
      <mesh position={[0, 0, -0.12]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshBasicMaterial color="#9C2B3A" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

// Physics-Based Great-Circle Aircraft Flight Group
function DataAircraftGroup({ radius = 1.9, isReducedMotion = false }: { radius?: number; isReducedMotion?: boolean }) {
  const craftRefs = useRef<THREE.Group[]>([]);

  // Great-circle flight routes connecting major global hubs
  const flightRoutes = useMemo(() => {
    const hubPairs = [
      { start: GLOBAL_NODES[0], end: GLOBAL_NODES[1], altitude: radius * 1.22, speed: 0.09, bankIntensity: 0.35 }, // SF -> London
      { start: GLOBAL_NODES[1], end: GLOBAL_NODES[2], altitude: radius * 1.28, speed: 0.07, bankIntensity: -0.4 }, // London -> Tokyo
      { start: GLOBAL_NODES[2], end: GLOBAL_NODES[4], altitude: radius * 1.20, speed: 0.08, bankIntensity: 0.3 },  // Tokyo -> Sydney
      { start: GLOBAL_NODES[3], end: GLOBAL_NODES[5], altitude: radius * 1.25, speed: 0.10, bankIntensity: -0.32 }, // Frankfurt -> Singapore
    ];

    return hubPairs.map((pair) => {
      const vStart = latLngToVector3(pair.start.lat, pair.start.lng, radius * 1.02);
      const vEnd = latLngToVector3(pair.end.lat, pair.end.lng, radius * 1.02);

      // Elevated midpoint control vector forming parabolic 3D flight arc
      const vMid = new THREE.Vector3().addVectors(vStart, vEnd).multiplyScalar(0.5);
      vMid.normalize().multiplyScalar(pair.altitude);

      const curve = new THREE.QuadraticBezierCurve3(vStart, vMid, vEnd);

      return { curve, speed: pair.speed, bankIntensity: pair.bankIntensity };
    });
  }, [radius]);

  useFrame((_, delta) => {
    if (isReducedMotion) return;

    const time = Date.now() * 0.001;

    flightRoutes.forEach((route, i) => {
      const craft = craftRefs.current[i];
      if (!craft) return;

      // Parameter t moving back and forth smoothly along 3D flight arc
      const cycleT = (time * route.speed + i * 0.25) % 2;
      const t = cycleT > 1 ? 2 - cycleT : cycleT; // Smooth round-trip trajectory

      // Current position and tangent position along curve
      const p1 = route.curve.getPoint(t);
      const p2 = route.curve.getPoint(Math.min(1, Math.max(0, t + (cycleT > 1 ? -0.01 : 0.01))));

      craft.position.copy(p1);

      // Compute aerodynamic vectors: Forward, Radial Up, Wing Right
      const forward = new THREE.Vector3().subVectors(p2, p1).normalize();
      if (forward.lengthSq() < 0.0001) return;

      const radialUp = p1.clone().normalize();
      const right = new THREE.Vector3().crossVectors(forward, radialUp).normalize();
      const trueUp = new THREE.Vector3().crossVectors(right, forward).normalize();

      // Aerodynamic Centripetal Banking: Roll wings into turn arc
      const bankRoll = Math.sin(t * Math.PI) * route.bankIntensity;

      // Construct aerodynamic orientation matrix
      const rotMatrix = new THREE.Matrix4();
      rotMatrix.makeBasis(right, trueUp, forward.negate());

      craft.rotation.setFromRotationMatrix(rotMatrix);
      craft.rotateZ(bankRoll); // Apply aerodynamic roll bank
    });
  });

  return (
    <group>
      {flightRoutes.map((_, i) => (
        <group
          key={i}
          ref={(el) => {
            if (el) craftRefs.current[i] = el;
          }}
        >
          <SleekAircraftMesh />
        </group>
      ))}
    </group>
  );
}

// 3D Earth Globe Body
function GlobeBody({ radius = 1.9, isReducedMotion = false, mousePos }: { radius?: number; isReducedMotion?: boolean; mousePos?: { x: number; y: number } }) {
  const globeGroupRef = useRef<THREE.Group>(null);
  const instancedDotsRef = useRef<THREE.InstancedMesh>(null);

  // Generate continent land dots
  const landDots = useMemo(() => generateLandDotCoordinates(3.2, 3.2), []);

  React.useEffect(() => {
    if (!instancedDotsRef.current) return;
    const dummy = new THREE.Object3D();
    const dotRadius = radius * 1.003;

    landDots.forEach(([lat, lng], i) => {
      const vec = latLngToVector3(lat, lng, dotRadius);
      dummy.position.copy(vec);
      dummy.lookAt(0, 0, 0);
      dummy.scale.set(0.013, 0.013, 0.013);
      dummy.updateMatrix();
      instancedDotsRef.current?.setMatrixAt(i, dummy.matrix);
    });

    instancedDotsRef.current.instanceMatrix.needsUpdate = true;
  }, [landDots, radius]);

  // Graticule wireframe lines
  const graticuleGeometry = useMemo(() => {
    const positions: number[] = [];
    const gridRadius = radius * 1.001;

    for (let lat = -60; lat <= 60; lat += 30) {
      for (let lng = -180; lng < 180; lng += 5) {
        const v1 = latLngToVector3(lat, lng, gridRadius);
        const v2 = latLngToVector3(lat, lng + 5, gridRadius);
        positions.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
      }
    }

    for (let lng = -180; lng < 180; lng += 30) {
      for (let lat = -90; lat < 90; lat += 5) {
        const v1 = latLngToVector3(lat, lng, gridRadius);
        const v2 = latLngToVector3(lat + 5, lng, gridRadius);
        positions.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, [radius]);

  // Fresnel Atmosphere Material
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

  useFrame((_, delta) => {
    if (!globeGroupRef.current) return;

    if (!isReducedMotion) {
      globeGroupRef.current.rotation.y += delta * 0.12;
    }

    if (mousePos) {
      const targetRotX = mousePos.y * 0.15;
      const targetRotY = mousePos.x * 0.15;
      globeGroupRef.current.rotation.x = THREE.MathUtils.lerp(globeGroupRef.current.rotation.x, targetRotX, 0.05);
      globeGroupRef.current.rotation.y = THREE.MathUtils.lerp(globeGroupRef.current.rotation.y, globeGroupRef.current.rotation.y + targetRotY * 0.01, 0.05);
    }
  });

  return (
    <group ref={globeGroupRef}>
      {/* Base Globe Body Sphere (#0B0F19) */}
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial color="#0B0F19" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Graticule Latitude/Longitude Grid (#9C2B3A) */}
      <lineSegments geometry={graticuleGeometry}>
        <lineBasicMaterial color="#9C2B3A" transparent opacity={0.18} />
      </lineSegments>

      {/* Dot-Matrix Continental Landmass Pattern (#8B92A8) */}
      <instancedMesh ref={instancedDotsRef} args={[undefined, undefined, landDots.length]}>
        <circleGeometry args={[1, 8]} />
        <meshBasicMaterial color="#8B92A8" transparent opacity={0.65} side={THREE.DoubleSide} />
      </instancedMesh>

      {/* Global Telemetry Node Points */}
      {GLOBAL_NODES.map((node) => {
        const pos = latLngToVector3(node.lat, node.lng, radius * 1.02);
        return (
          <group key={node.id} position={pos}>
            <mesh>
              <sphereGeometry args={[0.035, 16, 16]} />
              <meshBasicMaterial color="#F5F1E8" />
            </mesh>
            <mesh>
              <ringGeometry args={[0.04, 0.07, 24]} />
              <meshBasicMaterial color="#9C2B3A" transparent opacity={0.6} side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      })}

      {/* Physically Banked Great-Circle Aircraft Flight Group */}
      <DataAircraftGroup radius={radius} isReducedMotion={isReducedMotion} />

      {/* Rim Atmospheric Fresnel Glow */}
      <mesh material={atmosphereMaterial}>
        <sphereGeometry args={[radius * 1.15, 48, 48]} />
      </mesh>
    </group>
  );
}

export default function EarthGlobeCanvas({ isReducedMotion = false, mousePos }: EarthGlobeCanvasProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-transparent select-none cursor-grab active:cursor-grabbing">
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #7A1F2B 0%, #0B0F19 75%)",
        }}
      />

      <Canvas
        camera={{ position: [0, 0, 5.0], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0);
          scene.background = null;
        }}
        className="w-full h-full bg-transparent"
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 3, 5]} intensity={1.2} color="#F5F1E8" />
        <pointLight position={[-5, -3, -5]} intensity={0.6} color="#9C2B3A" />

        <GlobeBody radius={1.9} isReducedMotion={isReducedMotion} mousePos={mousePos} />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          rotateSpeed={0.5}
          enableDamping={true}
          dampingFactor={0.05}
        />

        {!isReducedMotion && (
          <EffectComposer enableNormalPass={false}>
            <Bloom
              luminanceThreshold={0.55}
              luminanceSmoothing={0.85}
              intensity={0.45}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
