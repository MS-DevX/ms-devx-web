"use client";

import { useState, useMemo, useCallback } from "react";
import ResultBox from "@/components/tools/tool-uis/shared/ResultBox";

interface Activity {
  name: string;
  met: number;
}

interface ActivityCategory {
  category: string;
  activities: Activity[];
}

interface ActivityWithCategory extends Activity {
  category: string;
}

interface IntensityLabel {
  max: number;
  label: string;
  color: string;
}

interface WeeklyCalories {
  freq: number;
  calories: number;
}

interface CaloriesResult {
  calories: number;
  met: number;
  intensity: IntensityLabel;
  perMinute: number;
  perHour: number;
  weekly: WeeklyCalories[];
  weightKg: number;
  duration: number;
}

const exerciseCategories: ActivityCategory[] = [
  {
    category: "Walking & Running",
    activities: [
      { name: "Slow walking (2 mph / 3.2 kph)", met: 2.8 },
      { name: "Moderate walking (3 mph / 4.8 kph)", met: 3.5 },
      { name: "Brisk walking (3.5 mph / 5.6 kph)", met: 4.3 },
      { name: "Very brisk walking (4 mph / 6.4 kph)", met: 5.0 },
      { name: "Power walking (4.5 mph / 7.2 kph)", met: 6.0 },
      { name: "Jogging (5 mph / 8 kph)", met: 8.0 },
      { name: "Running (6 mph / 9.7 kph)", met: 9.8 },
      { name: "Running (7.5 mph / 12 kph)", met: 11.8 },
      { name: "Running (10 mph / 16 kph)", met: 14.5 },
    ],
  },
  {
    category: "Cycling",
    activities: [
      { name: "Leisurely cycling (<10 mph / 16 kph)", met: 4.0 },
      { name: "Moderate cycling (10-12 mph / 16-19 kph)", met: 6.8 },
      { name: "Vigorous cycling (12-14 mph / 19-22 kph)", met: 8.0 },
      { name: "Very vigorous cycling (14-16 mph / 22-26 kph)", met: 10.0 },
      { name: "Racing cycling (>16 mph / 26 kph)", met: 12.0 },
      { name: "Stationary bike (moderate)", met: 5.5 },
      { name: "Stationary bike (vigorous)", met: 8.5 },
    ],
  },
  {
    category: "Strength Training",
    activities: [
      { name: "Light weightlifting", met: 3.0 },
      { name: "Moderate weightlifting", met: 5.0 },
      { name: "Vigorous weightlifting", met: 6.0 },
      { name: "Circuit training", met: 8.0 },
      { name: "Calisthenics (push-ups, pull-ups)", met: 4.5 },
      { name: "CrossFit / HIIT", met: 9.5 },
    ],
  },
  {
    category: "Cardio & Aerobics",
    activities: [
      { name: "Jumping rope (slow)", met: 8.8 },
      { name: "Jumping rope (fast)", met: 12.3 },
      { name: "Aerobics (low impact)", met: 5.0 },
      { name: "Aerobics (high impact)", met: 7.3 },
      { name: "Step aerobics", met: 6.6 },
      { name: "Rowing machine (moderate)", met: 4.8 },
      { name: "Rowing machine (vigorous)", met: 8.5 },
      { name: "Elliptical trainer", met: 5.0 },
      { name: "Stair climber", met: 8.0 },
    ],
  },
  {
    category: "Swimming & Water Sports",
    activities: [
      { name: "Leisurely swimming", met: 6.0 },
      { name: "Moderate swimming (freestyle)", met: 7.0 },
      { name: "Vigorous swimming (laps)", met: 8.3 },
      { name: "Water aerobics", met: 5.5 },
      { name: "Treading water (moderate)", met: 4.0 },
    ],
  },
  {
    category: "Sports & Recreation",
    activities: [
      { name: "Basketball (general)", met: 6.5 },
      { name: "Basketball (competitive)", met: 8.0 },
      { name: "Soccer (general)", met: 7.0 },
      { name: "Soccer (competitive)", met: 10.0 },
      { name: "Tennis (singles)", met: 7.3 },
      { name: "Tennis (doubles)", met: 5.0 },
      { name: "Volleyball (general)", met: 4.0 },
      { name: "Volleyball (competitive)", met: 6.0 },
      { name: "Golf (carrying clubs)", met: 5.0 },
      { name: "Golf (using cart)", met: 3.5 },
      { name: "Hiking (general)", met: 5.3 },
      { name: "Hiking (steep hills)", met: 7.5 },
      { name: "Yoga (Hatha)", met: 2.5 },
      { name: "Yoga (power / Vinyasa)", met: 4.0 },
      { name: "Dancing (ballroom)", met: 4.5 },
      { name: "Dancing (aerobic / Zumba)", met: 6.0 },
      { name: "Martial arts (general)", met: 8.0 },
      { name: "Boxing (sparring)", met: 7.8 },
      { name: "Boxing (bag work)", met: 5.5 },
      { name: "Skateboarding", met: 5.0 },
      { name: "Ice skating", met: 5.5 },
      { name: "Rollerblading", met: 7.0 },
    ],
  },
  {
    category: "Home & Daily Activities",
    activities: [
      { name: "Light housework (dusting, dishes)", met: 2.3 },
      { name: "Moderate housework (vacuuming, mopping)", met: 3.5 },
      { name: "Heavy housework (scrubbing, moving furniture)", met: 4.5 },
      { name: "Gardening (general)", met: 4.0 },
      { name: "Mowing lawn (push mower)", met: 5.5 },
      { name: "Shoveling snow", met: 6.0 },
      { name: "Carrying groceries upstairs", met: 5.0 },
      { name: "Climbing stairs (slow)", met: 5.0 },
      { name: "Climbing stairs (fast)", met: 8.0 },
    ],
  },
];

const intensityLabels: IntensityLabel[] = [
  { max: 2.0, label: "Sedentary", color: "bg-gray-300" },
  { max: 3.0, label: "Light", color: "bg-blue-300" },
  { max: 4.0, label: "Moderate", color: "bg-green-400" },
  { max: 6.0, label: "Vigorous", color: "bg-orange-400" },
  { max: 8.0, label: "High", color: "bg-red-400" },
  { max: 99, label: "Extreme", color: "bg-purple-500" },
];

export default function CaloriesBurnedCalculator() {
  const [unit, setUnit] = useState<string>("metric");
  const [weight, setWeight] = useState<string>("");
  const [duration, setDuration] = useState<string>("30");
  const [selectedActivity, setSelectedActivity] = useState<string>("Moderate walking (3 mph / 4.8 kph)");
  const [activeCategory, setActiveCategory] = useState<string>(exerciseCategories[0].category);
  const [copied, setCopied] = useState<boolean>(false);

  const activityList = useMemo((): ActivityWithCategory[] => {
    const all: ActivityWithCategory[] = [];
    exerciseCategories.forEach((cat) => {
      cat.activities.forEach((act) => {
        all.push({ ...act, category: cat.category });
      });
    });
    return all;
  }, []);

  const currentActivity = useMemo(() => {
    return activityList.find((a) => a.name === selectedActivity);
  }, [activityList, selectedActivity]);

  const result = useMemo((): CaloriesResult | null => {
    const weightNum = parseFloat(weight);
    const durNum = parseFloat(duration);
    if (!weight || !duration || isNaN(weightNum) || isNaN(durNum) || weightNum <= 0 || durNum <= 0 || !currentActivity)
      return null;

    const weightKg = unit === "metric" ? weightNum : weightNum * 0.453592;
    const met = currentActivity.met;
    const calories = Math.round((met * 3.5 * weightKg / 200) * durNum);

    const intensity = intensityLabels.find((i) => met <= i.max) || intensityLabels[intensityLabels.length - 1];

    const perMinute = Math.round(calories / durNum);
    const perHour = Math.round(calories / durNum * 60);

    const weeklyFreqs = [1, 2, 3, 4, 5, 6, 7];
    const weekly = weeklyFreqs.map((f) => ({
      freq: f,
      calories: calories * f,
    }));

    return {
      calories,
      met,
      intensity,
      perMinute,
      perHour,
      weekly,
      weightKg: Math.round(weightKg * 10) / 10,
      duration: durNum,
    };
  }, [weight, duration, unit, currentActivity]);

  const handleCopy = useCallback(async () => {
    if (!result || !currentActivity) return;
    const lines = [
      "Calories Burned Results:",
      `Activity: ${currentActivity.name}`,
      `Duration: ${result.duration} minutes`,
      `Calories burned: ${result.calories}`,
      `Intensity: ${result.intensity.label} (${result.met} METs)`,
      `Per minute: ${result.perMinute} kcal`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  }, [result, currentActivity]);

  const handleReset = useCallback(() => {
    setUnit("metric");
    setWeight("");
    setDuration("30");
    setSelectedActivity("Moderate walking (3 mph / 4.8 kph)");
    setActiveCategory(exerciseCategories[0].category);
    setCopied(false);
  }, []);

  const inputClasses = "w-full px-4 py-3 rounded-lg border border-border bg-[var(--bg-card)] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-base";
  const labelClasses = "block text-sm font-medium text-foreground mb-2";

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div>
          <label className={labelClasses}>
            Weight ({unit === "metric" ? "kg" : "lbs"})
          </label>
          <div className="flex gap-2 mb-2">
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
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"}
            min="0"
            step="0.1"
            className={inputClasses}
            aria-label="Body weight"
          />
        </div>

        <div>
          <label className={labelClasses}>Duration</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 30"
              min="1"
              className={inputClasses}
              aria-label="Duration in minutes"
            />
          </div>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {[10, 15, 30, 45, 60, 90].map((m) => (
              <button
                key={m}
                onClick={() => setDuration(String(m))}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  String(m) === duration
                    ? "bg-brand text-white"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-[var(--bg-card)]"
                }`}
              >
                {m < 60 ? `${m}m` : `${m / 60}h`}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClasses}>Activity Type</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {exerciseCategories.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeCategory === cat.category
                    ? "bg-brand text-white"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>
          <select
            value={selectedActivity}
            onChange={(e) => setSelectedActivity(e.target.value)}
            className={inputClasses}
            aria-label="Select activity"
          >
            {exerciseCategories
              .filter((cat) => cat.category === activeCategory)
              .map((cat) =>
                cat.activities.map((act) => (
                  <option key={act.name} value={act.name}>
                    {act.name}
                  </option>
                ))
              )}
          </select>
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
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Calories Burned</div>
            <div className="text-2xl font-bold text-foreground">{result?.calories?.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">kcal in {result?.duration} min</div>
          </div>
          <div className="bg-[var(--bg-soft)] rounded-xl p-4 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Per Minute</div>
            <div className="text-2xl font-bold text-foreground">{result?.perMinute}</div>
            <div className="text-xs text-muted-foreground">kcal / min</div>
          </div>
          <div className="bg-[var(--bg-soft)] rounded-xl p-4 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Per Hour</div>
            <div className="text-2xl font-bold text-foreground">{result?.perHour?.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">kcal / hour</div>
          </div>
        </div>

        <div className="bg-[var(--bg-soft)] rounded-xl p-5 border border-border mb-6">
          <h3 className="text-sm font-bold text-foreground mb-3">Intensity Level</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-6 bg-[var(--bg-card)] rounded-lg overflow-hidden border border-border flex">
              {intensityLabels.map((il, i) => {
                const prevMax = i === 0 ? 0 : intensityLabels[i - 1].max;
                const pct = ((il.max - prevMax) / 14.5) * 100;
                const isActive = result?.intensity.label === il.label;
                return (
                  <div
                    key={il.label}
                    className={`h-full transition-all duration-300 ${isActive ? il.color : "opacity-20"} ${il.color}`}
                    style={{ width: `${pct}%` }}
                    title={`${il.label} (\u2264${il.max} METs)`}
                  />
                );
              })}
            </div>
            <div className="text-sm font-bold text-foreground whitespace-nowrap">
              {result?.intensity.label} ({result?.met} METs)
            </div>
          </div>
        </div>

        <h3 className="text-base font-bold text-foreground mb-3">Weekly Frequency Comparison</h3>
        <div className="space-y-2 mb-6">
          {result?.weekly.map((w) => {
            const maxFreq = result!.weekly[result!.weekly.length - 1].calories;
            const pct = (w.calories / maxFreq) * 100;
            return (
              <div key={w.freq} className="flex items-center gap-3">
                <div className="w-16 shrink-0 text-xs font-medium text-muted-foreground">
                  {w.freq === 1 ? "1x /wk" : `${w.freq}x /wk`}
                </div>
                <div className="flex-1 h-7 bg-[var(--bg-soft)] rounded-lg overflow-hidden border border-border">
                  <div
                    className="h-full rounded-lg bg-brand transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="w-20 shrink-0 text-right text-sm font-semibold text-foreground">
                  {w.calories.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-xs text-muted-foreground bg-[var(--bg-soft)] rounded-lg p-3 border border-border">
          Calories estimated using the MET (Metabolic Equivalent of Task) formula: MET x 3.5 x weight(kg) / 200 x minutes.
          Individual results vary based on intensity, fitness level, and biomechanics.
        </div>
      </ResultBox>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">How MET Values Work</h2>
        <div className="bg-[var(--bg-soft)] rounded-xl p-6 border border-border space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p><strong>MET</strong> stands for Metabolic Equivalent of Task. One MET is the energy you burn at rest
          (sitting quietly), which is approximately 1 kcal per kg of body weight per hour.</p>
          <p>An activity with a MET value of 5 means you are burning 5 times as many calories as you would at rest.
          The higher the MET value, the more intense the activity.</p>
          <p><strong>Light activities (&lt;3 METs):</strong> Slow walking, light housework, stretching.</p>
          <p><strong>Moderate activities (3-6 METs):</strong> Brisk walking, leisurely cycling, dancing.</p>
          <p><strong>Vigorous activities (&gt;6 METs):</strong> Running, swimming laps, jumping rope, competitive sports.</p>
          <p>MET values are standardized from the Compendium of Physical Activities, which is maintained by researchers
          at Arizona State University and the National Cancer Institute.</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              How accurate is MET-based calorie estimation?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              MET-based estimation is reasonably accurate for steady-state activities (walking, running,
              cycling) with an error margin of about \u00B115%. For high-intensity interval training or complex
              movements, actual calorie burn can vary more significantly. The formula provides a solid
              guideline for most people and activities.
            </p>
          </details>
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Why does weight matter for calorie burn?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Heavier individuals burn more calories doing the same activity because moving a larger mass
              requires more energy. This is why two people doing the same workout at the same intensity will
              have different calorie burns if they weigh different amounts.
            </p>
          </details>
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              How can I increase calories burned during exercise?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              You can increase calorie burn by increasing duration (exercise longer), increasing intensity
              (go faster or harder), adding resistance (hills, weights, bands), or choosing compound
              movements that engage multiple muscle groups simultaneously.
            </p>
          </details>
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Do fitness trackers give more accurate results?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Fitness trackers and smartwatches combine MET data with heart rate readings, which improves
              accuracy &mdash; especially during varied-intensity activities. However, studies show most trackers
              still have a 10-20% error margin. This calculator provides a solid baseline estimate.
            </p>
          </details>
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              How many calories should I aim to burn through exercise?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              For general health, aim for 150-300 minutes of moderate activity or 75-150 minutes of vigorous
              activity per week (WHO guidelines). For weight loss, a daily deficit of 300-500 calories from
              exercise combined with diet is sustainable. Use the weekly frequency chart to plan your routine.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
