export type ChunkType = "context" | "added" | "removed" | "meta";

export interface BlogEntry {
  id: string;
  title: string;
  meta?: { date?: string; tags?: string[];[k: string]: unknown };
  sections: Section[];
}

export interface Section {
  id: string;
  heading?: string;
  content?: string; // mdx/markdown string
  codeBlocks?: CodeBlock[];
}

export interface CodeBlock {
  id: string;
  language: string;
  filePath?: string;
  fullOriginal?: string;
  fullModified?: string;
  chunks: CodeChunk[];
  hunks?: DiffHunk[];
  isLast?: boolean;
}

export interface CodeChunk {
  type: ChunkType;
  startLine?: number;
  lines: string[];
  note?: string;
}

export interface DiffHunk {
  hunkId: string;
  origStart: number;
  origLines: number;
  newStart: number;
  newLines: number;
}
