"use client";
import { useState, useEffect, useMemo } from "react";

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const monthNamesFull = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface DateParts {
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
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  businessDays: number;
  weekendDays: number;
  error: null;
}

interface DateDiffError {
  error: string;
}

type DateDiff = DateDiffResult | DateDiffError;

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function countBusinessDays(startDate: Date, endDate: Date): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  if (start > end) return 0;

  let count = 0;
  const current = new Date(start);

  while (current <= end) {
    if (!isWeekend(current)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
}

function calculateDateDifference(startDate: Date, endDate: Date, _includeTime = false): DateDiff {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) {
    return { error: "Start date must be before end date." };
  }

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const diffMs = end.getTime() - start.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(totalDays / 7);
  const remainingDays = totalDays % 7;

  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalSeconds = Math.floor(diffMs / 1000);

  const businessDays = countBusinessDays(start, end);
  const weekendDays = totalDays + 1 - businessDays;

  return {
    years,
    months,
    days,
    totalDays,
    weeks,
    remainingDays,
    totalHours,
    totalMinutes,
    totalSeconds,
    businessDays,
    weekendDays,
    error: null,
  };
}

function generateHumanReadableSummary(startDate: Date, endDate: Date, result: DateDiffResult): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const parts: string[] = [];

  if (result.years > 0) {
    parts.push(`${result.years} ${result.years === 1 ? "year" : "years"}`);
  }
  if (result.months > 0) {
    parts.push(`${result.months} ${result.months === 1 ? "month" : "months"}`);
  }
  if (result.days > 0) {
    parts.push(`${result.days} ${result.days === 1 ? "day" : "days"}`);
  }

  let period = "";
  if (parts.length > 1) {
    period = parts.slice(0, -1).join(", ") + ", and " + parts[parts.length - 1];
  } else if (parts.length === 1) {
    period = parts[0];
  } else {
    period = "less than a day";
  }

  const startStr = `${monthNamesFull[start.getMonth()]} ${start.getDate()}, ${start.getFullYear()}`;
  const endStr = `${monthNamesFull[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`;

  let summary = `From ${startStr} to ${endStr} is a period of ${period}.`;

  if (result.totalDays === 0) {
    summary = `${startStr} and ${endStr} are the same day.`;
  } else if (result.totalDays === 1) {
    summary = `From ${startStr} to ${endStr} is exactly 1 day.`;
  }

  return summary;
}

export default function DateDifferenceCalculator() {
  const now = new Date();

  const [startDate, setStartDate] = useState<DateParts>({
    month: 0,
    day: 1,
    year: 2024,
  });

  const [endDate, setEndDate] = useState<DateParts>({
    month: now.getMonth(),
    day: now.getDate(),
    year: now.getFullYear(),
  });

  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");
  const [includeTime, setIncludeTime] = useState(false);
  const [showBusinessDays, setShowBusinessDays] = useState(false);
  const futureYears = Array.from({ length: 150 }, (_, i) => 1900 + i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const startDaysInMonth = getDaysInMonth(startDate.year, startDate.month);
  const endDaysInMonth = getDaysInMonth(endDate.year, endDate.month);

  useEffect(() => {
    if (startDate.day > startDaysInMonth) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStartDate((prev) => ({ ...prev, day: startDaysInMonth }));
    }
  }, [startDate.month, startDate.year, startDaysInMonth, startDate.day]);

  useEffect(() => {
    if (endDate.day > endDaysInMonth) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEndDate((prev) => ({ ...prev, day: endDaysInMonth }));
    }
  }, [endDate.month, endDate.year, endDaysInMonth, endDate.day]);

  const result = useMemo(() => {
    const start = new Date(startDate.year, startDate.month, startDate.day);
    const end = new Date(endDate.year, endDate.month, endDate.day);

    if (includeTime) {
      const [startH, startM] = startTime.split(":").map(Number);
      const [endH, endM] = endTime.split(":").map(Number);
      start.setHours(startH, startM, 0, 0);
      end.setHours(endH, endM, 0, 0);
    }

    return calculateDateDifference(start, end, includeTime);
  }, [startDate, endDate, startTime, endTime, includeTime]);

  const swapDates = () => {
    const tempDate = { ...startDate };
    const tempTime = startTime;
    setStartDate({ ...endDate });
    setEndDate(tempDate);
    setStartTime(endTime);
    setEndTime(tempTime);
  };

  const setToToday = (setter: React.Dispatch<React.SetStateAction<DateParts>>) => {
    setter({
      month: now.getMonth(),
      day: now.getDate(),
      year: now.getFullYear(),
    });
  };

  const formatDateDisplay = (dateObj: DateParts) => {
    return `${monthNamesFull[dateObj.month]} ${dateObj.day}, ${dateObj.year}`;
  };

  return (
    <div>
      {/* Input Section */}
      <div className="bg-background rounded-2xl border border-border shadow-card p-6 md:p-8 mb-6">
        <h3 className="font-semibold text-foreground text-lg mb-6 text-center">
          📅 Calculate Date Difference
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Start Date */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-foreground">
                Start Date
              </label>
              <button
                onClick={() => setToToday(setStartDate)}
                className="text-xs text-primary hover:underline font-medium"
              >
                Today
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <select
                value={startDate.month}
                onChange={(e) => setStartDate({ ...startDate, month: parseInt(e.target.value) })}
                className="px-3 py-3 rounded-xl border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm bg-background font-medium"
              >
                {monthNames.map((m, i) => (
                  <option key={i} value={i}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={startDate.day}
                onChange={(e) => setStartDate({ ...startDate, day: parseInt(e.target.value) })}
                className="px-3 py-3 rounded-xl border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm bg-background font-medium"
              >
                {days.slice(0, startDaysInMonth).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <select
                value={startDate.year}
                onChange={(e) => setStartDate({ ...startDate, year: parseInt(e.target.value) })}
                className="px-3 py-3 rounded-xl border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm bg-background font-medium"
              >
                {futureYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {includeTime && (
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm bg-background"
                />
              </div>
            )}
          </div>

          {/* End Date */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-foreground">
                End Date
              </label>
              <button
                onClick={() => setToToday(setEndDate)}
                className="text-xs text-primary hover:underline font-medium"
              >
                Today
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <select
                value={endDate.month}
                onChange={(e) => setEndDate({ ...endDate, month: parseInt(e.target.value) })}
                className="px-3 py-3 rounded-xl border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm bg-background font-medium"
              >
                {monthNames.map((m, i) => (
                  <option key={i} value={i}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={endDate.day}
                onChange={(e) => setEndDate({ ...endDate, day: parseInt(e.target.value) })}
                className="px-3 py-3 rounded-xl border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm bg-background font-medium"
              >
                {days.slice(0, endDaysInMonth).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <select
                value={endDate.year}
                onChange={(e) => setEndDate({ ...endDate, year: parseInt(e.target.value) })}
                className="px-3 py-3 rounded-xl border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm bg-background font-medium"
              >
                {futureYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {includeTime && (
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm bg-background"
                />
              </div>
            )}
          </div>
        </div>

        {/* Options Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeTime}
                onChange={(e) => setIncludeTime(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-foreground font-medium">Include Time</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showBusinessDays}
                onChange={(e) => setShowBusinessDays(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-foreground font-medium">Show Business Days</span>
            </label>
          </div>

          <button
            onClick={swapDates}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-gray-200 rounded-lg text-sm font-medium text-foreground transition-colors"
          >
            🔄 Swap Dates
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div>
          {"error" in result && result.error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center mb-6">
              <p className="text-red-600 font-semibold text-lg">⚠️ {result.error}</p>
              <p className="text-red-500 text-sm mt-1">Try swapping dates or adjusting your selection.</p>
            </div>
          ) : (
            <>
              {/* Human Readable Summary */}
              <div className="bg-primary/10 border-2 border-primary rounded-xl p-5 md:p-6 mb-6 text-center">
                <p className="text-foreground font-medium text-lg md:text-xl leading-relaxed">
                  {(() => {
                      const start = new Date(startDate.year, startDate.month, startDate.day);
                      const end = new Date(endDate.year, endDate.month, endDate.day);
                      if (includeTime) {
                        const [startH, startM] = startTime.split(":").map(Number);
                        const [endH, endM] = endTime.split(":").map(Number);
                        start.setHours(startH, startM, 0, 0);
                        end.setHours(endH, endM, 0, 0);
                      }
                      return generateHumanReadableSummary(start, end, result as DateDiffResult);
                    })()}
                </p>
              </div>

              {/* Primary Difference Card */}
              <div className="bg-background rounded-2xl border border-border shadow-card p-6 md:p-8 mb-6">
                <h4 className="font-semibold text-foreground text-base mb-5 text-center">
                  📊 Exact Duration
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-muted rounded-xl border border-border">
                    <div className="text-3xl md:text-4xl font-extrabold text-primary">
                      {(result as DateDiffResult).years}
                    </div>
                    <div className="text-sm text-muted-foreground font-semibold mt-1 uppercase tracking-wide">
                      Years
                    </div>
                  </div>

                  <div className="text-center p-4 bg-muted rounded-xl border border-border">
                    <div className="text-3xl md:text-4xl font-extrabold text-primary">
                      {(result as DateDiffResult).months}
                    </div>
                    <div className="text-sm text-muted-foreground font-semibold mt-1 uppercase tracking-wide">
                      Months
                    </div>
                  </div>

                  <div className="text-center p-4 bg-muted rounded-xl border border-border">
                    <div className="text-3xl md:text-4xl font-extrabold text-primary">
                      {(result as DateDiffResult).weeks}
                    </div>
                    <div className="text-sm text-muted-foreground font-semibold mt-1 uppercase tracking-wide">
                      Weeks
                    </div>
                  </div>

                  <div className="text-center p-4 bg-muted rounded-xl border border-border">
                    <div className="text-3xl md:text-4xl font-extrabold text-primary">
                      {(result as DateDiffResult).remainingDays}
                    </div>
                    <div className="text-sm text-muted-foreground font-semibold mt-1 uppercase tracking-wide">
                      Extra Days
                    </div>
                  </div>
                </div>

                <div className="text-center p-4 bg-background rounded-xl border-2 border-primary mb-6">
                  <p className="text-xl md:text-2xl font-bold text-primary">
                    {(result as DateDiffResult).years} years, {(result as DateDiffResult).months} months, {(result as DateDiffResult).days} days
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    or {(result as DateDiffResult).weeks} weeks and {(result as DateDiffResult).remainingDays} days
                  </p>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-background rounded-xl border border-border shadow-card p-5">
                  <h4 className="font-semibold text-foreground mb-4 text-center">📅 Total Breakdown</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2.5 border-b border-border">
                      <span className="text-sm text-muted-foreground font-medium">Total Days</span>
                      <span className="text-lg font-bold text-primary">
                        {(result as DateDiffResult).totalDays.toLocaleString()} days
                      </span>
                    </div>

                    {includeTime && (
                      <>
                        <div className="flex justify-between items-center py-2.5 border-b border-border">
                          <span className="text-sm text-muted-foreground font-medium">Total Hours</span>
                          <span className="text-lg font-bold text-primary">
                            {(result as DateDiffResult).totalHours.toLocaleString()} hours
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2.5 border-b border-border">
                          <span className="text-sm text-muted-foreground font-medium">Total Minutes</span>
                          <span className="text-lg font-bold text-primary">
                            {(result as DateDiffResult).totalMinutes.toLocaleString()} minutes
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2.5">
                          <span className="text-sm text-muted-foreground font-medium">Total Seconds</span>
                          <span className="text-lg font-bold text-primary">
                            {(result as DateDiffResult).totalSeconds.toLocaleString()} seconds
                          </span>
                        </div>
                      </>
                    )}

                    {!includeTime && (
                      <>
                        <div className="flex justify-between items-center py-2.5 border-b border-border">
                          <span className="text-sm text-muted-foreground font-medium">Total Hours</span>
                          <span className="text-lg font-bold text-primary">
                            {((result as DateDiffResult).totalDays * 24).toLocaleString()} hours
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2.5">
                          <span className="text-sm text-muted-foreground font-medium">Total Minutes</span>
                          <span className="text-lg font-bold text-primary">
                            {((result as DateDiffResult).totalDays * 24 * 60).toLocaleString()} minutes
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Business Days Card */}
                {showBusinessDays && (
                  <div className="bg-background rounded-xl border border-border shadow-card p-5">
                    <h4 className="font-semibold text-foreground mb-4 text-center">💼 Business Days</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2.5 border-b border-border">
                        <span className="text-sm text-muted-foreground font-medium">Business Days (Mon-Fri)</span>
                        <span className="text-lg font-bold text-green-600">
                          {(result as DateDiffResult).businessDays.toLocaleString()} days
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2.5 border-b border-border">
                        <span className="text-sm text-muted-foreground font-medium">Weekend Days (Sat-Sun)</span>
                        <span className="text-lg font-bold text-orange-600">
                          {Math.max(0, (result as DateDiffResult).weekendDays).toLocaleString()} days
                        </span>
                      </div>

                      <div className="mt-4 p-4 bg-muted rounded-xl">
                        <p className="text-xs text-muted-foreground text-center leading-relaxed">
                          <strong>Note:</strong> Business days calculation excludes Saturdays and Sundays.
                          Does not include public holidays.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!showBusinessDays && (
                  <div className="bg-background rounded-xl border border-border shadow-card p-5">
                    <h4 className="font-semibold text-foreground mb-4 text-center">📋 Date Range Info</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2.5 border-b border-border">
                        <span className="text-sm text-muted-foreground font-medium">From</span>
                        <span className="text-sm font-bold text-foreground">
                          {formatDateDisplay(startDate)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2.5 border-b border-border">
                        <span className="text-sm text-muted-foreground font-medium">To</span>
                        <span className="text-sm font-bold text-foreground">
                          {formatDateDisplay(endDate)}
                        </span>
                      </div>

                      {includeTime && (
                        <>
                          <div className="flex justify-between items-center py-2.5 border-b border-border">
                            <span className="text-sm text-muted-foreground font-medium">Start Time</span>
                            <span className="text-sm font-bold text-foreground">{startTime}</span>
                          </div>
                          <div className="flex justify-between items-center py-2.5">
                            <span className="text-sm text-muted-foreground font-medium">End Time</span>
                            <span className="text-sm font-bold text-foreground">{endTime}</span>
                          </div>
                        </>
                      )}

                      {!includeTime && (
                        <div className="flex justify-between items-center py-2.5">
                          <span className="text-sm text-muted-foreground font-medium">Days Span</span>
                          <span className="text-sm font-bold text-foreground">
                            {(result as DateDiffResult).totalDays + 1} calendar days
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 bg-muted rounded-xl p-5 border border-border">
        <h3 className="font-semibold text-foreground mb-3">💡 About This Tool</h3>
        <ul className="text-sm text-muted-foreground space-y-1.5">
          <li>✓ <strong>Exact Date Math</strong> — Uses precise month/day/year calculation accounting for different month lengths</li>
          <li>✓ <strong>Time Support</strong> — Toggle &quot;Include Time&quot; for hour/minute precision</li>
          <li>✓ <strong>Business Days</strong> — Toggle to see working days (Mon-Fri) vs weekend days</li>
          <li>✓ <strong>Auto-calculates</strong> — Results update instantly as you change dates</li>
          <li>✓ <strong>Swap Dates</strong> — Quick button to swap start and end dates</li>
        </ul>
      </div>
    </div>
  );
}
