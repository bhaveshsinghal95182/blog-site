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
 * Convert a simple code block to the full CodeBlock format
 */
function parseSimpleCodeBlock(simple: SimpleCodeBlock): CodeBlock {
  return {
    id: simple.id,
    language: simple.language,
    filePath: simple.filePath,
    isLast: simple.isLast,
    chunks: parseCodeToChunks(simple.code),
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
  return {
    id: simple.id,
    title: simple.title,
    meta: simple.meta,
    sections: simple.sections.map(parseSimpleSection),
  };
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
