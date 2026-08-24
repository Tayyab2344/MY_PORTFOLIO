"use client";

import React from "react";
import { Globe } from "lucide-react";

export default function VisitorGlobeFallback() {
  return (
    <div className="relative w-full h-full min-h-[260px] sm:min-h-[340px] flex flex-col items-center justify-center bg-[#0B0F19]/60 border border-[#1C2333] p-6 text-center select-none overflow-hidden">
      {/* Background Animated Concentric Radar Circles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-48 h-48 rounded-full border border-[#9C2B3A] animate-ping" />
        <div className="absolute w-36 h-36 rounded-full border border-[#8B92A8]/40" />
        <div className="absolute w-24 h-24 rounded-full border border-[#8B92A8]/20" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="p-3 bg-[#7A1F2B]/10 border border-[#9C2B3A] rounded-full mb-3 text-[#9C2B3A] animate-pulse">
          <Globe className="w-6 h-6" />
        </div>
        <span className="font-mono text-xs text-[#F5F1E8] tracking-widest uppercase mb-1">
          GLOBAL VISITOR MAP
        </span>
        <span className="font-mono text-[10px] text-[#8B92A8]">
          Initializing 3D Telemetry Grid...
        </span>
      </div>
    </div>
  );
}
