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

interface Goal {
  value: string;
  label: string;
  desc: string;
  adjust: number;
  color: string;
  isMaintenance?: boolean;
}

interface Macros {
  protein: number;
  fat: number;
  carbs: number;
}

interface TdeeResult {
  bmr: number;
  tdee: number;
  target: number;
  macros: Macros;
  heightCm: number;
  weightKg: number;
  goalLabel: string;
  goalColor: string;
  adjustment: number;
  zone: string;
  levels: {
    label: string;
    value: number;
    color: string;
    isActive: boolean;
    isMaintenance?: boolean;
  }[];
}

const activityLevels: ActivityLevel[] = [
  { value: "sedentary", label: "Sedentary", desc: "Little or no exercise", multiplier: 1.2 },
  { value: "light", label: "Lightly Active", desc: "1-3 days/week", multiplier: 1.375 },
  { value: "moderate", label: "Moderately Active", desc: "3-5 days/week", multiplier: 1.55 },
  { value: "active", label: "Very Active", desc: "6-7 days/week", multiplier: 1.725 },
  { value: "extra", label: "Extra Active", desc: "Physical job / intense daily", multiplier: 1.9 },
];

const goals: Goal[] = [
  { value: "lose-aggressive", label: "Aggressive Loss", desc: "Lose ~1 kg (2 lb) per week", adjust: -1000, color: "bg-red-400" },
  { value: "lose", label: "Mild Weight Loss", desc: "Lose ~0.5 kg (1 lb) per week", adjust: -500, color: "bg-orange-400" },
  { value: "lose-mild", label: "Mild Weight Loss", desc: "Lose ~0.25 kg (0.5 lb) per week", adjust: -250, color: "bg-yellow-400" },
  { value: "maintain", label: "Maintain Weight", desc: "Keep your current weight", adjust: 0, color: "bg-green-400", isMaintenance: true },
  { value: "gain-mild", label: "Mild Muscle Gain", desc: "Gain ~0.25 kg (0.5 lb) per week", adjust: 250, color: "bg-blue-400" },
  { value: "gain", label: "Muscle Gain", desc: "Gain ~0.5 kg (1 lb) per week", adjust: 500, color: "bg-indigo-400" },
  { value: "gain-aggressive", label: "Aggressive Gain", desc: "Gain ~1 kg (2 lb) per week", adjust: 1000, color: "bg-purple-400" },
];

const goalDisplay: Record<string, string> = {
  "lose-aggressive": "Aggressive Weight Loss",
  "lose": "Mild Weight Loss",
  "lose-mild": "Mild Weight Loss",
  "maintain": "Maintain Weight",
  "gain-mild": "Mild Muscle Gain",
  "gain": "Muscle Gain",
  "gain-aggressive": "Aggressive Muscle Gain",
};

export default function TdeeCalculator() {
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("male");
  const [heightFeet, setHeightFeet] = useState<string>("");
  const [heightInches, setHeightInches] = useState<string>("");
  const [heightCm, setHeightCm] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [unit, setUnit] = useState<string>("metric");
  const [activity, setActivity] = useState<string>("moderate");
  const [goal, setGoal] = useState<string>("maintain");
  const [copied, setCopied] = useState<boolean>(false);

  const result = useMemo((): TdeeResult | null => {
    const ageNum = parseInt(age, 10);
    const weightNum = parseFloat(weight);

    if (!age || !weight || isNaN(ageNum) || isNaN(weightNum) || ageNum < 10 || ageNum > 120 || weightNum <= 0) return null;

    let heightCmNum: number;
    if (unit === "metric") {
      heightCmNum = parseFloat(heightCm);
      if (!heightCm || isNaN(heightCmNum) || heightCmNum <= 0) return null;
    } else {
      const feet = parseInt(heightFeet, 10) || 0;
      const inches = parseInt(heightInches, 10) || 0;
      heightCmNum = feet * 30.48 + inches * 2.54;
      if (heightCmNum <= 0) return null;
    }

    const weightKg = unit === "metric" ? weightNum : weightNum * 0.453592;
    const activityMult = activityLevels.find((a) => a.value === activity)?.multiplier || 1.55;
    const goalDef = goals.find((g) => g.value === goal) || goals[3];

    const bmr = gender === "male"
      ? 10 * weightKg + 6.25 * heightCmNum - 5 * ageNum + 5
      : 10 * weightKg + 6.25 * heightCmNum - 5 * ageNum - 161;

    const tdee = Math.round(bmr * activityMult);
    const target = tdee + goalDef.adjust;

    const macros: Macros = {
      protein: Math.round(weightKg * 2.0),
      fat: Math.round(weightKg * 0.8),
      carbs: Math.round((target - weightKg * 2.0 * 4 - weightKg * 0.8 * 9) / 4),
    };
    if (macros.carbs < 0) macros.carbs = 0;

    return {
      bmr: Math.round(bmr),
      tdee,
      target,
      macros,
      heightCm: Math.round(heightCmNum),
      weightKg: Math.round(weightKg * 10) / 10,
      goalLabel: goalDisplay[goal],
      goalColor: goalDef.color,
      adjustment: goalDef.adjust,
      zone: goalDef.adjust < 0 ? "deficit" : goalDef.adjust > 0 ? "surplus" : "maintenance",
      levels: goals.map((g) => ({
        label: g.label,
        value: tdee + g.adjust,
        color: g.color,
        isActive: g.value === goal,
        isMaintenance: g.isMaintenance,
      })),
    };
  }, [age, gender, heightCm, heightFeet, heightInches, weight, unit, activity, goal]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    const lines = [
      "TDEE Calculator Results:",
      `BMR: ${result.bmr} kcal/day`,
      `TDEE: ${result.tdee} kcal/day`,
      `Target (${result.goalLabel}): ${result.target} kcal/day`,
      `Protein: ${result.macros.protein}g | Fat: ${result.macros.fat}g | Carbs: ${result.macros.carbs}g`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  }, [result]);

  const handleReset = useCallback(() => {
    setAge("");
    setGender("male");
    setHeightCm("");
    setHeightFeet("");
    setHeightInches("");
    setWeight("");
    setUnit("metric");
    setActivity("moderate");
    setGoal("maintain");
    setCopied(false);
  }, []);

  const inputClasses = "w-full px-4 py-3 rounded-lg border border-border bg-[var(--bg-card)] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-base";
  const selectCardClasses = (isSelected: boolean) =>
    `flex-1 min-w-[100px] px-3 py-3 rounded-xl border-2 text-center cursor-pointer transition-all duration-200 ${
      isSelected
        ? "border-brand bg-brand-light text-primary font-semibold"
        : "border-border bg-[var(--bg-card)] text-muted-foreground hover:border-brand-light"
    }`;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Age</label>
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
          <label className="block text-sm font-medium text-foreground mb-2">Gender</label>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Height ({unit === "metric" ? "cm" : "feet & inches"})
          </label>
          <div className="flex gap-2 items-end">
            <div className="flex gap-1 flex-1">
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
          </div>
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

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
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
            aria-label="Weight input"
          />
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
        <label className="block text-sm font-medium text-foreground mb-3">Your Goal</label>
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

      <div className="flex gap-3 mt-4 mb-6">
        <button
          onClick={handleCopy}
          disabled={!result}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-brand-light transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-sm"
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-[var(--bg-soft)] rounded-xl p-4 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">BMR</div>
            <div className="text-2xl font-bold text-foreground">{result?.bmr}</div>
            <div className="text-xs text-muted-foreground">kcal/day</div>
          </div>
          <div className="bg-[var(--bg-soft)] rounded-xl p-4 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">TDEE</div>
            <div className="text-2xl font-bold text-foreground">{result?.tdee}</div>
            <div className="text-xs text-muted-foreground">kcal/day</div>
          </div>
          <div className={`rounded-xl p-4 text-center border-2 ${
            result?.adjustment === 0
              ? "border-green-400 bg-green-50 dark:bg-green-900/20"
              : result?.adjustment && result.adjustment < 0
                ? "border-orange-400 bg-orange-50 dark:bg-orange-900/20"
                : "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
          }`}>
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Target</div>
            <div className="text-2xl font-bold text-foreground">{result?.target}</div>
            <div className="text-xs text-muted-foreground capitalize">{result?.goalLabel}</div>
          </div>
        </div>

        <h3 className="text-base font-bold text-foreground mb-3">Calorie Levels</h3>
        <div className="space-y-2.5 mb-6">
          {result?.levels.map((level, i) => {
            const maxVal = Math.max(...result!.levels.map((l) => l.value), 1);
            const pct = (level.value / maxVal) * 100;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-28 shrink-0 text-right">
                  <span className={`text-xs font-medium ${level.isActive ? "text-foreground" : "text-muted-foreground"}`}>
                    {level.label}
                  </span>
                </div>
                <div className="flex-1 h-7 bg-[var(--bg-soft)] rounded-lg overflow-hidden border border-border relative">
                  <div
                    className={`h-full rounded-lg transition-all duration-500 ${level.color} ${level.isActive ? "opacity-90" : "opacity-50"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="w-20 shrink-0">
                  <span className={`text-sm font-semibold ${level.isActive ? "text-primary" : "text-muted-foreground"}`}>
                    {level.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <h3 className="text-base font-bold text-foreground mb-3">Recommended Macros</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="bg-[var(--bg-soft)] rounded-xl p-4 border border-border">
            <ResultItem label="Protein" value={`${result?.macros.protein}g`} />
            <div className="text-xs text-muted-foreground mt-0.5">{Math.round((result?.macros.protein ?? 0) * 4 || 0)} kcal</div>
          </div>
          <div className="bg-[var(--bg-soft)] rounded-xl p-4 border border-border">
            <ResultItem label="Fat" value={`${result?.macros.fat}g`} />
            <div className="text-xs text-muted-foreground mt-0.5">{Math.round((result?.macros.fat ?? 0) * 9 || 0)} kcal</div>
          </div>
          <div className="bg-[var(--bg-soft)] rounded-xl p-4 border border-border">
            <ResultItem label="Carbs" value={`${result?.macros.carbs}g`} />
            <div className="text-xs text-muted-foreground mt-0.5">{Math.round((result?.macros.carbs ?? 0) * 4 || 0)} kcal</div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground bg-[var(--bg-soft)] rounded-lg p-3 border border-border">
          Macros based on: Protein 2g per kg of body weight, Fat 0.8g per kg, remaining calories from carbs.
          <span className="block mt-1">BMR calculated using the Mifflin-St Jeor equation.</span>
        </div>
      </ResultBox>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Understanding Your Results</h2>
        <div className="bg-[var(--bg-soft)] rounded-xl p-6 border border-border space-y-3 text-sm text-muted-foreground">
          <p><strong>BMR</strong> — Basal Metabolic Rate: calories your body needs at complete rest to maintain vital functions.</p>
          <p><strong>TDEE</strong> — Total Daily Energy Expenditure: BMR × activity multiplier. This is what you need to maintain your current weight.</p>
          <p><strong>Target Calories</strong> — Your TDEE adjusted for your goal (deficit for loss, surplus for gain).</p>
          <p><strong>Protein</strong> is set at 2g per kg of body weight to preserve muscle during a deficit or support growth during a surplus.</p>
          <p><strong>Fat</strong> is set at 0.8g per kg for hormone function and overall health.</p>
          <p><strong>Carbs</strong> fill the remaining calories for energy and performance.</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              What is TDEE and why does it matter?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Total Daily Energy Expenditure (TDEE) is the total number of calories your body burns in a day,
              including all activity. Knowing your TDEE is essential for setting accurate calorie targets whether
              you want to lose weight, gain muscle, or maintain.
            </p>
          </details>
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              How accurate is the Mifflin-St Jeor equation?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              It is considered the most accurate BMR equation for the general population, with an error margin of
              about ±10%. For precise measurement, indirect calorimetry is needed, but this equation provides an
              excellent starting point.
            </p>
          </details>
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Should I eat back calories burned during exercise?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              The activity multiplier already accounts for your exercise level. If you selected the correct
              activity level, your TDEE already includes exercise calories. Eating them back would double-count them.
              Only adjust if your actual activity level changes significantly.
            </p>
          </details>
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Can I use this calculator for bulking or cutting?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Yes. Select &quot;Muscle Gain&quot; for a caloric surplus (bulking) or &quot;Weight Loss&quot; for a deficit (cutting).
              Adjust your goal based on how your body responds after 2-3 weeks and whether you are hitting your
              macro targets consistently.
            </p>
          </details>
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              How often should I recalculate my TDEE?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Recalculate whenever your weight changes by 5-10 lbs (2-5 kg) or your activity level changes
              significantly. Your TDEE decreases as you lose weight since a lighter body requires fewer calories.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
