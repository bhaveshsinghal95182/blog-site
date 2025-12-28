'use client';

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "../ui/button";

interface CopyButtonProps {
  textToCopy: string;
}

export function CopyButton({ textToCopy }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
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
  );
}
