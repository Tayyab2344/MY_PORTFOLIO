"use client";

import React, { useState, useEffect } from "react";
import { FileText, Scan, Binary, Database, Search, Cpu, MessageSquare } from "lucide-react";

interface PipelineStep {
  id: string;
  name: string;
  sub: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: PipelineStep[] = [
  { id: "doc", name: "DOCUMENT", sub: "PDF / Unstructured", detail: "Chunking raw text into 512-token windows", icon: FileText },
  { id: "parser", name: "PARSER", sub: "Layout & OCR", detail: "PDF element extraction & tabular parsing", icon: Scan },
  { id: "embedding", name: "EMBEDDING", sub: "Vector Model", detail: "bge-large-en-v1.5 (1024-dim dense vectors)", icon: Binary },
  { id: "vector", name: "VECTOR SEARCH", sub: "HNSW Index", detail: "Cosine similarity top-k ANN index lookup", icon: Database },
  { id: "retrieval", name: "RETRIEVAL", sub: "Reranker / Context", detail: "Cross-encoder context relevance scoring", icon: Search },
  { id: "llm", name: "LLM INFERENCE", sub: "Grounded Generation", detail: "Context-bounded response prompt synthesis", icon: Cpu },
  { id: "response", name: "RESPONSE", sub: "Structured JSON", detail: "Verified answer with source page citations", icon: MessageSquare },
];

export default function AIDocumentViz() {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % STEPS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full border border-[#1C2333] bg-[#0B0F19]/90 p-4 sm:p-6 rounded-sm shadow-2xl backdrop-blur-md select-none group/container">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1C2333] text-[10px] font-mono text-[#8B92A8]">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#9C2B3A] animate-pulse" />
          <span className="text-[#F5F1E8] font-semibold tracking-wider uppercase">
            RAG PIPELINE // EMBEDDING &amp; RETRIEVAL
          </span>
        </div>
        <span className="text-[#9C2B3A] font-mono">VECTOR::768d</span>
      </div>

      {/* SVG Pipeline Track & Nodes Canvas */}
      <div className="relative w-full aspect-[4/3] max-h-[420px] overflow-hidden">
        <svg viewBox="0 0 600 320" className="w-full h-full">
          <defs>
            <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9C2B3A" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#F5F1E8" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Serpentining Pipeline Paths */}
          {/* Row 1: 0 -> 1 -> 2 -> 3 (Left to Right) */}
          <line x1={70} y1={60} x2={220} y2={60} stroke={activeIdx >= 1 ? "#9C2B3A" : "#1C2333"} strokeWidth={activeIdx >= 1 ? 2 : 1} />
          <line x1={220} y1={60} x2={370} y2={60} stroke={activeIdx >= 2 ? "#9C2B3A" : "#1C2333"} strokeWidth={activeIdx >= 2 ? 2 : 1} />
          <line x1={370} y1={60} x2={520} y2={60} stroke={activeIdx >= 3 ? "#9C2B3A" : "#1C2333"} strokeWidth={activeIdx >= 3 ? 2 : 1} />

          {/* Downward Turn 3 -> 4 */}
          <path d="M 520 60 Q 560 60 560 110 T 520 160" fill="none" stroke={activeIdx >= 4 ? "#9C2B3A" : "#1C2333"} strokeWidth={activeIdx >= 4 ? 2 : 1} />

          {/* Row 2: 4 -> 5 -> 6 (Right to Left) */}
          <line x1={520} y1={160} x2={330} y2={160} stroke={activeIdx >= 5 ? "#9C2B3A" : "#1C2333"} strokeWidth={activeIdx >= 5 ? 2 : 1} />
          <line x1={330} y1={160} x2={140} y2={160} stroke={activeIdx >= 6 ? "#F5F1E8" : "#1C2333"} strokeWidth={activeIdx >= 6 ? 2.5 : 1} />

          {/* Active Data Fragment Moving Along Active Step */}
          {(() => {
            const stepPositions = [
              { x: 70, y: 60 },
              { x: 220, y: 60 },
              { x: 370, y: 60 },
              { x: 520, y: 60 },
              { x: 520, y: 160 },
              { x: 330, y: 160 },
              { x: 140, y: 160 },
            ];
            const currentPos = stepPositions[activeIdx];
            return (
              <circle cx={currentPos.x} cy={currentPos.y} r="5" fill="#F5F1E8" className="transition-all duration-500 ease-out">
                <animate attributeName="r" values="4;7;4" dur="1.2s" repeatCount="indefinite" />
              </circle>
            );
          })()}

          {/* Render Step Nodes */}
          {[
            { idx: 0, x: 70, y: 60 },
            { idx: 1, x: 220, y: 60 },
            { idx: 2, x: 370, y: 60 },
            { idx: 3, x: 520, y: 60 },
            { idx: 4, x: 520, y: 160 },
            { idx: 5, x: 330, y: 160 },
            { idx: 6, x: 140, y: 160 },
          ].map((item) => {
            const step = STEPS[item.idx];
            const isCurrent = activeIdx === item.idx;
            const isHovered = hoveredIdx === item.idx;

            return (
              <g
                key={step.id}
                transform={`translate(${item.x - 55}, ${item.y - 25})`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(item.idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <rect
                  width="110"
                  height="50"
                  rx="3"
                  fill="#0B0F19"
                  stroke={isHovered ? "#F5F1E8" : isCurrent ? "#9C2B3A" : "#1C2333"}
                  strokeWidth={isCurrent || isHovered ? "2" : "1"}
                  className="transition-all duration-200"
                />

                <text x="8" y="18" fill={isCurrent ? "#F5F1E8" : "#E2DCD0"} fontSize="9" fontFamily="monospace" fontWeight="600">
                  {step.name}
                </text>
                <text x="8" y="32" fill="#8B92A8" fontSize="7" fontFamily="sans-serif">
                  {step.sub}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* RAG Pipeline Detail Inspector Footer */}
      <div className="mt-2 pt-2 border-t border-[#1C2333] flex items-center justify-between text-[10px] font-mono text-[#8B92A8]">
        <span className="truncate text-[#F5F1E8]">
          {hoveredIdx !== null
            ? `STAGE :: ${STEPS[hoveredIdx].detail}`
            : `ACTIVE :: ${STEPS[activeIdx].detail}`}
        </span>
        <span className="text-[#9C2B3A] shrink-0 font-semibold ml-2">PYTHON / VECTOR RAG</span>
      </div>
    </div>
  );
}
