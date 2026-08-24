"use client";

import React, { useState } from "react";
import { Smartphone, Recycle, ArrowRight, ShieldCheck, CheckCircle2, DollarSign } from "lucide-react";

interface FlowStep {
  id: string;
  role: string;
  action: string;
  badge: string;
}

const FLOW_STEPS: FlowStep[] = [
  { id: "household", role: "HOUSEHOLD", action: "Snaps image of recyclable items", badge: "User Mobile App" },
  { id: "ai", role: "AI CLASSIFICATION", action: "TensorFlow model detects material grade", badge: "98.4% Accuracy" },
  { id: "listing", role: "SMART LISTING", action: "Auto-priced market item published", badge: "Node.js / PostgreSQL" },
  { id: "collector", role: "COLLECTOR ROUTE", action: "Geo-routed pickup assigned", badge: "Real-Time GPS" },
  { id: "marketplace", role: "WAREHOUSE BUYER", action: "Bulk batch verified & Stripe payout", badge: "Stripe Connect API" },
];

export default function RecyConnectViz() {
  const [activeStepIdx, setActiveStepIdx] = useState<number>(1);

  return (
    <div className="relative w-full border border-[#1C2333] bg-[#0B0F19]/90 p-4 sm:p-6 rounded-sm shadow-2xl backdrop-blur-md select-none group/container">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1C2333] text-[10px] font-mono text-[#8B92A8]">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#9C2B3A] animate-pulse" />
          <span className="text-[#F5F1E8] font-semibold tracking-wider uppercase">
            PRODUCT &amp; MARKETPLACE FLOW // MOBILE &amp; BACKEND
          </span>
        </div>
        <span className="text-[#9C2B3A] font-mono">FLUTTER / NODE.JS</span>
      </div>

      {/* Product Composition: Left Mobile Phone Screen Frame + Right Flow Steps */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Side: Mobile Phone Mockup Frame (5 cols) */}
        <div className="md:col-span-5 flex justify-center">
          <div className="relative w-48 sm:w-52 h-96 border-2 border-[#1C2333] bg-[#0B0F19] rounded-3xl p-3 shadow-2xl flex flex-col justify-between overflow-hidden group-hover/container:border-[#9C2B3A]/60 transition-colors duration-500">
            {/* Top Notch & Camera Marker */}
            <div className="w-20 h-4 bg-[#1C2333] rounded-b-xl mx-auto flex items-center justify-center mb-2">
              <span className="w-2 h-2 rounded-full bg-[#9C2B3A]" />
            </div>

            {/* Mobile Screen App Interface Simulation */}
            <div className="flex-1 border border-[#1C2333] rounded-2xl bg-[#0B0F19]/90 p-3 flex flex-col justify-between font-sans text-left">
              <div>
                <div className="flex items-center justify-between border-b border-[#1C2333] pb-2 mb-2">
                  <div className="flex items-center space-x-1.5">
                    <Recycle className="w-4 h-4 text-[#9C2B3A]" />
                    <span className="font-mono text-xs text-[#F5F1E8] font-bold tracking-wider">RecyConnect</span>
                  </div>
                  <span className="text-[9px] font-mono text-[#9C2B3A] bg-[#9C2B3A]/20 px-1.5 py-0.5 rounded">LIVE</span>
                </div>

                {/* Simulated AI Classification Scan Viewfinder */}
                <div className="relative aspect-square border border-dashed border-[#9C2B3A]/60 rounded-lg bg-[#1C2333]/20 flex flex-col items-center justify-center p-2 text-center my-2">
                  <div className="w-10 h-10 rounded-full bg-[#7A1F2B]/20 border border-[#9C2B3A] flex items-center justify-center text-[#F5F1E8] mb-1">
                    <Recycle className="w-5 h-5 text-[#9C2B3A] animate-spin" style={{ animationDuration: "8s" }} />
                  </div>
                  <span className="font-mono text-[10px] text-[#F5F1E8] font-semibold">PET Plastic Grade 1</span>
                  <span className="font-sans text-[8px] text-[#8B92A8]">AI Conf: 98.4%</span>
                </div>

                <div className="space-y-1.5 text-[9px] font-mono">
                  <div className="flex justify-between bg-[#1C2333]/40 p-1.5 rounded">
                    <span className="text-[#8B92A8]">Weight Est:</span>
                    <span className="text-[#F5F1E8] font-bold">14.2 kg</span>
                  </div>
                  <div className="flex justify-between bg-[#1C2333]/40 p-1.5 rounded">
                    <span className="text-[#8B92A8]">Market Value:</span>
                    <span className="text-[#9C2B3A] font-bold">$18.50</span>
                  </div>
                </div>
              </div>

              {/* Bottom Mobile Action Button */}
              <div className="pt-2">
                <button className="w-full bg-[#7A1F2B] hover:bg-[#9C2B3A] text-[#F5F1E8] font-mono text-[10px] py-1.5 rounded transition-colors uppercase tracking-wider font-semibold">
                  PUBLISH LISTING
                </button>
              </div>
            </div>

            {/* Bottom Speaker Bar */}
            <div className="w-12 h-1 bg-[#1C2333] rounded-full mx-auto mt-2" />
          </div>
        </div>

        {/* Right Side: Step-by-Step Marketplace Lifecycle Flow (7 cols) */}
        <div className="md:col-span-7 flex flex-col justify-center space-y-2.5">
          {FLOW_STEPS.map((step, idx) => {
            const isSelected = activeStepIdx === idx;
            return (
              <div
                key={step.id}
                onClick={() => setActiveStepIdx(idx)}
                className={`p-2.5 border rounded-sm transition-all duration-200 cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? "border-[#9C2B3A] bg-[#7A1F2B]/15"
                    : "border-[#1C2333] bg-[#0B0F19] hover:border-[#1C2333]/80"
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span
                    className={`font-mono text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      isSelected ? "bg-[#9C2B3A] text-[#F5F1E8]" : "bg-[#1C2333] text-[#8B92A8]"
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  <div className="flex flex-col min-w-0 text-left">
                    <span className="font-mono text-xs text-[#F5F1E8] font-semibold tracking-wider truncate">
                      {step.role}
                    </span>
                    <span className="font-sans text-[10px] text-[#8B92A8] truncate">
                      {step.action}
                    </span>
                  </div>
                </div>

                <span className="font-mono text-[9px] text-[#9C2B3A] border border-[#9C2B3A]/30 px-1.5 py-0.5 rounded shrink-0 ml-2">
                  {step.badge}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Spec Label */}
      <div className="mt-3 pt-2 border-t border-[#1C2333] flex items-center justify-between text-[10px] font-mono text-[#8B92A8]">
        <span className="truncate">PRODUCT :: FLUTTER MOBILE APP &amp; AI CLASSIFICATION MARKETPLACE</span>
        <span className="text-[#9C2B3A] shrink-0 font-semibold ml-2">TENSORFLOW / STRIPE</span>
      </div>
    </div>
  );
}
