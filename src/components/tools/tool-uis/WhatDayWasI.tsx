"use client";
import { useState, useMemo } from "react";

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const nowStatic = new Date();
const years = Array.from({ length: 130 }, (_, i) => nowStatic.getFullYear() - i);
const days = Array.from({ length: 31 }, (_, i) => i + 1);

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

type Weekday = (typeof WEEKDAYS)[number];

const WEEKDAY_EMOJIS: Record<Weekday, string> = {
  Sunday: "☀️",
  Monday: "🌙",
  Tuesday: "🔥",
  Wednesday: "🌿",
  Thursday: "⚡",
  Friday: "🌸",
  Saturday: "🌈",
};

interface ZodiacSign {
  name: string;
  symbol: string;
  element: string;
  start: { m: number; d: number };
  end: { m: number; d: number };
}

const ZODIAC_SIGNS: ZodiacSign[] = [
  { name: "Capricorn", symbol: "♑", element: "Earth", start: { m: 12, d: 22 }, end: { m: 1, d: 19 } },
  { name: "Aquarius", symbol: "♒", element: "Air", start: { m: 1, d: 20 }, end: { m: 2, d: 18 } },
  { name: "Pisces", symbol: "♓", element: "Water", start: { m: 2, d: 19 }, end: { m: 3, d: 20 } },
  { name: "Aries", symbol: "♈", element: "Fire", start: { m: 3, d: 21 }, end: { m: 4, d: 19 } },
  { name: "Taurus", symbol: "♉", element: "Earth", start: { m: 4, d: 20 }, end: { m: 5, d: 20 } },
  { name: "Gemini", symbol: "♊", element: "Air", start: { m: 5, d: 21 }, end: { m: 6, d: 20 } },
  { name: "Cancer", symbol: "♋", element: "Water", start: { m: 6, d: 21 }, end: { m: 7, d: 22 } },
  { name: "Leo", symbol: "♌", element: "Fire", start: { m: 7, d: 23 }, end: { m: 8, d: 22 } },
  { name: "Virgo", symbol: "♍", element: "Earth", start: { m: 8, d: 23 }, end: { m: 9, d: 22 } },
  { name: "Libra", symbol: "♎", element: "Air", start: { m: 9, d: 23 }, end: { m: 10, d: 22 } },
  { name: "Scorpio", symbol: "♏", element: "Water", start: { m: 10, d: 23 }, end: { m: 11, d: 21 } },
  { name: "Sagittarius", symbol: "♐", element: "Fire", start: { m: 11, d: 22 }, end: { m: 12, d: 21 } },
];

function getZodiacSign(month: number, day: number): ZodiacSign {
  for (const sign of ZODIAC_SIGNS) {
    if (
      (month === sign.start.m && day >= sign.start.d) ||
      (month === sign.end.m && day <= sign.end.d)
    ) {
      return sign;
    }
  }
  return ZODIAC_SIGNS[0];
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getChineseZodiac(year: number): { animal: string; symbol: string } {
  const animals = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
  const symbols = ["🐀", "🐂", "🐅", "🐇", "🐉", "🐍", "🐎", "🐐", "🐒", "🐓", "🐕", "🐖"];
  const index = ((year - 1900) % 12 + 12) % 12;
  return { animal: animals[index], symbol: symbols[index] };
}

function getGeneration(year: number): { name: string; emoji: string } {
  if (year >= 1997 && year <= 2012) return { name: "Gen Z", emoji: "📱" };
  if (year >= 1981 && year <= 1996) return { name: "Millennials", emoji: "💻" };
  if (year >= 1965 && year <= 1980) return { name: "Gen X", emoji: "📼" };
  if (year >= 1946 && year <= 1964) return { name: "Baby Boomers", emoji: "🎸" };
  return { name: "Other", emoji: "📅" };
}

function getSeason(dayOfYear: number): { name: string; emoji: string } {
  if (dayOfYear >= 79 && dayOfYear < 172) return { name: "Spring", emoji: "🌸" };
  if (dayOfYear >= 172 && dayOfYear < 266) return { name: "Summer", emoji: "☀️" };
  if (dayOfYear >= 266 && dayOfYear < 355) return { name: "Fall / Autumn", emoji: "🍂" };
  return { name: "Winter", emoji: "❄️" };
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function formatDateFull(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateShort(year: number, month: number, day: number): string {
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface DobDate {
  month: number;
  day: number;
  year: number;
}

interface DayResult {
  dayOfWeek: Weekday;
  dateFull: string;
  zodiac: ZodiacSign;
  chineseZodiac: { animal: string; symbol: string };
  generation: { name: string; emoji: string };
  leapYear: boolean;
  dayOfYear: number;
  totalDays: number;
  season: { name: string; emoji: string };
  percentage: string;
  ageYears: number;
  ageDays: number;
  month: number;
  day: number;
  year: number;
}

export default function WhatDayWasI() {
  const [dob, setDob] = useState<DobDate>({
    month: 0,
    day: 1,
    year: 2000,
  });

  const { result, error } = useMemo<{ result: DayResult | null; error: string | null }>(() => {
    const date = new Date(dob.year, dob.month, dob.day);
    const today = new Date();

    if (date > today) {
      return { result: null, error: "Birth date cannot be in the future." };
    }

    const dayOfWeek = WEEKDAYS[date.getDay()] as Weekday;
    const month = dob.month + 1;
    const day = dob.day;
    const year = dob.year;

    const zodiac = getZodiacSign(month, day);
    const chineseZodiac = getChineseZodiac(year);
    const generation = getGeneration(year);
    const leapYear = isLeapYear(year);
    const dayOfYear = getDayOfYear(date);
    const totalDays = leapYear ? 366 : 365;
    const season = getSeason(dayOfYear);
    const percentage = ((dayOfYear / totalDays) * 100).toFixed(1);

    const diffMs = today.getTime() - date.getTime();
    const ageYears = today.getFullYear() - date.getFullYear();
    const ageDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    return {
      result: {
        dayOfWeek,
        dateFull: formatDateFull(date),
        zodiac,
        chineseZodiac,
        generation,
        leapYear,
        dayOfYear,
        totalDays,
        season,
        percentage,
        ageYears,
        ageDays,
        month,
        day,
        year,
      },
      error: null,
    };
  }, [dob]);

  return (
    <div>
      {/* Input Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-primary/10 rounded-2xl border-2 border-primary/20 shadow-card p-6 md:p-8 mb-8 text-center">
        <h3 className="font-semibold text-foreground mb-2 text-xl">
          🎂 What Day Were You Born?
        </h3>
        <p className="text-sm text-muted-foreground mb-5 max-w-lg mx-auto">
          Select your birth date below to discover your birth weekday, zodiac sign, and more!
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

        {result && (
          <div className="flex justify-center gap-6 text-sm mt-4">
            <div>
              <span className="font-extrabold text-primary text-lg">{result.ageYears}</span>
              <span className="text-muted-foreground ml-1">years</span>
            </div>
            <div className="text-muted-foreground">•</div>
            <div>
              <span className="font-extrabold text-foreground text-lg">
                {result.ageDays.toLocaleString()}
              </span>
              <span className="text-muted-foreground ml-1">days</span>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center mb-8">
          <p className="text-red-600 font-semibold text-lg">
            ⚠️ {error}
          </p>
        </div>
      )}

      {/* Results */}
      {result && !error && (
        <>
          {/* Main Day Card */}
          <div className="bg-gradient-to-br from-primary/10 via-primary/10/50 to-background border-2 border-primary rounded-2xl p-6 md:p-8 mb-8 text-center">
            <div className="text-5xl md:text-6xl mb-3">
              {WEEKDAY_EMOJIS[result.dayOfWeek]}
            </div>
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              You were born on a
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary mb-3">
              {result.dayOfWeek}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {result.dateFull}
            </p>
          </div>

          {/* Zodiac Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
             {/* Western Zodiac */}
             <div className="bg-background rounded-2xl border border-border shadow-card p-6 text-center">
               <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                 Western Zodiac
               </p>
               <div className="text-4xl mb-2">
                 {result.zodiac.symbol}
               </div>
               <h3 className="text-xl font-extrabold text-foreground mb-1">
                 {result.zodiac.name}
               </h3>
               <p className="text-sm text-muted-foreground">
                 {result.zodiac.element} Sign
               </p>
               <p className="text-xs text-muted-foreground mt-1">
                 {formatDateShort(result.year, result.zodiac.start.m, result.zodiac.start.d)} - {formatDateShort(result.year, result.zodiac.end.m, result.zodiac.end.d)}
               </p>
             </div>

             {/* Chinese Zodiac */}
             <div className="bg-background rounded-2xl border border-border shadow-card p-6 text-center">
               <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                 Chinese Zodiac
               </p>
               <div className="text-4xl mb-2">
                 {result.chineseZodiac.symbol}
               </div>
               <h3 className="text-xl font-extrabold text-foreground mb-1">
                 Year of the {result.chineseZodiac.animal}
               </h3>
               <p className="text-sm text-muted-foreground">
                 {result.year}
               </p>
             </div>
          </div>

          {/* Fun Facts Grid */}
          <div className="bg-background rounded-2xl border border-border shadow-card p-6 md:p-8 mb-8">
            <h3 className="font-semibold text-foreground mb-5 text-lg">
              📊 Fun Facts About Your Birth
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-muted border border-border text-center">
                <div className="text-2xl mb-1">🎂</div>
                <div className="text-xl font-extrabold text-foreground">
                  {result.ageYears}
                </div>
                <div className="text-xs text-muted-foreground">Years Old</div>
              </div>

              <div className="p-4 rounded-xl bg-muted border border-border text-center">
                <div className="text-2xl mb-1">📅</div>
                <div className="text-xl font-extrabold text-foreground">
                  {result.ageDays.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Days Alive</div>
              </div>

              <div className="p-4 rounded-xl bg-muted border border-border text-center">
                <div className="text-2xl mb-1">📍</div>
                <div className="text-xl font-extrabold text-foreground">
                  {result.dayOfYear}
                </div>
                <div className="text-xs text-muted-foreground">Day of {result.totalDays}</div>
              </div>

              <div className="p-4 rounded-xl bg-muted border border-border text-center">
                <div className="text-2xl mb-1">{result.season.emoji}</div>
                <div className="text-xl font-extrabold text-foreground">
                  {result.season.name}
                </div>
                <div className="text-xs text-muted-foreground">Season</div>
              </div>

              <div className="p-4 rounded-xl bg-muted border border-border text-center">
                <div className="text-2xl mb-1">{result.generation.emoji}</div>
                <div className="text-xl font-extrabold text-foreground">
                  {result.generation.name}
                </div>
                <div className="text-xs text-muted-foreground">Generation</div>
              </div>

              <div className="p-4 rounded-xl bg-muted border border-border text-center">
                <div className="text-2xl mb-1">{result.leapYear ? "✨" : "📆"}</div>
                <div className="text-xl font-extrabold text-foreground">
                  {result.leapYear ? "Yes!" : "No"}
                </div>
                <div className="text-xs text-muted-foreground">Leap Year?</div>
              </div>
            </div>
          </div>

          {/* Percentage */}
          <div className="bg-muted rounded-2xl border border-border p-5 md:p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Your birthday was <span className="font-bold text-foreground">{result.percentage}%</span> of the way through {result.year}.
            </p>
            <div className="w-full h-3 bg-background rounded-full border border-border overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${Math.max(3, parseFloat(result.percentage))}%` }}
              ></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
