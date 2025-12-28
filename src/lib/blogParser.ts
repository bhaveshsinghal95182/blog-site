import { BlogEntry, Section, CodeBlock, CodeChunk } from "@/types/blog";

/**
 * Simple blog authoring format types
 */
export interface SimpleBlogEntry {
  id: string;
  title: string;
  meta: {
    date: string;
    tags: string[];
  };
  sections: SimpleSection[];
}

export interface SimpleSection {
  id: string;
  heading: string;
  content: string;
  /** Code blocks using simple diff syntax */
  codeBlocks?: SimpleCodeBlock[];
}

export interface SimpleCodeBlock {
  id: string;
  language: string;
  filePath?: string;
  isLast?: boolean;
  /**
   * Code with diff markers:
   * - Lines starting with `+` are added (green)
   * - Lines starting with `-` are removed (red)
   * - Lines starting with ` ` or no marker are context (dimmed)
   * 
   * Example:
   * ```
   * +#include <vector>
   * +#include <iostream>
   *  
   *  int main() {
   * +    vector<int> nums = {1, 2, 3};
   * -    int arr[3] = {1, 2, 3};
   *      return 0;
   *  }
   * ```
   */
  code: string;
  /**
   * Optional: The complete final file content.
   * If provided, this will be used for copying instead of computing from chunks.
   * Context and removed lines in `code` will be validated against this.
   */
  fullCode?: string;
}

/**
 * Parse a simple code block with diff markers into chunks
 */
function parseCodeToChunks(code: string): CodeChunk[] {
  const lines = code.split('\n');
  const chunks: CodeChunk[] = [];
  
  let currentType: CodeChunk['type'] | null = null;
  let currentLines: string[] = [];

  const flushChunk = () => {
    if (currentLines.length > 0 && currentType) {
      chunks.push({
        type: currentType,
        lines: currentLines,
      });
      currentLines = [];
    }
  };

  for (const line of lines) {
    let type: CodeChunk['type'];
    let content: string;

    if (line.startsWith('+')) {
      type = 'added';
      content = line.slice(1);
    } else if (line.startsWith('-')) {
      type = 'removed';
      content = line.slice(1);
    } else if (line.startsWith(' ')) {
      type = 'context';
      content = line.slice(1);
    } else {
      // No marker = context (for convenience)
      type = 'context';
      content = line;
    }

    // If type changed, flush the current chunk
    if (currentType !== type) {
      flushChunk();
      currentType = type;
    }

    currentLines.push(content);
  }

  // Flush remaining
  flushChunk();

  return chunks;
}

/**
 * Extract the full resulting code from chunks.
 * Includes 'added' and 'context' lines, excludes 'removed' lines.
 */
export function getFullCodeFromChunks(chunks: CodeChunk[]): string {
  const lines: string[] = [];
  
  for (const chunk of chunks) {
    // Skip removed lines - they don't appear in the final file
    if (chunk.type === 'removed') continue;
    
    // Include added and context lines
    lines.push(...chunk.lines);
  }
  
  return lines.join('\n');
}

/**
 * Convert a simple code block to the full CodeBlock format
 */
function parseSimpleCodeBlock(simple: SimpleCodeBlock): CodeBlock {
  return {
    id: simple.id,
    language: simple.language,
    filePath: simple.filePath,
    isLast: simple.isLast,
    chunks: parseCodeToChunks(simple.code),
    // If fullCode is explicitly provided, use it directly
    fullModified: simple.fullCode,
  };
}

/**
 * Convert a simple section to the full Section format
 */
function parseSimpleSection(simple: SimpleSection): Section {
  return {
    id: simple.id,
    heading: simple.heading,
    content: simple.content,
    codeBlocks: simple.codeBlocks?.map(parseSimpleCodeBlock) ?? [],
  };
}

/**
 * Convert a simple blog entry to the full BlogEntry format
 * 
 * Usage:
 * ```ts
 * const simpleBlog: SimpleBlogEntry = {
 *   id: "my-blog",
 *   title: "My Blog",
 *   meta: { date: "2025-01-01", tags: ["tag1"] },
 *   sections: [{
 *     id: "intro",
 *     heading: "Introduction",
 *     content: "## Hello\n\nThis is content.",
 *     codeBlocks: [{
 *       id: "code-1",
 *       language: "cpp",
 *       filePath: "main.cpp",
 *       code: `
 * +#include <iostream>
 * +
 * +int main() {
 *      // existing code
 * +    return 0;
 * +}
 *       `.trim()
 *     }]
 *   }]
 * };
 * 
 * const fullBlog = parseBlogEntry(simpleBlog);
 * ```
 */
export function parseBlogEntry(simple: SimpleBlogEntry): BlogEntry {
  const parsed: BlogEntry = {
    id: simple.id,
    title: simple.title,
    meta: simple.meta,
    sections: simple.sections.map(parseSimpleSection),
  };

  // Check if any code block has explicit fullCode provided
  const explicitFullCode = new Map<string, string>();
  for (const section of simple.sections) {
    for (const codeBlock of section.codeBlocks ?? []) {
      if (codeBlock.fullCode && codeBlock.filePath) {
        explicitFullCode.set(codeBlock.filePath, codeBlock.fullCode);
      }
    }
  }

  // Validate context/removed lines against explicit fullCode (if provided)
  if (explicitFullCode.size > 0) {
    validateChunksAgainstFullCode(parsed, explicitFullCode);
  }

  // Compute fullModified for the last code block of each file
  // by accumulating all chunks across sections
  const fileChunks = new Map<string, CodeChunk[]>();
  
  // Collect all chunks per file
  for (const section of parsed.sections) {
    for (const codeBlock of section.codeBlocks ?? []) {
      const filePath = codeBlock.filePath ?? 'unnamed';
      const existing = fileChunks.get(filePath) ?? [];
      existing.push(...codeBlock.chunks);
      fileChunks.set(filePath, existing);
    }
  }

  // Compute full code for each file (or use explicit fullCode if provided)
  const fullCodeMap = new Map<string, string>();
  for (const [filePath, chunks] of fileChunks) {
    // If explicit fullCode was provided, use it; otherwise compute from chunks
    const explicit = explicitFullCode.get(filePath);
    fullCodeMap.set(filePath, explicit ?? getFullCodeFromChunks(chunks));
  }

  // Attach fullModified to the last code block of each file
  const lastBlockSeen = new Map<string, CodeBlock>();
  for (const section of parsed.sections) {
    for (const codeBlock of section.codeBlocks ?? []) {
      const filePath = codeBlock.filePath ?? 'unnamed';
      lastBlockSeen.set(filePath, codeBlock);
    }
  }
  
  for (const [filePath, codeBlock] of lastBlockSeen) {
    codeBlock.fullModified = fullCodeMap.get(filePath);
  }

  return parsed;
}

/**
 * Validate that context and removed lines in chunks match the provided fullCode.
 * Logs warnings if mismatches are found (doesn't throw to avoid breaking builds).
 */
function validateChunksAgainstFullCode(
  parsed: BlogEntry,
  explicitFullCode: Map<string, string>
): void {
  for (const section of parsed.sections) {
    for (const codeBlock of section.codeBlocks ?? []) {
      const filePath = codeBlock.filePath;
      if (!filePath) continue;
      
      const fullCode = explicitFullCode.get(filePath);
      if (!fullCode) continue;
      
      const fullLines = fullCode.split('\n');
      
      // Check context and removed lines exist in the full code
      for (const chunk of codeBlock.chunks) {
        if (chunk.type === 'added') continue; // Added lines won't be in original
        
        for (const line of chunk.lines) {
          const trimmedLine = line.trim();
          // Skip empty lines
          if (!trimmedLine) continue;
          
          // Check if this line exists somewhere in the full code
          const found = fullLines.some(fullLine => fullLine.trim() === trimmedLine);
          
          if (!found) {
            console.warn(
              `[blogParser] Line mismatch in ${filePath} (${chunk.type}): "${line.slice(0, 50)}..." not found in fullCode`
            );
          }
        }
      }
    }
  }
}

/**
 * Helper to create code with proper indentation in template literals.
 * Strips leading empty line and common indentation.
 * The diff marker (+, -, or space) should be the first non-whitespace character.
 */
export function code(strings: TemplateStringsArray, ...values: unknown[]): string {
  // Combine template literal parts
  let result = strings[0];
  for (let i = 0; i < values.length; i++) {
    result += String(values[i]) + strings[i + 1];
  }

  // Split into lines
  const lines = result.split('\n');
  
  // Remove first line if empty
  if (lines[0].trim() === '') {
    lines.shift();
  }
  
  // Remove last line if empty
  if (lines.length > 0 && lines[lines.length - 1].trim() === '') {
    lines.pop();
  }

  // Find the common leading whitespace (before the diff marker)
  let minIndent = Infinity;
  for (const line of lines) {
    if (line.trim() === '') continue;
    
    // Find leading whitespace
    const leadingWhitespace = line.match(/^(\s*)/)?.[1].length ?? 0;
    minIndent = Math.min(minIndent, leadingWhitespace);
  }

  if (minIndent === Infinity) minIndent = 0;

  // Remove common indentation - the marker should now be at position 0
  const dedented = lines.map(line => {
    if (line.trim() === '') return '';
    return line.slice(minIndent);
  });

  return dedented.join('\n');
}
