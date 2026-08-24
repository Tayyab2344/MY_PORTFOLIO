"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const CONTACT_LINKS = [
  {
    label: "EMAIL",
    value: "ranatayyab941@gmail.com",
    href: "mailto:ranatayyab941@gmail.com",
  },
  {
    label: "GITHUB",
    value: "github.com/Tayyab2344",
    href: "https://github.com/Tayyab2344",
  },
  {
    label: "LINKEDIN",
    value: "linkedin.com/in/tayyabatiq",
    href: "https://linkedin.com/in/tayyabatiq",
  },
];

const NAV_LINKS = [
  { label: "ABOUT", href: "#about" },
  { label: "PROJECTS", href: "#work" },
  { label: "TECH STACK", href: "#tech" },
  { label: "CONTACT", href: "#contact" },
  { label: "WRITING", href: "#", badge: "SOON" },
];

export default function Footer() {
  const [terminalText, setTerminalText] = useState("");
  const [showClosedLine, setShowClosedLine] = useState(false);
  const [inView, setInView] = useState(false);

  // Typewriter effect for terminal line: tayyab@portfolio:~$ exit
  useEffect(() => {
    if (!inView) return;

    const fullCommand = "exit";
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < fullCommand.length) {
        setTerminalText(fullCommand.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setShowClosedLine(true);
        }, 400);
      }
    }, 180);

    return () => clearInterval(interval);
  }, [inView]);

  return (
    <footer
      id="contact"
      className="bg-[#0B0F19] text-[#F5F1E8] border-t border-[#1C2333] relative overflow-hidden pt-16 sm:pt-24 pb-12 bg-grid-pattern"
    >
      {/* Background Ambient Glow */}
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-[180px] opacity-10 pointer-events-none"
        style={{ background: "#9C2B3A" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ==================================================
            1. FOOTER INTRO & 2. PRIMARY CTA
           ================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          onViewportEnter={() => setInView(true)}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16 sm:mb-20"
        >
          {/* Eyebrow Tag */}
          <span className="font-mono text-[11px] sm:text-xs text-[#9C2B3A] tracking-[0.2em] uppercase font-semibold mb-3 select-none">
            // 03. CONTACT &amp; CONNECT
          </span>

          {/* Intro Heading */}
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F5F1E8] tracking-tight mb-3">
            LET&apos;S BUILD SOMETHING.
          </h2>

          {/* Subtitle Copy */}
          <p className="font-sans text-xs sm:text-sm text-[#C5CBE0] leading-relaxed mb-6 font-normal max-w-md">
            Have an idea, a system to build, or a problem worth solving?<br className="hidden sm:inline" />
            {" "}Let&apos;s talk.
          </p>

          {/* Primary CTA (Text Link with Animating Underline) */}
          <div className="relative group inline-block pt-1">
            <a
              href="mailto:ranatayyab941@gmail.com"
              className="inline-flex items-center space-x-2 font-mono text-xs sm:text-sm tracking-[0.2em] font-semibold text-[#F5F1E8] group-hover:text-[#9C2B3A] transition-colors duration-300 uppercase py-1"
            >
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                START A CONVERSATION
              </span>
              <ArrowUpRight className="w-4 h-4 text-[#9C2B3A] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </a>

            {/* 1px Burgundy Underline Animating Left to Right */}
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#1C2333]">
              <span className="absolute inset-0 bg-[#9C2B3A] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
            </span>
          </div>
        </motion.div>

        {/* ==================================================
            3. CONTACT INFORMATION GRID
           ================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pb-12 mb-12 border-b border-[#1C2333]"
        >
          {CONTACT_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group border border-[#1C2333] bg-[#0B0F19]/80 p-4 sm:p-5 hover:border-[#9C2B3A] transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] sm:text-[11px] text-[#A4ACCE] tracking-wider uppercase font-semibold">
                  {link.label}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#A4ACCE] group-hover:text-[#9C2B3A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
              </div>
              <span className="font-mono text-xs sm:text-sm text-[#F5F1E8] group-hover:text-[#9C2B3A] transition-colors truncate font-medium">
                {link.value}
              </span>
            </a>
          ))}
        </motion.div>

        {/* ==================================================
            4. FOOTER NAVIGATION
           ================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pb-12 mb-12 border-b border-[#1C2333]"
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="group relative inline-flex items-center space-x-1.5 font-mono text-xs tracking-widest text-[#A4ACCE] hover:text-[#F5F1E8] transition-colors duration-200 uppercase"
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[9px] font-mono text-[#9C2B3A] border border-[#9C2B3A]/30 px-1 py-0.2 rounded-none">
                  {item.badge}
                </span>
              )}
            </a>
          ))}
        </motion.div>

        {/* ==================================================
            5. TECHNICAL SIGNATURE & 7. COPYRIGHT STATUS
           ================================================== */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#1C2333]/60 text-xs font-mono">
          
          {/* Technical Signature */}
          <div className="flex items-center space-x-2 text-[#A4ACCE] text-[11px] sm:text-xs">
            <span className="text-[#8B92A8] uppercase">BUILT WITH</span>
            <span className="text-[#1C2333]">|</span>
            <span className="text-[#F5F1E8]">Next.js</span>
            <span className="text-[#9C2B3A]">·</span>
            <span className="text-[#F5F1E8]">TypeScript</span>
            <span className="text-[#9C2B3A]">·</span>
            <span className="text-[#F5F1E8]">React</span>
            <span className="text-[#9C2B3A]">·</span>
            <span className="text-[#F5F1E8]">Tailwind CSS</span>
          </div>

          {/* Copyright & Operational Status */}
          <div className="flex items-center space-x-4 text-[11px] sm:text-xs">
            <span className="text-[#A4ACCE]">© 2026 TAYYAB</span>

            <div className="flex items-center space-x-1.5 border border-[#1C2333] bg-[#0B0F19] px-2.5 py-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#10B981]"></span>
              </span>
              <span className="text-[10px] text-[#A4ACCE] tracking-wider uppercase font-semibold">
                ALL SYSTEMS OPERATIONAL
              </span>
            </div>
          </div>

        </div>

        {/* ==================================================
            6. TERMINAL-INSPIRED DETAIL (EASTER EGG)
           ================================================== */}
        <div className="pt-6 flex flex-col items-center justify-center font-mono text-[11px] sm:text-xs text-[#8B92A8] select-none">
          <div className="flex items-center space-x-1.5">
            <span className="text-[#9C2B3A]">tayyab@portfolio</span>
            <span className="text-[#A4ACCE]">:~$</span>
            <span className="text-[#F5F1E8] font-semibold">{terminalText}</span>
            <span className="w-1.5 h-3.5 bg-[#9C2B3A] animate-pulse" />
          </div>

          {showClosedLine && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-[#646A7E] text-[10px] mt-1 tracking-widest uppercase"
            >
              connection closed.
            </motion.div>
          )}
        </div>

      </div>
    </footer>
  );
}
