"use client";

import { useState, useMemo, useCallback } from "react";
import ResultBox from "@/components/tools/tool-uis/shared/ResultBox";

interface GenderParams {
  base: number;
  perInch: number;
}

interface Method {
  id: string;
  name: string;
  desc: string;
  male: GenderParams;
  female: GenderParams;
  color: string;
}

interface MethodEntry {
  id: string;
  name: string;
  desc: string;
  kg: number;
  lbs: number;
  color: string;
}

interface Result {
  entries: MethodEntry[];
  minKg: number;
  maxKg: number;
  avgIdeal: number;
  bmiLow: number;
  bmiHigh: number;
  rangeKg: { low: number; high: number };
  rangeLbs: { low: number; high: number };
  heightCm: number;
}

const methods: Method[] = [
  {
    id: "devine",
    name: "Devine (1974)",
    desc: "Developed for estimating drug dosages, widely adopted for ideal weight.",
    male: { base: 50, perInch: 2.3 },
    female: { base: 45.5, perInch: 2.3 },
    color: "bg-blue-400",
  },
  {
    id: "robinson",
    name: "Robinson (1983)",
    desc: "A revision of the Devine formula with slightly different base weights.",
    male: { base: 52, perInch: 1.9 },
    female: { base: 49, perInch: 1.7 },
    color: "bg-green-400",
  },
  {
    id: "miller",
    name: "Miller (1983)",
    desc: "Developed based on actuarial data for life insurance assessments.",
    male: { base: 56.2, perInch: 1.41 },
    female: { base: 53.1, perInch: 1.36 },
    color: "bg-purple-400",
  },
  {
    id: "hamwi",
    name: "Hamwi (1964)",
    desc: "One of the earliest formulas, originally for dietary consultation.",
    male: { base: 48, perInch: 2.7 },
    female: { base: 45.5, perInch: 2.2 },
    color: "bg-orange-400",
  },
];

function calcIdealWeight(method: Method, gender: "male" | "female", heightInches: number): number {
  const params = method[gender];
  const over = Math.max(0, heightInches - 60);
  return Math.round((params.base + params.perInch * over) * 10) / 10;
}

export default function IdealWeightCalculator() {
  const [unit, setUnit] = useState("metric");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo<Result | null>(() => {
    let heightIn: number;
    if (unit === "metric") {
      const cm = parseFloat(heightCm);
      if (!heightCm || isNaN(cm) || cm <= 0) return null;
      heightIn = cm / 2.54;
    } else {
      const ft = parseInt(heightFeet, 10) || 0;
      const inc = parseInt(heightInches, 10) || 0;
      heightIn = ft * 12 + inc;
      if (heightIn <= 0) return null;
    }

    const heightCmNum = Math.round(heightIn * 2.54);
    const heightM = heightCmNum / 100;

    const entries = methods.map((m): MethodEntry => {
      const kg = calcIdealWeight(m, gender, heightIn);
      const lbs = Math.round(kg * 2.20462 * 10) / 10;
      return {
        id: m.id,
        name: m.name,
        desc: m.desc,
        kg,
        lbs,
        color: m.color,
      };
    });

    const minKg = Math.min(...entries.map((e) => e.kg));
    const maxKg = Math.max(...entries.map((e) => e.kg));

    const bmiLow = Math.round(18.5 * heightM * heightM * 10) / 10;
    const bmiHigh = Math.round(24.9 * heightM * heightM * 10) / 10;

    const rangeKg = {
      low: Math.round(bmiLow * 10) / 10,
      high: Math.round(bmiHigh * 10) / 10,
    };
    const rangeLbs = {
      low: Math.round(bmiLow * 2.20462 * 10) / 10,
      high: Math.round(bmiHigh * 2.20462 * 10) / 10,
    };

    const avgIdeal = Math.round((entries.reduce((s, e) => s + e.kg, 0) / entries.length) * 10) / 10;

    return {
      entries,
      minKg,
      maxKg,
      avgIdeal,
      bmiLow,
      bmiHigh,
      rangeKg,
      rangeLbs,
      heightCm: heightCmNum,
    };
  }, [unit, gender, heightCm, heightFeet, heightInches]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    const lines = [
      "Ideal Weight Calculator Results",
      `Height: ${result.heightCm} cm`,
      ...result.entries.map((e) => `${e.name}: ${e.kg} kg (${e.lbs} lbs)`),
      `Average: ${result.avgIdeal} kg`,
      `Healthy BMI Range: ${result.rangeKg.low} - ${result.rangeKg.high} kg`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  }, [result]);

  const handleReset = useCallback(() => {
    setUnit("metric");
    setGender("male");
    setHeightCm("");
    setHeightFeet("");
    setHeightInches("");
    setCopied(false);
  }, []);

  const inputClasses = "w-full px-4 py-3 rounded-lg border border-border bg-[var(--bg-card)] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-base";
  const labelClasses = "block text-sm font-medium text-foreground mb-2";

  const spanKg = (v: number) => `${v} kg`;
  const spanLbs = (v: number) => `${v} lbs`;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
        <div>
          <label className={labelClasses}>Unit System</label>
          <div className="flex gap-2">
            <button
              onClick={() => setUnit("metric")}
              className={`flex-1 px-4 py-3 rounded-lg border-2 text-center font-medium transition-all ${
                unit === "metric"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-[var(--bg-card)] text-muted-foreground hover:border-primary/60"
              }`}
              aria-pressed={unit === "metric"}
            >
              Metric
            </button>
            <button
              onClick={() => setUnit("imperial")}
              className={`flex-1 px-4 py-3 rounded-lg border-2 text-center font-medium transition-all ${
                unit === "imperial"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-[var(--bg-card)] text-muted-foreground hover:border-primary/60"
              }`}
              aria-pressed={unit === "imperial"}
            >
              Imperial
            </button>
          </div>
        </div>

        <div>
          <label className={labelClasses}>Gender</label>
          <div className="flex gap-2">
            <button
              onClick={() => setGender("male")}
              className={`flex-1 px-4 py-3 rounded-lg border-2 text-center font-medium transition-all ${
                gender === "male"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-[var(--bg-card)] text-muted-foreground hover:border-primary/60"
              }`}
              aria-pressed={gender === "male"}
            >
              Male
            </button>
            <button
              onClick={() => setGender("female")}
              className={`flex-1 px-4 py-3 rounded-lg border-2 text-center font-medium transition-all ${
                gender === "female"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-[var(--bg-card)] text-muted-foreground hover:border-primary/60"
              }`}
              aria-pressed={gender === "female"}
            >
              Female
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className={labelClasses}>
          Height ({unit === "metric" ? "cm" : "feet & inches"})
        </label>
        <div className="mt-2">
          {unit === "metric" ? (
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              placeholder="e.g. 175"
              min="0"
              step="0.1"
              className={inputClasses}
              aria-label="Height in centimeters"
            />
          ) : (
            <div className="flex gap-2">
              <input
                type="number"
                value={heightFeet}
                onChange={(e) => setHeightFeet(e.target.value)}
                placeholder="Feet"
                min="0"
                className={`${inputClasses} w-1/2`}
                aria-label="Height in feet"
              />
              <input
                type="number"
                value={heightInches}
                onChange={(e) => setHeightInches(e.target.value)}
                placeholder="Inches"
                min="0"
                max="11"
                className={`${inputClasses} w-1/2`}
                aria-label="Height in inches"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-4 mb-6">
        <button
          onClick={handleCopy}
          disabled={!result}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/60 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-sm"
        >
          {copied ? "Copied!" : "Copy Results"}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-red-400 transition-all cursor-pointer text-sm"
        >
          Reset
        </button>
      </div>

      <ResultBox show={result !== null}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {result?.entries.map((entry) => {
            const maxVal = Math.max(...result.entries.map((e) => e.kg), 1);
            const pct = (entry.kg / maxVal) * 100;
            return (
              <div
                key={entry.id}
                className="bg-muted rounded-xl p-4 border border-border flex flex-col"
              >
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                  {entry.name}
                </div>
                <div className="text-xl font-bold text-foreground mb-1">
                  {unit === "metric" ? spanKg(entry.kg) : spanLbs(entry.lbs)}
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${entry.color}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed flex-1">
                  {entry.desc}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-muted rounded-xl p-5 border border-border mb-6">
          <h3 className="text-sm font-bold text-foreground mb-3">Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Average Ideal Weight: </span>
              <span className="text-foreground font-semibold">
                {unit === "metric" ? spanKg(result!.avgIdeal) : spanLbs(Math.round(result!.avgIdeal * 2.20462 * 10) / 10)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Range (all methods): </span>
              <span className="text-foreground font-semibold">
                {unit === "metric"
                  ? `${result!.minKg} - ${result!.maxKg} kg`
                  : `${Math.round(result!.minKg * 2.20462 * 10) / 10} - ${Math.round(result!.maxKg * 2.20462 * 10) / 10} lbs`}
              </span>
            </div>
          </div>
        </div>

        <h3 className="text-base font-bold text-foreground mb-3">Healthy BMI Weight Range</h3>
        <div className="bg-muted rounded-xl p-5 border border-border">
          <p className="text-sm text-muted-foreground mb-3">
            Based on a healthy BMI of <strong>18.5 - 24.9 kg/m&sup2;</strong> for your height ({result?.heightCm} cm):
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-background rounded-lg h-8 relative overflow-hidden border border-border">
              <div
                className="absolute inset-y-0 left-0 bg-green-400/60 rounded-lg"
                style={{
                  left: `${18.5 / 24.9 * 100}%`,
                  right: `${100 - 24.9 / 24.9 * 100}%`,
                }}
              />
            </div>
            <div className="text-sm font-semibold text-foreground whitespace-nowrap">
              {unit === "metric"
                ? `${result?.rangeKg.low} - ${result?.rangeKg.high} kg`
                : `${result?.rangeLbs.low} - ${result?.rangeLbs.high} lbs`}
            </div>
          </div>
        </div>
      </ResultBox>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">About These Formulas</h2>
        <div className="bg-muted rounded-xl p-6 border border-border space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>Ideal body weight formulas provide an estimate of what a person at a given height might weigh at an optimal body composition. They are used in clinical settings for medication dosing, nutritional assessment, and as general health benchmarks.</p>
          <p><strong>Important:</strong> These formulas do not account for muscle mass, bone density, body fat distribution, or frame size. Use them as a general reference rather than a strict target.</p>
          <p>The healthy BMI range (18.5-24.9) provides a broader, evidence-based healthy weight zone. Most ideal weight formulas fall within this range for average builds.</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Which formula is most accurate?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              No single formula is universally &quot;most accurate&quot; since individual body composition varies widely.
              The Devine formula is most commonly used in clinical settings for medication dosing. The Miller
              formula was derived from larger actuarial datasets. Take the average across all four as a
              reasonable estimate for most people.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              What is the difference between ideal weight and healthy weight?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              &quot;Ideal weight&quot; is a specific number from a formula, while &quot;healthy weight&quot; is the full BMI range
              (18.5-24.9) considered healthy for a given height. The healthy BMI range accounts for natural
              variation in body types and is generally preferred over formula-based ideal weights.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Do these formulas work for athletes or muscular people?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              No. These formulas do not account for muscle mass. Athletes with high muscle mass may weigh
              more than these formulas suggest while having very low body fat. Body fat percentage is a
              better metric for athletes than weight-based formulas.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Can I use this to set weight loss goals?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Yes, but use the healthy BMI range as your primary guide rather than a specific formula number.
              Aim to stay within the healthy range for your height, and focus on body composition rather than
              just the number on the scale.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Why do the formulas give different results?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Each formula was developed using different populations and methodologies. Devine used
              pharmaceutical data, Miller used life insurance records, Hamwi and Robinson used clinical
              data from different eras. The differences reflect varying assumptions about ideal body
              composition at the time each was created.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
