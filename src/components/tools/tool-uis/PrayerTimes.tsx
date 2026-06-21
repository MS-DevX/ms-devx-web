"use client";

import { Compass, Loader2, MapPin } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PrayerTime, ToolUiProps } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function PrayerTimes({ className }: ToolUiProps) {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTimes, setShowTimes] = useState(false);
  const [compassRotation, setCompassRotation] = useState(58);

  const prayerTimes = useMemo<PrayerTime[]>(() => {
    const seed = city.trim().toLowerCase().length || 5;

    const baseHour = 4 + (seed % 2);
    return [
      { name: "Fajr", time: `${String(baseHour).padStart(2, "0")}:45 AM` },
      { name: "Dhuhr", time: "12:30 PM" },
      { name: "Asr", time: `${3 + (seed % 2)}:15 PM` },
      { name: "Maghrib", time: `${6 + (seed % 2)}:05 PM` },
      { name: "Isha", time: `${7 + (seed % 2)}:30 PM` },
    ];
  }, [city]);

  const handleLookup = () => {
    if (!city.trim()) return;

    setLoading(true);
    setShowTimes(false);

    setTimeout(() => {
      setCompassRotation(45 + (city.length * 7) % 360);
      setShowTimes(true);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className={cn("grid gap-8 lg:grid-cols-2", className)}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="prayer-city" className="text-sm font-medium">
            City
          </label>
          <Input
            id="prayer-city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="London, Dubai, New York..."
          />
        </div>

        <Button
          type="button"
          onClick={handleLookup}
          disabled={loading || !city.trim()}
          className="bg-electric text-white hover:bg-electric/90"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              Calculating times...
            </>
          ) : (
            <>
              <MapPin />
              Get prayer times
            </>
          )}
        </Button>

        {showTimes && (
          <div className="animate-in fade-in space-y-2 duration-300">
            <p className="text-sm font-medium text-foreground">
              Prayer times for {city}
            </p>
            <ul className="divide-y divide-border rounded-lg border border-border">
              {prayerTimes.map((prayer) => (
                <li
                  key={prayer.name}
                  className="flex items-center justify-between px-4 py-3 text-sm"
                >
                  <span className="font-medium text-foreground">
                    {prayer.name}
                  </span>
                  <span className="text-electric">{prayer.time}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-muted/20 p-6">
        <p className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
          <Compass className="size-4 text-electric" />
          Qibla direction
        </p>

        <div className="relative size-48 sm:size-56">
          <svg viewBox="0 0 200 200" className="size-full">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-foreground/20"
            />
            <circle cx="100" cy="100" r="4" className="fill-electric" />
            <g
              style={{
                transform: `rotate(${compassRotation}deg)`,
                transformOrigin: "100px 100px",
                transition: "transform 0.6s ease-out",
              }}
            >
              <polygon
                points="100,30 90,100 100,85 110,100"
                className="fill-electric"
              />
            </g>
            <text
              x="100"
              y="24"
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              N
            </text>
          </svg>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Compass rotates toward Qibla based on your city (simulated)
        </p>
      </div>
    </div>
  );
}
