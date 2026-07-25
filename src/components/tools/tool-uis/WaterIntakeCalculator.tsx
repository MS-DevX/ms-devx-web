"use client";

import { useState, useMemo, useCallback } from "react";
import ResultBox from "@/components/tools/tool-uis/shared/ResultBox";
import ResultItem from "@/components/tools/tool-uis/shared/ResultItem";

interface ActivityLevel {
  value: string;
  label: string;
  desc: string;
  multiplier: number;
}

interface Climate {
  value: string;
  label: string;
  desc: string;
  multiplier: number;
}

interface WaterResult {
  liters: number;
  milliliters: number;
  cups: number;
  bottles: number;
}

const activityLevels: ActivityLevel[] = [
  { value: "sedentary", label: "Sedentary", desc: "Little or no exercise", multiplier: 1.0 },
  { value: "light", label: "Lightly Active", desc: "1-3 days/week", multiplier: 1.1 },
  { value: "moderate", label: "Moderately Active", desc: "3-5 days/week", multiplier: 1.2 },
  { value: "active", label: "Active", desc: "6-7 days/week", multiplier: 1.3 },
  { value: "very-active", label: "Very Active", desc: "Intense daily", multiplier: 1.5 },
];

const climates: Climate[] = [
  { value: "cool", label: "Cool", desc: "Below 15°C / 59°F", multiplier: 0.95 },
  { value: "moderate", label: "Moderate", desc: "15-25°C / 59-77°F", multiplier: 1.0 },
  { value: "hot", label: "Hot", desc: "Above 25°C / 77°F", multiplier: 1.15 },
];

export default function WaterIntakeCalculator() {
  const [weight, setWeight] = useState<string>("");
  const [unit, setUnit] = useState<string>("kg");
  const [activity, setActivity] = useState<string>("moderate");
  const [climate, setClimate] = useState<string>("moderate");
  const [copied, setCopied] = useState<boolean>(false);

  const result = useMemo((): WaterResult | null => {
    if (!weight || isNaN(Number(weight)) || Number(weight) <= 0) return null;

    const weightKg = unit === "kg" ? Number(weight) : Number(weight) * 0.453592;
    const activityMultiplier = activityLevels.find((a) => a.value === activity)?.multiplier || 1.0;
    const climateMultiplier = climates.find((c) => c.value === climate)?.multiplier || 1.0;

    const liters = weightKg * 0.033 * activityMultiplier * climateMultiplier;

    return {
      liters: Math.round(liters * 100) / 100,
      milliliters: Math.round(liters * 1000),
      cups: Math.round((liters / 0.2365) * 10) / 10,
      bottles: Math.round((liters / 0.5) * 10) / 10,
    };
  }, [weight, unit, activity, climate]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    const text = `Recommended daily water intake: ${result.liters}L (${result.milliliters}mL | ${result.cups} cups | ${result.bottles} bottles)`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  }, [result]);

  const handleReset = useCallback(() => {
    setWeight("");
    setUnit("kg");
    setActivity("moderate");
    setClimate("moderate");
    setCopied(false);
  }, []);

  const inputClasses = "w-full px-4 py-3 rounded-lg border border-border bg-[var(--bg-card)] text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg";
  const selectCardClasses = (isSelected: boolean) =>
    `flex-1 px-3 py-3 rounded-xl border-2 text-center cursor-pointer transition-all duration-200 ${
      isSelected
        ? "border-brand bg-brand-light text-primary font-semibold"
        : "border-border bg-[var(--bg-card)] text-muted-foreground hover:border-brand-light"
    }`;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Your Weight</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter your weight"
              min="0"
              step="0.1"
              className={inputClasses}
              aria-label="Weight input"
            />
            <div className="flex bg-muted rounded-lg p-1 shrink-0">
              <button
                onClick={() => setUnit("kg")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  unit === "kg" ? "bg-brand text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
                aria-pressed={unit === "kg"}
              >
                kg
              </button>
              <button
                onClick={() => setUnit("lbs")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  unit === "lbs" ? "bg-brand text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
                aria-pressed={unit === "lbs"}
              >
                lbs
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-3">Activity Level</label>
        <div className="flex flex-wrap gap-2">
          {activityLevels.map((a) => (
            <button
              key={a.value}
              onClick={() => setActivity(a.value)}
              className={selectCardClasses(activity === a.value)}
              title={a.desc}
            >
              <div className="text-sm">{a.label}</div>
              <div className="text-xs opacity-70 mt-0.5">{a.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-3">Climate</label>
        <div className="flex flex-wrap gap-2">
          {climates.map((c) => (
            <button
              key={c.value}
              onClick={() => setClimate(c.value)}
              className={selectCardClasses(climate === c.value)}
              title={c.desc}
            >
              <div className="text-sm">{c.label}</div>
              <div className="text-xs opacity-70 mt-0.5">{c.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={handleCopy}
          disabled={!result}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-brand-light transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-sm"
        >
          {copied ? "Copied!" : "Copy Result"}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-red-400 transition-all cursor-pointer text-sm"
        >
          Reset
        </button>
      </div>

      <ResultBox show={result !== null}>
        <h3 className="text-base font-bold text-foreground mb-4">Your Daily Water Intake</h3>
        <ResultItem label="Liters" value={`${result?.liters} L`} highlight />
        <ResultItem label="Milliliters" value={`${result?.milliliters} mL`} />
        <ResultItem label="Cups (236.5 mL)" value={`${result?.cups} cups`} />
        <ResultItem label="Bottles (500 mL)" value={`${result?.bottles} bottles`} />
      </ResultBox>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Hydration Tips</h2>
        <div className="bg-[var(--bg-soft)] rounded-xl p-6 border border-border space-y-3 text-sm text-muted-foreground">
          <p>💧 <strong>Start your day:</strong> Drink a glass of water as soon as you wake up to kickstart your metabolism.</p>
          <p>💧 <strong>Before meals:</strong> Drink water 30 minutes before eating to aid digestion and prevent overeating.</p>
          <p>💧 <strong>During exercise:</strong> Drink 200-300 mL every 15-20 minutes during physical activity.</p>
          <p>💧 <strong>Listen to your body:</strong> Thirst is a late signal of dehydration. Sip water consistently throughout the day.</p>
          <p>💧 <strong>Track your intake:</strong> Use a marked water bottle to monitor how much you drink daily.</p>
          <p>💧 <strong>Adjust for weather:</strong> In hot or humid conditions, increase your intake beyond the calculated baseline.</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              How is daily water intake calculated?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              The calculator uses your body weight as the baseline (0.033 liters per kg), then adjusts for
              your activity level and climate. Active individuals and those in hot climates need additional
              water to compensate for fluid loss through sweat.
            </p>
          </details>
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Is 8 glasses of water per day still accurate?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              The &quot;8×8&quot; rule (eight 8-ounce glasses) is a general guideline, but individual needs vary
              significantly based on weight, activity, climate, and overall health. Our calculator provides
              a personalized recommendation tailored to your specific inputs.
            </p>
          </details>
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Does this include water from food?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              No, this calculation estimates your total fluid intake from beverages only. Most people get
              20-30% of their daily water from food (fruits, vegetables, soups). You can adjust your
              drinking target downward slightly if your diet is rich in water-dense foods.
            </p>
          </details>
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Can I drink too much water?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Yes, excessive water intake can lead to hyponatremia (low blood sodium). Stick close to your
              calculated recommendation and increase intake based on thirst, exercise, and heat exposure.
              If you have kidney or heart conditions, consult your doctor.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
