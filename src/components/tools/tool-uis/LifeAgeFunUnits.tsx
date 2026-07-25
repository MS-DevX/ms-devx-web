"use client";
import { useState, useEffect, useRef, useMemo } from "react";

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const nowStatic = new Date();
const years = Array.from({ length: 130 }, (_, i) => nowStatic.getFullYear() - i);
const days = Array.from({ length: 31 }, (_, i) => i + 1);

interface FunStat {
  id: string;
  name: string;
  emoji: string;
  perMinute?: number;
  perWakingHour?: number;
  wakingHoursPerDay?: number;
  perDay?: number;
  multiplier?: number;
  daysPerOrbit?: number;
  perYear?: number;
  tvHoursPerDay?: number;
}

const FUN_STATS: FunStat[] = [
  { id: "breaths", name: "Breaths Taken", emoji: "🫁", perMinute: 15 },
  { id: "heartbeats", name: "Heartbeats", emoji: "💓", perMinute: 70 },
  { id: "blinks", name: "Times Blinked", emoji: "👁️", perWakingHour: 900, wakingHoursPerDay: 16 },
  { id: "laughs", name: "Times Laughed", emoji: "😂", perDay: 15 },
  { id: "sleeps", name: "Nights Slept", emoji: "😴", perDay: 1 },
  { id: "meals", name: "Meals Eaten", emoji: "🍽️", perDay: 3 },
  { id: "dogYears", name: "Age in Dog Years", emoji: "🐕", multiplier: 7 },
  { id: "catYears", name: "Age in Cat Years", emoji: "🐱", multiplier: 6.5 },
  { id: "moonOrbits", name: "Moon Orbits", emoji: "🌙", daysPerOrbit: 29.53 },
  { id: "birthdays", name: "Birthdays Celebrated", emoji: "🎂", perYear: 1 },
  { id: "earthOrbits", name: "Trips Around the Sun", emoji: "🌍", perYear: 1 },
  { id: "video", name: "Days of Video Content", emoji: "📺", tvHoursPerDay: 3 },
];

function calculateStat(stat: FunStat, ageDays: number, ageYears: number): number | string {
  const minutesPerDay = 24 * 60;
  const hoursPerDay = 24;

  switch (stat.id) {
    case "breaths":
      return Math.floor(ageDays * minutesPerDay * (stat.perMinute ?? 0));
    case "heartbeats":
      return Math.floor(ageDays * minutesPerDay * (stat.perMinute ?? 0));
    case "blinks":
      return Math.floor(ageDays * (stat.wakingHoursPerDay ?? 0) * (stat.perWakingHour ?? 0));
    case "laughs":
      return Math.floor(ageDays * (stat.perDay ?? 0));
    case "sleeps":
      return Math.floor(ageDays * (stat.perDay ?? 0));
    case "meals":
      return Math.floor(ageDays * (stat.perDay ?? 0));
    case "dogYears":
      return (ageYears * (stat.multiplier ?? 0)).toFixed(1);
    case "catYears":
      return (ageYears * (stat.multiplier ?? 0)).toFixed(1);
    case "moonOrbits":
      return (ageDays / (stat.daysPerOrbit ?? 1)).toFixed(1);
    case "birthdays":
      return Math.floor(ageYears);
    case "earthOrbits":
      return Math.floor(ageYears);
    case "video":
      return (ageDays * (stat.tvHoursPerDay ?? 0) / hoursPerDay).toFixed(1);
    default:
      return 0;
  }
}

function formatNumber(num: number | string): string {
  const n = parseFloat(String(num));
  if (isNaN(n)) return "0";

  if (n >= 1e9) {
    return (n / 1e9).toFixed(2) + "B";
  }
  if (n >= 1e6) {
    return (n / 1e6).toFixed(2) + "M";
  }
  if (n >= 1e3) {
    return (n / 1e3).toFixed(1) + "K";
  }
  if (n % 1 === 0) {
    return Math.floor(n).toLocaleString();
  }
  return n.toString();
}

function formatNumberFull(num: number | string): string {
  const n = parseFloat(String(num));
  if (isNaN(n)) return "0";
  if (n % 1 === 0) {
    return Math.floor(n).toLocaleString();
  }
  return n.toLocaleString();
}

interface AnimatedCounterProps {
  value: number | string;
  label: string;
  emoji: string;
  fact: string;
}

function AnimatedCounter({ value, label, emoji, fact }: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const target = parseFloat(String(value)) || 0;
    const start = prev.current;
    const duration = 800;
    const startTime = performance.now();

    function animate(time: number) {
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * eased;
      setDisplay(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplay(target);
        prev.current = target;
      }
    }

    requestAnimationFrame(animate);
  }, [value]);

  const displayText = formatNumber(display);
  const fullText = formatNumberFull(value);
  const isAbbreviated = displayText !== fullText;

  return (
    <div
      className="p-4 md:p-5 rounded-xl border-2 border-border bg-background hover:border-primary/50 transition-all duration-300 hover:shadow-md group"
      title={isAbbreviated ? fullText : ""}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl md:text-3xl">{emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="text-lg md:text-xl lg:text-2xl font-extrabold text-foreground font-mono truncate">
            {displayText}
          </div>
          <div className="text-sm font-semibold text-muted-foreground mt-0.5">
            {label}
          </div>
          <div className="text-xs text-muted-foreground/70 mt-1 hidden group-hover:block">
            {fact}
          </div>
        </div>
      </div>
    </div>
  );
}

interface DobDate {
  month: number;
  day: number;
  year: number;
}

interface CalculatedStat extends FunStat {
  value: number | string;
}

interface AgeInfo {
  ageDays: number;
  ageYears: string;
}

interface ResultData {
  stats: CalculatedStat[];
  ageInfo: AgeInfo | null;
}

export default function LifeAgeFunUnits() {
  const [dob, setDob] = useState<DobDate>({
    month: 0,
    day: 1,
    year: 2000,
  });

  const resultData = useMemo<ResultData>(() => {
    const birth = new Date(dob.year, dob.month, dob.day);
    const today = new Date();

    if (birth > today) {
      return { stats: [], ageInfo: null };
    }

    const diffMs = today.getTime() - birth.getTime();
    const ageDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const ageYears = ageDays / 365.25;

    const calculated = FUN_STATS.map((stat) => ({
      ...stat,
      value: calculateStat(stat, ageDays, ageYears),
    }));

    return {
      stats: calculated,
      ageInfo: {
        ageDays,
        ageYears: ageYears.toFixed(1),
      },
    };
  }, [dob]);

  const { stats, ageInfo } = resultData;

  return (
    <div>
      {/* Input Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-primary/10 rounded-2xl border-2 border-primary/20 shadow-card p-6 md:p-8 mb-8 text-center">
        <h3 className="font-semibold text-foreground mb-2 text-xl">
          🎉 Your Life in Fun Numbers
        </h3>
        <p className="text-sm text-muted-foreground mb-5 max-w-lg mx-auto">
          Enter your birth date and discover how many breaths you&apos;ve taken, laughs you&apos;ve shared, and trips around the Sun you&apos;ve made!
        </p>

        <div className="max-w-sm mx-auto">
          <div className="grid grid-cols-3 gap-2">
            <select
              value={dob.month}
              onChange={(e) => setDob({ ...dob, month: parseInt(e.target.value) })}
              className="px-3 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm bg-background text-foreground"
            >
              {monthNames.map((m, i) => (
                <option key={i} value={i}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={dob.day}
              onChange={(e) => setDob({ ...dob, day: parseInt(e.target.value) })}
              className="px-3 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm bg-background text-foreground"
            >
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              value={dob.year}
              onChange={(e) => setDob({ ...dob, year: parseInt(e.target.value) })}
              className="px-3 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm bg-background text-foreground"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {ageInfo && (
          <div className="flex justify-center gap-6 text-sm mt-4">
            <div>
              <span className="font-extrabold text-primary text-lg">{ageInfo.ageYears}</span>
              <span className="text-muted-foreground ml-1">years</span>
            </div>
            <div className="text-muted-foreground">•</div>
            <div>
              <span className="font-extrabold text-foreground text-lg">
                {ageInfo.ageDays.toLocaleString()}
              </span>
              <span className="text-muted-foreground ml-1">days</span>
            </div>
          </div>
        )}
      </div>

      {/* Fun Stats Grid */}
      {stats.length > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold text-foreground mb-5 text-lg">
            📊 Your Life Statistics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.map((stat) => (
              <AnimatedCounter
                key={stat.id}
                value={stat.value}
                label={stat.name}
                emoji={stat.emoji}
                fact={stat.id === "breaths" ? "Average resting respiration rate" :
                      stat.id === "heartbeats" ? "Average resting heart rate" :
                      stat.id === "blinks" ? "~15 blinks per minute while awake" :
                      stat.id === "laughs" ? "Average laughs per day" :
                      stat.id === "sleeps" ? "One per day" :
                      stat.id === "meals" ? "~3 meals per day average" :
                      stat.id === "dogYears" ? "Popular 7:1 dog year estimate" :
                      stat.id === "catYears" ? "Average cat year conversion" :
                      stat.id === "moonOrbits" ? "Lunar month (synodic)" :
                      stat.id === "birthdays" ? "One per trip around the Sun" :
                      stat.id === "earthOrbits" ? "Earth&apos;s orbital period" :
                      "Average screen time"}
              />
            ))}
          </div>
        </div>
      )}

      {/* Fun Footer */}
      {ageInfo && (
        <div className="bg-muted rounded-2xl border border-border p-5 md:p-6 text-center">
          <p className="text-muted-foreground text-sm">
            💡 Every second is precious. You&apos;ve already experienced
            <span className="font-extrabold text-primary mx-1">
              {ageInfo.ageDays.toLocaleString()}
            </span>
            amazing days. Make each one count!
          </p>
        </div>
      )}
    </div>
  );
}
