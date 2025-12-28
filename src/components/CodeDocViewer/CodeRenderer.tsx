'use client';
import { Highlight } from "prism-react-renderer";
import { CodeBlock, CodeChunk } from "@/types/blog";
import { cn } from "@/lib/utils";
import { FileCode, Copy, Check, Plus, Minus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";

interface CodeRendererProps {
  codeBlock: CodeBlock & { isLast?: boolean };
  /** Animation delay per line in ms */
  lineAnimationDelay?: number;
}

const gruvboxDark = {
  plain: {
    color: "#ebdbb2",
    backgroundColor: "#282828",
  },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: { color: "#928374", fontStyle: "italic" as const },
    },
    {
      types: ["namespace"],
      style: { opacity: 0.7 },
    },
    {
      types: ["string", "attr-value"],
      style: { color: "#b8bb26" },
    },
    {
      types: ["punctuation", "operator"],
      style: { color: "#8ec07c" },
    },
    {
      types: [
        "entity",
        "url",
        "symbol",
        "number",
        "boolean",
        "variable",
        "constant",
        "property",
        "regex",
        "inserted",
      ],
      style: { color: "#d3869b" },
    },
    {
      types: ["atrule", "keyword", "attr-name", "selector"],
      style: { color: "#fb4934" },
    },
    {
      types: ["function", "deleted", "tag"],
      style: { color: "#b8bb26" },
    },
    {
      types: ["function-variable"],
      style: { color: "#83a598" },
    },
    {
      types: ["tag", "selector", "keyword"],
      style: { color: "#fb4934" },
    },
    {
      types: ["builtin", "class-name"],
      style: { color: "#fabd2f" },
    },
  ],
};

function AnimatedLine({
  chunk,
  line,
  lineNumber,
  delay,
}: {
  chunk: CodeChunk;
  line: string;
  lineNumber: number;
  delay: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (lineRef.current) {
      observer.observe(lineRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const isAdded = chunk.type === "added";
  const isRemoved = chunk.type === "removed";
  const isContext = chunk.type === "context";

  return (
    <div
      ref={lineRef}
      className={cn(
        "flex group transition-all duration-500 ease-out",
        isAdded && "bg-diff-added-bg border-l-2 border-diff-added-border",
        isRemoved &&
          "bg-diff-removed-bg border-l-2 border-diff-removed-border line-through",
        isContext && "opacity-50 hover:opacity-80",
        isAdded && !isVisible && "opacity-0 translate-x-8",
        isAdded && isVisible && "opacity-100 translate-x-0"
      )}
      style={{
        transitionDelay: isAdded ? `${delay}ms` : "0ms",
      }}
    >
      {/* Line number */}
      <span className="w-12 shrink-0 text-right pr-4 text-line-number select-none text-sm">
        {lineNumber}
      </span>

      {/* Diff marker */}
      <span className="w-5 shrink-0 text-center select-none">
        {isAdded && <Plus className="w-3 h-3 inline text-diff-added-border" />}
        {isRemoved && (
          <Minus className="w-3 h-3 inline text-diff-removed-border" />
        )}
      </span>

      {/* Code content */}
      <span className="flex-1 pr-4">
        <Highlight theme={gruvboxDark} code={line} language="cpp">
          {({ style, tokens, getTokenProps }) => (
            <span style={{ ...style, background: "transparent" }}>
              {tokens[0]?.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </span>
          )}
        </Highlight>
      </span>
    </div>
  );
}

export function CodeRenderer({
  codeBlock,
  lineAnimationDelay = 40,
}: CodeRendererProps) {
  const [copied, setCopied] = useState(false);
  let lineNumber = 1;
  let addedLineIndex = 0;

  const handleCopy = async () => {
    const allCode = codeBlock.chunks.flatMap((chunk) => chunk.lines).join("\n");
    await navigator.clipboard.writeText(allCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const showCopyButton = codeBlock.isLast;

  return (
    <div className="rounded-lg overflow-hidden bg-code-bg border border-code-fg/10 shadow-lg">
      {/* File header */}
      {codeBlock.filePath && (
        <div className="flex items-center justify-between px-4 py-2 bg-code-bg border-b border-code-fg/10">
          <div className="flex items-center gap-2 text-code-fg/70 text-sm">
            <FileCode className="w-4 h-4" />
            <span className="font-mono">{codeBlock.filePath}</span>
          </div>
          {showCopyButton && (
            <Button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1 rounded bg-code-fg/10 hover:bg-code-fg/20 text-code-fg/70 hover:text-code-fg transition-colors text-sm"
              title="Copy entire file"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-diff-added-border" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy file</span>
                </>
              )}
            </Button>
          )}
        </div>
      )}

      {/* Code content */}
      <div className="overflow-x-auto code-scrollbar">
        <pre className="py-4 text-sm leading-relaxed">
          <code>
            {codeBlock.chunks.map((chunk, chunkIndex) => (
              <div key={chunkIndex}>
                {chunk.lines.map((line, lineIndex) => {
                  const currentLineNumber = lineNumber++;
                  const isAdded = chunk.type === "added";
                  const currentDelay = isAdded
                    ? addedLineIndex++ * lineAnimationDelay
                    : 0;

                  return (
                    <AnimatedLine
                      key={`${chunkIndex}-${lineIndex}`}
                      chunk={chunk}
                      line={line || " "}
                      lineNumber={currentLineNumber}
                      delay={currentDelay}
                    />
                  );
                })}
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
