"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import type { ToolUiProps } from "@/lib/types";

interface TextCounts {
  words: number;
  chars: number;
  sentences: number;
}

export default function CapitalizeText({ className }: ToolUiProps) {
  const [inputText, setInputText] = useState("");
  const [copied, setCopied] = useState(false);

  const resultText = useMemo(() => {
    return inputText.replace(
      /(^|\.\s*|!\s*|\?\s*)(\w)/g,
      (match) => match.toUpperCase()
    );
  }, [inputText]);

  const counts = useMemo<TextCounts>(() => {
    const words = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
    const chars = inputText.length;
    const sentences = inputText
      ? inputText.split(/[.!?]+/).filter((s) => s.trim().length > 0).length
      : 0;
    return { words, chars, sentences };
  }, [inputText]);

  const copyResult = async () => {
    if (!resultText) return;
    try {
      await navigator.clipboard.writeText(resultText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silent
    }
  };

  const clearAll = () => {
    setInputText("");
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Input Text
          </label>
          <textarea
            value={inputText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputText(e.target.value)}
            placeholder="Enter your text here... It will be automatically capitalized."
            rows={8}
            className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Result (Capitalized)
          </label>
          <textarea
            value={resultText}
            readOnly
            rows={8}
            className="w-full px-4 py-3 rounded-lg border border-border bg-muted text-foreground resize-none cursor-default"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-muted rounded-xl p-5 text-center border border-border">
          <div className="text-xl font-extrabold text-primary mb-1">
            {counts.words.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            Words
          </div>
        </div>
        <div className="bg-muted rounded-xl p-5 text-center border border-border">
          <div className="text-xl font-extrabold text-primary mb-1">
            {counts.chars.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            Characters
          </div>
        </div>
        <div className="bg-muted rounded-xl p-5 text-center border border-border">
          <div className="text-xl font-extrabold text-primary mb-1">
            {counts.sentences.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            Sentences
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={copyResult}>
          {copied ? "✓ Copied!" : "Copy"}
        </Button>
        <Button variant="secondary" onClick={clearAll}>
          Clear All
        </Button>
      </div>
    </div>
  );
}
