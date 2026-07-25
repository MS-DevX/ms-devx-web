"use client";

import { useState, useMemo } from "react";
import type { ToolUiProps } from "@/lib/types";

interface WordCounts {
  words: number;
  characters: number;
  sentences: number;
  paragraphs: number;
  lines: number;
}

export default function WordCounter({ className }: ToolUiProps) {
  const [text, setText] = useState("");
  const [countSpaces, setCountSpaces] = useState(false);

  const counts = useMemo<WordCounts>(() => {
    const t = text.trim();
    const words = t ? t.split(/\s+/).length : 0;
    const characters = countSpaces
      ? text.length
      : text.replace(/ /g, "").length;
    const sentences = t
      ? text
          .split(/[.!?]+/)
          .filter((s) => s.trim().length > 0).length
      : 0;
    const paragraphs = t
      ? text
          .split(/\n\s*\n/)
          .filter((p) => p.trim().length > 0).length
      : 0;
    const lines = text ? text.split(/\n/).length : 0;

    return { words, characters, sentences, paragraphs, lines };
  }, [text, countSpaces]);

  return (
    <div className={className}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-2">
          Enter your text
        </label>
        <textarea
          value={text}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
          placeholder="Start typing or paste your text here..."
          rows={8}
          className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background resize-none"
        />
      </div>

      <div className="flex items-center gap-2 mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={countSpaces}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCountSpaces(e.target.checked)}
            className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
          />
          <span className="text-sm text-muted-foreground">
            Count spaces in character count
          </span>
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-muted rounded-xl p-5 text-center border border-border">
          <div className="text-2xl md:text-3xl font-extrabold text-primary mb-1">
            {counts.words.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            Words
          </div>
        </div>
        <div className="bg-muted rounded-xl p-5 text-center border border-border">
          <div className="text-2xl md:text-3xl font-extrabold text-primary mb-1">
            {counts.characters.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            Characters
          </div>
        </div>
        <div className="bg-muted rounded-xl p-5 text-center border border-border">
          <div className="text-2xl md:text-3xl font-extrabold text-primary mb-1">
            {counts.sentences.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            Sentences
          </div>
        </div>
        <div className="bg-muted rounded-xl p-5 text-center border border-border">
          <div className="text-2xl md:text-3xl font-extrabold text-primary mb-1">
            {counts.paragraphs.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            Paragraphs
          </div>
        </div>
        <div className="bg-muted rounded-xl p-5 text-center border border-border col-span-2 md:col-span-1">
          <div className="text-2xl md:text-3xl font-extrabold text-primary mb-1">
            {counts.lines.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            Lines
          </div>
        </div>
      </div>
    </div>
  );
}
