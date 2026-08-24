"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import GlobeSphere from "./GlobeSphere";
import VisitorMarkers from "./VisitorMarkers";
import { VisitorLocation } from "@/lib/visitorStore";
import VisitorGlobeFallback from "./VisitorGlobeFallback";

interface GlobeCanvasProps {
  visitors: VisitorLocation[];
  isReducedMotion?: boolean;
  autoRotate?: boolean;
}

function RotatingGlobeGroup({
  children,
  autoRotate = true,
  isReducedMotion = false,
}: {
  children: React.ReactNode;
  autoRotate?: boolean;
  isReducedMotion?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const isInteracting = useRef(false);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate && !isReducedMotion && !isInteracting.current) {
      groupRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerDown={() => {
        isInteracting.current = true;
      }}
      onPointerUp={() => {
        setTimeout(() => {
          isInteracting.current = false;
        }, 1500);
      }}
    >
      {children}
    </group>
  );
}

export default function GlobeCanvas({
  visitors,
  isReducedMotion = false,
  autoRotate = true,
}: GlobeCanvasProps) {
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    setMounted(true);
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!mounted || !hasWebGL) {
    return <VisitorGlobeFallback />;
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-transparent select-none cursor-grab active:cursor-grabbing">
      {/* Background Radial Glow */}
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #7A1F2B 0%, #0B0F19 75%)",
        }}
      />

      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: true,
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0);
          scene.background = null;
        }}
        className="w-full h-full bg-transparent"
        style={{ background: "transparent" }}
      >
        {/* Lights */}
        <ambientLight intensity={0.45} />
        <directionalLight position={[5, 3, 5]} intensity={1.1} color="#F5F1E8" />
        <pointLight position={[-5, -3, -5]} intensity={0.6} color="#9C2B3A" />

        {/* 3D Globe Group */}
        <RotatingGlobeGroup autoRotate={autoRotate} isReducedMotion={isReducedMotion}>
          <GlobeSphere radius={2} />
          <VisitorMarkers visitors={visitors} globeRadius={2} />
        </RotatingGlobeGroup>

        {/* Orbit Controls with Damping and Zoom Limits */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={3.0}
          maxDistance={7.5}
          rotateSpeed={0.55}
          zoomSpeed={0.8}
          enableDamping={true}
          dampingFactor={0.05}
        />

        {/* Bloom Post-Processing Effect for Glowing Nodes */}
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
