"use client";

import { useState, useMemo, useCallback } from "react";
import ResultBox from "@/components/tools/tool-uis/shared/ResultBox";

interface Intensity {
  value: string;
  label: string;
  met: number;
  repsPerMin: number;
  desc: string;
}

interface FoodComparison {
  label: string;
  calories: number;
}

interface FoodCompResult extends FoodComparison {
  servings: number;
}

interface EquivalentExercise {
  label: string;
  met: number;
  unit: string;
}

interface EquivResult extends EquivalentExercise {
  value: string;
}

interface Result {
  reps: number;
  calories: number;
  calPerRep: number;
  timeMinutes: number;
  timeDisplay: string;
  intensityLabel: string;
  weightKg: number;
  foodComp: FoodCompResult[];
  equiv: EquivResult[];
}

const intensities: Intensity[] = [
  { value: "moderate", label: "Moderate", met: 3.8, repsPerMin: 20, desc: "Standard pace, controlled form" },
  { value: "vigorous", label: "Vigorous", met: 8.0, repsPerMin: 40, desc: "Fast pace, explosive movement" },
];

const comparisons: FoodComparison[] = [
  { label: "Apple slice", calories: 5 },
  { label: "Banana", calories: 105 },
  { label: "Egg (large)", calories: 70 },
  { label: "Chicken breast (100g)", calories: 165 },
  { label: "Slice of pizza", calories: 285 },
  { label: "Cheeseburger", calories: 540 },
];

const equivalentExercises: EquivalentExercise[] = [
  { label: "Walking (moderate)", met: 3.5, unit: "minutes" },
  { label: "Jumping jacks", met: 8.0, unit: "minutes" },
  { label: "Burpees", met: 8.0, unit: "reps" },
  { label: "Sit-ups", met: 3.8, unit: "reps" },
];

export default function PushUpCalorieCalculator() {
  const [unit, setUnit] = useState("metric");
  const [pushUps, setPushUps] = useState("");
  const [weight, setWeight] = useState("");
  const [intensity, setIntensity] = useState("moderate");
  const [copied, setCopied] = useState(false);

  const result = useMemo<Result | null>(() => {
    const reps = parseInt(pushUps, 10);
    const weightNum = parseFloat(weight);
    if (!pushUps || !weight || isNaN(reps) || isNaN(weightNum) || reps <= 0 || weightNum <= 0) return null;

    const weightKg = unit === "metric" ? weightNum : weightNum * 0.453592;
    const cfg = intensities.find((i) => i.value === intensity) || intensities[0];

    const timeMinutes = Math.round((reps / cfg.repsPerMin) * 10) / 10;
    const calories = Math.round((cfg.met * 3.5 * weightKg / 200) * timeMinutes);
    const calPerRep = Math.round((calories / reps) * 100) / 100;

    const foodComp = comparisons.map((f): FoodCompResult => ({
      ...f,
      servings: Math.round((calories / f.calories) * 10) / 10,
    }));

    const equiv = equivalentExercises.map((e): EquivResult => {
      if (e.unit === "minutes") {
        const mins = Math.round((calories / (e.met * 3.5 * weightKg / 200)) * 10) / 10;
        return { ...e, value: mins > 1 ? `${mins} minutes` : `${mins} minute` };
      }
      if (e.unit === "reps") {
        const estimatedReps = Math.round(calories / (e.met * 3.5 * weightKg / 200 / 30));
        return { ...e, value: `${estimatedReps} reps` };
      }
      return { ...e, value: "" };
    });

    const mins = Math.floor(timeMinutes);
    const secs = Math.round((timeMinutes - mins) * 60);

    return {
      reps,
      calories,
      calPerRep,
      timeMinutes,
      timeDisplay: mins > 0 ? `${mins}m ${secs}s` : `${secs}s`,
      intensityLabel: cfg.label,
      weightKg: Math.round(weightKg * 10) / 10,
      foodComp,
      equiv,
    };
  }, [pushUps, weight, unit, intensity]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    const lines = [
      "Push-Up Calorie Calculator Results:",
      `${result.reps} push-ups at ${result.intensityLabel} intensity`,
      `Calories burned: ${result.calories}`,
      `Time: ${result.timeDisplay}`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  }, [result]);

  const handleReset = useCallback(() => {
    setPushUps("");
    setWeight("");
    setUnit("metric");
    setIntensity("moderate");
    setCopied(false);
  }, []);

  const inputClasses = "w-full px-4 py-3 rounded-lg border border-border bg-[var(--bg-card)] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-base";
  const labelClasses = "block text-sm font-medium text-foreground mb-2";

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
        <div>
          <label className={labelClasses}>Number of Push-Ups</label>
          <input type="number" value={pushUps} onChange={(e) => setPushUps(e.target.value)} placeholder="e.g. 50" min="0" className={inputClasses} aria-label="Number of push-ups" />
          <p className="text-xs text-muted-foreground mt-1.5">Enter total reps completed in one session.</p>
        </div>
        <div>
          <label className={labelClasses}>Body Weight</label>
          <div className="flex gap-2">
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"} min="0" step="0.1" className={inputClasses} aria-label="Body weight" />
            <button onClick={() => setUnit(unit === "metric" ? "imperial" : "metric")} className="shrink-0 px-4 py-3 rounded-lg border border-border bg-[var(--bg-card)] text-foreground font-medium text-sm hover:border-primary/60 transition-all cursor-pointer">
              {unit === "metric" ? "kg" : "lbs"}
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className={labelClasses}>Intensity</label>
        <div className="flex gap-2">
          {intensities.map((i) => (
            <button key={i.value} onClick={() => setIntensity(i.value)} className={`flex-1 px-4 py-3 rounded-lg border-2 text-center transition-all ${intensity === i.value ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border bg-[var(--bg-card)] text-muted-foreground hover:border-primary/60"}`} aria-pressed={intensity === i.value}>
              <div className="text-sm">{i.label}</div>
              <div className="text-xs opacity-70 mt-0.5">{i.desc}</div>
            </button>
          ))}
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-muted rounded-xl p-5 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Calories Burned</div>
            <div className="text-3xl font-bold text-foreground">{result?.calories}</div>
            <div className="text-sm text-muted-foreground">kcal</div>
          </div>
          <div className="bg-muted rounded-xl p-5 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Calories Per Push-Up</div>
            <div className="text-2xl font-bold text-foreground">{result?.calPerRep}</div>
            <div className="text-sm text-muted-foreground">kcal</div>
          </div>
          <div className="bg-muted rounded-xl p-5 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Duration</div>
            <div className="text-2xl font-bold text-foreground">{result?.timeDisplay}</div>
            <div className="text-sm text-muted-foreground">{result?.intensityLabel} pace</div>
          </div>
        </div>

        <div className="bg-muted rounded-xl p-5 border border-border mb-6">
          <h3 className="text-sm font-bold text-foreground mb-3">Food Equivalent</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {result?.foodComp.map((f) => (
              <div key={f.label} className="bg-background rounded-lg px-3 py-2 text-center border border-border">
                <div className="text-lg font-semibold text-foreground">{f.servings < 0.1 ? "<0.1" : f.servings}</div>
                <div className="text-xs text-muted-foreground">{f.servings === 1 ? f.label : `${f.label}s`}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-muted rounded-xl p-5 border border-border mb-4">
          <h3 className="text-sm font-bold text-foreground mb-3">Exercise Equivalent</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {result?.equiv.map((e) => (
              <div key={e.label} className="bg-background rounded-lg px-3 py-2 text-center border border-border">
                <div className="text-sm font-semibold text-foreground">{e.value}</div>
                <div className="text-xs text-muted-foreground">{e.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground bg-muted rounded-lg p-3 border border-border">
          Calories estimated using MET formula: MET × 3.5 × weight(kg) / 200 × time(minutes).
          Moderate push-ups: MET 3.8, ~20 reps/min. Vigorous: MET 8.0, ~40 reps/min.
        </div>
      </ResultBox>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">How Many Calories Do Push-Ups Burn?</h2>
        <div className="bg-muted rounded-xl p-6 border border-border space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>Push-ups are a compound bodyweight exercise that engages the chest, shoulders, triceps, and core.
          While they primarily build strength, they also burn calories. The exact number depends on your body
          weight, the intensity of your reps, and how long you spend doing them.</p>
          <p>A person weighing 70 kg (154 lbs) burns approximately <strong>0.23 calories per moderate push-up</strong>
          and about <strong>0.35 calories per vigorous push-up</strong>. This means 100 push-ups at a
          moderate pace burn roughly 23-35 calories.</p>
          <p>While push-ups alone are not the most efficient calorie-burning exercise (compared to running or
          cycling), they are an excellent addition to a full-body strength routine and contribute to your
          overall daily energy expenditure.</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">The Science Behind the Calculation</h2>
        <div className="bg-muted rounded-xl p-6 border border-border text-sm text-muted-foreground leading-relaxed space-y-3">
          <p>This calculator uses the standard MET (Metabolic Equivalent of Task) formula:</p>
          <p className="font-mono text-foreground bg-background rounded-lg p-3 border border-border text-center">
            Calories = MET × 3.5 × weight(kg) / 200 × time(minutes)
          </p>
          <p>The MET values come from the Compendium of Physical Activities:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Moderate push-ups (MET 3.8):</strong> Steady-paced, controlled form — ~3 seconds per rep.</li>
            <li><strong>Vigorous push-ups (MET 8.0):</strong> Fast, explosive movement — ~1.5 seconds per rep.</li>
          </ul>
          <p>Time is estimated based on the number of reps divided by the expected reps-per-minute rate
          for each intensity level. Individual pace may vary based on fitness level and form.</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">How to Burn More Calories With Push-Ups</h2>
        <div className="bg-muted rounded-xl p-6 border border-border space-y-3 text-sm text-muted-foreground leading-relaxed">
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Increase intensity:</strong> Explosive push-ups (clapping, plyometric) burn significantly more calories per minute.</li>
            <li><strong>Add volume:</strong> Build up to higher rep counts over time through consistent training.</li>
            <li><strong>Reduce rest:</strong> Shorten rest between sets to keep heart rate elevated and increase total calorie burn.</li>
            <li><strong>Combine with other exercises:</strong> Circuits that mix push-ups with squats, lunges, and pulling exercises maximize total energy expenditure.</li>
            <li><strong>Superset with cardio:</strong> Alternating push-up sets with jumping jacks or mountain climbers increases the metabolic demand.</li>
          </ul>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Do push-ups really burn calories?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Yes. Any muscle contraction requires energy. Push-ups are a compound movement engaging multiple
              large muscle groups, so they burn more calories than isolation exercises. While the per-rep burn
              is modest (0.2-0.4 kcal), doing high volumes (100+) contributes noticeably to daily energy expenditure.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              How many push-ups to burn 100 calories?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              For a 70 kg (154 lbs) person, approximately 430 moderate push-ups or 285 vigorous push-ups
              would burn 100 calories. While this sounds like a lot, push-ups are better used as part of a
              varied workout rather than a standalone calorie-burning strategy.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Do different push-up variations burn more calories?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Plyometric variations (clapping push-ups, spiderman push-ups) have a higher MET value due to
              explosive muscle activation. Decline push-ups and weighted push-ups also increase the load,
              raising energy expenditure. Standard, wide-grip, and diamond push-ups have similar MET values.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Is it better to do push-ups for strength or calories?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Push-ups are primarily a strength and muscular endurance exercise. While they do burn calories,
              they should not be your primary calorie-burning activity. Use cardio exercises (walking, running,
              cycling) for calorie expenditure and push-ups for building upper body strength.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              How accurate is the push-up calorie calculation?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              The MET formula provides a reasonable estimate, but individual factors like muscle mass, form
              efficiency, metabolism, and rest between reps affect actual calorie burn. Use this calculator
              as a general guide rather than an exact measurement.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
