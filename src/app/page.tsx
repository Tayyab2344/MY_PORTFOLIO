import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import { ArrowUpRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-[#F5F1E8] relative selection:bg-[#7A1F2B] selection:text-[#F5F1E8]">
      {/* Sticky Instrument Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Editorial About Section */}
      <AboutSection />

      {/* Work & Technical Portfolio Section Placeholder */}
      <section id="work" className="py-16 sm:py-24 border-t border-[#1C2333] relative bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 pb-6 border-b border-[#1C2333]">
            <div>
              <span className="text-[11px] sm:text-xs font-mono tracking-widest text-[#9C2B3A] uppercase">
                // 02. SELECTED WORKS
              </span>
              <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-normal text-[#F5F1E8] mt-2">
                Featured Engineering & Projects
              </h2>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#8B92A8] max-w-md mt-3 md:mt-0">
              Architectured systems, open-source software, and full-stack web applications built for performance.
            </p>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Project Card 1 */}
            <div className="group relative border border-[#1C2333] bg-[#0B0F19] p-5 sm:p-6 hover:border-[#9C2B3A] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] sm:text-[10px] font-mono text-[#9C2B3A] tracking-wider uppercase border border-[#9C2B3A]/30 px-2 py-0.5">
                    SYSTEMS / DISTRIBUTED
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[#8B92A8] group-hover:text-[#F5F1E8] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
                <h3 className="font-display text-lg sm:text-xl text-[#F5F1E8] mb-2 group-hover:text-[#9C2B3A] transition-colors">
                  Nexus Mesh Router
                </h3>
                <p className="font-sans text-xs text-[#8B92A8] leading-relaxed mb-6">
                  High-throughput distributed RPC router and load balancer engineered for low-latency node synchronization.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] font-mono text-[#8B92A8] pt-4 border-t border-[#1C2333]">
                <span>C</span>
                <span>•</span>
                <span>WEBSOCKETS</span>
                <span>•</span>
                <span>DOCKER</span>
              </div>
            </div>

            {/* Project Card 2 */}
            <div className="group relative border border-[#1C2333] bg-[#0B0F19] p-5 sm:p-6 hover:border-[#9C2B3A] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] sm:text-[10px] font-mono text-[#9C2B3A] tracking-wider uppercase border border-[#9C2B3A]/30 px-2 py-0.5">
                    FULL-STACK / SAAS
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[#8B92A8] group-hover:text-[#F5F1E8] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
                <h3 className="font-display text-lg sm:text-xl text-[#F5F1E8] mb-2 group-hover:text-[#9C2B3A] transition-colors">
                  Aether Analytics Engine
                </h3>
                <p className="font-sans text-xs text-[#8B92A8] leading-relaxed mb-6">
                  Real-time telemetry and user-behavior insights platform featuring serverless pipeline ingest and interactive WebGL metrics visualizer.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] font-mono text-[#8B92A8] pt-4 border-t border-[#1C2333]">
                <span>NEXT.JS</span>
                <span>•</span>
                <span>TYPESCRIPT</span>
                <span>•</span>
                <span>POSTGRESQL</span>
              </div>
            </div>

            {/* Project Card 3 */}
            <div className="group relative border border-[#1C2333] bg-[#0B0F19] p-5 sm:p-6 hover:border-[#9C2B3A] transition-all duration-300 flex flex-col justify-between md:col-span-2 lg:col-span-1">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] sm:text-[10px] font-mono text-[#9C2B3A] tracking-wider uppercase border border-[#9C2B3A]/30 px-2 py-0.5">
                    AI / INFRASTRUCTURE
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[#8B92A8] group-hover:text-[#F5F1E8] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
                <h3 className="font-display text-lg sm:text-xl text-[#F5F1E8] mb-2 group-hover:text-[#9C2B3A] transition-colors">
                  Krypton Agent Platform
                </h3>
                <p className="font-sans text-xs text-[#8B92A8] leading-relaxed mb-6">
                  Autonomous LLM orchestration framework designed for structured code generation, multi-file refactoring, and automated testing.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] font-mono text-[#8B92A8] pt-4 border-t border-[#1C2333]">
                <span>PYTHON</span>
                <span>•</span>
                <span>KAFKA</span>
                <span>•</span>
                <span>FASTAPI</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer / Contact Bar */}
      <footer id="contact" className="py-8 sm:py-12 border-t border-[#1C2333] bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between font-mono text-xs text-[#8B92A8] space-y-4 md:space-y-0 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="text-[#F5F1E8] font-semibold">TAYYAB</span>
            <span>—</span>
            <span className="text-[#9C2B3A]">SYSTEMS ARCHITECT</span>
          </div>
          <div>
            <span>© 2026 TAYYAB. ALL RIGHTS RESERVED.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
