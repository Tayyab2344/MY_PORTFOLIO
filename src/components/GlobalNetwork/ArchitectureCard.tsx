"use client";

import React from "react";
import { Activity } from "lucide-react";

export default function ArchitectureCard() {
  return (
    <div className="absolute top-1 right-1 sm:top-0 sm:right-0 z-30 pointer-events-none select-none bg-[#0B0F19]/90 border border-[#1C2333] p-2 sm:p-3 rounded-sm shadow-xl backdrop-blur-md font-mono text-[9px] sm:text-xs text-[#8B92A8] w-36 sm:w-48">
      {/* Title Header */}
      <div className="flex items-center justify-between pb-1.5 sm:pb-2 mb-1.5 sm:mb-2 border-b border-[#1C2333]">
        <div className="flex items-center space-x-1 sm:space-x-1.5 text-[#F5F1E8] font-semibold tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9C2B3A] animate-pulse" />
          <span className="text-[8px] sm:text-[10px]">ARCHITECTURE</span>
        </div>
        <Activity className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#9C2B3A]" />
      </div>

      {/* Grounded Specification Rows */}
      <div className="space-y-1 sm:space-y-1.5 text-[8px] sm:text-[10px]">
        <div className="flex justify-between items-center">
          <span className="text-[#8B92A8]">SYSTEM</span>
          <span className="text-[#9C2B3A] font-semibold">DISTRIBUTED</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#8B92A8]">SUBSYSTEMS</span>
          <span className="text-[#F5F1E8] font-semibold">8</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#8B92A8]">COMPONENTS</span>
          <span className="text-[#F5F1E8] font-semibold">24</span>
        </div>
        <div className="flex justify-between items-center pt-1 border-t border-[#1C2333]/50">
          <span className="text-[#8B92A8]">STATUS</span>
          <span className="text-[#F5F1E8] font-semibold text-[8px] sm:text-[9px] bg-[#9C2B3A]/20 border border-[#9C2B3A]/40 px-1 py-0.2 rounded">
            OPTIMAL
          </span>
        </div>
      </div>
    </div>
  );
}
