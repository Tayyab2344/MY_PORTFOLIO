"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

interface SystemCoreCanvasProps {
  isReducedMotion?: boolean;
  mousePos?: { x: number; y: number };
}

// Floating Layered 3D System Core
function ArchitecturalCore({ isReducedMotion = false, mousePos }: { isReducedMotion?: boolean; mousePos?: { x: number; y: number } }) {
  const groupRef = useRef<THREE.Group>(null);
  const coreCubeRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Slow continuous rotation & floating motion
    if (!isReducedMotion) {
      groupRef.current.rotation.y += delta * 0.15;
      groupRef.current.position.y = Math.sin(Date.now() * 0.0015) * 0.06;

      if (coreCubeRef.current) {
        coreCubeRef.current.rotation.x += delta * 0.2;
        coreCubeRef.current.rotation.z += delta * 0.15;
      }
      if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.1;
      if (ring2Ref.current) ring2Ref.current.rotation.x += delta * 0.12;
    }

    // Subtle mouse parallax tilt toward cursor
    if (mousePos) {
      const targetRotX = mousePos.y * 0.15;
      const targetRotY = mousePos.x * 0.15;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, groupRef.current.rotation.y + targetRotY * 0.01, 0.05);
    }
  });

  // Background particle field
  const particles = useMemo(() => {
    const count = 90;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4.5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4.5;
    }
    return positions;
  }, []);

  return (
    <group ref={groupRef} scale={[0.85, 0.85, 0.85]}>
      {/* Central Floating Core Block (Emissive Burgundy Cube) */}
      <mesh ref={coreCubeRef} position={[0, 0, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          color="#9C2B3A"
          emissive="#7A1F2B"
          emissiveIntensity={1.9}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Outer Core Wireframe Cube Accent */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.68, 0.68, 0.68]} />
        <meshBasicMaterial color="#9C2B3A" wireframe transparent opacity={0.35} />
      </mesh>

      {/* 4 Layered Isometric Glass Planes (Stacked Computational Layers) */}
      {[-0.5, -0.15, 0.15, 0.5].map((yOffset, i) => (
        <group key={i} position={[0, yOffset, 0]} rotation={[Math.PI / 4, 0, Math.PI / 4]}>
          {/* Glass Fill Plane */}
          <mesh>
            <planeGeometry args={[1.6, 1.6]} />
            <meshStandardMaterial
              color="#0B0F19"
              transparent
              opacity={0.55}
              roughness={0.1}
              metalness={0.9}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Wireframe Glowing Border */}
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(1.6, 1.6)]} />
            <lineBasicMaterial color="#9C2B3A" transparent opacity={0.6} linewidth={1.5} />
          </lineSegments>
        </group>
      ))}

      {/* Thin Orbital Concentric Glowing Rings */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[1.25, 1.28, 64]} />
        <meshBasicMaterial color="#9C2B3A" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>

      <mesh ref={ring2Ref} rotation={[0, Math.PI / 4, Math.PI / 3]}>
        <ringGeometry args={[1.55, 1.58, 64]} />
        <meshBasicMaterial color="#F5F1E8" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* Ambient Micro Particle Field */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.025}
          color="#9C2B3A"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

export default function SystemCoreCanvas({ isReducedMotion = false, mousePos }: SystemCoreCanvasProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-transparent select-none cursor-grab active:cursor-grabbing">
      {/* Central Background Light Glow */}
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #7A1F2B 0%, #0B0F19 75%)",
        }}
      />

      <Canvas
        camera={{ position: [0, 1.2, 4.2], fov: 45 }}
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
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#F5F1E8" />
        <pointLight position={[0, 0, 0]} intensity={2.5} color="#9C2B3A" />

        <ArchitecturalCore isReducedMotion={isReducedMotion} mousePos={mousePos} />

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
