import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import { ArrowUpRight } from "lucide-react";

import ProjectsSection from "@/components/Projects/ProjectsSection";
import Footer from "@/components/Footer";

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

      {/* Bespoke Systems Engineering Footer */}
      <Footer />
    </main>
  );
}
