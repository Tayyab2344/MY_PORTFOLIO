"use client";

import React, { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { VisitorLocation } from "@/lib/visitorStore";
import VisitorGlobeFallback from "./VisitorGlobeFallback";
import { Users, Radio } from "lucide-react";

// Dynamically import GlobeCanvas client-side with ssr: false
const GlobeCanvas = dynamic(() => import("./GlobeCanvas"), {
  ssr: false,
  loading: () => <VisitorGlobeFallback />,
});

export interface VisitorGlobeProps {
  size?: "hero" | "full" | "compact";
  autoRotate?: boolean;
  pollIntervalMs?: number;
  className?: string;
}

export default function VisitorGlobe({
  size = "hero",
  autoRotate = true,
  pollIntervalMs = 6000,
  className = "",
}: VisitorGlobeProps) {
  const [visitors, setVisitors] = useState<VisitorLocation[]>([]);
  const [currentVisitor, setCurrentVisitor] = useState<VisitorLocation | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [activeCount, setActiveCount] = useState<number>(0);

  // 1. Fetch active visitors telemetry from endpoint
  const fetchActiveVisitors = useCallback(async () => {
    try {
      const res = await fetch("/api/active-visitors");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.visitors)) {
          setVisitors(data.visitors);
          setActiveCount(data.activeCount || data.visitors.length);
        }
      }
    } catch {
      // Silent catch on network error, maintain previous state
    }
  }, []);

  // 2. Resolve current visitor IP geolocation on initial load
  useEffect(() => {
    // Check accessibility prefers-reduced-motion setting
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(motionQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    motionQuery.addEventListener("change", handleMotionChange);

    const initGeo = async () => {
      try {
        const res = await fetch("/api/geo");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.visitor) {
            setCurrentVisitor(data.visitor);
          }
        }
      } catch (err) {
        console.error("Geo init error:", err);
      } finally {
        fetchActiveVisitors();
      }
    };

    initGeo();

    // Set up polling interval for real-time visitor presence
    const interval = setInterval(fetchActiveVisitors, pollIntervalMs);

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
      clearInterval(interval);
    };
  }, [fetchActiveVisitors, pollIntervalMs]);

  // Dynamic height classes based on `size` prop
  const containerHeightClass =
    size === "hero"
      ? "h-[280px] sm:h-[360px] lg:h-[400px] xl:h-[440px]"
      : size === "compact"
      ? "h-[250px] sm:h-[300px]"
      : "h-[450px] sm:h-[550px] lg:h-[650px]";

  return (
    <div className={`relative w-full ${containerHeightClass} ${className}`}>
      {/* Structural instrument corner brackets */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#1C2333] z-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#1C2333] z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#1C2333] z-20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#1C2333] z-20 pointer-events-none" />

      {/* Top HUD Telemetry Bar */}
      <div className="absolute top-3 left-3 z-20 flex items-center space-x-3 pointer-events-none select-none">
        <div className="flex items-center space-x-1.5 text-[10px] font-mono text-[#F5F1E8] bg-[#0B0F19]/85 border border-[#1C2333] px-2.5 py-1 backdrop-blur-md">
          <Radio className="w-3 h-3 text-[#9C2B3A] animate-pulse" />
          <span>LIVE TELEMETRY</span>
        </div>
        
        <div className="hidden sm:flex items-center space-x-1.5 text-[10px] font-mono text-[#8B92A8] bg-[#0B0F19]/85 border border-[#1C2333] px-2.5 py-1 backdrop-blur-md">
          <Users className="w-3 h-3 text-[#F5F1E8]" />
          <span>{activeCount} NODES ONLINE</span>
        </div>
      </div>

      {/* Current Visitor Location Badge (if resolved) */}
      {currentVisitor && (
        <div className="absolute top-3 right-3 z-20 hidden md:flex items-center space-x-1.5 text-[10px] font-mono text-[#F5F1E8] bg-[#0B0F19]/85 border border-[#9C2B3A] px-2.5 py-1 backdrop-blur-md pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F5F1E8] animate-ping" />
          <span>YOUR NODE: {currentVisitor.city.toUpperCase()}</span>
        </div>
      )}

      {/* 3D R3F Globe Canvas Component */}
      <GlobeCanvas
        visitors={visitors}
        isReducedMotion={isReducedMotion}
        autoRotate={autoRotate}
      />

      {/* Bottom Interactive Hint Badge */}
      <div className="absolute bottom-3 right-3 z-20 flex items-center space-x-2 text-[10px] font-mono text-[#8B92A8] bg-[#0B0F19]/80 border border-[#1C2333] px-2.5 py-1 backdrop-blur-sm pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[#9C2B3A]" />
        <span>DRAG TO ROTATE • SCROLL TO ZOOM</span>
      </div>
    </div>
  );
}
