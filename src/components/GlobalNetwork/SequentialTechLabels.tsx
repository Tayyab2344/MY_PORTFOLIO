"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TechLabel {
  name: string;
  category: string;
  xPercent: number;
  yPercent: number;
  tetherX: number;
  tetherY: number;
}

// Allowed engineering stack items (NO Rust)
const SEQUENTIAL_TECHS: TechLabel[] = [
  { name: "C", category: "Low-Level Systems", xPercent: 18, yPercent: 20, tetherX: 38, tetherY: 34 },
  { name: "Java / Spring Boot", category: "Enterprise Backend", xPercent: 78, yPercent: 16, tetherX: 58, tetherY: 28 },
  { name: "Node.js", category: "Runtime / APIs", xPercent: 82, yPercent: 42, tetherX: 62, tetherY: 48 },
  { name: "Next.js", category: "Web Architecture", xPercent: 22, yPercent: 76, tetherX: 42, tetherY: 62 },
  { name: "AI / ML", category: "Intelligence Layer", xPercent: 76, yPercent: 78, tetherX: 56, tetherY: 66 },
  { name: "PostgreSQL", category: "Relational Store", xPercent: 14, yPercent: 46, tetherX: 36, tetherY: 50 },
  { name: "Docker & K8s", category: "Orchestration", xPercent: 84, yPercent: 62, tetherX: 60, tetherY: 58 },
  { name: "Kafka", category: "Event Streaming", xPercent: 26, yPercent: 18, tetherX: 44, tetherY: 32 },
  { name: "AWS & Linux", category: "Cloud Infrastructure", xPercent: 72, yPercent: 32, tetherX: 54, tetherY: 40 },
  { name: "Redis", category: "Distributed Cache", xPercent: 48, yPercent: 88, tetherX: 50, tetherY: 68 },
];

export default function SequentialTechLabels() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    // Cycles to next technology label every 3.0 seconds (0.4s fade-in, 2.2s hold, 0.4s fade-out)
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SEQUENTIAL_TECHS.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const activeTech = SEQUENTIAL_TECHS[currentIndex];

  return (
    <div className="absolute inset-0 z-20 pointer-events-none select-none overflow-hidden">
      {/* SVG Thin Connection Tether Line */}
      <svg className="w-full h-full absolute inset-0">
        <defs>
          <linearGradient id="tetherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9C2B3A" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#F5F1E8" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <AnimatePresence mode="wait">
          <motion.g
            key={`tether-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <line
              x1={`${activeTech.xPercent}%`}
              y1={`${activeTech.yPercent}%`}
              x2={`${activeTech.tetherX}%`}
              y2={`${activeTech.tetherY}%`}
              stroke="url(#tetherGrad)"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
            <circle cx={`${activeTech.tetherX}%`} cy={`${activeTech.tetherY}%`} r="3" fill="#F5F1E8" />
          </motion.g>
        </AnimatePresence>
      </svg>

      {/* Dynamic 1-at-a-Time Fading Technology Badge */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`label-${currentIndex}`}
          initial={{ opacity: 0, scale: 0.92, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: -6 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          style={{
            left: `clamp(22%, ${activeTech.xPercent}%, 78%)`,
            top: `clamp(18%, ${activeTech.yPercent}%, 82%)`,
            transform: "translate(-50%, -50%)",
          }}
          className="absolute z-30 pointer-events-auto bg-[#0B0F19]/95 border border-[#9C2B3A] px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded shadow-2xl backdrop-blur-md max-w-[160px] sm:max-w-none"
        >
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#9C2B3A] animate-pulse shrink-0" />
            <div className="flex flex-col text-left whitespace-nowrap min-w-0">
              <span className="font-mono text-[11px] sm:text-sm font-bold text-[#F5F1E8] tracking-wider truncate">
                {activeTech.name}
              </span>
              <span className="font-sans text-[8px] sm:text-[9px] text-[#8B92A8] truncate">
                {activeTech.category}
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
