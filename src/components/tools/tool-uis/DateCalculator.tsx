"use client";

import { useState, useMemo } from "react";
import ResultBox from "@/components/tools/tool-uis/shared/ResultBox";
import ResultItem from "@/components/tools/tool-uis/shared/ResultItem";
import type { ToolUiProps } from "@/lib/types";

const monthNames: string[] = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const nowStatic = new Date();
const yearsFuture: number[] = Array.from({ length: 150 }, (_, i) => 1900 + i);
const days: number[] = Array.from({ length: 31 }, (_, i) => i + 1);

interface DateValues {
  month: number;
  day: number;
  year: number;
}

interface DateDiffResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  weeks: number;
  remainingDays: number;
}

type CalcResult = DateDiffResult | { error: string };

export default function DateCalculator({ className }: ToolUiProps) {
  const [startDate, setStartDate] = useState<DateValues>({
    month: 0,
    day: 1,
    year: 2020,
  });
  const [endDate, setEndDate] = useState<DateValues>({
    month: nowStatic.getMonth(),
    day: nowStatic.getDate(),
    year: nowStatic.getFullYear(),
  });

  const result = useMemo<CalcResult | null>(() => {
    const start = new Date(startDate.year, startDate.month, startDate.day);
    const end = new Date(endDate.year, endDate.month, endDate.day);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return null;
    }

    if (start > end) {
      return { error: "Start date must be before end date." };
    }

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let daysDiff = end.getDate() - start.getDate();

    if (daysDiff < 0) {
      months--;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      daysDiff += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const diffMs = end.getTime() - start.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7);

    return {
      years,
      months,
      days: daysDiff,
      totalDays,
      weeks,
      remainingDays: totalDays % 7,
    };
  }, [startDate, endDate]);

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Start Date
          </label>
          <div className="grid grid-cols-3 gap-2">
            <select
              value={startDate.month}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStartDate({ ...startDate, month: parseInt(e.target.value) })}
              className="px-3 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm bg-background"
            >
              {monthNames.map((m, i) => (
                <option key={i} value={i}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={startDate.day}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStartDate({ ...startDate, day: parseInt(e.target.value) })}
              className="px-3 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm bg-background"
            >
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              value={startDate.year}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStartDate({ ...startDate, year: parseInt(e.target.value) })}
              className="px-3 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm bg-background"
            >
              {yearsFuture.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            End Date
          </label>
          <div className="grid grid-cols-3 gap-2">
            <select
              value={endDate.month}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEndDate({ ...endDate, month: parseInt(e.target.value) })}
              className="px-3 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm bg-background"
            >
              {monthNames.map((m, i) => (
                <option key={i} value={i}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={endDate.day}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEndDate({ ...endDate, day: parseInt(e.target.value) })}
              className="px-3 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm bg-background"
            >
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              value={endDate.year}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEndDate({ ...endDate, year: parseInt(e.target.value) })}
              className="px-3 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm bg-background"
            >
              {yearsFuture.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {result && (
        <ResultBox show={true}>
          {"error" in result ? (
            <p className="text-red-500 font-medium">{result.error}</p>
          ) : (
            <div>
              <h3 className="font-semibold text-foreground mb-4 text-lg">Date Difference</h3>
              <div className="mb-4 p-4 bg-primary/10 rounded-xl">
                <p className="text-primary font-semibold text-xl text-center">
                  {result.years} years {result.months} months {result.days} days
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <ResultItem
                  label="Total Days"
                  value={result.totalDays.toLocaleString() + " days"}
                />
                <ResultItem
                  label="Weeks"
                  value={`${result.weeks} weeks ${result.remainingDays} days`}
                />
              </div>
            </div>
          )}
        </ResultBox>
      )}
    </div>
  );
}
