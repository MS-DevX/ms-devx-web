"use client";
import { useState, useMemo } from "react";
import ResultBox from "@/components/tools/tool-uis/shared/ResultBox";

interface WorkResult {
  shift1: { start: string; end: string };
  shift2: { start: string; end: string } | null;
  breakMin: number;
  hours: number;
  minutes: number;
  seconds: number;
  weeklyHours: number;
  daysPerWeek: number;
}

export default function WorkHoursCalculator() {
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [breakTime, setBreakTime] = useState("30");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [startTime2, setStartTime2] = useState("");
  const [endTime2, setEndTime2] = useState("");
  const [daysPerWeek, setDaysPerWeek] = useState("5");

  function formatTime(timeStr: string): string {
    if (!timeStr) return "";
    const [hourStr, minute] = timeStr.split(":");
    let hour = parseInt(hourStr);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  }

  function getDiff(s: string, e: string): number {
    const sDate = new Date(`1970-01-01T${s}:00`);
    const eDate = new Date(`1970-01-01T${e}:00`);
    if (eDate < sDate) eDate.setDate(eDate.getDate() + 1);
    return eDate.getTime() - sDate.getTime();
  }

  const result = useMemo<WorkResult | null>(() => {
    if (!startTime || !endTime) {
      return null;
    }

    const breakMin = parseInt(breakTime) || 0;
    const daysWeek = parseInt(daysPerWeek) || 0;

    let totalMs = getDiff(startTime, endTime);

    if (startTime2 && endTime2) {
      totalMs += getDiff(startTime2, endTime2);
    }

    totalMs -= breakMin * 60 * 1000;

    if (totalMs < 0) {
      return { error: "Break time cannot exceed total work time." } as unknown as WorkResult;
    }

    const totalSeconds = Math.floor(totalMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const weeklyHours = daysWeek ? hours * daysWeek : 0;

    return {
      shift1: { start: startTime, end: endTime },
      shift2: startTime2 && endTime2 ? { start: startTime2, end: endTime2 } : null,
      breakMin,
      hours,
      minutes,
      seconds,
      weeklyHours,
      daysPerWeek: daysWeek,
    };
  }, [startTime, endTime, breakTime, startTime2, endTime2, daysPerWeek]);

  const hasError = result && "error" in result;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Shift Start
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Shift End
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          Break (minutes)
        </label>
        <input
          type="number"
          value={breakTime}
          onChange={(e) => setBreakTime(e.target.value)}
          placeholder="e.g., 30"
          className="w-full md:w-48 px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background"
        />
      </div>

      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-sm text-primary hover:underline mb-6 flex items-center gap-1"
      >
        {showAdvanced ? "▼" : "▶"} Add Second Shift & Weekly Calculation
      </button>

      {showAdvanced && (
        <div className="bg-muted rounded-xl p-6 mb-6 border border-border">
          <h4 className="font-semibold text-foreground mb-4">Second Shift (Optional)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Start
              </label>
              <input
                type="time"
                value={startTime2}
                onChange={(e) => setStartTime2(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                End
              </label>
              <input
                type="time"
                value={endTime2}
                onChange={(e) => setEndTime2(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Days Per Week (for weekly projection)
            </label>
            <input
              type="number"
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(e.target.value)}
              placeholder="e.g., 5"
              className="w-full md:w-48 px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background"
            />
          </div>
        </div>
      )}

      {result && (
        <ResultBox show={true}>
          {hasError ? (
            <p className="text-red-500 font-medium">{(result as unknown as { error: string }).error}</p>
          ) : (
            <div>
              <h3 className="font-semibold text-foreground mb-4 text-lg">
                🕒 Work Summary
              </h3>
              <div className="mb-4 text-muted-foreground text-sm space-y-1">
                <p>Shift 1: {formatTime(result.shift1.start)} - {formatTime(result.shift1.end)}</p>
                {result.shift2 && (
                  <p>Shift 2: {formatTime(result.shift2.start)} - {formatTime(result.shift2.end)}</p>
                )}
                <p>⏸ Break: {result.breakMin} minutes</p>
              </div>

              <div className="p-5 bg-primary/10 rounded-xl text-center mb-4">
                <h4 className="text-sm text-primary font-semibold mb-2">Total Daily Work</h4>
                <div className="text-2xl font-extrabold text-primary">
                  {result.hours}h {result.minutes}m {result.seconds}s
                </div>
              </div>

              {result.daysPerWeek > 0 && (
                <div className="p-5 bg-muted rounded-xl text-center">
                  <h4 className="text-sm text-muted-foreground font-semibold mb-2">Weekly Work ({result.daysPerWeek} days)</h4>
                  <div className="text-2xl font-extrabold text-foreground">
                    {result.weeklyHours} hours
                  </div>
                </div>
              )}
            </div>
          )}
        </ResultBox>
      )}
    </div>
  );
}
