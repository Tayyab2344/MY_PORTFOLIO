"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, Terminal } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
}

const DESKTOP_NAV_ITEMS: NavItem[] = [
  { label: "PROJECTS", href: "#work" },
  { label: "ABOUT", href: "#about" },
  { label: "TECH STACK", href: "#tech" },
];

const MOBILE_NAV_ITEMS: NavItem[] = [
  { label: "PROJECTS", href: "#work" },
  { label: "ABOUT", href: "#about" },
  { label: "TECH STACK", href: "#tech" },
  { label: "CONTACT", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-16 sm:h-18 flex items-center ${
        isScrolled || mobileMenuOpen
          ? "bg-[#0B0F19]/95 backdrop-blur-xl border-b border-[#1C2333] shadow-lg shadow-[#0B0F19]/50"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left Section: Logo & Instrument Status Badge */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <a
            href="#"
            className="group flex items-center space-x-2.5 sm:space-x-3 text-[#F5F1E8] focus:outline-none"
            aria-label="Tayyab - Home"
          >
            {/* Minimalist technical icon marker */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-none border border-[#1C2333] bg-[#0B0F19] group-hover:border-[#9C2B3A] transition-colors duration-200 flex items-center justify-center shrink-0">
              <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#9C2B3A] group-hover:text-[#F5F1E8] transition-colors" />
            </div>

            <div className="flex flex-col">
              <span className="font-mono text-xs sm:text-sm tracking-widest uppercase font-semibold text-[#F5F1E8] group-hover:text-[#9C2B3A] transition-colors">
                TAYYAB
              </span>
              <span className="font-sans text-[9px] sm:text-[10px] tracking-wider text-[#8B92A8] uppercase hidden min-[340px]:block">
                SYSTEMS ARCHITECT
              </span>
            </div>
          </a>

          {/* Thin Vertical Instrument Divider */}
          <div className="hidden sm:block h-6 w-[1px] bg-[#1C2333]" />

          {/* Status Indicator */}
          <div className="hidden md:flex items-center space-x-2 px-2.5 py-0.5 rounded-none border border-[#1C2333] bg-[#0B0F19]/60">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9C2B3A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#9C2B3A]"></span>
            </span>
            <span className="text-[11px] font-mono tracking-wider text-[#8B92A8] uppercase">
              SYS::ONLINE
            </span>
          </div>
        </div>

        {/* Right Section: Desktop Navigation Links & Outlined CTA */}
        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex items-center space-x-6" aria-label="Main Navigation">
            {DESKTOP_NAV_ITEMS.map((item, idx) => (
              <a
                key={item.label}
                href={item.href}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative py-2 text-xs font-mono tracking-widest text-[#8B92A8] hover:text-[#F5F1E8] transition-colors duration-200 uppercase"
              >
                {item.label}
                
                {/* 1px --accent-bright underline that animates on hover */}
                {hoveredIndex === idx && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#9C2B3A]"
                    initial={{ opacity: 0, width: "0%" }}
                    animate={{ opacity: 1, width: "100%" }}
                    exit={{ opacity: 0, width: "0%" }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Thin Vertical Rule */}
          <div className="h-5 w-[1px] bg-[#1C2333]" />

          {/* Outlined CTA in --accent-bright */}
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative inline-flex items-center justify-center px-4 py-2 text-xs font-mono tracking-widest text-[#F5F1E8] uppercase border border-[#9C2B3A] hover:bg-[#7A1F2B]/20 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#9C2B3A]"
          >
            <span>CONTACT</span>
            <ArrowUpRight className="ml-1.5 w-3.5 h-3.5 text-[#9C2B3A] group-hover:text-[#F5F1E8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </motion.a>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden flex items-center space-x-2.5">
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-2.5 py-1 text-[10px] sm:text-[11px] font-mono tracking-widest text-[#F5F1E8] uppercase border border-[#9C2B3A] hover:bg-[#7A1F2B]/20 transition-colors"
          >
            CONTACT
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 border border-[#1C2333] bg-[#0B0F19] text-[#8B92A8] hover:text-[#F5F1E8] hover:border-[#9C2B3A] transition-colors focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Instrument Panel Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden absolute top-full left-0 right-0 bg-[#0B0F19]/95 backdrop-blur-2xl border-b border-[#1C2333] px-5 py-5 shadow-2xl flex flex-col space-y-3 z-50"
          >
            <div className="flex items-center justify-between border-b border-[#1C2333] pb-2.5">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#8B92A8]">
                NAVIGATION MENU
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#9C2B3A]">
                SYS::READY
              </span>
            </div>

            {MOBILE_NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 font-mono text-xs sm:text-sm tracking-widest uppercase flex items-center justify-between transition-all duration-200 ${
                  item.label === "CONTACT"
                    ? "text-[#F5F1E8] bg-[#7A1F2B]/20 border border-[#9C2B3A] px-3 my-1"
                    : "text-[#8B92A8] hover:text-[#F5F1E8] hover:pl-2 border-l border-transparent hover:border-[#9C2B3A]"
                }`}
              >
                <span>{item.label}</span>
                {item.label === "CONTACT" && (
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#9C2B3A]" />
                )}
              </a>
            ))}

            <div className="pt-3 border-t border-[#1C2333] flex justify-between items-center text-[10px] font-mono text-[#8B92A8]">
              <span>TAYYAB / RANATAYYAB.DEV</span>
              <span className="text-[#9C2B3A]">2026</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
