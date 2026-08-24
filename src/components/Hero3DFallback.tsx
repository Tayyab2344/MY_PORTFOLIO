"use client";

import React from "react";

export default function Hero3DFallback() {
  return (
    <div className="relative w-full h-full min-h-[320px] sm:min-h-[420px] flex items-center justify-center pointer-events-none select-none">
      {/* Background ambient radial glow */}
      <div 
        className="absolute inset-0 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #7A1F2B 0%, #0B0F19 70%)"
        }}
      />
      
      {/* Technical Low-Poly SVG Wireframe Graphic */}
      <svg
        viewBox="0 0 400 400"
        className="w-4/5 h-4/5 max-w-[340px] max-h-[340px] text-[#7A1F2B] drop-shadow-[0_0_20px_rgba(122,31,43,0.3)] animate-pulse"
        style={{ animationDuration: "6s" }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Faceted Geometric Ring */}
        <polygon
          points="200,30 340,110 370,250 270,360 130,360 30,250 60,110"
          stroke="#9C2B3A"
          strokeWidth="1.5"
          strokeOpacity="0.4"
          fill="#7A1F2B"
          fillOpacity="0.08"
        />

        {/* Inner Faceted Icosahedron Triangles */}
        <path
          d="M200,30 L270,140 L130,140 Z"
          stroke="#9C2B3A"
          strokeWidth="1.2"
          fill="#7A1F2B"
          fillOpacity="0.25"
        />
        <path
          d="M200,30 L340,110 L270,140 Z"
          stroke="#9C2B3A"
          strokeWidth="1.2"
          fill="#7A1F2B"
          fillOpacity="0.15"
        />
        <path
          d="M200,30 L60,110 L130,140 Z"
          stroke="#9C2B3A"
          strokeWidth="1.2"
          fill="#7A1F2B"
          fillOpacity="0.18"
        />

        {/* Center Triangular Nodes */}
        <path
          d="M130,140 L270,140 L200,280 Z"
          stroke="#F5F1E8"
          strokeWidth="1"
          strokeOpacity="0.7"
          fill="#7A1F2B"
          fillOpacity="0.35"
        />
        <path
          d="M130,140 L30,250 L200,280 Z"
          stroke="#9C2B3A"
          strokeWidth="1.2"
          fill="#7A1F2B"
          fillOpacity="0.1"
        />
        <path
          d="M270,140 L370,250 L200,280 Z"
          stroke="#9C2B3A"
          strokeWidth="1.2"
          fill="#7A1F2B"
          fillOpacity="0.15"
        />
        <path
          d="M30,250 L130,360 L200,280 Z"
          stroke="#9C2B3A"
          strokeWidth="1.2"
          fill="#7A1F2B"
          fillOpacity="0.2"
        />
        <path
          d="M370,250 L270,360 L200,280 Z"
          stroke="#9C2B3A"
          strokeWidth="1.2"
          fill="#7A1F2B"
          fillOpacity="0.22"
        />

        {/* Highlight Nodes */}
        <circle cx="200" cy="30" r="3" fill="#F5F1E8" />
        <circle cx="270" cy="140" r="2.5" fill="#F5F1E8" />
        <circle cx="130" cy="140" r="2.5" fill="#F5F1E8" />
        <circle cx="200" cy="280" r="3.5" fill="#F5F1E8" />
      </svg>
    </div>
  );
}
