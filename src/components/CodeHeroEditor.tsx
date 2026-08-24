"use client";

import React, { useEffect, useState, useMemo } from "react";

interface CodeLineToken {
  text: string;
  className: string;
  isInteractive?: boolean;
  interactiveKey?: "rigor" | "purpose" | "scale";
}

interface CodeLineData {
  lineNumber: string;
  tokens: CodeLineToken[];
  comment?: string;
  pauseAfterLine?: number;
}

const CODE_LINES: CodeLineData[] = [
  {
    lineNumber: "01",
    tokens: [
      { text: "System", className: "font-display font-semibold text-[#F5F1E8]" },
      { text: " ", className: "" },
      { text: "*", className: "text-[#9C2B3A] font-mono font-bold" },
      { text: "architect", className: "font-display italic font-normal text-[#F5F1E8]" },
      { text: "(", className: "text-[#8B92A8]" },
      { text: "Code", className: "text-[#8B92A8] font-mono" },
      { text: " ", className: "" },
      { text: "*", className: "text-[#9C2B3A] font-mono font-bold" },
      { text: "c", className: "text-[#8B92A8] font-mono" },
      { text: ")", className: "text-[#8B92A8]" },
    ],
    pauseAfterLine: 250,
  },
  {
    lineNumber: "02",
    tokens: [{ text: "{", className: "text-[#8B92A8] font-mono" }],
    pauseAfterLine: 200,
  },
  {
    lineNumber: "03",
    tokens: [
      { text: "    ", className: "" },
      { text: "return", className: "text-[#9C2B3A] font-mono font-semibold" },
      { text: " ", className: "" },
      { text: "c", className: "text-[#F5F1E8] font-mono" },
    ],
    comment: "// build with intent",
    pauseAfterLine: 220,
  },
  {
    lineNumber: "04",
    tokens: [
      { text: "        ", className: "" },
      { text: "->", className: "text-[#9C2B3A] font-mono font-bold" },
      {
        text: "rigor",
        className:
          "text-[#F5F1E8] font-mono font-medium border-b border-[#F5F1E8]/40 hover:border-[#9C2B3A] hover:text-[#9C2B3A] transition-all duration-200 cursor-pointer",
        isInteractive: true,
        interactiveKey: "rigor",
      },
    ],
    comment: "// engineering excellence",
    pauseAfterLine: 180,
  },
  {
    lineNumber: "05",
    tokens: [
      { text: "        ", className: "" },
      { text: "->", className: "text-[#9C2B3A] font-mono font-bold" },
      {
        text: "purpose",
        className:
          "text-[#E2DCD0] font-mono font-medium border-b border-[#E2DCD0]/40 hover:border-[#9C2B3A] hover:text-[#9C2B3A] transition-all duration-200 cursor-pointer",
        isInteractive: true,
        interactiveKey: "purpose",
      },
    ],
    comment: "// solve meaningful problems",
    pauseAfterLine: 180,
  },
  {
    lineNumber: "06",
    tokens: [
      { text: "        ", className: "" },
      { text: "->", className: "text-[#9C2B3A] font-mono font-bold" },
      {
        text: "scale",
        className:
          "text-[#8B92A8] font-mono font-medium border-b border-[#8B92A8]/40 hover:border-[#9C2B3A] hover:text-[#F5F1E8] transition-all duration-200 cursor-pointer",
        isInteractive: true,
        interactiveKey: "scale",
      },
      { text: ";", className: "text-[#8B92A8] font-mono" },
    ],
    comment: "// systems that grow",
    pauseAfterLine: 400,
  },
  {
    lineNumber: "07",
    tokens: [{ text: "}", className: "text-[#8B92A8] font-mono" }],
  },
];

export default function CodeHeroEditor() {
  const [typedCharCount, setTypedCharCount] = useState<number>(0);
  const [isCompiled, setIsCompiled] = useState<boolean>(false);
  const [hoveredProp, setHoveredProp] = useState<string | null>(null);

  // Pure pre-calculation of line character boundaries
  const { totalChars, linesWithRanges } = useMemo(() => {
    let globalOffset = 0;
    const ranges = CODE_LINES.map((line) => {
      const tokensStr = line.tokens.reduce((acc, t) => acc + t.text, "");
      const fullText = tokensStr + (line.comment ? "    " + line.comment : "");
      const start = globalOffset;
      const end = globalOffset + fullText.length;
      globalOffset = end;
      return {
        ...line,
        fullText,
        startCharIndex: start,
        endCharIndex: end,
      };
    });
    return { totalChars: globalOffset, linesWithRanges: ranges };
  }, []);

  // Determine active line and character offset within that line
  const activeLineInfo = useMemo(() => {
    if (typedCharCount === 0) {
      return { activeLineIndex: 0, relativePos: 0 };
    }

    for (let i = 0; i < linesWithRanges.length; i++) {
      const l = linesWithRanges[i];
      if (typedCharCount >= l.startCharIndex && typedCharCount <= l.endCharIndex) {
        return { activeLineIndex: i, relativePos: typedCharCount - l.startCharIndex };
      }
    }

    // After typing completes, cursor sits at end of last line
    const lastIdx = linesWithRanges.length - 1;
    return {
      activeLineIndex: lastIdx,
      relativePos: linesWithRanges[lastIdx].fullText.length,
    };
  }, [typedCharCount, linesWithRanges]);

  useEffect(() => {
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
        }, 400);
        return;
      }

      currentCharIndex++;
      setTypedCharCount(currentCharIndex);

      let currentAccumulated = 0;
      let delay = 30 + Math.floor(Math.random() * 20);

      for (const line of CODE_LINES) {
        const lineLen =
          line.tokens.reduce((tAcc, tok) => tAcc + tok.text.length, 0) +
          (line.comment ? line.comment.length + 4 : 0);

        if (currentCharIndex === currentAccumulated + lineLen && line.pauseAfterLine) {
          delay += line.pauseAfterLine;
          break;
        }
        currentAccumulated += lineLen;
      }

      timerId = setTimeout(typeNextChar, delay);
    };

    timerId = setTimeout(typeNextChar, 350);

    return () => clearTimeout(timerId);
  }, [totalChars]);

  return (
    <div className="relative font-mono text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed text-[#F5F1E8] select-none my-3 bg-[#0B0F19]/90 border border-[#1C2333] p-3 sm:p-4 md:p-5 rounded-sm shadow-2xl backdrop-blur-md overflow-hidden">
      {/* Code Editor Header Bar */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 sm:pb-3 sm:mb-3 border-b border-[#1C2333] text-[10px] sm:text-xs text-[#8B92A8]">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#9C2B3A]/80 inline-block" />
          <span className="font-mono text-[#F5F1E8] font-medium tracking-wider text-[11px] sm:text-xs">architect.c</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-[#8B92A8] hidden sm:inline">UTF-8</span>
          <span className="text-[#9C2B3A] font-semibold text-[11px] sm:text-xs">C</span>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="font-sans whitespace-pre overflow-x-auto scrollbar-none max-w-full">
        <table className="w-full border-collapse">
          <tbody>
            {linesWithRanges.map((line, lineIdx) => {
              const isLineActive = activeLineInfo.activeLineIndex === lineIdx;
              const cursorTargetPos = activeLineInfo.relativePos;

              // Track character position inside this line
              let lineCharOffset = 0;

              return (
                <tr key={line.lineNumber} className="group hover:bg-[#1C2333]/20 transition-colors">
                  {/* Line Number Column */}
                  <td className="pr-2 sm:pr-4 text-right text-[10px] sm:text-xs font-mono text-[#8B92A8]/50 select-none w-6 sm:w-8 border-r border-[#1C2333]/50">
                    {line.lineNumber}
                  </td>

                  {/* Code Line Content */}
                  <td className="pl-2.5 sm:pl-4 py-0.5">
                    {/* Render Tokens */}
                    {line.tokens.map((token, tokIdx) => {
                      const tokenChars = token.text.split("");

                      return (
                        <span
                          key={tokIdx}
                          className={`${token.className} ${
                            token.interactiveKey && hoveredProp === token.interactiveKey
                              ? "text-[#9C2B3A] border-b-2 border-[#9C2B3A]"
                              : ""
                          }`}
                          onMouseEnter={() => {
                            if (token.isInteractive && isCompiled) {
                              setHoveredProp(token.interactiveKey || null);
                            }
                          }}
                          onMouseLeave={() => setHoveredProp(null)}
                        >
                          {tokenChars.map((char, cIdx) => {
                            const thisCharPos = lineCharOffset;
                            lineCharOffset++;
                            const globalPos = line.startCharIndex + lineCharOffset;
                            const isTyped = typedCharCount >= globalPos;
                            // CURSOR RULE: Only the ACTIVE LINE renders a cursor, and ONLY at relative cursorTargetPos!
                            const showCursorHere = isLineActive && lineCharOffset === cursorTargetPos;
                            const showInitialCursor = isLineActive && typedCharCount === 0 && lineIdx === 0 && tokIdx === 0 && cIdx === 0;

                            return (
                              <React.Fragment key={cIdx}>
                                {showInitialCursor && (
                                  <span className="inline-block w-[0.45em] h-[1.1em] bg-[#9C2B3A] mr-[1px] align-middle animate-pulse" />
                                )}
                                <span className={isTyped ? "opacity-100" : "opacity-0"}>
                                  {char}
                                </span>
                                {showCursorHere && !showInitialCursor && (
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

                    {/* Render Inline Comment if present */}
                    {line.comment && (
                      <span className="ml-2 sm:ml-6 text-[#8B92A8]/60 italic font-mono text-[10px] sm:text-xs md:text-sm">
                        {("    " + line.comment).split("").map((c, cIdx) => {
                          const thisCharPos = lineCharOffset;
                          lineCharOffset++;
                          const globalPos = line.startCharIndex + lineCharOffset;
                          const isTyped = typedCharCount >= globalPos;
                          const showCursorHere = isLineActive && lineCharOffset === cursorTargetPos;

                          return (
                            <React.Fragment key={cIdx}>
                              <span className={isTyped ? "opacity-100" : "opacity-0"}>
                                {c}
                              </span>
                              {showCursorHere && (
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
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Editor Status Footer Bar */}
      <div className="mt-3 pt-2 border-t border-[#1C2333] flex items-center justify-between text-[10px] font-mono text-[#8B92A8]">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9C2B3A]" />
          <span className="text-[#9C2B3A] uppercase tracking-wider font-semibold">
            {isCompiled ? "SYSTEM::COMPILED" : "COMPILING..."}
          </span>
        </div>
        <div className="hidden sm:flex items-center space-x-4">
          <span>LN 6, COL 18</span>
          <span>SYSTEM ARCHITECTURE</span>
        </div>
      </div>
    </div>
  );
}
