"use client";

import { useState, useMemo } from "react";
import type { ToolUiProps } from "@/lib/types";

interface SpeedOption {
  value: number;
  label: string;
}

const speedOptions: SpeedOption[] = [
  { value: 100, label: "100 wpm (Slow)" },
  { value: 150, label: "150 wpm (Below Average)" },
  { value: 200, label: "200 wpm (Average)" },
  { value: 250, label: "250 wpm (Fast)" },
  { value: 300, label: "300 wpm (Very Fast)" },
];

interface ReadingResult {
  timeDisplay: string;
  wordDisplay: string;
  speedDisplay: string;
  readingTimeSec: number;
}

export default function ReadingTimeEstimator({ className }: ToolUiProps) {
  const [inputText, setInputText] = useState("");
  const [speed, setSpeed] = useState(200);

  const result = useMemo<ReadingResult>(() => {
    const words = inputText.trim()
      ? inputText.trim().split(/\s+/).length
      : 0;
    const chars = inputText.length;
    const minutes = words / speed;
    const totalSec = Math.round(minutes * 60);

    let timeDisplay: string;
    if (totalSec < 60) {
      timeDisplay = `${totalSec} sec`;
    } else {
      const m = Math.floor(totalSec / 60);
      const s = totalSec % 60;
      timeDisplay = `${m} min${s > 0 ? ` ${s} sec` : ""}`;
    }

    return {
      timeDisplay,
      wordDisplay: `${words.toLocaleString()} words • ${chars.toLocaleString()} characters`,
      speedDisplay: `${speed} wpm`,
      readingTimeSec: totalSec,
    };
  }, [inputText, speed]);

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">
            Paste your text
          </label>
          <textarea
            value={inputText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputText(e.target.value)}
            placeholder="Paste or type your text here to estimate reading time..."
            rows={10}
            className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Reading Speed
          </label>
          <select
            value={speed}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSpeed(parseInt(e.target.value))}
            className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background"
          >
            {speedOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-background rounded-2xl border border-border p-6 md:p-8">
        <h3 className="font-semibold text-foreground mb-6 text-lg text-center">
          Reading Time Estimate
        </h3>

        <div className="text-center mb-8">
          <div className="text-5xl md:text-6xl font-extrabold text-primary mb-2">
            {result.timeDisplay}
          </div>
          {result.readingTimeSec > 0 && (
            <div className="text-sm text-muted-foreground">
              or {result.readingTimeSec} seconds total
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted rounded-xl p-5 text-center border border-border">
            <div className="text-sm text-muted-foreground mb-1">Words & Characters</div>
            <div className="text-lg font-semibold text-foreground">
              {result.wordDisplay}
            </div>
          </div>
          <div className="bg-muted rounded-xl p-5 text-center border border-border">
            <div className="text-sm text-muted-foreground mb-1">Reading Speed</div>
            <div className="text-lg font-semibold text-foreground">
              {result.speedDisplay}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
