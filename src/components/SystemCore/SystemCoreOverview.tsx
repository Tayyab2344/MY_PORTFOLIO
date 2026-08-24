"use client";

import React from "react";
import { Activity } from "lucide-react";

export default function SystemCoreOverview() {
  return (
    <div className="absolute top-0 right-0 z-30 pointer-events-none select-none bg-[#0B0F19]/95 border border-[#1C2333] p-3 rounded-sm shadow-xl backdrop-blur-md font-mono text-[10px] sm:text-xs text-[#8B92A8] w-44 sm:w-48">
      {/* Title Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1C2333]">
        <div className="flex items-center space-x-1.5 text-[#F5F1E8] font-semibold tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9C2B3A] animate-pulse" />
          <span className="text-[10px]">SYSTEM ARCHITECTURE</span>
        </div>
        <Activity className="w-3 h-3 text-[#9C2B3A]" />
      </div>

      {/* Specification Rows */}
      <div className="space-y-1.5 text-[10px]">
        <div className="flex justify-between items-center">
          <span className="text-[#8B92A8]">ARCHITECTURE</span>
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
        <div className="flex justify-between items-center">
          <span className="text-[#8B92A8]">CONNECTIONS</span>
          <span className="text-[#F5F1E8] font-semibold">64</span>
        </div>
        <div className="flex justify-between items-center pt-1 border-t border-[#1C2333]/50">
          <span className="text-[#8B92A8]">STATUS</span>
          <span className="text-[#F5F1E8] font-semibold text-[9px] bg-[#9C2B3A]/20 border border-[#9C2B3A]/40 px-1.5 py-0.2 rounded">
            OPTIMAL
          </span>
        </div>
      </div>
    </div>
  );
}
