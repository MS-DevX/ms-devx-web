"use client";

import { Flame, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ToolUiProps } from "@/lib/types";
import { cn } from "@/lib/utils";

const SURAH_NAMES = [
  "Al-Fatiha",
  "Al-Baqarah",
  "Ali 'Imran",
  "An-Nisa",
  "Al-Ma'idah",
  "Al-An'am",
  "Al-A'raf",
  "Al-Anfal",
  "At-Tawbah",
  "Yunus",
  "Hud",
  "Yusuf",
  "Ar-Ra'd",
  "Ibrahim",
  "Al-Hijr",
  "An-Nahl",
  "Al-Isra",
  "Al-Kahf",
  "Maryam",
  "Ta-Ha",
  "Al-Anbiya",
  "Al-Hajj",
  "Al-Mu'minun",
  "An-Nur",
  "Al-Furqan",
  "Ash-Shu'ara",
  "An-Naml",
  "Al-Qasas",
  "Al-'Ankabut",
  "Ar-Rum",
  "Luqman",
  "As-Sajdah",
  "Al-Ahzab",
  "Saba",
  "Fatir",
  "Ya-Sin",
  "As-Saffat",
  "Sad",
  "Az-Zumar",
  "Ghafir",
  "Fussilat",
  "Ash-Shura",
  "Az-Zukhruf",
  "Ad-Dukhan",
  "Al-Jathiyah",
  "Al-Ahqaf",
  "Muhammad",
  "Al-Fath",
  "Al-Hujurat",
  "Qaf",
  "Adh-Dhariyat",
  "At-Tur",
  "An-Najm",
  "Al-Qamar",
  "Ar-Rahman",
  "Al-Waqi'ah",
  "Al-Hadid",
  "Al-Mujadila",
  "Al-Hashr",
  "Al-Mumtahanah",
  "As-Saff",
  "Al-Jumu'ah",
  "Al-Munafiqun",
  "At-Taghabun",
  "At-Talaq",
  "At-Tahrim",
  "Al-Mulk",
  "Al-Qalam",
  "Al-Haqqah",
  "Al-Ma'arij",
  "Nuh",
  "Al-Jinn",
  "Al-Muzzammil",
  "Al-Muddaththir",
  "Al-Qiyamah",
  "Al-Insan",
  "Al-Mursalat",
  "An-Naba",
  "An-Nazi'at",
  "'Abasa",
  "At-Takwir",
  "Al-Infitar",
  "Al-Mutaffifin",
  "Al-Inshiqaq",
  "Al-Buruj",
  "At-Tariq",
  "Al-A'la",
  "Al-Ghashiyah",
  "Al-Fajr",
  "Al-Balad",
  "Ash-Shams",
  "Al-Layl",
  "Ad-Duha",
  "Ash-Sharh",
  "At-Tin",
  "Al-'Alaq",
  "Al-Qadr",
  "Al-Bayyinah",
  "Az-Zalzalah",
  "Al-'Adiyat",
  "Al-Qari'ah",
  "At-Takathur",
  "Al-'Asr",
  "Al-Humazah",
  "Al-Fil",
  "Quraysh",
  "Al-Ma'un",
  "Al-Kawthar",
  "Al-Kafirun",
  "An-Nasr",
  "Al-Masad",
  "Al-Ikhlas",
  "Al-Falaq",
  "An-Nas",
] as const;

export default function HifzTracker({ className }: ToolUiProps) {
  const [memorized, setMemorized] = useState<Set<number>>(new Set());
  const [streak, setStreak] = useState(3);

  const progress = useMemo(() => {
    return Math.round((memorized.size / SURAH_NAMES.length) * 100);
  }, [memorized]);

  const toggleSurah = (index: number) => {
    setMemorized((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const incrementStreak = () => {
    setStreak((prev) => prev + 1);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground">Memorization progress</p>
          <p className="mt-1 text-2xl font-bold text-electric">{progress}%</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-electric transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {memorized.size} of {SURAH_NAMES.length} surahs marked
          </p>
        </div>

        <div className="flex flex-col justify-between rounded-lg border border-border p-4">
          <div>
            <p className="text-sm text-muted-foreground">Current streak</p>
            <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-foreground">
              <Flame className="size-6 text-teal" />
              {streak} days
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={incrementStreak}
            className="mt-3 w-fit"
          >
            <Plus />
            Log today&apos;s session
          </Button>
        </div>
      </div>

      <ScrollArea className="h-80 rounded-lg border border-border p-4">
        <ul className="space-y-2 pr-4">
          {SURAH_NAMES.map((surah, index) => {
            const checked = memorized.has(index);

            return (
              <li key={surah}>
                <label className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 transition hover:bg-muted/50">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSurah(index)}
                    className="size-4 rounded border-border accent-electric"
                  />
                  <span className="w-8 text-xs text-muted-foreground">
                    {index + 1}.
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      checked
                        ? "font-medium text-teal line-through"
                        : "text-foreground"
                    )}
                  >
                    {surah}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
    </div>
  );
}
