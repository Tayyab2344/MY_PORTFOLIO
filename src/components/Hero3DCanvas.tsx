"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Hero3DObject from "./Hero3DObject";
import Hero3DFallback from "./Hero3DFallback";

export default function Hero3DCanvas() {
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const mousePos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    // Check prefers-reduced-motion accessibility setting
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    motionQuery.addEventListener("change", handleMotionChange);

    // WebGL capability detection
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }

    // Mouse movement tracker normalized between -1 and 1
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || isReducedMotion) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mousePos.current = { x, y };
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isReducedMotion]);

  if (!mounted || !hasWebGL) {
    return <Hero3DFallback />;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center cursor-crosshair select-none bg-transparent"
    >
      {/* Background Subtle Gradient Radial Glow */}
      <div 
        className="absolute inset-0 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #7A1F2B 0%, #0B0F19 75%)"
        }}
      />

      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
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
        <Hero3DObject mousePos={mousePos} isReducedMotion={isReducedMotion} />
        
        {/* Restrained Post-Processing Bloom for Emissive Nodes & Rim Highlights */}
        {!isReducedMotion && (
          <EffectComposer enableNormalPass={false}>
            <Bloom
              luminanceThreshold={0.65}
              luminanceSmoothing={0.85}
              intensity={0.4}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
