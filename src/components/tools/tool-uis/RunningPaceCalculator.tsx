"use client";

import { useState, useMemo, useCallback } from "react";
import ResultBox from "@/components/tools/tool-uis/shared/ResultBox";

interface RaceDistance {
  label: string;
  km: number;
  icon: string;
}

interface RaceEstimate extends RaceDistance {
  estMinutes: number;
}

interface Result {
  pacePerKm: number;
  pacePerMile: number;
  paceDisplayKm: string;
  paceDisplayMile: string;
  totalMinutes: number;
  distKm: number;
  distMiles: number;
  speedKph: number;
  speedMph: number;
  raceEstimates: RaceEstimate[];
}

const raceDistances: RaceDistance[] = [
  { label: "1 mile", km: 1.609, icon: "🏃" },
  { label: "5 km", km: 5, icon: "🏃" },
  { label: "10 km", km: 10, icon: "🏃" },
  { label: "Half Marathon", km: 21.0975, icon: "🏅" },
  { label: "Marathon", km: 42.195, icon: "🏅" },
  { label: "50 km", km: 50, icon: "🏆" },
  { label: "100 km", km: 100, icon: "🏆" },
];

function formatPace(minPerKm: number): string {
  if (!minPerKm || !isFinite(minPerKm)) return "-";
  const totalSec = Math.round(minPerKm * 60);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatTimeHMS(totalMinutes: number): string {
  if (!totalMinutes || !isFinite(totalMinutes)) return "-";
  const h = Math.floor(totalMinutes / 60);
  const m = Math.floor(totalMinutes % 60);
  const s = Math.round((totalMinutes * 60) % 60);
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default function RunningPaceCalculator() {
  const [unit, setUnit] = useState("km");
  const [distance, setDistance] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo<Result | null>(() => {
    const dist = parseFloat(distance);
    const h = parseInt(hours, 10) || 0;
    const m = parseInt(minutes, 10) || 0;
    const s = parseInt(seconds, 10) || 0;

    if (!distance || isNaN(dist) || dist <= 0) return null;
    if (h === 0 && m === 0 && s === 0) return null;

    const totalMinutes = h * 60 + m + s / 60;
    const distKm = unit === "km" ? dist : dist * 1.60934;
    const distMiles = unit === "miles" ? dist : dist / 1.60934;

    const pacePerKm = totalMinutes / distKm;
    const pacePerMile = totalMinutes / distMiles;

    const raceEstimates = raceDistances.map((rd): RaceEstimate => ({
      ...rd,
      estMinutes: pacePerKm * rd.km,
    }));

    const speedKph = distKm / (totalMinutes / 60);
    const speedMph = distMiles / (totalMinutes / 60);

    return {
      pacePerKm,
      pacePerMile,
      paceDisplayKm: formatPace(pacePerKm),
      paceDisplayMile: formatPace(pacePerMile),
      totalMinutes: Math.round(totalMinutes * 100) / 100,
      distKm: Math.round(distKm * 100) / 100,
      distMiles: Math.round(distMiles * 100) / 100,
      speedKph: Math.round(speedKph * 100) / 100,
      speedMph: Math.round(speedMph * 100) / 100,
      raceEstimates,
    };
  }, [distance, hours, minutes, seconds, unit]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    const lines = [
      "Running Pace Calculator Results:",
      `Distance: ${result.distKm} km / ${result.distMiles} miles`,
      `Time: ${formatTimeHMS(result.totalMinutes)}`,
      `Pace: ${result.paceDisplayKm} /km, ${result.paceDisplayMile} /mile`,
      `Speed: ${result.speedKph} kph / ${result.speedMph} mph`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  }, [result]);

  const handleReset = useCallback(() => {
    setUnit("km");
    setDistance("");
    setHours("");
    setMinutes("");
    setSeconds("");
    setCopied(false);
  }, []);

  const inputClasses = "w-full px-4 py-3 rounded-lg border border-border bg-[var(--bg-card)] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-base";
  const labelClasses = "block text-sm font-medium text-foreground mb-2";

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
        <div>
          <label className={labelClasses}>Distance</label>
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setUnit("km")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                unit === "km" ? "bg-primary text-white shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
              aria-pressed={unit === "km"}
            >
              Kilometers
            </button>
            <button
              onClick={() => setUnit("miles")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                unit === "miles" ? "bg-primary text-white shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
              aria-pressed={unit === "miles"}
            >
              Miles
            </button>
          </div>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder={unit === "km" ? "e.g. 10" : "e.g. 6.2"}
            min="0"
            step="0.01"
            className={inputClasses}
            aria-label="Distance"
          />
        </div>

        <div>
          <label className={labelClasses}>Time</label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="hh"
                min="0"
                max="99"
                className={inputClasses}
                aria-label="Hours"
              />
              <div className="text-xs text-muted-foreground text-center mt-1">Hours</div>
            </div>
            <div>
              <input
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                placeholder="mm"
                min="0"
                max="59"
                className={inputClasses}
                aria-label="Minutes"
              />
              <div className="text-xs text-muted-foreground text-center mt-1">Minutes</div>
            </div>
            <div>
              <input
                type="number"
                value={seconds}
                onChange={(e) => setSeconds(e.target.value)}
                placeholder="ss"
                min="0"
                max="59"
                className={inputClasses}
                aria-label="Seconds"
              />
              <div className="text-xs text-muted-foreground text-center mt-1">Seconds</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-4 mb-6">
        <button onClick={handleCopy} disabled={!result} className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/60 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-sm">
          {copied ? "Copied!" : "Copy Results"}
        </button>
        <button onClick={handleReset} className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-red-400 transition-all cursor-pointer text-sm">
          Reset
        </button>
      </div>

      <ResultBox show={result !== null}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-muted rounded-xl p-4 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Pace per km</div>
            <div className="text-2xl font-bold text-foreground">{result?.paceDisplayKm}</div>
            <div className="text-xs text-muted-foreground">min/km</div>
          </div>
          <div className="bg-muted rounded-xl p-4 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Pace per mile</div>
            <div className="text-2xl font-bold text-foreground">{result?.paceDisplayMile}</div>
            <div className="text-xs text-muted-foreground">min/mile</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-muted rounded-xl p-4 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Speed</div>
            <div className="text-lg font-bold text-foreground">{result?.speedKph}</div>
            <div className="text-xs text-muted-foreground">km/h</div>
          </div>
          <div className="bg-muted rounded-xl p-4 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Speed</div>
            <div className="text-lg font-bold text-foreground">{result?.speedMph}</div>
            <div className="text-xs text-muted-foreground">mph</div>
          </div>
        </div>

        <h3 className="text-base font-bold text-foreground mb-3">Estimated Race Times</h3>
        <div className="space-y-2 mb-4">
          {result?.raceEstimates.map((race, i) => {
            const maxTime = result.raceEstimates[result.raceEstimates.length - 1].estMinutes;
            const pct = (race.estMinutes / maxTime) * 100;
            return (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm">{race.icon}</span>
                <div className="w-28 shrink-0 text-xs font-medium text-muted-foreground">{race.label}</div>
                <div className="flex-1 h-6 bg-muted rounded-lg overflow-hidden border border-border">
                  <div className="h-full rounded-lg bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
                <div className="w-28 shrink-0 text-right text-sm font-semibold text-foreground">
                  {formatTimeHMS(race.estMinutes)}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-xs text-muted-foreground bg-muted rounded-lg p-3 border border-border">
          Race time estimates assume even pacing throughout the entire distance. Actual race times vary based on
          terrain, elevation, weather, and fatigue management.
        </div>
      </ResultBox>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Understanding Running Pace</h2>
        <div className="bg-muted rounded-xl p-6 border border-border space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p><strong>Pace</strong> is the time it takes to cover a unit of distance, typically expressed as
          minutes per kilometer (min/km) or minutes per mile (min/mile). Unlike speed (km/h or mph), pace
          gives you a per-distance time target that is easier to use during a run.</p>
          <p><strong>Even pacing</strong> is the key to race success. Most runners who go out too fast
          experience significant slowdowns in the second half of a race. Use the race time estimates to
          set realistic goals based on your current fitness.</p>
          <p><strong>Pace awareness</strong> improves with experience. Using a GPS watch or phone app
          helps you stay on track during training runs and races.</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Common Race Distances</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {raceDistances.map((rd) => (
            <div key={rd.label} className="bg-muted rounded-xl p-4 border border-border">
              <div className="text-lg mb-1">{rd.icon}</div>
              <h3 className="font-semibold text-foreground text-sm">{rd.label}</h3>
              <p className="text-xs text-muted-foreground">{rd.km} km / {Math.round(rd.km / 1.609 * 100) / 100} miles</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              What is a good running pace for a beginner?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              A comfortable conversational pace for beginners is typically 6:00-8:00 min/km (9:30-12:50
              min/mile). Focus on building endurance at an easy pace rather than speed. Most of your
              training runs should be at a pace where you can hold a conversation.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              How do I improve my running pace?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              To improve pace, incorporate a mix of easy runs (80% of mileage), tempo runs, interval
              training, and hill repeats. Strength training and proper recovery also contribute to faster
              running. Increase weekly mileage gradually — no more than 10% per week.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              What is the difference between pace and speed?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Pace (min/km or min/mile) tells you how long it takes to cover a fixed distance — useful
              during a run for staying on target. Speed (km/h or mph) tells you how much distance you
              cover in a fixed time. Pace is more commonly used by runners because it directly relates
              to race goal times.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              How does elevation affect pace?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Hills significantly affect pace. A general rule: climbing a steep hill at the same effort
              level will slow your pace by 30-60 seconds per km. Descending may speed it up by 10-20
              seconds per km. Trail running with elevation changes requires adjusting pace expectations.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              What is negative splitting?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Negative splitting means running the second half of a race faster than the first half. It is
              considered the optimal pacing strategy because it avoids early fatigue and allows you to
              capitalize on preserved energy. Most personal bests at distances from 5k to marathon are
              set with a slight negative split.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
