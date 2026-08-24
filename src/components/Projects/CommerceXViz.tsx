"use client";

import React, { useState } from "react";
import { Cpu, ShieldCheck, ShoppingBag, ShoppingCart, Activity, BarChart3 } from "lucide-react";

interface NodeItem {
  id: string;
  name: string;
  sub: string;
  x: number;
  y: number;
  icon: React.ComponentType<{ className?: string }>;
  tech: string;
}

const NODES: NodeItem[] = [
  { id: "gateway", name: "API GATEWAY", sub: "Spring Cloud / NGINX", x: 300, y: 50, icon: Cpu, tech: "Port 8080 · Auth Ingestion" },
  { id: "auth", name: "AUTH SERVICE", sub: "OAuth2 / JWT", x: 120, y: 170, icon: ShieldCheck, tech: "Spring Security · Redis Cache" },
  { id: "product", name: "PRODUCT SERVICE", sub: "Catalog API", x: 300, y: 170, icon: ShoppingBag, tech: "PostgreSQL · Read Replica" },
  { id: "order", name: "ORDER SERVICE", sub: "Transactions", x: 480, y: 170, icon: ShoppingCart, tech: "ACID Transactions · Saga Pattern" },
  { id: "kafka", name: "KAFKA EVENT BUS", sub: "Pub/Sub Stream", x: 300, y: 290, icon: Activity, tech: "Partitioned Topics · 45k msg/s" },
  { id: "analytics", name: "ANALYTICS ENGINE", sub: "Metrics & Telemetry", x: 300, y: 390, icon: BarChart3, tech: "Real-Time Pipeline · ClickHouse" },
];

export default function CommerceXViz() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const isConnected = (source: string, target: string) => {
    if (!hoveredNode) return false;
    if (hoveredNode === source || hoveredNode === target) return true;
    if (hoveredNode === "gateway" && (target === "auth" || target === "product" || target === "order")) return true;
    if ((source === "auth" || source === "product" || source === "order") && target === "kafka") return true;
    if (source === "kafka" && target === "analytics" && hoveredNode === "kafka") return true;
    return false;
  };

  return (
    <div className="relative w-full border border-[#1C2333] bg-[#0B0F19]/90 p-4 sm:p-6 rounded-sm shadow-2xl backdrop-blur-md select-none group/container">
      {/* Visual Header Badge */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1C2333] text-[10px] font-mono text-[#8B92A8]">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#9C2B3A] animate-pulse" />
          <span className="text-[#F5F1E8] font-semibold tracking-wider uppercase">ARCHITECTURE // EVENT-DRIVEN</span>
        </div>
        <span className="text-[#9C2B3A] font-mono">SYS::ACTIVE</span>
      </div>

      {/* SVG Diagram Canvas */}
      <div className="relative w-full aspect-[4/3] max-h-[420px] overflow-hidden">
        <svg viewBox="0 0 600 450" className="w-full h-full">
          <defs>
            <linearGradient id="lineGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9C2B3A" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#7A1F2B" stopOpacity="0.3" />
            </linearGradient>

            <linearGradient id="lineGradActive" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5F1E8" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#9C2B3A" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          {/* Connection Lines from Gateway (x:300, y:50) to Services */}
          {[
            { id: "g-auth", x1: 300, y1: 50, x2: 120, y2: 170, source: "gateway", target: "auth" },
            { id: "g-prod", x1: 300, y1: 50, x2: 300, y2: 170, source: "gateway", target: "product" },
            { id: "g-ord", x1: 300, y1: 50, x2: 480, y2: 170, source: "gateway", target: "order" },
          ].map((conn) => {
            const active = isConnected(conn.source, conn.target);
            return (
              <g key={conn.id}>
                <line
                  x1={conn.x1}
                  y1={conn.y1}
                  x2={conn.x2}
                  y2={conn.y2}
                  stroke={active ? "url(#lineGradActive)" : "url(#lineGradMain)"}
                  strokeWidth={active ? 2.5 : 1.2}
                  strokeDasharray={active ? "none" : "4 4"}
                  className="transition-all duration-300"
                />
                {/* Streaming Data Particle */}
                <circle r={active ? 3.5 : 2.5} fill={active ? "#F5F1E8" : "#9C2B3A"}>
                  <animateMotion
                    path={`M ${conn.x1} ${conn.y1} L ${conn.x2} ${conn.y2}`}
                    dur={active ? "1.5s" : "3s"}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}

          {/* Connection Lines from Microservices to Kafka (x:300, y:290) */}
          {[
            { id: "auth-k", x1: 120, y1: 170, x2: 300, y2: 290, source: "auth", target: "kafka" },
            { id: "prod-k", x1: 300, y1: 170, x2: 300, y2: 290, source: "product", target: "kafka" },
            { id: "ord-k", x1: 480, y1: 170, x2: 300, y2: 290, source: "order", target: "kafka" },
          ].map((conn) => {
            const active = isConnected(conn.source, conn.target);
            return (
              <g key={conn.id}>
                <line
                  x1={conn.x1}
                  y1={conn.y1}
                  x2={conn.x2}
                  y2={conn.y2}
                  stroke={active ? "url(#lineGradActive)" : "url(#lineGradMain)"}
                  strokeWidth={active ? 2.5 : 1.2}
                  strokeDasharray={active ? "none" : "4 4"}
                  className="transition-all duration-300"
                />
                <circle r={active ? 3.5 : 2.5} fill={active ? "#F5F1E8" : "#9C2B3A"}>
                  <animateMotion
                    path={`M ${conn.x1} ${conn.y1} L ${conn.x2} ${conn.y2}`}
                    dur={active ? "1.6s" : "3.2s"}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}

          {/* Connection Line from Kafka to Analytics */}
          {(() => {
            const active = isConnected("kafka", "analytics");
            return (
              <g>
                <line
                  x1={300}
                  y1={290}
                  x2={300}
                  y2={390}
                  stroke={active ? "url(#lineGradActive)" : "url(#lineGradMain)"}
                  strokeWidth={active ? 2.5 : 1.2}
                  strokeDasharray={active ? "none" : "4 4"}
                  className="transition-all duration-300"
                />
                <circle r={active ? 3.5 : 2.5} fill={active ? "#F5F1E8" : "#9C2B3A"}>
                  <animateMotion path="M 300 290 L 300 390" dur={active ? "1.2s" : "2.4s"} repeatCount="indefinite" />
                </circle>
              </g>
            );
          })()}

          {/* Render Service Nodes */}
          {NODES.map((node) => {
            const isHovered = hoveredNode === node.id;
            const width = node.id === "kafka" ? 180 : 130;
            const height = 44;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x - width / 2}, ${node.y - height / 2})`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Node Box */}
                <rect
                  width={width}
                  height={height}
                  rx="3"
                  fill="#0B0F19"
                  stroke={isHovered ? "#9C2B3A" : "#1C2333"}
                  strokeWidth={isHovered ? "2" : "1"}
                  className="transition-all duration-200"
                />

                {/* Accent Highlight Line */}
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2={height}
                  stroke={isHovered ? "#F5F1E8" : "#9C2B3A"}
                  strokeWidth="3"
                />

                {/* Node Text & Label */}
                <text x="12" y="18" fill="#F5F1E8" fontSize="10" fontFamily="monospace" fontWeight="600">
                  {node.name}
                </text>
                <text x="12" y="32" fill="#8B92A8" fontSize="8" fontFamily="sans-serif">
                  {node.sub}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer Technical Spec Bar */}
      <div className="mt-3 pt-2.5 border-t border-[#1C2333] flex items-center justify-between text-[10px] font-mono text-[#8B92A8]">
        <span className="truncate">
          {hoveredNode
            ? `INSPECT :: ${NODES.find((n) => n.id === hoveredNode)?.tech}`
            : "HOVER NODE TO INSPECT ARCHITECTURE"}
        </span>
        <span className="text-[#9C2B3A] shrink-0 font-semibold ml-2">SPRING BOOT / KAFKA</span>
      </div>
    </div>
  );
}
