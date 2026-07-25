"use client";

import { useState, useMemo } from "react";
import ResultBox from "@/components/tools/tool-uis/shared/ResultBox";
import type { ToolUiProps } from "@/lib/types";

interface TimeDiffResult {
  totalHours: number;
  minutes: number;
  seconds: number;
  totalMinutes: number;
  totalSeconds: number;
}

type CalcResult = TimeDiffResult | { error: string };

export default function TimeCalculator({ className }: ToolUiProps) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const setNow = () => {
    const now = new Date();
    setStartTime(now.toISOString().slice(0, 16));
  };

  const addOneHour = () => {
    if (!startTime) return;
    const start = new Date(startTime);
    start.setHours(start.getHours() + 1);
    setEndTime(start.toISOString().slice(0, 16));
  };

  const result = useMemo<CalcResult | null>(() => {
    if (!startTime || !endTime) {
      return null;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return null;
    }

    if (start >= end) {
      return { error: "Start time must be before end time." };
    }

    const diffMs = end.getTime() - start.getTime();
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);

    const seconds = totalSeconds % 60;
    const minutes = totalMinutes % 60;

    return {
      totalHours,
      minutes,
      seconds,
      totalMinutes,
      totalSeconds,
    };
  }, [startTime, endTime]);

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Start Time
          </label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartTime(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            End Time
          </label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndTime(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={setNow}
          className="px-5 py-2.5 rounded-lg border-2 border-border bg-background text-foreground font-medium hover:border-primary hover:text-primary transition-all"
        >
          Set Start to Now
        </button>
        <button
          onClick={addOneHour}
          disabled={!startTime}
          className="px-5 py-2.5 rounded-lg border-2 border-border bg-background text-foreground font-medium hover:border-primary hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          +1 Hour to End
        </button>
      </div>

      {result && (
        <ResultBox show={true}>
          {"error" in result ? (
            <p className="text-red-500 font-medium">{result.error}</p>
          ) : (
            <div>
              <h3 className="font-semibold text-foreground mb-4 text-lg text-center">
                Time Difference
              </h3>
              <div className="text-center mb-6 p-4 bg-muted rounded-xl">
                <span className="text-2xl font-extrabold text-primary">
                  {result.totalHours}h {result.minutes}m {result.seconds}s
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <div className="flex justify-between items-center py-2.5 border-b border-border">
                  <span className="text-muted-foreground text-sm">Total Minutes</span>
                  <span className="font-semibold text-foreground">
                    {result.totalMinutes.toLocaleString()} min
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-border">
                  <span className="text-muted-foreground text-sm">Total Seconds</span>
                  <span className="font-semibold text-foreground">
                    {result.totalSeconds.toLocaleString()} sec
                  </span>
                </div>
              </div>
            </div>
          )}
        </ResultBox>
      )}
    </div>
  );
}
