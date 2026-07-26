"use client";

import {
  CalculationMethod,
  Coordinates,
  Madhab,
  PrayerTimes as AdhanPrayerTimes,
  Qibla,
} from "adhan";
import { Compass, Locate, MapPin } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ToolUiProps } from "@/lib/types";
import { cn } from "@/lib/utils";

type MethodKey =
  | "MWL"
  | "ISNA"
  | "Egypt"
  | "Makkah"
  | "Karachi"
  | "Dubai"
  | "Moonsighting";

const CALC_METHODS: Record<MethodKey, { label: string; fn: () => any }> = {
  MWL: {
    label: "Muslim World League",
    fn: () => CalculationMethod.MuslimWorldLeague(),
  },
  ISNA: {
    label: "ISNA (North America)",
    fn: () => CalculationMethod.NorthAmerica(),
  },
  Egypt: {
    label: "Egyptian General Authority",
    fn: () => CalculationMethod.Egyptian(),
  },
  Makkah: {
    label: "Umm al-Qura (Makkah)",
    fn: () => CalculationMethod.UmmAlQura(),
  },
  Karachi: {
    label: "University of Islamic Sciences, Karachi",
    fn: () => CalculationMethod.Karachi(),
  },
  Dubai: { label: "Dubai", fn: () => CalculationMethod.Dubai() },
  Moonsighting: {
    label: "Moonsighting Committee",
    fn: () => CalculationMethod.MoonsightingCommittee(),
  },
};

export default function PrayerTimes({ className }: ToolUiProps) {
  const [lat, setLat] = useState<string>("51.5074");
  const [lng, setLng] = useState<string>("-0.1278");
  const [locationName, setLocationName] = useState<string>("London, UK");
  const [calcMethod, setCalcMethod] = useState<MethodKey>("MWL");
  const [asrMethod, setAsrMethod] = useState<"shafi" | "hanafi">("shafi");
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  const numLat = parseFloat(lat);
  const numLng = parseFloat(lng);
  const isValidCoords = !isNaN(numLat) && !isNaN(numLng) && numLat >= -90 && numLat <= 90 && numLng >= -180 && numLng <= 180;

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }
    setGeoLoading(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(4));
        setLng(pos.coords.longitude.toFixed(4));
        setLocationName(`Your Location (${pos.coords.latitude.toFixed(2)}°, ${pos.coords.longitude.toFixed(2)}°)`);
        setGeoLoading(false);
      },
      (err) => {
        setGeoError(err.message || "Geolocation permission denied. Please enter coordinates manually.");
        setGeoLoading(false);
      },
      { timeout: 10000 }
    );
  };

  const { prayerTimesList, qiblaBearing, nextPrayer } = useMemo(() => {
    if (!isValidCoords) {
      return { prayerTimesList: [], qiblaBearing: 0, nextPrayer: null };
    }

    try {
      const coords = new Coordinates(numLat, numLng);
      const date = new Date();
      const params = CALC_METHODS[calcMethod].fn();
      params.madhab = asrMethod === "hanafi" ? Madhab.Hanafi : Madhab.Shafi;

      const adhanTimes = new AdhanPrayerTimes(coords, date, params);
      const qibla = Qibla(coords);

      const formatTime = (timeDate: Date) =>
        timeDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

      const list = [
        { name: "Fajr", time: formatTime(adhanTimes.fajr), dateObj: adhanTimes.fajr },
        { name: "Sunrise", time: formatTime(adhanTimes.sunrise), dateObj: adhanTimes.sunrise },
        { name: "Dhuhr", time: formatTime(adhanTimes.dhuhr), dateObj: adhanTimes.dhuhr },
        { name: "Asr", time: formatTime(adhanTimes.asr), dateObj: adhanTimes.asr },
        { name: "Maghrib", time: formatTime(adhanTimes.maghrib), dateObj: adhanTimes.maghrib },
        { name: "Isha", time: formatTime(adhanTimes.isha), dateObj: adhanTimes.isha },
      ];

      const nextName = adhanTimes.nextPrayer();
      const nextNameStr = nextName !== "none" ? nextName.charAt(0).toUpperCase() + nextName.slice(1) : null;

      return {
        prayerTimesList: list,
        qiblaBearing: Math.round(qibla),
        nextPrayer: nextNameStr,
      };
    } catch {
      return { prayerTimesList: [], qiblaBearing: 0, nextPrayer: null };
    }
  }, [numLat, numLng, calcMethod, asrMethod, isValidCoords]);

  return (
    <div className={cn("grid gap-8 lg:grid-cols-2", className)}>
      <div className="space-y-6">
        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Location & Settings</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGeolocate}
              disabled={geoLoading}
              className="gap-2 text-xs"
            >
              <Locate className={cn("size-3.5", geoLoading && "animate-spin")} />
              {geoLoading ? "Locating..." : "Use Current Location"}
            </Button>
          </div>

          {geoError && (
            <p className="text-xs text-destructive">{geoError}</p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="prayer-lat" className="text-xs font-medium text-muted-foreground">
                Latitude (°N)
              </label>
              <Input
                id="prayer-lat"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="51.5074"
                className="mt-1 text-sm"
              />
            </div>
            <div>
              <label htmlFor="prayer-lng" className="text-xs font-medium text-muted-foreground">
                Longitude (°E)
              </label>
              <Input
                id="prayer-lng"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                placeholder="-0.1278"
                className="mt-1 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="calc-method" className="text-xs font-medium text-muted-foreground">
                Calculation Method
              </label>
              <Select value={calcMethod} onValueChange={(val) => setCalcMethod(val as MethodKey)}>
                <SelectTrigger id="calc-method" className="mt-1 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CALC_METHODS).map(([key, item]) => (
                    <SelectItem key={key} value={key} className="text-xs">
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="asr-method" className="text-xs font-medium text-muted-foreground">
                Asr Method (Madhab)
              </label>
              <Select value={asrMethod} onValueChange={(val) => setAsrMethod(val as "shafi" | "hanafi")}>
                <SelectTrigger id="asr-method" className="mt-1 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shafi" className="text-xs">Shafi&apos;i / Standard</SelectItem>
                  <SelectItem value="hanafi" className="text-xs">Hanafi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {isValidCoords && prayerTimesList.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <MapPin className="size-4 text-electric" />
                Prayer Times for {locationName}
              </p>
              {nextPrayer && (
                <span className="rounded-full bg-blue-600/10 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-electric border border-blue-500/20">
                  Next: {nextPrayer}
                </span>
              )}
            </div>

            <ul className="divide-y divide-border rounded-xl border border-border bg-card overflow-hidden">
              {prayerTimesList.map((prayer) => {
                const isNext = nextPrayer?.toLowerCase() === prayer.name.toLowerCase();
                return (
                  <li
                    key={prayer.name}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 text-sm transition-colors",
                      isNext && "bg-blue-600/10 font-semibold"
                    )}
                  >
                    <span className="font-medium text-foreground">{prayer.name}</span>
                    <span className={cn("font-bold", isNext ? "text-blue-700 dark:text-electric" : "text-foreground/80")}>
                      {prayer.time}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-6 text-center">
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Compass className="size-4 text-blue-700 dark:text-electric" />
          Qibla Direction (Bearing)
        </p>

        <p className="text-xs text-muted-foreground mb-6">
          Great-circle bearing from your coordinates to the Kaaba (21.4225° N, 39.8262° E)
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
            <circle cx="100" cy="100" r="4" className="fill-blue-700 dark:fill-electric" />
            <g
              style={{
                transform: `rotate(${qiblaBearing}deg)`,
                transformOrigin: "100px 100px",
                transition: "transform 0.6s ease-out",
              }}
            >
              <polygon
                points="100,30 90,100 100,85 110,100"
                className="fill-blue-700 dark:fill-electric"
              />
            </g>
            <text x="100" y="24" textAnchor="middle" className="fill-muted-foreground text-[10px] font-bold">N</text>
            <text x="176" y="104" textAnchor="middle" className="fill-muted-foreground text-[10px] font-bold">E</text>
            <text x="100" y="184" textAnchor="middle" className="fill-muted-foreground text-[10px] font-bold">S</text>
            <text x="24" y="104" textAnchor="middle" className="fill-muted-foreground text-[10px] font-bold">W</text>
          </svg>
        </div>

        <p className="mt-4 text-sm font-bold text-foreground">
          Qibla Angle: {qiblaBearing}° from North
        </p>
      </div>
    </div>
  );
}
