"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-24 border-t border-[#1C2333] relative bg-[#0B0F19] bg-grid-pattern overflow-hidden">
      {/* Background Radial Ambient Glow */}
      <div
        className="absolute top-1/2 left-0 w-96 h-96 rounded-full blur-[160px] opacity-10 pointer-events-none -translate-y-1/2"
        style={{ background: "#9C2B3A" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* LEFT SIDE: Technical Portrait Frame (~45% width on desktop, stacked on mobile) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-5 relative group max-w-sm sm:max-w-md mx-auto lg:max-w-none w-full"
          >
            {/* Outer Technical Instrument Container */}
            <div className="relative border border-[#1C2333] bg-[#0B0F19]/90 p-3 sm:p-4 rounded-sm shadow-2xl backdrop-blur-md hover:border-[#9C2B3A]/80 transition-colors duration-500">
              
              {/* Top Instrument Header Tag */}
              <div className="flex items-center justify-between pb-2 sm:pb-2.5 mb-2.5 sm:mb-3 border-b border-[#1C2333] text-[9px] sm:text-[10px] font-mono text-[#8B92A8] select-none">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9C2B3A] animate-pulse" />
                  <span className="text-[#F5F1E8] font-semibold tracking-wider">PORTRAIT / 01</span>
                </div>
                <span className="text-[#9C2B3A] font-semibold">TAYYAB</span>
              </div>

              {/* Corner Instrument Brackets */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#1C2333] group-hover:border-[#9C2B3A] transition-colors duration-300 pointer-events-none" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#1C2333] group-hover:border-[#9C2B3A] transition-colors duration-300 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#1C2333] group-hover:border-[#9C2B3A] transition-colors duration-300 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#1C2333] group-hover:border-[#9C2B3A] transition-colors duration-300 pointer-events-none" />

              {/* Image Frame Wrapper */}
              <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] w-full overflow-hidden rounded-sm bg-[#0B0F19] border border-[#1C2333]/80">
                <Image
                  src="/images/profilePic.png"
                  alt="Tayyab - Full-Stack Engineer & Systems Architect"
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-cover object-center filter grayscale-[30%] contrast-[0.98] brightness-[0.95] group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 group-hover:scale-[1.02] transition-all duration-700 ease-out"
                  priority
                />
                
                {/* Image Gradient Dark Overlay at Bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none" />
              </div>

              {/* Bottom Technical Subtext Label */}
              <div className="flex items-center justify-between pt-2 sm:pt-2.5 mt-2.5 sm:mt-3 border-t border-[#1C2333] text-[9px] sm:text-[10px] font-mono text-[#8B92A8] select-none">
                <span>SOFTWARE ENGINEER</span>
                <span className="text-[#9C2B3A]">SYSTEMS / AI / PRODUCT</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE: Personal Introduction & Metadata Grid (~55% width on desktop) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="lg:col-span-7 flex flex-col justify-center text-left mt-4 lg:mt-0"
          >
            {/* 1. Section Eyebrow Label */}
            <span className="font-mono text-[11px] sm:text-xs text-[#9C2B3A] tracking-[0.2em] uppercase font-semibold mb-1 sm:mb-2 select-none">
              01 / ABOUT
            </span>

            {/* 2. Main Headline */}
            <h2 className="font-display text-xl sm:text-3xl lg:text-4xl text-[#F5F1E8] font-bold leading-tight my-2 sm:my-3 select-none">
              I build <span className="text-[#9C2B3A]">systems</span>,<br className="hidden sm:inline" />
              {" "}but I think in <span className="text-[#9C2B3A]">products</span>.
            </h2>

            {/* 3. Personal Introduction Paragraphs */}
            <div className="space-y-2.5 sm:space-y-3 font-sans text-xs sm:text-base text-[#8B92A8] leading-relaxed max-w-[58ch] my-2 sm:my-3 font-normal">
              <p>
                I&apos;m Tayyab, a software engineer focused on building software systems that go beyond the interface. I work across application architecture, backend engineering, distributed systems, and AI, with a strong interest in understanding how things work beneath the abstraction.
              </p>
              <p>
                I enjoy taking an idea from a rough concept to something engineered, deployed, and useful.
              </p>
            </div>

            {/* 4. Compact Personal Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 pt-4 sm:pt-5 mt-3 sm:mt-4 border-t border-[#1C2333]">
              <div className="flex flex-col">
                <span className="font-mono text-[9px] sm:text-[11px] text-[#8B92A8] uppercase tracking-wider font-semibold">
                  FOCUS
                </span>
                <span className="font-sans text-xs sm:text-sm text-[#F5F1E8] font-medium mt-0.5 sm:mt-1">
                  Systems · AI/ML · Backend
                </span>
              </div>

              <div className="flex flex-col">
                <span className="font-mono text-[9px] sm:text-[11px] text-[#8B92A8] uppercase tracking-wider font-semibold">
                  EXPERIENCE
                </span>
                <span className="font-mono text-xs sm:text-sm text-[#9C2B3A] font-bold mt-0.5 sm:mt-1">
                  3+ YEARS
                </span>
              </div>

              <div className="flex flex-col">
                <span className="font-mono text-[9px] sm:text-[11px] text-[#8B92A8] uppercase tracking-wider font-semibold">
                  BUILDING
                </span>
                <span className="font-sans text-xs sm:text-sm text-[#F5F1E8] font-medium mt-0.5 sm:mt-1">
                  Software · Products · Research
                </span>
              </div>

              <div className="flex flex-col">
                <span className="font-mono text-[9px] sm:text-[11px] text-[#8B92A8] uppercase tracking-wider font-semibold">
                  WORK
                </span>
                <span className="font-sans text-xs sm:text-sm text-[#F5F1E8] font-medium mt-0.5 sm:mt-1">
                  Global / Remote
                </span>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
