"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

interface CodeToken {
  id: string;
  text: string;
  className: string;
  isInteractive?: boolean;
  interactiveKey?: "rigor" | "purpose" | "scale";
  pauseAfter?: number; // Optional pause in ms after typing this token
}

// Tokenized representation of C code snippet for precise typing & syntax highlighting
const CODE_TOKENS: CodeToken[] = [
  // Line 1: System *architect(Code *c)
  { id: "t-system", text: "System", className: "font-display font-semibold text-[#F5F1E8]" },
  { id: "t-s1", text: " ", className: "" },
  { id: "t-star1", text: "*", className: "text-[#9C2B3A] font-mono font-bold" },
  { id: "t-architect", text: "architect", className: "font-display italic font-normal text-[#F5F1E8]" },
  { id: "t-p1", text: "(", className: "text-[#8B92A8]" },
  { id: "t-code", text: "Code", className: "text-[#8B92A8] font-mono" },
  { id: "t-s2", text: " ", className: "" },
  { id: "t-star2", text: "*", className: "text-[#9C2B3A] font-mono font-bold" },
  { id: "t-c1", text: "c", className: "text-[#8B92A8] font-mono" },
  { id: "t-p2", text: ")", className: "text-[#8B92A8]", pauseAfter: 280 },

  // Line 2: \n{
  { id: "t-nl1", text: "\n", className: "" },
  { id: "t-b1", text: "{", className: "text-[#8B92A8] font-mono", pauseAfter: 220 },

  // Line 3: \n    return c
  { id: "t-nl2", text: "\n", className: "" },
  { id: "t-ind1", text: "    ", className: "" },
  { id: "t-return", text: "return", className: "text-[#9C2B3A] font-mono font-semibold" },
  { id: "t-s3", text: " ", className: "" },
  { id: "t-c2", text: "c", className: "text-[#F5F1E8] font-mono", pauseAfter: 200 },

  // Line 4: \n        ->rigor
  { id: "t-nl3", text: "\n", className: "" },
  { id: "t-ind2", text: "        ", className: "" },
  { id: "t-op1", text: "->", className: "text-[#9C2B3A] font-mono font-bold" },
  {
    id: "t-rigor",
    text: "rigor",
    className: "text-[#F5F1E8] font-mono font-medium hover:text-[#9C2B3A] hover:underline underline-offset-4 transition-all duration-200 cursor-pointer",
    isInteractive: true,
    interactiveKey: "rigor",
    pauseAfter: 180,
  },

  // Line 5: \n        ->purpose
  { id: "t-nl4", text: "\n", className: "" },
  { id: "t-ind3", text: "        ", className: "" },
  { id: "t-op2", text: "->", className: "text-[#9C2B3A] font-mono font-bold" },
  {
    id: "t-purpose",
    text: "purpose",
    className: "text-[#E2DCD0] font-mono font-medium hover:text-[#9C2B3A] hover:underline underline-offset-4 transition-all duration-200 cursor-pointer",
    isInteractive: true,
    interactiveKey: "purpose",
    pauseAfter: 180,
  },

  // Line 6: \n        ->scale;
  { id: "t-nl5", text: "\n", className: "" },
  { id: "t-ind4", text: "        ", className: "" },
  { id: "t-op3", text: "->", className: "text-[#9C2B3A] font-mono font-bold" },
  {
    id: "t-scale",
    text: "scale",
    className: "text-[#8B92A8] font-mono font-medium hover:text-[#F5F1E8] hover:underline underline-offset-4 transition-all duration-200 cursor-pointer",
    isInteractive: true,
    interactiveKey: "scale",
  },
  { id: "t-semi", text: ";", className: "text-[#8B92A8] font-mono", pauseAfter: 450 },

  // Line 7: \n}
  { id: "t-nl6", text: "\n", className: "" },
  { id: "t-b2", text: "}", className: "text-[#8B92A8] font-mono" },
];

export default function CodeHeroTypist() {
  const [typedCharCount, setTypedCharCount] = useState<number>(0);
  const [isCompiled, setIsCompiled] = useState<boolean>(false);
  const [hoveredProp, setHoveredProp] = useState<string | null>(null);

  // Compute total characters in full snippet
  const totalChars = useMemo(
    () => CODE_TOKENS.reduce((acc, token) => acc + token.text.length, 0),
    []
  );

  useEffect(() => {
    // Accessibility check: immediately display complete code if prefers-reduced-motion is active
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      setTypedCharCount(totalChars);
      setIsCompiled(true);
      return;
    }

    let currentCharIndex = 0;
    let timerId: NodeJS.Timeout;

    const typeNextChar = () => {
      if (currentCharIndex >= totalChars) {
        timerId = setTimeout(() => {
          setIsCompiled(true);
        }, 500);
        return;
      }

      currentCharIndex++;
      setTypedCharCount(currentCharIndex);

      let currentLen = 0;
      let delay = 35 + Math.floor(Math.random() * 25); // Realistic typing jitter (35-60ms)

      for (const token of CODE_TOKENS) {
        const tokenEnd = currentLen + token.text.length;
        if (currentCharIndex === tokenEnd && token.pauseAfter) {
          delay += token.pauseAfter;
          break;
        }
        currentLen = tokenEnd;
      }

      timerId = setTimeout(typeNextChar, delay);
    };

    timerId = setTimeout(typeNextChar, 400);

    return () => clearTimeout(timerId);
  }, [totalChars]);

  // Pre-calculate character index offsets per token
  let globalCharIndex = 0;

  return (
    <div className="relative font-mono text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-[1.3] text-[#F5F1E8] select-none my-1 flex flex-col justify-start min-h-[210px] sm:min-h-[250px] md:min-h-[290px] lg:min-h-[330px]">
      {/* Code Display Box: Full 7-line layout pre-rendered to prevent ANY vertical layout shifts */}
      <pre className="font-sans whitespace-pre font-normal tracking-tight overflow-x-auto scrollbar-none m-0 p-0">
        <code>
          {CODE_TOKENS.map((token) => {
            const tokenStart = globalCharIndex;
            const tokenChars = token.text.split("");
            globalCharIndex += token.text.length;

            return (
              <span
                key={token.id}
                className={`${token.className} ${
                  token.interactiveKey && hoveredProp === token.interactiveKey
                    ? "brightness-125 translate-x-0.5"
                    : ""
                }`}
                onMouseEnter={() => {
                  if (token.isInteractive && isCompiled) {
                    setHoveredProp(token.interactiveKey || null);
                  }
                }}
                onMouseLeave={() => setHoveredProp(null)}
              >
                {tokenChars.map((char, charIdx) => {
                  const charGlobalPos = tokenStart + charIdx + 1;
                  const isTyped = typedCharCount >= charGlobalPos;
                  const isCursorTarget = typedCharCount === charGlobalPos;

                  // Render char visible if typed, otherwise opacity-0 so full height is pre-allocated
                  return (
                    <React.Fragment key={charIdx}>
                      <span className={isTyped ? "opacity-100" : "opacity-0"}>
                        {char}
                      </span>
                      {/* Active Cursor immediately following the last typed character */}
                      {isCursorTarget && (
                        <span
                          className={`inline-block w-[0.45em] h-[1.1em] bg-[#9C2B3A] ml-[1px] align-middle transition-opacity duration-200 ${
                            isCompiled ? "opacity-30 animate-pulse" : "animate-pulse"
                          }`}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </span>
            );
          })}

          {/* Initial Cursor before first character is typed */}
          {typedCharCount === 0 && (
            <span className="inline-block w-[0.45em] h-[1.1em] bg-[#9C2B3A] align-middle animate-pulse" />
          )}
        </code>
      </pre>

      {/* Compiled Status Badge: Fixed height container to prevent layout reflow */}
      <div className="h-6 mt-2 flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={isCompiled ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
          transition={{ duration: 0.4 }}
          className="flex items-center space-x-2 text-[10px] sm:text-xs font-mono text-[#8B92A8] pointer-events-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#9C2B3A]" />
          <span className="tracking-widest uppercase text-[#9C2B3A]">BUILD SUCCESSFUL</span>
          <span>—</span>
          <span className="text-[#8B92A8]">0 ERRORS • 0 WARNINGS</span>
        </motion.div>
      </div>
    </div>
  );
}
