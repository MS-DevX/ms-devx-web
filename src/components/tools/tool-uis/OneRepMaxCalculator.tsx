"use client";

import { useState, useMemo, useCallback } from "react";
import ResultBox from "@/components/tools/tool-uis/shared/ResultBox";

interface Formula {
  id: string;
  name: string;
  desc: string;
  calc: (w: number, r: number) => number;
  color: string;
}

interface Estimate extends Formula {
  kg: number;
  lbs: number;
}

interface RepTableRow {
  reps: number;
  pct: number;
  kg: number;
  lbs: number;
}

interface BwStrength {
  bwKg: number;
  ratio: number;
}

interface StrengthLevel {
  label: string;
  maleMin: number;
  maleMax: number;
  femaleMin: number;
  femaleMax: number;
}

interface StrengthStandard {
  lift: string;
  levels: StrengthLevel[];
}

interface Result {
  estimates: Estimate[];
  avgKg: number;
  avgLbs: number;
  repTable: RepTableRow[];
  bwStrength: BwStrength | null;
  weightKg: number;
  reps: number;
}

const formulas: Formula[] = [
  {
    id: "epley",
    name: "Epley",
    desc: "Most widely used, accurate for 1-10 reps.",
    calc: (w, r) => w * (1 + 0.0333 * r),
    color: "bg-blue-400",
  },
  {
    id: "brzycki",
    name: "Brzycki",
    desc: "Preferred for higher rep ranges (up to 15).",
    calc: (w, r) => (w * 36) / (37 - r),
    color: "bg-green-400",
  },
  {
    id: "lombardi",
    name: "Lombardi",
    desc: "Better for explosive lifts like power cleans.",
    calc: (w, r) => w * Math.pow(r, 0.1),
    color: "bg-purple-400",
  },
  {
    id: "lander",
    name: "Lander",
    desc: "Accurate for 1-6 rep range.",
    calc: (w, r) => (100 * w) / (101.3 - 2.67123 * r),
    color: "bg-orange-400",
  },
];

const repMaxes = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20];

const strengthStandards: StrengthStandard[] = [
  { lift: "Bench Press", levels: [
    { label: "Beginner", maleMin: 0.5, maleMax: 0.8, femaleMin: 0.3, femaleMax: 0.5 },
    { label: "Novice", maleMin: 0.8, maleMax: 1.1, femaleMin: 0.5, femaleMax: 0.7 },
    { label: "Intermediate", maleMin: 1.1, maleMax: 1.4, femaleMin: 0.7, femaleMax: 0.9 },
    { label: "Advanced", maleMin: 1.4, maleMax: 1.7, femaleMin: 0.9, femaleMax: 1.1 },
    { label: "Elite", maleMin: 1.7, maleMax: 2.5, femaleMin: 1.1, femaleMax: 1.7 },
  ]},
  { lift: "Squat", levels: [
    { label: "Beginner", maleMin: 0.7, maleMax: 1.0, femaleMin: 0.4, femaleMax: 0.7 },
    { label: "Novice", maleMin: 1.0, maleMax: 1.4, femaleMin: 0.7, femaleMax: 1.0 },
    { label: "Intermediate", maleMin: 1.4, maleMax: 1.8, femaleMin: 1.0, femaleMax: 1.3 },
    { label: "Advanced", maleMin: 1.8, maleMax: 2.3, femaleMin: 1.3, femaleMax: 1.7 },
    { label: "Elite", maleMin: 2.3, maleMax: 3.0, femaleMin: 1.7, femaleMax: 2.5 },
  ]},
  { lift: "Deadlift", levels: [
    { label: "Beginner", maleMin: 0.8, maleMax: 1.2, femaleMin: 0.5, femaleMax: 0.8 },
    { label: "Novice", maleMin: 1.2, maleMax: 1.6, femaleMin: 0.8, femaleMax: 1.1 },
    { label: "Intermediate", maleMin: 1.6, maleMax: 2.1, femaleMin: 1.1, femaleMax: 1.5 },
    { label: "Advanced", maleMin: 2.1, maleMax: 2.6, femaleMin: 1.5, femaleMax: 2.0 },
    { label: "Elite", maleMin: 2.6, maleMax: 3.5, femaleMin: 2.0, femaleMax: 2.8 },
  ]},
];

export default function OneRepMaxCalculator() {
  const [unit, setUnit] = useState("metric");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [gender, setGender] = useState("male");
  const [bodyweight, setBodyweight] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo<Result | null>(() => {
    const w = parseFloat(weight);
    const r = parseInt(reps, 10);
    const bw = parseFloat(bodyweight);

    if (!weight || !reps || isNaN(w) || isNaN(r) || w <= 0 || r < 1 || r > 30) return null;

    const weightKg = unit === "metric" ? w : w * 0.453592;

    const estimates = formulas.map((f): Estimate => {
      const raw = f.calc(weightKg, r);
      return {
        ...f,
        kg: Math.round(raw * 10) / 10,
        lbs: Math.round(raw * 2.20462 * 10) / 10,
      };
    });

    const avgKg = Math.round((estimates.reduce((s, e) => s + e.kg, 0) / estimates.length) * 10) / 10;
    const avgLbs = Math.round((estimates.reduce((s, e) => s + e.lbs, 0) / estimates.length) * 10) / 10;

    const repTable = repMaxes.map((rm): RepTableRow => {
      const pct = 100 / (1 + 0.0333 * (rm - 1));
      const est = weightKg * (1 + 0.0333 * (rm - 1));
      return {
        reps: rm,
        pct: Math.round(pct),
        kg: Math.round(est * 10) / 10,
        lbs: Math.round(est * 2.20462 * 10) / 10,
      };
    });

    let bwStrength: BwStrength | null = null;
    if (bodyweight && !isNaN(bw) && bw > 0) {
      const bwKg = unit === "metric" ? bw : bw * 0.453592;
      const ratio = avgKg / bwKg;
      bwStrength = { bwKg: Math.round(bwKg * 10) / 10, ratio: Math.round(ratio * 100) / 100 };
    }

    return {
      estimates,
      avgKg,
      avgLbs,
      repTable,
      bwStrength,
      weightKg: Math.round(weightKg * 10) / 10,
      reps: r,
    };
  }, [weight, reps, unit, bodyweight]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    const lines = [
      "One Rep Max Results:",
      `Estimated 1RM: ${result.avgKg} kg (${result.avgLbs} lbs)`,
      ...result.estimates.map((e) => `  ${e.name}: ${e.kg} kg (${e.lbs} lbs)`),
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  }, [result]);

  const handleReset = useCallback(() => {
    setUnit("metric");
    setWeight("");
    setReps("");
    setGender("male");
    setBodyweight("");
    setCopied(false);
  }, []);

  const inputClasses = "w-full px-4 py-3 rounded-lg border border-border bg-[var(--bg-card)] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-base";
  const labelClasses = "block text-sm font-medium text-foreground mb-2";

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
        <div>
          <label className={labelClasses}>Weight Lifted</label>
          <div className="flex gap-2 mb-2">
            <button onClick={() => setUnit("metric")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${unit === "metric" ? "bg-primary text-white shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground"}`} aria-pressed={unit === "metric"}>kg</button>
            <button onClick={() => setUnit("imperial")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${unit === "imperial" ? "bg-primary text-white shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground"}`} aria-pressed={unit === "imperial"}>lbs</button>
          </div>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder={unit === "metric" ? "e.g. 80" : "e.g. 175"} min="0" step="0.5" className={inputClasses} aria-label="Weight lifted" />
        </div>
        <div>
          <label className={labelClasses}>Reps Performed</label>
          <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} placeholder="e.g. 5" min="1" max="30" className={inputClasses} aria-label="Reps performed" />
          <p className="text-xs text-muted-foreground mt-1.5">Enter reps you completed with this weight (1-30).</p>
        </div>
      </div>

      <div className="mb-6">
        <label className={labelClasses}>Body Weight (optional — for strength standards)</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="number" value={bodyweight} onChange={(e) => setBodyweight(e.target.value)} placeholder={unit === "metric" ? "e.g. 75" : "e.g. 165"} min="0" step="0.1" className={inputClasses} aria-label="Body weight" />
          <div className="flex gap-2 items-center">
            <span className="text-xs text-muted-foreground">Gender:</span>
            <button onClick={() => setGender("male")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${gender === "male" ? "bg-primary text-white shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground"}`} aria-pressed={gender === "male"}>Male</button>
            <button onClick={() => setGender("female")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${gender === "female" ? "bg-primary text-white shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground"}`} aria-pressed={gender === "female"}>Female</button>
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
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Estimated 1RM</div>
            <div className="text-3xl font-bold text-foreground">{result?.avgKg}</div>
            <div className="text-sm text-muted-foreground">kg ({result?.avgLbs} lbs)</div>
          </div>
          <div className="bg-muted rounded-xl p-4 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Performed</div>
            <div className="text-xl font-bold text-foreground">{result?.weightKg} {unit === "metric" ? "kg" : "lbs"} × {result?.reps}</div>
            <div className="text-sm text-muted-foreground">reps</div>
          </div>
        </div>

        <h3 className="text-base font-bold text-foreground mb-3">Formula Comparison</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {result?.estimates.map((e) => {
            const maxVal = Math.max(...result.estimates.map((x) => x.kg), 1);
            const pct = (e.kg / maxVal) * 100;
            return (
              <div key={e.id} className="bg-muted rounded-xl p-4 border border-border">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">{e.name}</div>
                <div className="text-lg font-bold text-foreground">{unit === "metric" ? `${e.kg} kg` : `${e.lbs} lbs`}</div>
                <div className="h-2 bg-background rounded-full overflow-hidden mt-1 mb-1.5">
                  <div className={`h-full rounded-full transition-all duration-500 ${e.color}`} style={{ width: `${pct}%` }} />
                </div>
                <div className="text-xs text-muted-foreground">{e.desc}</div>
              </div>
            );
          })}
        </div>

        <h3 className="text-base font-bold text-foreground mb-3">Rep-Max Table (Epley)</h3>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground border-b border-border">
                <th className="text-left py-2 pr-3">Reps</th>
                <th className="text-left py-2 pr-3">% 1RM</th>
                <th className="text-right py-2">Weight</th>
              </tr>
            </thead>
            <tbody>
              {result?.repTable.map((row) => (
                <tr key={row.reps} className={`border-b border-border ${row.reps === 1 ? "bg-primary/10 font-semibold" : ""}`}>
                  <td className={`py-2 pr-3 ${row.reps === 1 ? "text-primary" : "text-foreground"}`}>{row.reps} RM</td>
                  <td className="py-2 pr-3 text-muted-foreground">{row.pct}%</td>
                  <td className={`py-2 text-right ${row.reps === 1 ? "text-primary" : "text-foreground"}`}>{unit === "metric" ? `${row.kg} kg` : `${row.lbs} lbs`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {result?.bwStrength && (
          <div className="bg-muted rounded-xl p-5 border border-border mb-4">
            <h3 className="text-sm font-bold text-foreground mb-3">Strength Standard</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Your estimated 1RM of {result.avgKg} kg at a body weight of {result.bwStrength.bwKg} kg is a <strong>ratio of {result.bwStrength.ratio}x body weight</strong>.
            </p>
            <div className="space-y-2">
              {strengthStandards.map((s) => {
                const matched = s.levels.find((l) => {
                  const lo = gender === "male" ? l.maleMin : l.femaleMin;
                  const hi = gender === "male" ? l.maleMax : l.femaleMax;
                  return result.bwStrength!.ratio >= lo && result.bwStrength!.ratio < hi;
                }) || s.levels[s.levels.length - 1];
                const idx = s.levels.indexOf(matched);
                const maxLevels = s.levels.length;
                const fillPct = ((idx + 1) / maxLevels) * 100;
                return (
                  <div key={s.lift} className="flex items-center gap-3">
                    <div className="w-24 shrink-0 text-xs text-muted-foreground">{s.lift}</div>
                    <div className="flex-1 h-5 bg-background rounded-lg overflow-hidden border border-border">
                      <div className="h-full rounded-lg bg-primary transition-all duration-500" style={{ width: `${fillPct}%` }} />
                    </div>
                    <div className="w-20 shrink-0 text-right text-xs font-semibold text-foreground">{matched.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground bg-muted rounded-lg p-3 border border-border">
          1RM estimates are most accurate for weights in the 1-10 rep range. The average across all four formulas
          provides the most reliable estimate. Actual 1RM depends on technique, fatigue, and training history.
        </div>
      </ResultBox>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Understanding One Rep Max</h2>
        <div className="bg-muted rounded-xl p-6 border border-border space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>Your one rep max (1RM) is the maximum weight you can lift for a single repetition with proper form. It is the gold standard for measuring strength and is used to set training loads for strength programs.</p>
          <p><strong>Training zones based on 1RM:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Strength:</strong> 85-100% of 1RM (1-5 reps)</li>
            <li><strong>Hypertrophy:</strong> 65-85% of 1RM (6-15 reps)</li>
            <li><strong>Endurance:</strong> 40-65% of 1RM (15+ reps)</li>
            <li><strong>Power:</strong> 50-70% of 1RM (explosive reps)</li>
          </ul>
          <p className="mt-2"><strong>Safety note:</strong> Attempting a true 1RM requires a spotter and proper warm-up. Use estimated 1RMs from submaximal lifts for day-to-day training.</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">The Formulas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {formulas.map((f) => (
            <div key={f.id} className="bg-muted rounded-xl p-4 border border-border">
              <h3 className="font-semibold text-foreground text-sm">{f.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
              <div className={`h-1.5 rounded-full mt-2 ${f.color}`} style={{ width: "60%" }} />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Which formula is most accurate?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              The Epley formula is the most widely validated for the 1-10 rep range. Brzycki performs better
              for higher rep ranges (10-15). Taking the average across all four formulas gives the most
              reliable estimate for most lifters.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              How often should I test my 1RM?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Most programs recommend testing every 4-12 weeks. Beginners should use estimated 1RMs from
              submaximal lifts rather than attempting true max lifts. Intermediate and advanced lifters
              can test more specifically for competition needs.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              What is a good 1RM for my body weight?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Strength relative to body weight is a better measure than absolute numbers. A 1.5x body
              weight bench press or 2x body weight squat is considered intermediate for men. The strength
              standard chart in the calculator shows where you rank by lift and gender.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Can I use 1RM for all lifts?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Yes, but the formula accuracy varies by lift. The formulas work best for compound lifts
              (bench press, squat, deadlift) because they involve multiple muscle groups. Isolation
              exercises may not follow the same strength-curve pattern.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Should I train at my 1RM?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Training at your 1RM is not recommended for regular workouts due to high injury risk and
              CNS fatigue. Use percentages of your estimated 1RM (e.g., 70-85% for most training) and
              only attempt true 1RM lifts when properly prepared with a spotter.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
