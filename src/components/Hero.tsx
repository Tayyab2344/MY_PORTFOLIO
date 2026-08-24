"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, FileText } from "lucide-react";
import CodeHeroEditor from "./CodeHeroEditor";
import GlobalNetworkVisualization from "./GlobalNetwork";
import TechStackBar from "./TechStackBar";

const KICKER_TEXT = "FULL-STACK ENGINEER & SYSTEMS ARCHITECT";

export default function Hero() {
  const pathname = usePathname();
  const heroRef = useRef<HTMLElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const graphicContainerRef = useRef<HTMLDivElement>(null);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    // Check prefers-reduced-motion accessibility preference
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldReduceMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setShouldReduceMotion(e.matches);
    };
    motionQuery.addEventListener("change", handleMotionChange);

    // Register GSAP ScrollTrigger plugin on client side
    gsap.registerPlugin(ScrollTrigger);

    if (!motionQuery.matches && heroRef.current && textContentRef.current && graphicContainerRef.current) {
      const ctx = gsap.context(() => {
        gsap.to(textContentRef.current, {
          y: -25,
          opacity: 0.85,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(graphicContainerRef.current, {
          y: 35,
          scale: 0.95,
          opacity: 0.75,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }, heroRef);

      return () => ctx.revert();
    }

    return () => motionQuery.removeEventListener("change", handleMotionChange);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : {
            staggerChildren: 0.08,
            delayChildren: 0.03,
          },
    },
  };

  const kickerCharVariants: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.03 },
    },
  };

  const kickerContainerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : {
            staggerChildren: 0.015,
          },
    },
  };

  const subheadVariants: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: shouldReduceMotion
        ? { duration: 0 }
        : {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          },
    },
  };

  const itemVariants: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : {
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1],
          },
    },
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen flex flex-col justify-between pt-20 sm:pt-24 lg:pt-28 pb-6 sm:pb-8 overflow-hidden bg-[#0B0F19] bg-grid-pattern"
    >
      {/* Background Radial Gradient Glowing Fields */}
      <div
        className="absolute top-1/4 left-10 w-96 h-96 rounded-full blur-[140px] opacity-15 pointer-events-none"
        style={{ background: "#7A1F2B" }}
      />
      <div
        className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full blur-[160px] opacity-10 pointer-events-none"
        style={{ background: "#9C2B3A" }}
      />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col justify-between my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center w-full my-auto">
          
          {/* Left Zone: Code Editor & Content (Equal 6 columns 50% split) */}
          <motion.div
            key={pathname}
            ref={textContentRef}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 flex flex-col justify-center text-left"
          >
            {/* 1. Terminal Kicker Positioning Line */}
            <motion.p
              variants={itemVariants}
              className="font-mono text-[10px] sm:text-[11px] tracking-[0.15em] sm:tracking-[0.2em] text-[#9C2B3A] font-semibold uppercase mb-1 select-none flex flex-wrap"
            >
              <motion.span variants={kickerContainerVariants} className="inline-flex flex-wrap">
                {KICKER_TEXT.split("").map((char, index) => (
                  <motion.span key={index} variants={kickerCharVariants}>
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </motion.span>
            </motion.p>

            {/* 2. Embedded C-Code Function Editor */}
            <motion.div variants={itemVariants}>
              <CodeHeroEditor />
            </motion.div>

            {/* 3. Systems Subhead Copy */}
            <motion.p
              variants={subheadVariants}
              className="font-sans text-xs sm:text-sm md:text-base text-[#C5CBE0] leading-relaxed max-w-[54ch] my-3 font-normal"
            >
              I architect resilient systems, scalable platforms, and intelligent solutions that solve real problems.
              From low-level code to distributed systems — I build with intent and ship with impact.
            </motion.p>

            {/* 4. Grounded Metrics & Stats Row */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 py-3 my-2 border-y border-[#1C2333]"
            >
              <div className="flex flex-col group p-1 sm:p-1.5 transition-colors hover:bg-[#1C2333]/30">
                <span className="text-lg sm:text-2xl font-mono font-bold text-[#F5F1E8]">3+</span>
                <span className="text-[10px] sm:text-xs font-mono font-semibold text-[#F5F1E8]/90 uppercase tracking-wider group-hover:text-[#9C2B3A] transition-colors mt-0.5">
                  YEARS
                </span>
                <span className="text-[10px] sm:text-xs font-sans text-[#B0B7CB] mt-0.5">Building systems</span>
              </div>
              <div className="flex flex-col group p-1 sm:p-1.5 transition-colors hover:bg-[#1C2333]/30">
                <span className="text-lg sm:text-2xl font-mono font-bold text-[#F5F1E8]">20+</span>
                <span className="text-[10px] sm:text-xs font-mono font-semibold text-[#F5F1E8]/90 uppercase tracking-wider group-hover:text-[#9C2B3A] transition-colors mt-0.5">
                  PROJECTS
                </span>
                <span className="text-[10px] sm:text-xs font-sans text-[#B0B7CB] mt-0.5">Shipped &amp; delivered</span>
              </div>
              <div className="flex flex-col group p-1 sm:p-1.5 transition-colors hover:bg-[#1C2333]/30">
                <span className="text-lg sm:text-2xl font-mono font-bold text-[#F5F1E8]">10+</span>
                <span className="text-[10px] sm:text-xs font-mono font-semibold text-[#F5F1E8]/90 uppercase tracking-wider group-hover:text-[#9C2B3A] transition-colors mt-0.5">
                  TECHNOLOGIES
                </span>
                <span className="text-[10px] sm:text-xs font-sans text-[#B0B7CB] mt-0.5">Across the stack</span>
              </div>
              <div className="flex flex-col group p-1 sm:p-1.5 transition-colors hover:bg-[#1C2333]/30">
                <span className="text-lg sm:text-2xl font-mono font-bold text-[#F5F1E8]">∞</span>
                <span className="text-[10px] sm:text-xs font-mono font-semibold text-[#F5F1E8]/90 uppercase tracking-wider group-hover:text-[#9C2B3A] transition-colors mt-0.5">
                  CURIOSITY
                </span>
                <span className="text-[10px] sm:text-xs font-sans text-[#B0B7CB] mt-0.5">Always learning</span>
              </div>
            </motion.div>

            {/* 5. Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col min-[420px]:flex-row items-stretch min-[420px]:items-center gap-2.5 sm:gap-3 mt-3"
            >
              <motion.a
                href="#work"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center justify-center px-4 py-2.5 text-xs font-mono tracking-widest text-[#F5F1E8] uppercase border border-[#9C2B3A] bg-[#7A1F2B]/10 hover:bg-[#7A1F2B] transition-all duration-200 focus:outline-none w-full min-[420px]:w-auto"
              >
                <span>VIEW PROJECTS</span>
                <ArrowRight className="ml-2 w-3.5 h-3.5 text-[#9C2B3A] group-hover:text-[#F5F1E8] group-hover:translate-x-1 transition-transform duration-200" />
              </motion.a>

              <motion.a
                href="#contact"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center justify-center px-4 py-2.5 text-xs font-mono tracking-widest text-[#C5CBE0] hover:text-[#F5F1E8] uppercase border border-[#1C2333] hover:border-[#8B92A8]/40 bg-[#0B0F19] transition-all duration-200 focus:outline-none w-full min-[420px]:w-auto"
              >
                <FileText className="mr-2 w-3.5 h-3.5 text-[#C5CBE0] group-hover:text-[#F5F1E8] transition-colors" />
                <span>RESUME / SPECS</span>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Zone: Interactive 3D Earth Globe & Global Software Network (Equal 6 columns 50% split) */}
          <div
            ref={graphicContainerRef}
            className="lg:col-span-6 relative w-full flex items-center justify-center pr-0 lg:pr-2 my-auto mt-6 lg:mt-0"
          >
            <GlobalNetworkVisualization />
          </div>

        </div>

        {/* Bottom Section: Verified Tech Stack Ecosystem Strip */}
        <TechStackBar />
      </div>
    </section>
  );
}
