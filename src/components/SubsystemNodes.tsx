"use client";

import React, { useState } from "react";
import {
  Cpu,
  Brain,
  Database,
  Cloud,
  Network,
  Monitor,
  Lock,
  Boxes,
} from "lucide-react";

export interface SubsystemNode {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  xPercent: number; // Wide outer perimeter position
  yPercent: number;
  isPrimaryMobile?: boolean;
}

export const SUBSYSTEM_NODES: SubsystemNode[] = [
  { id: "api-gw", name: "API GATEWAY", subtitle: "Requests flow", icon: Cpu, xPercent: 18, yPercent: 14, isPrimaryMobile: true },
  { id: "ai-ml", name: "AI / ML SERVICES", subtitle: "Intelligence layer", icon: Brain, xPercent: 78, yPercent: 14, isPrimaryMobile: true },
  { id: "data-pipe", name: "DATA PIPELINES", subtitle: "Process & store", icon: Database, xPercent: 88, yPercent: 36 },
  { id: "infra", name: "INFRASTRUCTURE", subtitle: "Deploy & scale", icon: Cloud, xPercent: 88, yPercent: 62, isPrimaryMobile: true },
  { id: "dist-sys", name: "DISTRIBUTED SYSTEMS", subtitle: "Messaging & events", icon: Network, xPercent: 78, yPercent: 84 },
  { id: "frontend", name: "FRONTEND SYSTEMS", subtitle: "Interfaces & UX", icon: Monitor, xPercent: 50, yPercent: 90, isPrimaryMobile: true },
  { id: "auth", name: "AUTH SERVICES", subtitle: "Secure access", icon: Lock, xPercent: 20, yPercent: 84 },
  { id: "micro", name: "MICROSERVICES", subtitle: "Independent & scalable", icon: Boxes, xPercent: 10, yPercent: 48 },
];

export default function SubsystemNodes() {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Center coordinate of 3D core in percentage space
  const centerX = 50;
  const centerY = 50;

  return (
    <>
      {/* Outer Screen-Space Network UI Layer over 3D Canvas */}
      <div className="absolute inset-0 z-10 pointer-events-none select-none overflow-hidden">
        {/* SVG Bezier Connection Lines & Flowing Particles */}
        <svg className="w-full h-full absolute inset-0">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9C2B3A" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#7A1F2B" stopOpacity="0.15" />
            </linearGradient>

            <linearGradient id="lineGradActive" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5F1E8" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#9C2B3A" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          {SUBSYSTEM_NODES.map((node) => {
            const isHovered = hoveredNodeId === node.id;
            const isAnyHovered = hoveredNodeId !== null;
            const isDimmed = isAnyHovered && !isHovered;

            // Curved Bezier path control offset from center to outer node
            const controlX = (node.xPercent + centerX) / 2 + (node.yPercent - centerY) * 0.12;
            const controlY = (node.yPercent + centerY) / 2 - (node.xPercent - centerX) * 0.12;

            const pathD = `M ${centerX}% ${centerY}% Q ${controlX}% ${controlY}% ${node.xPercent}% ${node.yPercent}%`;

            return (
              <g key={node.id} className="transition-opacity duration-300">
                {/* Connection Line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isHovered ? "url(#lineGradActive)" : "url(#lineGrad)"}
                  strokeWidth={isHovered ? 2 : 1}
                  strokeDasharray={isHovered ? "none" : "3 3"}
                  className={`transition-all duration-300 ${isDimmed ? "opacity-15" : "opacity-60"}`}
                />

                {/* Flowing Particle along connection line */}
                <circle r={isHovered ? 3.5 : 2} fill={isHovered ? "#F5F1E8" : "#9C2B3A"}>
                  <animateMotion
                    path={pathD}
                    dur={`${4 + (node.xPercent % 3)}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}
        </svg>

        {/* Outer Perimeter Screen-Space Subsystem Nodes */}
        {SUBSYSTEM_NODES.map((node) => {
          const isHovered = hoveredNodeId === node.id;
          const isAnyHovered = hoveredNodeId !== null;
          const isDimmed = isAnyHovered && !isHovered;
          const Icon = node.icon;

          return (
            <div
              key={node.id}
              style={{
                left: `${node.xPercent}%`,
                top: `${node.yPercent}%`,
                transform: "translate(-50%, -50%)",
              }}
              className={`absolute pointer-events-auto cursor-pointer transition-all duration-300 group ${
                node.isPrimaryMobile ? "flex" : "hidden md:flex"
              } ${isDimmed ? "opacity-30 scale-95" : "opacity-100 scale-100"} ${
                isHovered ? "scale-105 z-30" : "z-20"
              }`}
              onMouseEnter={() => setHoveredNodeId(node.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
            >
              <div className="flex items-center space-x-2 bg-[#0B0F19]/90 border border-[#1C2333] hover:border-[#9C2B3A] p-1.5 pr-3 rounded-md backdrop-blur-md transition-all duration-300">
                {/* Node Icon Badge */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center border transition-all duration-300 ${
                    isHovered
                      ? "bg-[#9C2B3A]/30 border-[#F5F1E8] text-[#F5F1E8]"
                      : "bg-[#0B0F19] border-[#1C2333] text-[#9C2B3A]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>

                {/* Node Title & Domain Subtitle */}
                <div className="flex flex-col text-left whitespace-nowrap">
                  <span
                    className={`font-mono text-[10px] sm:text-[11px] font-semibold tracking-wider transition-colors duration-300 ${
                      isHovered ? "text-[#F5F1E8]" : "text-[#F5F1E8]/90 group-hover:text-[#F5F1E8]"
                    }`}
                  >
                    {node.name}
                  </span>
                  <span className="font-sans text-[9px] text-[#8B92A8]">
                    {node.subtitle}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile-Only Subsystem Category Grid Below Visualization */}
      <div className="md:hidden grid grid-cols-2 gap-2 mt-4 px-2 select-none">
        {SUBSYSTEM_NODES.filter((n) => !n.isPrimaryMobile).map((node) => {
          const Icon = node.icon;
          return (
            <div
              key={node.id}
              className="flex items-center space-x-2 bg-[#0B0F19] border border-[#1C2333] p-2 rounded text-left"
            >
              <div className="w-6 h-6 rounded bg-[#7A1F2B]/10 border border-[#9C2B3A] flex items-center justify-center text-[#9C2B3A] shrink-0">
                <Icon className="w-3 h-3" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-[10px] font-semibold text-[#F5F1E8] truncate">
                  {node.name}
                </span>
                <span className="font-sans text-[8px] text-[#8B92A8] truncate">
                  {node.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
