"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import type { ToolUiProps } from "@/lib/types";

interface EditResult {
  original: number;
  edited: number;
  difference: number;
  changePercent: number;
}

function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export default function EditCounter({ className }: ToolUiProps) {
  const [originalText, setOriginalText] = useState("");
  const [editedText, setEditedText] = useState("");

  const result = useMemo<EditResult>(() => {
    const origCount = countWords(originalText);
    const editCount = countWords(editedText);
    const diff = editCount - origCount;

    let percent: number;
    if (origCount > 0) {
      percent = (diff / origCount) * 100;
    } else if (editCount > 0) {
      percent = 100;
    } else {
      percent = 0;
    }

    return {
      original: origCount,
      edited: editCount,
      difference: diff,
      changePercent: percent,
    };
  }, [originalText, editedText]);

  const clearAll = () => {
    setOriginalText("");
    setEditedText("");
  };

  const getDiffClass = (diff: number): string => {
    if (diff > 0) return "text-green-600";
    if (diff < 0) return "text-red-600";
    return "text-foreground";
  };

  const formatDiff = (diff: number): string => {
    return diff > 0 ? `+${diff}` : `${diff}`;
  };

  const formatPercent = (diff: number, pct: number): string => {
    const prefix = diff > 0 ? "+" : "";
    return `${prefix}${pct.toFixed(1)}%`;
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Original Text
          </label>
          <textarea
            value={originalText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setOriginalText(e.target.value)}
            placeholder="Paste your original text here..."
            rows={10}
            className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Edited Text
          </label>
          <textarea
            value={editedText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditedText(e.target.value)}
            placeholder="Paste your edited text here..."
            rows={10}
            className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background resize-none"
          />
        </div>
      </div>

      {result && (
        <div className="bg-background rounded-2xl border border-border p-6 md:p-8">
          <h3 className="font-semibold text-foreground mb-6 text-lg text-center">
            Edit Comparison
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-muted rounded-xl p-5 text-center border border-border">
              <div className="text-sm text-muted-foreground mb-1">Original</div>
              <div className="text-2xl font-extrabold text-foreground">
                {result.original.toLocaleString()}
              </div>
            </div>
            <div className="bg-muted rounded-xl p-5 text-center border border-border">
              <div className="text-sm text-muted-foreground mb-1">Edited</div>
              <div className="text-2xl font-extrabold text-foreground">
                {result.edited.toLocaleString()}
              </div>
            </div>
            <div className="bg-muted rounded-xl p-5 text-center border border-border">
              <div className="text-sm text-muted-foreground mb-1">Difference</div>
              <div
                className={`text-2xl font-extrabold ${getDiffClass(
                  result.difference
                )}`}
              >
                {formatDiff(result.difference)}
              </div>
            </div>
            <div className="bg-muted rounded-xl p-5 text-center border border-border">
              <div className="text-sm text-muted-foreground mb-1">% Change</div>
              <div
                className={`text-2xl font-extrabold ${getDiffClass(
                  result.difference
                )}`}
              >
                {formatPercent(result.difference, result.changePercent)}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={clearAll}>
          Clear All
        </Button>
      </div>
    </div>
  );
}
