"use client";

import { useState, useMemo, useCallback } from "react";
import ResultBox from "@/components/tools/tool-uis/shared/ResultBox";

interface ActivityLevel {
  value: string;
  label: string;
  desc: string;
  multiplier: number;
}

interface Goal {
  value: string;
  label: string;
  desc: string;
  adjust: number;
  color: string;
}

interface MealBreakdown {
  meals: number;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}

interface FoodExample {
  name: string;
  p: number;
  c: number;
  f: number;
}

interface ProteinFactor {
  min: number;
  max: number;
  default: number;
}

interface MacroResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  protein: number;
  proteinCal: number;
  carbs: number;
  carbsCal: number;
  fat: number;
  fatCal: number;
  pctProtein: number;
  pctCarbs: number;
  pctFat: number;
  meals: MealBreakdown[];
  weightKg: number;
  goalLabel: string;
  highProteinFoods: FoodExample[];
  highCarbFoods: FoodExample[];
  highFatFoods: FoodExample[];
  proteinRange: { low: number; high: number };
}

const activityLevels: ActivityLevel[] = [
  { value: "sedentary", label: "Sedentary", desc: "Little or no exercise", multiplier: 1.2 },
  { value: "light", label: "Lightly Active", desc: "1-3 days/week", multiplier: 1.375 },
  { value: "moderate", label: "Moderately Active", desc: "3-5 days/week", multiplier: 1.55 },
  { value: "active", label: "Very Active", desc: "6-7 days/week", multiplier: 1.725 },
  { value: "extra", label: "Extra Active", desc: "Physical job / intense daily", multiplier: 1.9 },
];

const goals: Goal[] = [
  { value: "fat-loss", label: "Fat Loss", desc: "Lose ~0.5 kg per week", adjust: -500, color: "bg-orange-400" },
  { value: "maintain", label: "Maintenance", desc: "Stay at current weight", adjust: 0, color: "bg-green-400" },
  { value: "muscle-gain", label: "Muscle Gain", desc: "Gain ~0.5 kg per month", adjust: 300, color: "bg-blue-400" },
];

const proteinFactors: Record<string, ProteinFactor> = {
  "fat-loss": { min: 1.8, max: 2.4, default: 2.0 },
  maintain: { min: 1.2, max: 1.8, default: 1.5 },
  "muscle-gain": { min: 1.6, max: 2.2, default: 1.9 },
};

const fatMin = 0.8;

const macroColors: Record<string, { bg: string; text: string; hex: string }> = {
  protein: { bg: "bg-blue-400", text: "text-blue-500", hex: "#60a5fa" },
  carbs: { bg: "bg-yellow-400", text: "text-yellow-500", hex: "#facc15" },
  fat: { bg: "bg-orange-400", text: "text-orange-500", hex: "#fb923c" },
};

const foodExamples: FoodExample[] = [
  { name: "Chicken Breast (100g)", p: 31, c: 0, f: 3.6 },
  { name: "Eggs (3 large)", p: 18, c: 1.5, f: 15 },
  { name: "Greek Yogurt (200g)", p: 20, c: 8, f: 0.7 },
  { name: "Brown Rice (1 cup)", p: 5, c: 45, f: 1.8 },
  { name: "Sweet Potato (1 medium)", p: 2, c: 26, f: 0.1 },
  { name: "Oats (1/2 cup dry)", p: 6, c: 27, f: 3 },
  { name: "Avocado (1 medium)", p: 3, c: 12, f: 22 },
  { name: "Almonds (30g)", p: 6, c: 6, f: 15 },
  { name: "Olive Oil (1 tbsp)", p: 0, c: 0, f: 14 },
  { name: "Salmon (150g)", p: 34, c: 0, f: 18 },
];

export default function MacroCalculator() {
  const [unit, setUnit] = useState<string>("metric");
  const [weight, setWeight] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("male");
  const [heightFeet, setHeightFeet] = useState<string>("");
  const [heightInches, setHeightInches] = useState<string>("");
  const [heightCm, setHeightCm] = useState<string>("");
  const [activity, setActivity] = useState<string>("moderate");
  const [goal, setGoal] = useState<string>("maintain");
  const [copied, setCopied] = useState<boolean>(false);

  const result = useMemo((): MacroResult | null => {
    const weightNum = parseFloat(weight);
    const ageNum = parseInt(age, 10);
    if (!weight || !age || isNaN(weightNum) || isNaN(ageNum) || weightNum <= 0 || ageNum < 10 || ageNum > 120)
      return null;

    let heightCmNum: number;
    if (unit === "metric") {
      heightCmNum = parseFloat(heightCm);
      if (!heightCm || isNaN(heightCmNum) || heightCmNum <= 0) return null;
    } else {
      const ft = parseInt(heightFeet, 10) || 0;
      const inc = parseInt(heightInches, 10) || 0;
      heightCmNum = ft * 30.48 + inc * 2.54;
      if (heightCmNum <= 0) return null;
    }

    const weightKg = unit === "metric" ? weightNum : weightNum * 0.453592;
    const goalCfg = goals.find((g) => g.value === goal) || goals[1];
    const activityCfg = activityLevels.find((a) => a.value === activity) || activityLevels[2];
    const proteinFactor = proteinFactors[goal] || proteinFactors.maintain;

    const bmr = gender === "male"
      ? 10 * weightKg + 6.25 * heightCmNum - 5 * ageNum + 5
      : 10 * weightKg + 6.25 * heightCmNum - 5 * ageNum - 161;

    const tdee = Math.round(bmr * activityCfg.multiplier);
    const targetCalories = tdee + goalCfg.adjust;

    const proteinG = Math.round(proteinFactor.default * weightKg);
    const proteinCal = proteinG * 4;

    const fatG = Math.round(Math.max(fatMin * weightKg, (targetCalories * 0.2) / 9));
    const fatCal = fatG * 9;

    const carbsCal = Math.max(0, targetCalories - proteinCal - fatCal);
    const carbsG = Math.round(carbsCal / 4);

    const totalMacroCal = proteinCal + fatCal + carbsCal;

    const pctProtein = Math.round((proteinCal / totalMacroCal) * 100);
    const pctCarbs = Math.round((carbsCal / totalMacroCal) * 100);
    const pctFat = Math.round((fatCal / totalMacroCal) * 100);

    const meals: MealBreakdown[] = [3, 4, 5].map((m) => ({
      meals: m,
      protein: Math.round(proteinG / m),
      carbs: Math.round(carbsG / m),
      fat: Math.round(fatG / m),
      calories: Math.round(targetCalories / m),
    }));

    const highProteinFoods = foodExamples.filter((f) => f.p >= 18);
    const highCarbFoods = foodExamples.filter((f) => f.c >= 20);
    const highFatFoods = foodExamples.filter((f) => f.f >= 14);

    return {
      bmr: Math.round(bmr),
      tdee,
      targetCalories,
      protein: proteinG,
      proteinCal,
      carbs: carbsG,
      carbsCal,
      fat: fatG,
      fatCal,
      pctProtein,
      pctCarbs,
      pctFat,
      meals,
      weightKg: Math.round(weightKg * 10) / 10,
      goalLabel: goalCfg.label,
      highProteinFoods,
      highCarbFoods,
      highFatFoods,
      proteinRange: { low: Math.round(proteinFactor.min * weightKg), high: Math.round(proteinFactor.max * weightKg) },
    };
  }, [weight, age, gender, heightCm, heightFeet, heightInches, unit, activity, goal]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    const lines = [
      "Macro Calculator Results:",
      `Target: ${result.targetCalories} kcal/day`,
      `Protein: ${result.protein}g (${result.pctProtein}%)`,
      `Carbs: ${result.carbs}g (${result.pctCarbs}%)`,
      `Fat: ${result.fat}g (${result.pctFat}%)`,
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
    setAge("");
    setGender("male");
    setHeightCm("");
    setHeightFeet("");
    setHeightInches("");
    setActivity("moderate");
    setGoal("maintain");
    setCopied(false);
  }, []);

  const inputClasses = "w-full px-4 py-3 rounded-lg border border-border bg-[var(--bg-card)] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-base";
  const labelClasses = "block text-sm font-medium text-foreground mb-2";
  const selectCardClasses = (isSelected: boolean) =>
    `flex-1 min-w-[90px] px-3 py-3 rounded-xl border-2 text-center cursor-pointer transition-all duration-200 ${
      isSelected
        ? "border-brand bg-brand-light text-primary font-semibold"
        : "border-border bg-[var(--bg-card)] text-muted-foreground hover:border-brand-light"
    }`;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
        <div>
          <label className={labelClasses}>Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g. 30"
            min="10"
            max="120"
            className={inputClasses}
            aria-label="Age in years"
          />
        </div>
        <div>
          <label className={labelClasses}>Gender</label>
          <div className="flex gap-2">
            <button
              onClick={() => setGender("male")}
              className={`flex-1 px-4 py-3 rounded-lg border-2 text-center font-medium transition-all ${
                gender === "male"
                  ? "border-brand bg-brand-light text-primary"
                  : "border-border bg-[var(--bg-card)] text-muted-foreground hover:border-brand-light"
              }`}
              aria-pressed={gender === "male"}
            >
              Male
            </button>
            <button
              onClick={() => setGender("female")}
              className={`flex-1 px-4 py-3 rounded-lg border-2 text-center font-medium transition-all ${
                gender === "female"
                  ? "border-brand bg-brand-light text-primary"
                  : "border-border bg-[var(--bg-card)] text-muted-foreground hover:border-brand-light"
              }`}
              aria-pressed={gender === "female"}
            >
              Female
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
        <div>
          <label className={labelClasses}>Height ({unit === "metric" ? "cm" : "feet & inches"})</label>
          <div className="flex gap-2 items-end mb-2">
            <button
              onClick={() => setUnit("metric")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                unit === "metric"
                  ? "bg-brand text-white shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
              aria-pressed={unit === "metric"}
            >
              Metric
            </button>
            <button
              onClick={() => setUnit("imperial")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                unit === "imperial"
                  ? "bg-brand text-white shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
              aria-pressed={unit === "imperial"}
            >
              Imperial
            </button>
          </div>
          {unit === "metric" ? (
            <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} placeholder="e.g. 175" min="0" step="0.1" className={inputClasses} aria-label="Height in cm" />
          ) : (
            <div className="flex gap-2">
              <input type="number" value={heightFeet} onChange={(e) => setHeightFeet(e.target.value)} placeholder="Feet" min="0" className={`${inputClasses} w-1/2`} aria-label="Height in feet" />
              <input type="number" value={heightInches} onChange={(e) => setHeightInches(e.target.value)} placeholder="Inches" min="0" max="11" className={`${inputClasses} w-1/2`} aria-label="Height in inches" />
            </div>
          )}
        </div>

        <div>
          <label className={labelClasses}>Weight ({unit === "metric" ? "kg" : "lbs"})</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder={unit === "metric" ? "e.g. 75" : "e.g. 165"} min="0" step="0.1" className={inputClasses} aria-label="Weight" />
        </div>
      </div>

      <div className="mb-6">
        <label className={labelClasses}>Activity Level</label>
        <div className="flex flex-wrap gap-2">
          {activityLevels.map((a) => (
            <button key={a.value} onClick={() => setActivity(a.value)} className={selectCardClasses(activity === a.value)} title={a.desc}>
              <div className="text-sm">{a.label}</div>
              <div className="text-xs opacity-70 mt-0.5">{a.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className={labelClasses}>Goal</label>
        <div className="flex flex-wrap gap-2">
          {goals.map((g) => (
            <button key={g.value} onClick={() => setGoal(g.value)} className={selectCardClasses(goal === g.value)} title={g.desc}>
              <div className="text-sm">{g.label}</div>
              <div className="text-xs opacity-70 mt-0.5">{g.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-4 mb-6">
        <button onClick={handleCopy} disabled={!result} className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-brand-light transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-sm">
          {copied ? "Copied!" : "Copy Results"}
        </button>
        <button onClick={handleReset} className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-red-400 transition-all cursor-pointer text-sm">
          Reset
        </button>
      </div>

      <ResultBox show={result !== null}>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-[var(--bg-soft)] rounded-xl p-4 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Calories</div>
            <div className="text-xl font-bold text-foreground">{result?.targetCalories}</div>
            <div className="text-xs text-muted-foreground capitalize">kcal/day</div>
          </div>
          <div className="bg-[var(--bg-soft)] rounded-xl p-4 text-center border border-border border-t-2 border-t-blue-400">
            <div className={`text-xs uppercase tracking-wide mb-1 ${macroColors.protein.text}`}>Protein</div>
            <div className="text-xl font-bold text-foreground">{result?.protein}g</div>
            <div className="text-xs text-muted-foreground">{result?.proteinCal} kcal ({result?.pctProtein}%)</div>
          </div>
          <div className="bg-[var(--bg-soft)] rounded-xl p-4 text-center border border-border border-t-2 border-t-yellow-400">
            <div className={`text-xs uppercase tracking-wide mb-1 ${macroColors.carbs.text}`}>Carbs</div>
            <div className="text-xl font-bold text-foreground">{result?.carbs}g</div>
            <div className="text-xs text-muted-foreground">{result?.carbsCal} kcal ({result?.pctCarbs}%)</div>
          </div>
          <div className="bg-[var(--bg-soft)] rounded-xl p-4 text-center border border-border border-t-2 border-t-orange-400">
            <div className={`text-xs uppercase tracking-wide mb-1 ${macroColors.fat.text}`}>Fat</div>
            <div className="text-xl font-bold text-foreground">{result?.fat}g</div>
            <div className="text-xs text-muted-foreground">{result?.fatCal} kcal ({result?.pctFat}%)</div>
          </div>
        </div>

        <h3 className="text-base font-bold text-foreground mb-3">Calorie & Macro Breakdown</h3>
        <div className="bg-[var(--bg-soft)] rounded-xl p-5 border border-border mb-6">
          <div className="h-8 bg-[var(--bg-card)] rounded-lg overflow-hidden border border-border flex mb-4">
            <div className="bg-blue-400 h-full transition-all duration-500 flex items-center justify-center text-xs text-white font-medium" style={{ width: `${result?.pctProtein}%` }}>
              {result?.pctProtein && result.pctProtein > 10 ? `${result.pctProtein}%` : ""}
            </div>
            <div className="bg-yellow-400 h-full transition-all duration-500 flex items-center justify-center text-xs text-white font-medium" style={{ width: `${result?.pctCarbs}%` }}>
              {result?.pctCarbs && result.pctCarbs > 10 ? `${result.pctCarbs}%` : ""}
            </div>
            <div className="bg-orange-400 h-full transition-all duration-500 flex items-center justify-center text-xs text-white font-medium" style={{ width: `${result?.pctFat}%` }}>
              {result?.pctFat && result.pctFat > 10 ? `${result.pctFat}%` : ""}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-400" /> Protein</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-yellow-400" /> Carbs</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-orange-400" /> Fat</span>
          </div>
        </div>

        <h3 className="text-base font-bold text-foreground mb-3">Per-Meal Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {result?.meals.map((m) => (
            <div key={m.meals} className="bg-[var(--bg-soft)] rounded-xl p-4 border border-border">
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">{m.meals} Meals</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Protein</span><span className="font-semibold text-foreground">{m.protein}g</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Carbs</span><span className="font-semibold text-foreground">{m.carbs}g</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Fat</span><span className="font-semibold text-foreground">{m.fat}g</span></div>
                <div className="border-t border-border pt-1 mt-1 flex justify-between"><span className="text-muted-foreground">Calories</span><span className="font-semibold text-foreground">{m.calories}</span></div>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-base font-bold text-foreground mb-3">Macro-Friendly Foods</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="bg-[var(--bg-soft)] rounded-xl p-4 border border-border">
            <h4 className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-2">High Protein</h4>
            <ul className="space-y-1.5">
              {result?.highProteinFoods.slice(0, 4).map((f, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate pr-2">{f.name}</span>
                  <span className="font-semibold text-foreground whitespace-nowrap">{f.p}g</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[var(--bg-soft)] rounded-xl p-4 border border-border">
            <h4 className="text-xs font-semibold text-yellow-500 uppercase tracking-wide mb-2">High Carbs</h4>
            <ul className="space-y-1.5">
              {result?.highCarbFoods.slice(0, 4).map((f, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate pr-2">{f.name}</span>
                  <span className="font-semibold text-foreground whitespace-nowrap">{f.c}g</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[var(--bg-soft)] rounded-xl p-4 border border-border">
            <h4 className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-2">High Fat</h4>
            <ul className="space-y-1.5">
              {result?.highFatFoods.slice(0, 4).map((f, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate pr-2">{f.name}</span>
                  <span className="font-semibold text-foreground whitespace-nowrap">{f.f}g</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-xs text-muted-foreground bg-[var(--bg-soft)] rounded-lg p-3 border border-border">
          Protein: {result?.proteinRange.low}-{result?.proteinRange.high}g range recommended. Fat set at minimum 0.8g/kg.
          Remaining calories allocated to carbohydrates. BMR calculated using Mifflin-St Jeor equation.
        </div>
      </ResultBox>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Understanding Your Macros</h2>
        <div className="bg-[var(--bg-soft)] rounded-xl p-6 border border-border space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p><strong>Protein (4 kcal/g):</strong> Essential for muscle repair, enzyme production, and satiety. Set at {result ? `${result.protein}g` : "X"} based on your goal and body weight. Range: {result ? `${result.proteinRange.low}-${result.proteinRange.high}g` : "X-X"}.</p>
          <p><strong>Carbohydrates (4 kcal/g):</strong> Your body&apos;s primary fuel source. Remaining calories after protein and fat are allocated to carbs to meet your energy needs.</p>
          <p><strong>Fat (9 kcal/g):</strong> Critical for hormone production, vitamin absorption, and cell membrane health. Set at a minimum of 0.8g per kg of body weight.</p>
          <p>These ratios are guidelines, not rigid rules. Adjust based on how your body responds — some people feel better on higher carbs, while others prefer higher fat.</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Do I need to hit my macros exactly every day?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              No. Aim to be within 5-10g of your targets. Consistency over weeks matters more than
              perfection on any single day. Focus on hitting your protein target consistently, then
              adjust carbs and fat based on energy levels and preferences.
            </p>
          </details>
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              What if I prefer higher fat, lower carbs?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              You can adjust macro ratios to fit your preferences as long as protein stays adequate
              and total calories meet your goal. A keto-style ratio (70% fat, 20% protein, 10% carbs)
              works for some people, while athletes often prefer higher carbs (50-60%).
            </p>
          </details>
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              How do I track my macros?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Use a food tracking app like MyFitnessPal, Cronometer, or MacroFactor. Weigh your food
              with a kitchen scale for accuracy, especially for calorie-dense foods like oils, nuts,
              and grains. Consistent tracking for 2-3 weeks will teach you portion sizes intuitively.
            </p>
          </details>
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Should I adjust macros on training vs. rest days?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Some people benefit from higher carbs on training days and higher fat on rest days
              (carb cycling). However, consistent daily intake is simpler and just as effective for
              most people. The activity level you selected already accounts for your typical routine.
            </p>
          </details>
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Can I build muscle while eating at maintenance?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Beginners and those returning after a break can build muscle at maintenance (body
              recomposition). More experienced lifters typically need a 200-400 calorie surplus for
              optimal muscle gain. Adequate protein (1.6-2.2g/kg) is the most important factor.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
