"use client";

import React from "react";
import {
  Code,
  Server,
  Layers,
  Database,
  Cloud,
  Terminal,
  Cpu,
  Boxes,
  Shield,
  Zap,
} from "lucide-react";

interface TechItem {
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TECH_ITEMS: TechItem[] = [
  { name: "C", category: "Systems", icon: Code },
  { name: "Java / Spring", category: "Backend", icon: Server },
  { name: "Node.js", category: "Runtime", icon: Zap },
  { name: "Next.js", category: "Framework", icon: Layers },
  { name: "TypeScript", category: "Language", icon: Code },
  { name: "React", category: "Frontend", icon: Cpu },
  { name: "Python", category: "AI / Data", icon: Terminal },
  { name: "PostgreSQL", category: "SQL", icon: Database },
  { name: "MongoDB", category: "NoSQL", icon: Database },
  { name: "Docker", category: "Containers", icon: Boxes },
  { name: "Kubernetes", category: "Orchestration", icon: Cloud },
  { name: "Redis", category: "Cache", icon: Zap },
  { name: "Kafka", category: "Events", icon: Server },
  { name: "AWS", category: "Cloud", icon: Cloud },
  { name: "Linux", category: "OS / Kernel", icon: Shield },
];

export default function TechStackBar() {
  // Duplicate array 2x for seamless continuous infinite looping
  const doubleTechItems = [...TECH_ITEMS, ...TECH_ITEMS];

  return (
    <div className="w-full pt-6 mt-6 border-t border-[#1C2333]">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 text-[10px] font-mono text-[#8B92A8] tracking-widest uppercase select-none">
        <span className="text-[#9C2B3A] font-semibold flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9C2B3A] animate-pulse" />
          <span>TECH ECOSYSTEM</span>
        </span>
        <span className="hidden sm:inline text-[#8B92A8]/70">VERIFIED ENGINEERING STACK</span>
      </div>

      {/* Infinite Running Marquee Container */}
      <div className="relative w-full overflow-hidden group select-none">
        {/* Left & Right Gradient Fade Masks */}
        <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-[#0B0F19] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-[#0B0F19] to-transparent z-10 pointer-events-none" />

        {/* Ticker Row */}
        <div className="flex items-center space-x-3 w-max animate-tech-ticker group-hover:[animation-play-state:paused]">
          {doubleTechItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={`${item.name}-${idx}`}
                className="flex items-center space-x-2 border border-[#1C2333] bg-[#0B0F19]/90 px-3.5 py-1.5 rounded-sm hover:border-[#9C2B3A] hover:bg-[#7A1F2B]/15 transition-all duration-200 shrink-0 group/item cursor-default shadow-sm"
              >
                <Icon className="w-3.5 h-3.5 text-[#8B92A8] group-hover/item:text-[#F5F1E8] transition-colors" />
                <span className="font-mono text-xs text-[#F5F1E8] font-medium">{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CSS Keyframe Marquee Animation */}
      <style jsx>{`
        @keyframes techTicker {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-tech-ticker {
          animation: techTicker 32s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-tech-ticker {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
