"use client";

import React, { useState, useEffect } from "react";
import { Binary, GitCommit, ArrowRight, RotateCcw } from "lucide-react";

interface NodeStep {
  id: string;
  label: string;
  sub: string;
  cCode: string;
  x: number;
  y: number;
}

const GRAPH_NODES: NodeStep[] = [
  { id: "tensor", label: "TENSOR (X, W)", sub: "float32* data", cCode: "Tensor* x = tensor_create(dims, 2)", x: 80, y: 70 },
  { id: "op", label: "OPERATION (*, +)", sub: "matmul / bias_add", cCode: "Tensor* z = tensor_matmul(w, x)", x: 220, y: 70 },
  { id: "graph", label: "GRAPH NODE", sub: "backward_fn ptr", cCode: "z->backward = &autograd_matmul_bw", x: 360, y: 70 },
  { id: "forward", label: "FORWARD PASS", sub: "activation output", cCode: "Tensor* out = relu(z)", x: 500, y: 70 },
  { id: "loss", label: "LOSS FUNCTION", sub: "cross_entropy", cCode: "float loss = mse_loss(out, y)", x: 500, y: 220 },
  { id: "backward", label: "BACKWARD PASS", sub: "autograd_backward()", cCode: "tensor_backward(loss)", x: 320, y: 220 },
  { id: "grad", label: "GRADIENTS (dW)", sub: "float32* grad", cCode: "w->grad += dL_dw", x: 120, y: 220 },
];

export default function NanoTorchViz() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    // Cycles forward through steps 0->4, then backward through 4->6
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < 4) {
          setDirection("forward");
          return prev + 1;
        } else if (prev < 6) {
          setDirection("backward");
          return prev + 1;
        } else {
          setDirection("forward");
          return 0;
        }
      });
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full border border-[#1C2333] bg-[#0B0F19]/90 p-4 sm:p-6 rounded-sm shadow-2xl backdrop-blur-md select-none group/container">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1C2333] text-[10px] font-mono text-[#8B92A8]">
        <div className="flex items-center space-x-2">
          <span
            className={`w-2 h-2 rounded-full ${
              direction === "forward" ? "bg-[#F5F1E8] animate-pulse" : "bg-[#9C2B3A] animate-pulse"
            }`}
          />
          <span className="text-[#F5F1E8] font-semibold tracking-wider uppercase">
            AUTOGRAD GRAPH // C ENGINE
          </span>
        </div>
        <span className="text-[#9C2B3A] font-mono uppercase">
          {direction === "forward" ? "PASS::FORWARD →" : "PASS::BACKWARD (dL/dW) ←"}
        </span>
      </div>

      {/* SVG Computational Graph Canvas */}
      <div className="relative w-full aspect-[4/3] max-h-[420px] overflow-hidden">
        <svg viewBox="0 0 600 300" className="w-full h-full">
          <defs>
            <linearGradient id="fwdGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9C2B3A" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#F5F1E8" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="bwdGrad" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#F5F1E8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#9C2B3A" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Forward Connections Top Row: 0 -> 1 -> 2 -> 3 */}
          {[
            { id: "0-1", x1: 80, y1: 70, x2: 220, y2: 70, step: 0 },
            { id: "1-2", x1: 220, y1: 70, x2: 360, y2: 70, step: 1 },
            { id: "2-3", x1: 360, y1: 70, x2: 500, y2: 70, step: 2 },
          ].map((conn) => {
            const isActive = activeStep >= conn.step && direction === "forward";
            return (
              <g key={conn.id}>
                <line
                  x1={conn.x1}
                  y1={conn.y1}
                  x2={conn.x2}
                  y2={conn.y2}
                  stroke={isActive ? "#F5F1E8" : "#1C2333"}
                  strokeWidth={isActive ? 2 : 1}
                  strokeDasharray={isActive ? "none" : "3 3"}
                  className="transition-all duration-300"
                />
                {isActive && (
                  <circle r="3" fill="#F5F1E8">
                    <animateMotion path={`M ${conn.x1} ${conn.y1} L ${conn.x2} ${conn.y2}`} dur="0.9s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            );
          })}

          {/* Downward Connection: 3 -> 4 (Loss) */}
          <line
            x1={500}
            y1={70}
            x2={500}
            y2={220}
            stroke={activeStep >= 3 ? "#9C2B3A" : "#1C2333"}
            strokeWidth={activeStep >= 3 ? 2 : 1}
            strokeDasharray={activeStep >= 3 ? "none" : "3 3"}
          />
          {activeStep >= 3 && (
            <circle r="3" fill="#9C2B3A">
              <animateMotion path="M 500 70 L 500 220" dur="0.9s" repeatCount="indefinite" />
            </circle>
          )}

          {/* Backward Connections Bottom Row: 4 -> 5 -> 6 (Autograd Derivative Pass) */}
          {[
            { id: "4-5", x1: 500, y1: 220, x2: 320, y2: 220, step: 4 },
            { id: "5-6", x1: 320, y1: 220, x2: 120, y2: 220, step: 5 },
          ].map((conn) => {
            const isActive = activeStep >= conn.step && direction === "backward";
            return (
              <g key={conn.id}>
                <line
                  x1={conn.x1}
                  y1={conn.y1}
                  x2={conn.x2}
                  y2={conn.y2}
                  stroke={isActive ? "#9C2B3A" : "#1C2333"}
                  strokeWidth={isActive ? 2.5 : 1}
                  strokeDasharray={isActive ? "none" : "3 3"}
                  className="transition-all duration-300"
                />
                {isActive && (
                  <circle r="3.5" fill="#9C2B3A">
                    <animateMotion path={`M ${conn.x1} ${conn.y1} L ${conn.x2} ${conn.y2}`} dur="0.8s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {GRAPH_NODES.map((node, idx) => {
            const isActiveStep = activeStep === idx;
            const isHovered = hoveredNode === node.id;
            const width = 110;
            const height = 40;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x - width / 2}, ${node.y - height / 2})`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <rect
                  width={width}
                  height={height}
                  rx="3"
                  fill="#0B0F19"
                  stroke={
                    isHovered
                      ? "#F5F1E8"
                      : isActiveStep
                      ? direction === "forward"
                        ? "#F5F1E8"
                        : "#9C2B3A"
                      : "#1C2333"
                  }
                  strokeWidth={isActiveStep || isHovered ? "2" : "1"}
                  className="transition-all duration-200"
                />

                <text x="8" y="16" fill={isActiveStep ? "#F5F1E8" : "#E2DCD0"} fontSize="9" fontFamily="monospace" fontWeight="600">
                  {node.label}
                </text>
                <text x="8" y="29" fill="#8B92A8" fontSize="7" fontFamily="sans-serif">
                  {node.sub}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* C Code Struct Inspector Footer */}
      <div className="mt-2 pt-2 border-t border-[#1C2333] flex items-center justify-between text-[10px] font-mono text-[#8B92A8]">
        <span className="truncate text-[#F5F1E8]">
          {hoveredNode
            ? `C SOURCE :: ${GRAPH_NODES.find((n) => n.id === hoveredNode)?.cCode}`
            : `EXECUTING :: ${GRAPH_NODES[activeStep]?.cCode}`}
        </span>
        <span className="text-[#9C2B3A] shrink-0 font-semibold ml-2">C / AUTOGRAD</span>
      </div>
    </div>
  );
}
