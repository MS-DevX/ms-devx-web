"use client";

import { useState, useMemo, useCallback } from "react";
import ResultBox from "@/components/tools/tool-uis/shared/ResultBox";

interface ActivityLevel {
  value: string;
  label: string;
  desc: string;
  multiplier: number;
}

interface OrganContribution {
  organ: string;
  pct: number;
  color: string;
  calories?: number;
}

interface AgeComparison {
  age: number;
  change: number;
  estBmr?: number;
}

interface TdeeEstimate {
  label: string;
  desc: string;
  tdee: number;
}

interface BmrResult {
  bmr: number;
  bmrKj: number;
  weightKg: number;
  heightCm: number;
  tdeeEstimates: TdeeEstimate[];
  organCals: OrganContribution[];
  ageData: AgeComparison[];
}

const activityLevels: ActivityLevel[] = [
  { value: "sedentary", label: "Sedentary", desc: "Little or no exercise", multiplier: 1.2 },
  { value: "light", label: "Lightly Active", desc: "1-3 days/week", multiplier: 1.375 },
  { value: "moderate", label: "Moderately Active", desc: "3-5 days/week", multiplier: 1.55 },
  { value: "active", label: "Very Active", desc: "6-7 days/week", multiplier: 1.725 },
  { value: "extra", label: "Extra Active", desc: "Physical job / intense daily", multiplier: 1.9 },
];

const organContributions: { organ: string; pct: number; color: string }[] = [
  { organ: "Liver", pct: 27, color: "bg-red-400" },
  { organ: "Brain", pct: 19, color: "bg-blue-400" },
  { organ: "Heart", pct: 17, color: "bg-pink-400" },
  { organ: "Kidneys", pct: 10, color: "bg-purple-400" },
  { organ: "Skeletal Muscle", pct: 18, color: "bg-orange-400" },
  { organ: "Other", pct: 9, color: "bg-gray-400" },
];

const ageComparison: AgeComparison[] = [
  { age: 20, change: 0 },
  { age: 30, change: -55 },
  { age: 40, change: -110 },
  { age: 50, change: -165 },
  { age: 60, change: -220 },
  { age: 70, change: -275 },
];

export default function BmrCalculator() {
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("male");
  const [unit, setUnit] = useState<string>("metric");
  const [heightFeet, setHeightFeet] = useState<string>("");
  const [heightInches, setHeightInches] = useState<string>("");
  const [heightCm, setHeightCm] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const result = useMemo((): BmrResult | null => {
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

    const bmr = gender === "male"
      ? 10 * weightKg + 6.25 * heightCmNum - 5 * ageNum + 5
      : 10 * weightKg + 6.25 * heightCmNum - 5 * ageNum - 161;

    const bmrRounded = Math.round(bmr);
    const bmrKj = Math.round(bmr * 4.184);

    const tdeeEstimates = activityLevels.map((a) => ({
      label: a.label,
      desc: a.desc,
      tdee: Math.round(bmr * a.multiplier),
    }));

    const organCals = organContributions.map((o) => ({
      ...o,
      calories: Math.round(bmr * o.pct / 100),
    }));

    const ageData = ageComparison.map((a) => ({
      ...a,
      estBmr: Math.round(bmr + a.change),
    }));

    return {
      bmr: bmrRounded,
      bmrKj,
      weightKg: Math.round(weightKg * 10) / 10,
      heightCm: Math.round(heightCmNum),
      tdeeEstimates,
      organCals,
      ageData,
    };
  }, [age, gender, heightCm, heightFeet, heightInches, weight, unit]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    const lines = [
      "BMR Calculator Results:",
      `BMR: ${result.bmr} kcal/day`,
      `BMR (kJ): ${result.bmrKj} kJ/day`,
      `Height: ${result.heightCm} cm`,
      `Weight: ${result.weightKg} kg`,
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
    setCopied(false);
  }, []);

  const inputClasses = "w-full px-4 py-3 rounded-lg border border-border bg-[var(--bg-card)] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-base";
  const labelClasses = "block text-sm font-medium text-foreground mb-2";

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
          <label className={labelClasses}>
            Height ({unit === "metric" ? "cm" : "feet & inches"})
          </label>
          <div className="flex gap-2 items-end mb-2">
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
            aria-label="Weight"
          />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-[var(--bg-soft)] rounded-xl p-5 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">BMR</div>
            <div className="text-3xl font-bold text-foreground">{result?.bmr}</div>
            <div className="text-sm text-muted-foreground">kcal / day</div>
          </div>
          <div className="bg-[var(--bg-soft)] rounded-xl p-5 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">BMR (kJ)</div>
            <div className="text-3xl font-bold text-foreground">{result?.bmrKj?.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">kJ / day</div>
          </div>
        </div>

        <h3 className="text-base font-bold text-foreground mb-3">What Your BMR Supports</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
          {result?.organCals.map((o) => (
            <div key={o.organ} className="bg-[var(--bg-soft)] rounded-lg p-3 border border-border flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${o.color} flex items-center justify-center text-white text-xs font-bold`}>
                {o.pct}%
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">{o.organ}</div>
                <div className="text-xs text-muted-foreground">{o.calories} kcal</div>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-base font-bold text-foreground mb-3">Estimated TDEE by Activity Level</h3>
        <div className="space-y-2 mb-6">
          {result?.tdeeEstimates.map((level, i) => {
            const maxTdee = result!.tdeeEstimates[result!.tdeeEstimates.length - 1].tdee;
            const pct = (level.tdee / maxTdee) * 100;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-24 shrink-0">
                  <div className="text-xs font-medium text-foreground">{level.label}</div>
                  <div className="text-[10px] text-muted-foreground">{level.desc}</div>
                </div>
                <div className="flex-1 h-6 bg-[var(--bg-soft)] rounded-lg overflow-hidden border border-border">
                  <div className="h-full rounded-lg bg-brand transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
                <div className="w-16 shrink-0 text-right text-sm font-semibold text-foreground">
                  {level.tdee}
                </div>
              </div>
            );
          })}
        </div>

        <h3 className="text-base font-bold text-foreground mb-3">BMR Comparison by Age</h3>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground border-b border-border">
                <th className="text-left py-2 pr-4">Age</th>
                <th className="text-left py-2 pr-4">BMR Change</th>
                <th className="text-left py-2">Est. BMR</th>
              </tr>
            </thead>
            <tbody>
              {result?.ageData.map((d) => {
                const isCurrentAge = d.age === parseInt(age, 10);
                return (
                  <tr key={d.age} className={`border-b border-border ${isCurrentAge ? "bg-brand-light" : ""}`}>
                    <td className={`py-2 pr-4 font-medium ${isCurrentAge ? "text-primary" : "text-foreground"}`}>{d.age}</td>
                    <td className={`py-2 pr-4 ${d.change < 0 ? "text-orange-400" : "text-foreground"}`}>{d.change > 0 ? "+" : ""}{d.change}</td>
                    <td className={`py-2 font-semibold ${isCurrentAge ? "text-primary" : "text-foreground"}`}>{d.estBmr}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="text-xs text-muted-foreground bg-[var(--bg-soft)] rounded-lg p-3 border border-border">
          BMR calculated using the Mifflin-St Jeor equation. TDEE estimates multiply BMR by standard activity
          factors. BMR naturally declines with age due to muscle loss and hormonal changes.
        </div>
      </ResultBox>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">What Is BMR?</h2>
        <div className="bg-[var(--bg-soft)] rounded-xl p-6 border border-border space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>Basal Metabolic Rate (BMR) is the number of calories your body needs at complete rest to maintain
          vital functions — breathing, circulation, cell production, nutrient processing, and temperature regulation.</p>
          <p>BMR accounts for <strong>60-75%</strong> of your total daily energy expenditure (TDEE). The remaining
          energy is used for physical activity (15-30%) and digesting food (10%).</p>
          <p>Several factors influence BMR:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Muscle mass:</strong> More muscle increases BMR since muscle burns more calories at rest than fat.</li>
            <li><strong>Age:</strong> BMR decreases by 1-2% per decade after age 20 due to muscle loss.</li>
            <li><strong>Gender:</strong> Men typically have higher BMR than women due to greater muscle mass and body size.</li>
            <li><strong>Genetics:</strong> Some people naturally have faster or slower metabolisms.</li>
            <li><strong>Hormones:</strong> Thyroid hormones, cortisol, and sex hormones all affect metabolic rate.</li>
          </ul>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">The Mifflin-St Jeor Equation</h2>
        <div className="bg-[var(--bg-soft)] rounded-xl p-6 border border-border text-sm text-muted-foreground leading-relaxed">
          <p className="mb-3">Developed in 1990, the Mifflin-St Jeor equation is considered the most accurate formula for estimating BMR in the general population:</p>
          <div className="bg-[var(--bg-card)] rounded-lg p-4 mb-3 font-mono text-sm">
            <p><strong>Male:</strong> BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5</p>
            <p className="mt-1"><strong>Female:</strong> BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161</p>
          </div>
          <p>This formula has an accuracy of approximately ±10% compared to indirect calorimetry. It replaced the older Harris-Benedict equation, which tended to overestimate BMR by 5-15%.</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              How is BMR different from TDEE?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              BMR is what you burn at complete rest. TDEE (Total Daily Energy Expenditure) is BMR plus all
              your daily activity — walking, exercise, and digesting food. Use the activity-adjusted estimates
              above to see how your BMR translates to your total calorie needs.
            </p>
          </details>
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Can I increase my BMR?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Yes, the most effective way is to increase muscle mass through resistance training. Each
              kilogram of muscle burns about 13 extra calories per day at rest. High-protein diets and
              adequate sleep also support a healthy metabolic rate.
            </p>
          </details>
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Does eating less slow down my BMR?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Prolonged severe calorie restriction can lower BMR by 10-20% as the body adapts to conserve
              energy (metabolic adaptation). This is why moderate deficits of 300-500 calories are recommended
              for weight loss, and why refeed days or diet breaks can help maintain metabolic rate.
            </p>
          </details>
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              How often should I recalculate my BMR?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Recalculate whenever your weight changes by 5-10 lbs (2-5 kg) or your body composition changes
              significantly. Since BMR depends on weight, height, and age, you only need to recalculate when
              one of those factors changes.
            </p>
          </details>
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              What is the difference between BMR and RMR?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              BMR (Basal Metabolic Rate) is measured under strict conditions — complete rest, after 8 hours
              of sleep, 12 hours of fasting. RMR (Resting Metabolic Rate) is measured under less strict
              conditions and is typically 5-10% higher than BMR. In practical use, the terms are often
              used interchangeably.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
