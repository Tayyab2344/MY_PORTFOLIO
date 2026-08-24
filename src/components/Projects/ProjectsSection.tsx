"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import CommerceXViz from "./CommerceXViz";
import NanoTorchViz from "./NanoTorchViz";
import AIDocumentViz from "./AIDocumentViz";
import RecyConnectViz from "./RecyConnectViz";

interface ProjectData {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  techs: string[];
  link?: string;
  sourceLink?: string;
  component: React.ComponentType;
  reverseDesktop?: boolean;
}

const PROJECTS: ProjectData[] = [
  {
    number: "01",
    title: "COMMERCE X",
    subtitle: "Distributed Commerce Platform",
    description:
      "A modular commerce platform designed around independent services, event-driven communication, scalable backend architecture, and modern infrastructure.",
    techs: ["Spring Boot", "Next.js", "PostgreSQL", "Kafka", "Redis", "Docker", "Kubernetes"],
    link: "#",
    component: CommerceXViz,
    reverseDesktop: false, // Text Left, Viz Right
  },
  {
    number: "02",
    title: "NANOTORCH",
    subtitle: "Machine Learning Library in C",
    description:
      "A compact machine learning library built from scratch in C to understand tensors, automatic differentiation, computation graphs, neural network layers, losses, optimizers, and training internals.",
    techs: ["C", "Tensor Operations", "Autograd", "Computational Graphs", "Neural Networks"],
    link: "#",
    component: NanoTorchViz,
    reverseDesktop: true, // Viz Left, Text Right
  },
  {
    number: "03",
    title: "AI DOCUMENT INTELLIGENCE",
    subtitle: "Intelligent Document Processing & RAG",
    description:
      "An AI system for extracting information from documents, generating embeddings, retrieving relevant context, and producing grounded responses through a retrieval-augmented generation pipeline.",
    techs: ["Python", "Embeddings", "Vector Search", "RAG", "LLM"],
    link: "#",
    component: AIDocumentViz,
    reverseDesktop: false, // Text Left, Viz Right
  },
  {
    number: "04",
    title: "RECYCONNECT",
    subtitle: "AI-Powered Recycling Marketplace",
    description:
      "A marketplace connecting households, collectors, warehouses, and companies, with AI-assisted recyclable classification and digital marketplace workflows.",
    techs: ["Flutter", "Node.js", "PostgreSQL", "TensorFlow", "Stripe"],
    link: "#",
    component: RecyConnectViz,
    reverseDesktop: true, // Viz Left, Text Right
  },
];

export default function ProjectsSection() {
  return (
    <section id="work" className="py-20 sm:py-24 border-t border-[#1C2333] relative bg-[#0B0F19] bg-grid-pattern overflow-hidden">
      {/* Background Ambient Radial Glow */}
      <div
        className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full blur-[180px] opacity-10 pointer-events-none"
        style={{ background: "#7A1F2B" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Main Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 sm:mb-20 pb-6 border-b border-[#1C2333]">
          <div>
            <span className="font-mono text-xs text-[#9C2B3A] tracking-[0.2em] uppercase font-semibold select-none">
              02 / PROJECTS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F5F1E8] mt-2 select-none">
              Things I&apos;ve built.
            </h2>
          </div>
          <p className="font-sans text-xs sm:text-sm text-[#C5CBE0] max-w-md mt-3 sm:mt-0 font-normal">
            Architectured systems, low-level libraries, AI pipelines, and full-stack software built with engineering rigor.
          </p>
        </div>

        {/* Vertical Stack of 4 Immersive Project Case Studies */}
        <div className="space-y-24 sm:space-y-32">
          {PROJECTS.map((proj) => {
            const VizComponent = proj.component;

            return (
              <motion.div
                key={proj.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="min-h-[70vh] flex flex-col justify-center border-b border-[#1C2333]/60 pb-16 sm:pb-24 last:border-b-0 last:pb-0"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  
                  {/* TEXT INFORMATION ZONE */}
                  <div
                    className={`lg:col-span-6 flex flex-col justify-center text-left ${
                      proj.reverseDesktop ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    {/* Small Technical Identifier */}
                    <div className="flex items-center space-x-2 mb-2 select-none">
                      <span className="font-mono text-xs font-bold text-[#9C2B3A] bg-[#9C2B3A]/15 border border-[#9C2B3A]/30 px-2 py-0.5 rounded-none">
                        {proj.number}
                      </span>
                      <span className="font-mono text-[10px] text-[#A4ACCE] tracking-widest uppercase">
                        // CASE STUDY
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#F5F1E8] font-bold tracking-tight mt-1 mb-2">
                      {proj.title}
                    </h3>
                    <h4 className="font-mono text-xs sm:text-sm text-[#9C2B3A] font-semibold tracking-wider uppercase mb-4">
                      {proj.subtitle}
                    </h4>

                    {/* Project Description */}
                    <p className="font-sans text-xs sm:text-sm text-[#C5CBE0] leading-relaxed max-w-[54ch] mb-6 font-normal">
                      {proj.description}
                    </p>

                    {/* Compact Technical Metadata Stack Badges */}
                    <div className="mb-6 pt-4 border-t border-[#1C2333]">
                      <span className="font-mono text-[10px] text-[#A4ACCE] uppercase tracking-wider block mb-2 font-semibold">
                        VERIFIED STACK
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {proj.techs.map((tech) => (
                          <span
                            key={tech}
                            className="font-mono text-[10px] sm:text-[11px] text-[#F5F1E8] bg-[#0B0F19] border border-[#1C2333] px-2.5 py-1 rounded-sm hover:border-[#9C2B3A] transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Simple Text Links (No huge buttons) */}
                    <div className="flex items-center space-x-6 font-mono text-xs">
                      {proj.link && (
                        <a
                          href={proj.link}
                          className="group inline-flex items-center text-[#F5F1E8] hover:text-[#9C2B3A] transition-colors uppercase tracking-widest font-semibold"
                        >
                          <span>EXPLORE PROJECT</span>
                          <ArrowUpRight className="ml-1 w-4 h-4 text-[#9C2B3A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                      )}
                      {proj.sourceLink && (
                        <a
                          href={proj.sourceLink}
                          className="group inline-flex items-center text-[#C5CBE0] hover:text-[#F5F1E8] transition-colors uppercase tracking-widest font-medium"
                        >
                          <span>SOURCE</span>
                          <ArrowUpRight className="ml-1 w-3.5 h-3.5 text-[#C5CBE0] group-hover:text-[#F5F1E8] transition-colors" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* TECHNICAL VISUALIZATION ZONE */}
                  <div
                    className={`lg:col-span-6 w-full ${
                      proj.reverseDesktop ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <VizComponent />
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
