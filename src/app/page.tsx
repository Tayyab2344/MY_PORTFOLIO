import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import { ArrowUpRight } from "lucide-react";

import ProjectsSection from "@/components/Projects/ProjectsSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-[#F5F1E8] relative selection:bg-[#7A1F2B] selection:text-[#F5F1E8]">
      {/* Sticky Instrument Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Editorial About Section */}
      <AboutSection />

      {/* 02 / PROJECTS Section with Bespoke Case Study Showcases */}
      <ProjectsSection />

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
