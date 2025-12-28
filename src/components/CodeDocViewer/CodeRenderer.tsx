import { Highlight } from "prism-react-renderer";
import { CodeBlock, CodeChunk } from "@/types/blog";
import { cn } from "@/lib/utils";
import { FileCode, Plus, Minus } from "lucide-react";
import { CopyButton } from "./CopyButton";

interface CodeRendererProps {
  codeBlock: CodeBlock & { isLast?: boolean };
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

function CodeLine({
  chunk,
  line,
  lineNumber,
}: {
  chunk: CodeChunk;
  line: string;
  lineNumber: number;
}) {
  const isAdded = chunk.type === "added";
  const isRemoved = chunk.type === "removed";
  const isContext = chunk.type === "context";

  return (
    <div
      className={cn(
        "flex group",
        isAdded && "bg-diff-added-bg border-l-2 border-diff-added-border",
        isRemoved && "bg-diff-removed-bg border-l-2 border-diff-removed-border",
        isContext && "opacity-60 hover:opacity-90"
      )}
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
                <span key={key} {...getTokenProps({ token })} className="tracking-wide" />
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
}: CodeRendererProps) {
  let lineNumber = 1;

  // Compute the text to copy - use fullModified if available, otherwise build from chunks
  const textToCopy = codeBlock.fullModified 
    ?? codeBlock.chunks
        .filter((chunk) => chunk.type !== 'removed')
        .flatMap((chunk) => chunk.lines)
        .join("\n");

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
            <CopyButton textToCopy={textToCopy} />
          )}
        </div>
      )}

      {/* Code content */}
      <div className="overflow-x-auto code-scrollbar">
        <pre className="py-4 text-sm leading-relaxed">
          <code className="block min-w-max">
            {codeBlock.chunks.map((chunk, chunkIndex) => (
              <div key={chunkIndex}>
                {chunk.lines.map((line, lineIndex) => {
                  const currentLineNumber = lineNumber++;

                  return (
                    <CodeLine
                      key={`${chunkIndex}-${lineIndex}`}
                      chunk={chunk}
                      line={line || " "}
                      lineNumber={currentLineNumber}
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
