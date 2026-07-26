"use client";

import { useState, useMemo, useCallback } from "react";
import ResultBox from "@/components/tools/tool-uis/shared/ResultBox";

interface Goal {
  value: string;
  label: string;
  desc: string;
  color: string;
}

interface ActivityLevel {
  value: string;
  label: string;
  desc: string;
}

interface ProteinRange {
  low: number;
  high: number;
  mid: number;
}

interface FoodExample {
  name: string;
  amount: string;
  protein: number;
}

interface Result {
  mid: number;
  low: number;
  high: number;
  perMeal: number;
  meals: number;
  range: ProteinRange;
  weightKg: number;
  calorieProtein: number;
}

const goals: Goal[] = [
  { value: "maintain", label: "Maintenance", desc: "Stay at your current weight", color: "bg-green-400" },
  { value: "fat-loss", label: "Fat Loss", desc: "Preserve muscle while losing fat", color: "bg-orange-400" },
  { value: "muscle-gain", label: "Muscle Gain", desc: "Build muscle mass", color: "bg-blue-400" },
];

const activityLevels: ActivityLevel[] = [
  { value: "sedentary", label: "Sedentary", desc: "Little or no exercise" },
  { value: "light", label: "Lightly Active", desc: "1-3 days/week" },
  { value: "moderate", label: "Moderately Active", desc: "3-5 days/week" },
  { value: "active", label: "Very Active", desc: "6-7 days/week" },
  { value: "extra", label: "Extra Active", desc: "Physical job / intense daily" },
];

const proteinRanges: Record<string, Record<string, ProteinRange>> = {
  maintain: {
    sedentary:   { low: 0.8,  high: 1.0,  mid: 0.9 },
    light:       { low: 1.0,  high: 1.2,  mid: 1.1 },
    moderate:    { low: 1.2,  high: 1.4,  mid: 1.3 },
    active:      { low: 1.4,  high: 1.6,  mid: 1.5 },
    extra:       { low: 1.6,  high: 1.8,  mid: 1.7 },
  },
  "fat-loss": {
    sedentary:   { low: 1.4,  high: 1.6,  mid: 1.5 },
    light:       { low: 1.6,  high: 1.8,  mid: 1.7 },
    moderate:    { low: 1.8,  high: 2.0,  mid: 1.9 },
    active:      { low: 2.0,  high: 2.2,  mid: 2.1 },
    extra:       { low: 2.2,  high: 2.4,  mid: 2.3 },
  },
  "muscle-gain": {
    sedentary:   { low: 1.2,  high: 1.4,  mid: 1.3 },
    light:       { low: 1.4,  high: 1.6,  mid: 1.5 },
    moderate:    { low: 1.6,  high: 1.8,  mid: 1.7 },
    active:      { low: 1.8,  high: 2.0,  mid: 1.9 },
    extra:       { low: 2.0,  high: 2.2,  mid: 2.1 },
  },
};

const mealOptions = [3, 4, 5, 6];

const foodExamples: { high: FoodExample[] } = {
  high: [
    { name: "Chicken Breast", amount: "100g", protein: 31 },
    { name: "Eggs", amount: "3 large", protein: 18 },
    { name: "Greek Yogurt", amount: "1 cup (200g)", protein: 20 },
    { name: "Cottage Cheese", amount: "1 cup (200g)", protein: 24 },
    { name: "Tofu", amount: "150g", protein: 12 },
    { name: "Whey Protein", amount: "1 scoop (30g)", protein: 24 },
  ],
};

export default function ProteinIntakeCalculator() {
  const [unit, setUnit] = useState("metric");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("maintain");
  const [activity, setActivity] = useState("moderate");
  const [meals, setMeals] = useState(4);
  const [copied, setCopied] = useState(false);

  const result = useMemo<Result | null>(() => {
    const weightNum = parseFloat(weight);
    if (!weight || isNaN(weightNum) || weightNum <= 0) return null;

    const weightKg = unit === "metric" ? weightNum : weightNum * 0.453592;
    const range = proteinRanges[goal]?.[activity];
    if (!range) return null;

    const midG = Math.round(weightKg * range.mid);
    const lowG = Math.round(weightKg * range.low);
    const highG = Math.round(weightKg * range.high);

    const perMeal = Math.round(midG / meals);

    const calorieProtein = midG * 4;

    return {
      mid: midG,
      low: lowG,
      high: highG,
      perMeal,
      meals,
      range,
      weightKg: Math.round(weightKg * 10) / 10,
      calorieProtein,
    };
  }, [weight, unit, goal, activity, meals]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    const lines = [
      "Daily Protein Intake:",
      `Recommended: ${result.mid}g/day`,
      `Range: ${result.low} - ${result.high}g/day`,
      `Per meal (${result.meals} meals): ${result.perMeal}g`,
      `Calories from protein: ${result.calorieProtein} kcal`,
      `Body weight: ${result.weightKg} kg`,
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
    setGoal("maintain");
    setActivity("moderate");
    setMeals(4);
    setCopied(false);
  }, []);

  const inputClasses = "w-full px-4 py-3 rounded-lg border border-border bg-[var(--bg-card)] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-base";
  const labelClasses = "block text-sm font-medium text-foreground mb-2";
  const selectCardClasses = (isSelected: boolean) =>
    `flex-1 min-w-[90px] px-3 py-3 rounded-xl border-2 text-center cursor-pointer transition-all duration-200 ${
      isSelected
        ? "border-primary bg-primary/10 text-primary font-semibold"
        : "border-border bg-[var(--bg-card)] text-muted-foreground hover:border-primary/60"
    }`;

  const goalInfo = goals.find((g) => g.value === goal);
  const rangeInfo = result && proteinRanges[goal]?.[activity];

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
          <label className={labelClasses}>
            Weight ({unit === "metric" ? "kg" : "lbs"})
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={unit === "metric" ? "e.g. 75" : "e.g. 165"}
            min="0"
            step="0.1"
            className={inputClasses}
            aria-label="Body weight"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className={labelClasses}>Your Goal</label>
        <div className="flex flex-wrap gap-2">
          {goals.map((g) => (
            <button
              key={g.value}
              onClick={() => setGoal(g.value)}
              className={selectCardClasses(goal === g.value)}
              title={g.desc}
            >
              <div className="text-sm">{g.label}</div>
              <div className="text-xs opacity-70 mt-0.5">{g.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className={labelClasses}>Activity Level</label>
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
        <label className={labelClasses}>Meals Per Day</label>
        <div className="flex flex-wrap gap-2">
          {mealOptions.map((m) => (
            <button
              key={m}
              onClick={() => setMeals(m)}
              className={selectCardClasses(meals === m)}
            >
              <div className="text-sm">{m} meals</div>
            </button>
          ))}
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

      {result && (
        <ResultBox show={true}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-muted rounded-xl p-4 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Daily Target</div>
            <div className="text-2xl font-bold text-foreground">{result?.mid}g</div>
            <div className="text-xs text-muted-foreground">protein / day</div>
          </div>
          <div className="bg-muted rounded-xl p-4 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Per Meal</div>
            <div className="text-2xl font-bold text-foreground">{result?.perMeal}g</div>
            <div className="text-xs text-muted-foreground">{result?.meals} meals</div>
          </div>
          <div className="bg-muted rounded-xl p-4 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Calories</div>
            <div className="text-2xl font-bold text-foreground">{result?.calorieProtein}</div>
            <div className="text-xs text-muted-foreground">kcal from protein</div>
          </div>
        </div>

        <h3 className="text-base font-bold text-foreground mb-3">Recommended Range</h3>
        <div className="bg-muted rounded-xl p-5 border border-border mb-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1 h-7 bg-background rounded-lg overflow-hidden border border-border relative">
              <div
                className="absolute inset-y-0 left-0 bg-primary rounded-lg transition-all duration-500 opacity-60"
                style={{ width: `${(result!.low / (result!.high * 1.15)) * 100}%` }}
              />
              <div
                className="absolute inset-y-0 bg-primary rounded-lg transition-all duration-500"
                style={{
                  left: `${(result!.low / (result!.high * 1.15)) * 100}%`,
                  width: `${((result!.high - result!.low) / (result!.high * 1.15)) * 100}%`,
                  opacity: 0.9,
                }}
              />
            </div>
            <div className="text-sm font-semibold text-foreground whitespace-nowrap">
              {result?.low} - {result?.high}g
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Based on {rangeInfo ? `${rangeInfo.low} - ${rangeInfo.high}g/kg` : ""} for {goalInfo?.label?.toLowerCase()} with {activityLevels.find((a) => a.value === activity)?.label?.toLowerCase()} activity.
          </p>
        </div>

        <h3 className="text-base font-bold text-foreground mb-3">Per-Meal Breakdown</h3>
        <div className="space-y-2 mb-6">
          {mealOptions.map((m) => {
            const gPerMeal = result ? Math.round(result.mid / m) : 0;
            const isSelected = m === result?.meals;
            return (
              <div key={m} className="flex items-center gap-3">
                <div className="w-16 shrink-0 text-xs font-medium text-muted-foreground">{m} meals</div>
                <div className="flex-1 h-7 bg-muted rounded-lg overflow-hidden border border-border">
                  <div
                    className={`h-full rounded-lg transition-all duration-500 ${isSelected ? "bg-primary" : "bg-primary/30"}`}
                    style={{ width: `${(gPerMeal / (result ? Math.round(result.mid / 3) : 1)) * 100}%` }}
                  />
                </div>
                <div className="w-16 shrink-0 text-right">
                  <span className={`text-sm font-semibold ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                    {gPerMeal}g
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <h3 className="text-base font-bold text-foreground mb-3">High-Protein Food Examples</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
          {foodExamples.high.map((food, i) => (
            <div key={i} className="bg-muted rounded-lg p-3 border border-border flex justify-between items-center">
              <div>
                <div className="text-sm font-medium text-foreground">{food.name}</div>
                <div className="text-xs text-muted-foreground">{food.amount}</div>
              </div>
              <div className="text-sm font-bold text-primary">{food.protein}g</div>
            </div>
          ))}
        </div>
      </ResultBox>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Why Protein Matters</h2>
        <div className="bg-muted rounded-xl p-6 border border-border space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>Protein is essential for building and repairing tissues, producing enzymes and hormones, and maintaining muscle mass. Unlike carbs and fat, the body does not store protein, so a consistent daily intake is critical.</p>
          <p><strong>For muscle gain:</strong> Adequate protein provides the amino acids necessary for muscle protein synthesis after resistance training. Pair it with a calorie surplus for optimal growth.</p>
          <p><strong>For fat loss:</strong> Higher protein intake (1.6-2.4 g/kg) helps preserve lean mass during a calorie deficit, increases satiety, and has a higher thermic effect — meaning your body burns more calories digesting protein than carbs or fat.</p>
          <p><strong>For maintenance:</strong> A moderate protein intake supports general health, immune function, and recovery from daily activity.</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Timing Your Protein Intake</h2>
        <div className="bg-muted rounded-xl p-6 border border-border space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p><strong>Spread it out:</strong> Consuming 20-40g of protein per meal, spaced 3-4 hours apart, maximizes muscle protein synthesis throughout the day.</p>
          <p><strong>Post-workout:</strong> A protein-rich meal within 2 hours after exercise supports recovery and muscle adaptation.</p>
          <p><strong>Before bed:</strong> Casein protein (found in dairy) digests slowly and can provide a steady stream of amino acids during sleep. A serving of cottage cheese or Greek yogurt is an excellent option.</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Can I eat too much protein?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              For healthy individuals, high protein intake is generally safe. The recommended ranges on this
              calculator (up to 2.4 g/kg) are well within safe limits. Extremely high intakes (above 3.5 g/kg)
              may cause digestive discomfort and should be discussed with a healthcare professional.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Is protein harmful to kidneys?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              In people with healthy kidneys, high protein intake does not cause kidney damage. However, those
              with pre-existing kidney disease should limit protein intake and consult their doctor. If you have
              a history of kidney issues, speak with a healthcare professional before increasing protein.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Do I need protein supplements?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              No. Whole foods like chicken, fish, eggs, dairy, legumes, and tofu can meet all your protein needs.
              Supplements like whey or plant protein powders are convenient options for hitting higher targets
              or for post-workout nutrition, but they are not required.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Should I eat more protein on training days?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Your activity level selection already accounts for your typical training frequency. If you have
              a particularly intense session, an extra 20-30g of protein post-workout can support recovery,
              but consistent daily intake matters more than day-to-day adjustments.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Can I get enough protein on a plant-based diet?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Absolutely. Good plant protein sources include tofu, tempeh, lentils, chickpeas, beans, seitan,
              edamame, quinoa, and hemp seeds. Combining different plant proteins throughout the day ensures
              you get all essential amino acids. Aim for slightly higher total intake (add 10-15%) to account
              for lower digestibility of some plant proteins.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
