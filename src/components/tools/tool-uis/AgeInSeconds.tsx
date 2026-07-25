"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const nowStatic = new Date();
const years = Array.from({ length: 130 }, (_, i) => nowStatic.getFullYear() - i);
const days = Array.from({ length: 31 }, (_, i) => i + 1);

function formatNumber(num: number): string {
  if (typeof num !== "number" || isNaN(num) || !isFinite(num)) return "0";
  const n = Math.floor(num);

  if (n >= 1e12) {
    return (n / 1e12).toFixed(2) + "T";
  }
  if (n >= 1e9) {
    return (n / 1e9).toFixed(2) + "B";
  }
  if (n >= 1e6) {
    return (n / 1e6).toFixed(2) + "M";
  }
  if (n >= 1e3) {
    return (n / 1e3).toFixed(2) + "K";
  }
  return n.toString();
}

function formatNumberFull(num: number): string {
  if (typeof num !== "number" || isNaN(num) || !isFinite(num)) return "0";
  return Math.floor(num).toLocaleString();
}

interface AgeBreakdown {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  totalSeconds: number;
  totalMinutes: number;
  totalHours: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  totalYears: number;
  nextBirthday: Date;
  daysToBirthday: number;
  hoursToBirthday: number;
  minutesToBirthday: number;
  secondsToBirthday: number;
}

function calculateAgeBreakdown(birthDate: Date, now: Date): AgeBreakdown {
  const diffMs = now.getTime() - birthDate.getTime();
  const totalMs = diffMs;
  const totalSeconds = diffMs / 1000;
  const totalMinutes = totalSeconds / 60;
  const totalHours = totalMinutes / 60;
  const totalDays = totalHours / 24;
  const totalWeeks = totalDays / 7;
  const totalMonths = totalDays / 30.436875;
  const totalYears = totalDays / 365.2425;

  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();
  let hours = now.getHours() - birthDate.getHours();
  let minutes = now.getMinutes() - birthDate.getMinutes();
  let seconds = now.getSeconds() - birthDate.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes--;
  }
  if (minutes < 0) {
    minutes += 60;
    hours--;
  }
  if (hours < 0) {
    hours += 24;
    days--;
  }
  if (days < 0) {
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
    months--;
  }
  if (months < 0) {
    months += 12;
    years--;
  }

  const nextBirthday = new Date(
    now.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate(),
    birthDate.getHours(),
    birthDate.getMinutes(),
    birthDate.getSeconds()
  );

  if (nextBirthday <= now) {
    nextBirthday.setFullYear(now.getFullYear() + 1);
  }

  const timeToBirthday = nextBirthday.getTime() - now.getTime();
  const daysToBirthday = Math.floor(timeToBirthday / (1000 * 60 * 60 * 24));
  const hoursToBirthday = Math.floor((timeToBirthday % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesToBirthday = Math.floor((timeToBirthday % (1000 * 60 * 60)) / (1000 * 60));
  const secondsToBirthday = Math.floor((timeToBirthday % (1000 * 60)) / 1000);

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    totalMs,
    totalSeconds,
    totalMinutes,
    totalHours,
    totalDays,
    totalWeeks,
    totalMonths,
    totalYears,
    nextBirthday,
    daysToBirthday,
    hoursToBirthday,
    minutesToBirthday,
    secondsToBirthday,
  };
}

interface AnimatedCounterProps {
  value: number;
  label: string;
  icon: string;
  highlight: boolean;
}

function AnimatedCounter({ value, label, icon, highlight }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValue = useRef(0);

  useEffect(() => {
    if (value === displayValue) return;

    const start = prevValue.current;
    const end = value;
    const duration = 400;
    const startTime = performance.now();

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAnimating(true);

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(end);
        prevValue.current = end;
        setIsAnimating(false);
      }
    }

    requestAnimationFrame(animate);
  }, [value, displayValue]);

  const displayText = formatNumber(displayValue);
  const fullText = formatNumberFull(value);
  const isAbbreviated = displayText !== fullText;

  return (
    <div
      className={`p-4 rounded-xl border-2 transition-all ${
        highlight
          ? "border-primary bg-primary/10 shadow-sm"
          : "border-border bg-background"
      }`}
      title={isAbbreviated ? fullText : ""}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div
        className={`text-lg md:text-xl lg:text-2xl font-extrabold font-mono truncate ${
          highlight ? "text-primary" : "text-foreground"
        } ${isAnimating ? "text-opacity-90" : ""}`}
      >
        {displayText}
      </div>
      <div className="text-xs text-muted-foreground mt-0.5">
        {label}
        {isAbbreviated && <span className="text-primary opacity-70 ml-1">ⓘ</span>}
      </div>
    </div>
  );
}

interface TickingDigitProps {
  value: number;
  label: string;
}

function TickingDigit({ value, label }: TickingDigitProps) {
  const [prevValue, setPrevValue] = useState(value);
  const [isTicking, setIsTicking] = useState(false);

  useEffect(() => {
    if (value !== prevValue) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsTicking(true);
      const timeout = setTimeout(() => {
        setIsTicking(false);
        setPrevValue(value);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [value, prevValue]);

  const display = String(value).padStart(2, "0");

  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-lg border-2 transition-all ${
          isTicking
            ? "border-primary bg-primary/10 scale-105"
            : "border-border bg-muted"
        }`}
      >
        <span
          className={`text-xl md:text-2xl font-extrabold font-mono transition-all ${
            isTicking ? "text-primary" : "text-foreground"
          }`}
        >
          {display}
        </span>
      </div>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </div>
  );
}

interface DobDate {
  month: number;
  day: number;
  year: number;
}

export default function AgeInSeconds() {
  const [dob, setDob] = useState<DobDate>({
    month: 0,
    day: 1,
    year: 2000,
  });
  const [birthTime, setBirthTime] = useState("00:00");
  const [hasTime, setHasTime] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [now, setNow] = useState(new Date());
  const [copied, setCopied] = useState(false);
  const animationRef = useRef<number>(0);
  const animateRef = useRef<() => void>(() => {});

  const getFullBirthDate = useCallback(() => {
    const date = new Date(dob.year, dob.month, dob.day, 0, 0, 0, 0);
    if (hasTime && birthTime) {
      const [hours, minutes] = birthTime.split(":").map(Number);
      date.setHours(hours, minutes, 0, 0);
    }
    return date;
  }, [dob, birthTime, hasTime]);

  const birthDateTime = getFullBirthDate();
  const isFuture = birthDateTime > now;

  const ageData = !isFuture ? calculateAgeBreakdown(birthDateTime, now) : null;

  const animate = useCallback(() => {
    setNow(new Date());
    animationRef.current = requestAnimationFrame(animateRef.current);
  }, []);

  useEffect(() => {
    animateRef.current = animate;
  }, [animate]);

  useEffect(() => {
    if (isRunning && !isFuture) {
      animationRef.current = requestAnimationFrame(animateRef.current);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, isFuture]);

  const handleStart = () => {
    if (!isFuture) {
      setIsRunning(true);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleCopySeconds = async () => {
    if (!ageData) return;
    try {
      await navigator.clipboard.writeText(formatNumberFull(ageData.totalSeconds));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
    }
  };

  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: hasTime ? "2-digit" : undefined,
      minute: hasTime ? "2-digit" : undefined,
    });
  };

  return (
    <div>
      {/* Input Section */}
      <div className="bg-background rounded-2xl border border-border shadow-card p-6 md:p-8 mb-8">
        <h3 className="font-semibold text-foreground mb-5 text-lg">Enter Your Birth Info</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              🗓️ Date of Birth
            </label>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={dob.month}
                onChange={(e) => {
                  setDob({ ...dob, month: parseInt(e.target.value) });
                  setIsRunning(false);
                }}
                className="px-3 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm bg-background"
              >
                {monthNames.map((m, i) => (
                  <option key={i} value={i}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={dob.day}
                onChange={(e) => {
                  setDob({ ...dob, day: parseInt(e.target.value) });
                  setIsRunning(false);
                }}
                className="px-3 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm bg-background"
              >
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <select
                value={dob.year}
                onChange={(e) => {
                  setDob({ ...dob, year: parseInt(e.target.value) });
                  setIsRunning(false);
                }}
                className="px-3 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm bg-background"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              ⏰ Birth Time (Optional)
            </label>
            <div className="flex items-center gap-3 h-12">
              <input
                type="time"
                value={birthTime}
                disabled={!hasTime}
                onChange={(e) => {
                  setBirthTime(e.target.value);
                  setIsRunning(false);
                }}
                className={`flex-1 px-4 py-3 rounded-lg border border-border transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  hasTime
                    ? "border-border focus:border-primary text-foreground bg-background"
                    : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                }`}
              />
              <button
                onClick={() => {
                  setHasTime(!hasTime);
                  setIsRunning(false);
                }}
                className={`px-3 py-3 rounded-lg border-2 transition-all font-medium text-sm ${
                  hasTime
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground hover:border-primary/50"
                }`}
              >
                {hasTime ? "✓" : "+"}
              </button>
            </div>
          </div>
        </div>

        {/* Start/Stop Buttons */}
        <div className="flex gap-3">
          {!isRunning ? (
            <button
              onClick={handleStart}
              disabled={isFuture}
              className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-base transition-all ${
                isFuture
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary-dark shadow-[0_4px_14px_rgba(30,64,175,0.25)] hover:shadow-[0_6px_20px_rgba(30,64,175,0.35)]"
              }`}
            >
              ▶️ Start Counter
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="flex-1 py-3.5 px-6 rounded-xl font-bold text-base bg-red-500 text-white hover:bg-red-600 transition-all shadow-[0_4px_14px_rgba(239,68,68,0.25)]"
            >
              ⏸️ Pause
            </button>
          )}
        </div>

        {isFuture && (
          <p className="text-sm text-red-500 mt-3 font-medium">
            ⚠️ Birth date cannot be in the future.
          </p>
        )}
      </div>

      {/* Live Ticking Display */}
      {ageData && (
        <>
          {/* Main Seconds Counter */}
          <div
            className={`rounded-2xl border-2 p-6 md:p-8 mb-8 transition-all cursor-pointer ${
              isRunning
                ? "border-primary bg-primary/10 shadow-md"
                : "border-border bg-background shadow-card"
            }`}
            onClick={handleCopySeconds}
            title="Click to copy seconds"
          >
            <div className="text-center">
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                You have been alive for
              </div>
              <div className="text-3xl md:text-5xl lg:text-6xl font-extrabold font-mono text-primary mb-1 overflow-x-auto">
                {formatNumberFull(ageData.totalSeconds)}
              </div>
              <div className="text-base md:text-lg text-muted-foreground font-semibold">
                Seconds
              </div>
              {copied && (
                <div className="text-sm text-green-600 mt-3 font-bold animate-fade-up">
                  ✓ Copied to clipboard!
                </div>
              )}
            </div>
          </div>

          {/* Age Breakdown - Live */}
          <div className="bg-background rounded-2xl border border-border shadow-card p-6 md:p-8 mb-8">
            <h3 className="font-semibold text-foreground mb-5 text-lg text-center">
              Your Exact Age
            </h3>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-2">
              <TickingDigit value={ageData.years} label="Years" />
              <span className="text-primary font-bold text-2xl self-center pb-3">:</span>
              <TickingDigit value={ageData.months} label="Months" />
              <span className="text-primary font-bold text-2xl self-center pb-3">:</span>
              <TickingDigit value={ageData.days} label="Days" />
              <span className="text-primary font-bold text-2xl self-center pb-3">:</span>
              <TickingDigit value={ageData.hours} label="Hours" />
              <span className="text-primary font-bold text-2xl self-center pb-3">:</span>
              <TickingDigit value={ageData.minutes} label="Mins" />
              <span className="text-primary font-bold text-2xl self-center pb-3">:</span>
              <TickingDigit value={ageData.seconds} label="Secs" />
            </div>
            {isRunning && (
              <p className="text-center text-xs text-primary font-medium mt-3">
                ● Live updating...
              </p>
            )}
          </div>

          {/* All Measurements */}
          <div className="bg-background rounded-2xl border border-border shadow-card p-6 md:p-8 mb-8">
            <h3 className="font-semibold text-foreground mb-5 text-lg">
              All Measurements
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <AnimatedCounter
                value={ageData.totalYears}
                label="Years"
                icon="🎂"
                highlight={false}
              />
              <AnimatedCounter
                value={ageData.totalMonths}
                label="Months"
                icon="📅"
                highlight={false}
              />
              <AnimatedCounter
                value={ageData.totalWeeks}
                label="Weeks"
                icon="🗓️"
                highlight={false}
              />
              <AnimatedCounter
                value={ageData.totalDays}
                label="Days"
                icon="☀️"
                highlight={false}
              />
              <AnimatedCounter
                value={ageData.totalHours}
                label="Hours"
                icon="⏰"
                highlight={false}
              />
              <AnimatedCounter
                value={ageData.totalMinutes}
                label="Minutes"
                icon="⏱️"
                highlight={false}
              />
              <AnimatedCounter
                value={ageData.totalSeconds}
                label="Seconds"
                icon="⚡"
                highlight={true}
              />
              <AnimatedCounter
                value={ageData.totalMs}
                label="Milliseconds"
                icon="💫"
                highlight={false}
              />
            </div>
          </div>

          {/* Next Birthday */}
          <div className="bg-muted rounded-2xl border border-border p-6 md:p-8">
            <div className="text-center">
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                Next Birthday
              </div>
              <div className="text-xl md:text-2xl font-extrabold text-foreground mb-3">
                {formatFullDate(ageData.nextBirthday)}
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <div className="px-4 py-2 bg-primary rounded-xl text-white">
                  <span className="font-bold">{ageData.daysToBirthday}</span>
                  <span className="text-xs ml-1 opacity-80">days</span>
                </div>
                <div className="px-4 py-2 bg-primary/10 rounded-xl text-primary">
                  <span className="font-bold">{ageData.hoursToBirthday}</span>
                  <span className="text-xs ml-1">hrs</span>
                </div>
                <div className="px-4 py-2 bg-background rounded-xl border border-border text-foreground">
                  <span className="font-bold">{ageData.minutesToBirthday}</span>
                  <span className="text-xs ml-1 text-muted-foreground">min</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
