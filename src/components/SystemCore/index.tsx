"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import SystemCoreFallback from "./SystemCoreFallback";
import SubsystemNodes from "./SubsystemNodes";
import { MousePointer } from "lucide-react";

// Dynamically import 3D Canvas client-side with ssr: false
const SystemCoreCanvas = dynamic(() => import("./SystemCoreCanvas"), {
  ssr: false,
  loading: () => <SystemCoreFallback />,
});

export interface SystemCoreVisualizationProps {
  className?: string;
}

export default function SystemCoreVisualization({ className = "" }: SystemCoreVisualizationProps) {
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check accessibility reduced motion preference
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(motionQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    motionQuery.addEventListener("change", handleMotionChange);

    // Track mouse position normalized between -1 and 1
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || isReducedMotion) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isReducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[400px] sm:h-[460px] lg:h-[500px] xl:h-[540px] ${className}`}
    >
      {/* Structural instrument corner brackets */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#1C2333] z-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#1C2333] z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#1C2333] z-20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#1C2333] z-20 pointer-events-none" />

      {/* Outer Screen-Space Subsystem Nodes & Connection Lines */}
      <SubsystemNodes />

      {/* Unobstructed 3D Floating System Core R3F Canvas */}
      <SystemCoreCanvas isReducedMotion={isReducedMotion} mousePos={mousePos} />

      {/* Bottom Central Drag / Rotate Hint Badge */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2 text-[10px] font-mono text-[#8B92A8] bg-[#0B0F19]/85 border border-[#1C2333] px-3 py-1 backdrop-blur-md pointer-events-none">
        <MousePointer className="w-3 h-3 text-[#9C2B3A] animate-pulse" />
        <span className="tracking-wider uppercase">DRAG TO ROTATE</span>
      </div>
    </div>
  );
}
