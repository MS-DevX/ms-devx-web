"use client";

import Link from "next/link";
import { useState, useMemo, useCallback } from "react";
import ResultBox from "@/components/tools/tool-uis/shared/ResultBox";

interface FitnessNorm {
  age: number;
  excellent: number;
  good: number;
  average: number;
  fair: number;
  poor: number;
}

interface Category {
  label: string;
  color: string;
  textColor: string;
}

interface PctLevel {
  level: number;
  label: string;
  color: string;
}

interface Method {
  id: string;
  label: string;
  desc: string;
}

interface Result {
  vo2: number;
  category: Category;
  pct: number;
  methodName: string;
  age: number;
  gender: string;
  levelDesc: string;
  restingHr: number | null;
  hrMax: number;
  norms: FitnessNorm;
}

const fitnessCategories: Record<string, FitnessNorm[]> = {
  male: [
    { age: 20, excellent: 50, good: 44, average: 39, fair: 34, poor: 30 },
    { age: 30, excellent: 47, good: 42, average: 37, fair: 33, poor: 28 },
    { age: 40, excellent: 44, good: 39, average: 35, fair: 31, poor: 26 },
    { age: 50, excellent: 40, good: 36, average: 32, fair: 28, poor: 24 },
    { age: 60, excellent: 37, good: 33, average: 30, fair: 26, poor: 22 },
  ],
  female: [
    { age: 20, excellent: 44, good: 39, average: 34, fair: 29, poor: 25 },
    { age: 30, excellent: 41, good: 37, average: 32, fair: 28, poor: 23 },
    { age: 40, excellent: 38, good: 34, average: 30, fair: 26, poor: 22 },
    { age: 50, excellent: 35, good: 31, average: 28, fair: 24, poor: 20 },
    { age: 60, excellent: 32, good: 28, average: 25, fair: 22, poor: 18 },
  ],
};

function getCategory(vo2: number, age: number, gender: string): Category {
  const norms = fitnessCategories[gender] || fitnessCategories.male;
  const closest = norms.reduce((prev, curr) =>
    Math.abs(curr.age - age) < Math.abs(prev.age - age) ? curr : prev
  );
  if (vo2 >= closest.excellent) return { label: "Excellent", color: "bg-blue-400", textColor: "text-blue-500" };
  if (vo2 >= closest.good) return { label: "Good", color: "bg-green-400", textColor: "text-green-500" };
  if (vo2 >= closest.average) return { label: "Average", color: "bg-yellow-400", textColor: "text-yellow-500" };
  if (vo2 >= closest.fair) return { label: "Fair", color: "bg-orange-400", textColor: "text-orange-500" };
  return { label: "Poor", color: "bg-red-400", textColor: "text-red-500" };
}

const pctLevels: PctLevel[] = [
  { level: 10, label: "Elite", color: "bg-purple-500" },
  { level: 30, label: "Excellent", color: "bg-blue-400" },
  { level: 50, label: "Good", color: "bg-green-400" },
  { level: 70, label: "Average", color: "bg-yellow-400" },
  { level: 90, label: "Fair", color: "bg-orange-400" },
  { level: 100, label: "Poor", color: "bg-red-400" },
];

const methods: Method[] = [
  { id: "resting-hr", label: "Resting HR", desc: "Quick estimate using age, gender, and resting heart rate." },
  { id: "cooper", label: "Cooper 12-min", desc: "Run as far as you can in 12 minutes. Enter distance." },
  { id: "run-1.5", label: "1.5-Mile Run", desc: "Time your 1.5-mile (2.4 km) run. Enter your time." },
];

export default function Vo2MaxEstimator() {
  const [method, setMethod] = useState("resting-hr");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [restingHr, setRestingHr] = useState("");
  const [cooperDistance, setCooperDistance] = useState("");
  const [cooperUnit, setCooperUnit] = useState("meters");
  const [runTimeMin, setRunTimeMin] = useState("");
  const [runTimeSec, setRunTimeSec] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo<Result | null>(() => {
    const ageNum = parseInt(age, 10);
    if (!age || isNaN(ageNum) || ageNum < 10 || ageNum > 120) return null;

    let vo2: number | null = null;
    let methodName = "";

    if (method === "resting-hr") {
      const rhr = parseInt(restingHr, 10);
      if (!restingHr || isNaN(rhr) || rhr < 30 || rhr > 120) return null;
      const hrMax = 208 - 0.7 * ageNum;
      vo2 = Math.round(15 * (hrMax / rhr) * 10) / 10;
      methodName = "Resting Heart Rate Method";
    } else if (method === "cooper") {
      const dist = parseFloat(cooperDistance);
      if (!cooperDistance || isNaN(dist) || dist <= 0) return null;
      const distM = cooperUnit === "meters" ? dist : dist * 0.9144;
      vo2 = Math.round(((distM - 504.9) / 44.73) * 10) / 10;
      methodName = "Cooper 12-Minute Run Test";
    } else if (method === "run-1.5") {
      const mins = parseInt(runTimeMin, 10) || 0;
      const secs = parseInt(runTimeSec, 10) || 0;
      if (mins === 0 && secs === 0) return null;
      const totalMinutes = mins + secs / 60;
      const distMeters = 2414;
      const mPerMin = distMeters / totalMinutes;
      vo2 = Math.round(((mPerMin - 133) / 3.5) * 10) / 10;
      methodName = "1.5-Mile Run Test";
    }

    if (vo2 === null || vo2 <= 0) return null;

    const category = getCategory(vo2, ageNum, gender);

    const norms = fitnessCategories[gender] || fitnessCategories.male;
    const closest = norms.reduce((prev, curr) =>
      Math.abs(curr.age - ageNum) < Math.abs(prev.age - ageNum) ? curr : prev
    );
    const maxNorms = closest.excellent;
    const minNorms = closest.poor;
    const normRange = maxNorms - minNorms;
    const pct = Math.max(0, Math.min(100, ((vo2 - minNorms) / normRange) * 100));

    const levelDesc = vo2 >= closest.excellent
      ? "Excellent cardiovascular fitness. Typically seen in endurance athletes."
      : vo2 >= closest.good
        ? "Good cardiovascular fitness. Above average for your age group."
        : vo2 >= closest.average
          ? "Average cardiovascular fitness. Typical for your age group."
          : vo2 >= closest.fair
            ? "Below average. Increasing aerobic activity can improve this."
            : "Low cardiovascular fitness. Consider gradually increasing physical activity.";

    const restingHrUsed = method === "resting-hr" ? parseInt(restingHr, 10) : null;
    const hrMax = 208 - 0.7 * ageNum;

    return {
      vo2,
      category,
      pct,
      methodName,
      age: ageNum,
      gender,
      levelDesc,
      restingHr: restingHrUsed,
      hrMax,
      norms: closest,
    };
  }, [method, age, gender, restingHr, cooperDistance, cooperUnit, runTimeMin, runTimeSec]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    const lines = [
      "VO2 Max Estimator Results:",
      `VO2 Max: ${result.vo2} ml/kg/min`,
      `Category: ${result.category.label}`,
      `Method: ${result.methodName}`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  }, [result]);

  const handleReset = useCallback(() => {
    setMethod("resting-hr");
    setAge("");
    setGender("male");
    setRestingHr("");
    setCooperDistance("");
    setCooperUnit("meters");
    setRunTimeMin("");
    setRunTimeSec("");
    setCopied(false);
  }, []);

  const inputClasses = "w-full px-4 py-3 rounded-lg border border-border bg-[var(--bg-card)] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-base";
  const labelClasses = "block text-sm font-medium text-foreground mb-2";
  const selectCardClasses = (isSelected: boolean) =>
    `flex-1 min-w-[80px] px-3 py-2.5 rounded-xl border-2 text-center cursor-pointer transition-all duration-200 ${
      isSelected ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border bg-[var(--bg-card)] text-muted-foreground hover:border-primary/60"
    }`;

  return (
    <div>
      <div className="mb-6">
        <label className={labelClasses}>Estimation Method</label>
        <div className="flex flex-wrap gap-2">
          {methods.map((m) => (
            <button key={m.id} onClick={() => setMethod(m.id)} className={selectCardClasses(method === m.id)} title={m.desc}>
              <div className="text-sm">{m.label}</div>
              <div className="text-xs opacity-70 mt-0.5">{m.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
        <div>
          <label className={labelClasses}>Age</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 30" min="10" max="120" className={inputClasses} aria-label="Age" />
        </div>
        <div>
          <label className={labelClasses}>Gender</label>
          <div className="flex gap-2">
            <button onClick={() => setGender("male")} className={`flex-1 px-4 py-3 rounded-lg border-2 text-center font-medium transition-all ${gender === "male" ? "border-primary bg-primary/10 text-primary" : "border-border bg-[var(--bg-card)] text-muted-foreground hover:border-primary/60"}`} aria-pressed={gender === "male"}>Male</button>
            <button onClick={() => setGender("female")} className={`flex-1 px-4 py-3 rounded-lg border-2 text-center font-medium transition-all ${gender === "female" ? "border-primary bg-primary/10 text-primary" : "border-border bg-[var(--bg-card)] text-muted-foreground hover:border-primary/60"}`} aria-pressed={gender === "female"}>Female</button>
          </div>
        </div>
      </div>

      {method === "resting-hr" && (
        <div className="mb-6">
          <label className={labelClasses}>Resting Heart Rate (bpm)</label>
          <input type="number" value={restingHr} onChange={(e) => setRestingHr(e.target.value)} placeholder="e.g. 65" min="30" max="120" className={inputClasses} aria-label="Resting heart rate" />
          <p className="text-xs text-muted-foreground mt-1.5">Measure first thing in the morning before getting out of bed.</p>
        </div>
      )}

      {method === "cooper" && (
        <div className="mb-6">
          <label className={labelClasses}>Distance Covered in 12 Minutes</label>
          <div className="flex gap-2 mb-2">
            <button onClick={() => setCooperUnit("meters")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${cooperUnit === "meters" ? "bg-primary text-white shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground"}`}>Meters</button>
            <button onClick={() => setCooperUnit("yards")} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${cooperUnit === "yards" ? "bg-primary text-white shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground"}`}>Yards</button>
          </div>
          <input type="number" value={cooperDistance} onChange={(e) => setCooperDistance(e.target.value)} placeholder={cooperUnit === "meters" ? "e.g. 2800" : "e.g. 3100"} min="0" className={inputClasses} aria-label="Cooper test distance" />
          <p className="text-xs text-muted-foreground mt-1.5">Run or walk as far as possible in exactly 12 minutes on a flat surface.</p>
        </div>
      )}

      {method === "run-1.5" && (
        <div className="mb-6">
          <label className={labelClasses}>1.5-Mile (2.4 km) Run Time</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input type="number" value={runTimeMin} onChange={(e) => setRunTimeMin(e.target.value)} placeholder="Minutes" min="0" max="60" className={inputClasses} aria-label="Minutes" />
            </div>
            <div>
              <input type="number" value={runTimeSec} onChange={(e) => setRunTimeSec(e.target.value)} placeholder="Seconds" min="0" max="59" className={inputClasses} aria-label="Seconds" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">Run 1.5 miles (2.4 km) as fast as possible on a flat surface.</p>
        </div>
      )}

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
          <div className={`rounded-xl p-5 text-center border-2 ${result?.category.color.replace("bg-", "border-")} bg-muted`}>
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">VO&#8322; Max</div>
            <div className="text-3xl font-bold text-foreground">{result?.vo2}</div>
            <div className="text-sm text-muted-foreground">ml/kg/min</div>
          </div>
          <div className="bg-muted rounded-xl p-5 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Fitness Category</div>
            <div className={`text-2xl font-bold ${result?.category.textColor}`}>{result?.category.label}</div>
            <div className="text-xs text-muted-foreground mt-1">for age {result?.age}, {result?.gender === "male" ? "Male" : "Female"}</div>
          </div>
        </div>

        <div className="bg-muted rounded-xl p-5 border border-border mb-6">
          <h3 className="text-sm font-bold text-foreground mb-3">Fitness Level Scale</h3>
          <div className="h-5 bg-background rounded-lg overflow-hidden border border-border flex">
            {pctLevels.map((pl, i) => {
              const prev = i === 0 ? 0 : pctLevels[i - 1].level;
              const width = pl.level - prev;
              const isActive = result !== null && result.pct <= pl.level;
              return (
                <div key={pl.label} className={`h-full ${isActive ? pl.color : pl.color + " opacity-20"}`} style={{ width: `${width}%` }} title={pl.label} />
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>Poor</span>
            <span>Fair</span>
            <span>Average</span>
            <span>Good</span>
            <span>Excellent</span>
            <span>Elite</span>
          </div>
        </div>

        <div className="bg-muted rounded-xl p-5 border border-border mb-4">
          <p className="text-sm text-muted-foreground leading-relaxed">{result?.levelDesc}</p>
          <p className="text-xs text-muted-foreground mt-2">Estimated using: {result?.methodName}</p>
          {result?.restingHr && (
            <p className="text-xs text-muted-foreground mt-1">HR Max (Tanaka): {result.hrMax} bpm | Resting HR: {result.restingHr} bpm</p>
          )}
        </div>

        <h3 className="text-base font-bold text-foreground mb-3">VO&#8322; Max Norms by Age</h3>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground border-b border-border">
                <th className="text-left py-2 pr-3">Age</th>
                <th className="text-left py-2 pr-3">Excellent</th>
                <th className="text-left py-2 pr-3">Good</th>
                <th className="text-left py-2 pr-3">Average</th>
                <th className="text-left py-2 pr-3">Fair</th>
                <th className="text-left py-2 pr-3">Poor</th>
              </tr>
            </thead>
            <tbody>
              {(fitnessCategories[gender] || fitnessCategories.male).map((row) => {
                const isCurrent = row.age === result?.norms.age;
                return (
                  <tr key={row.age} className={`border-b border-border ${isCurrent ? "bg-primary/10 font-semibold" : ""}`}>
                    <td className={`py-2 pr-3 ${isCurrent ? "text-primary" : "text-foreground"}`}>{row.age}</td>
                    <td className={`py-2 pr-3 ${isCurrent ? "text-blue-500" : "text-muted-foreground"}`}>{row.excellent}</td>
                    <td className={`py-2 pr-3 ${isCurrent ? "text-green-500" : "text-muted-foreground"}`}>{row.good}</td>
                    <td className={`py-2 pr-3 ${isCurrent ? "text-yellow-500" : "text-muted-foreground"}`}>{row.average}</td>
                    <td className={`py-2 pr-3 ${isCurrent ? "text-orange-500" : "text-muted-foreground"}`}>{row.fair}</td>
                    <td className={`py-2 ${isCurrent ? "text-red-500" : "text-muted-foreground"}`}>{row.poor}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="text-xs text-muted-foreground bg-muted rounded-lg p-3 border border-border">
          Norms based on ACSM guidelines for VO&#8322; max by age and gender. Values in ml/kg/min.
        </div>
      </ResultBox>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">What Is VO&#8322; Max?</h2>
        <div className="bg-muted rounded-xl p-6 border border-border space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>VO&#8322; max (maximal oxygen uptake) is the maximum rate at which your body can consume oxygen during
          intense exercise. It is considered the single best measure of cardiovascular fitness and aerobic endurance.</p>
          <p>VO&#8322; max is expressed in milliliters of oxygen per kilogram of body weight per minute (ml/kg/min).
          A higher VO&#8322; max means your body can deliver and use oxygen more efficiently during exercise.</p>
          <p><strong>Factors that affect VO&#8322; max:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Genetics:</strong> Up to 50% of your VO&#8322; max is determined by genetics.</li>
            <li><strong>Training:</strong> Endurance training can improve VO&#8322; max by 10-30%.</li>
            <li><strong>Age:</strong> VO&#8322; max typically peaks in the early 20s and declines 5-10% per decade.</li>
            <li><strong>Gender:</strong> Women typically have 15-30% lower VO&#8322; max than men due to lower hemoglobin and muscle mass.</li>
            <li><strong>Altitude:</strong> Training at altitude can increase oxygen-carrying capacity.</li>
          </ul>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Estimation Methods</h2>
        <div className="space-y-3">
          {methods.map((m) => (
            <div key={m.id} className="bg-muted rounded-xl border border-border p-4">
              <h3 className="font-semibold text-foreground text-sm">{m.label}</h3>
              <p className="text-xs text-muted-foreground mt-1">{m.desc}</p>
              {m.id === "resting-hr" && <p className="text-xs text-muted-foreground mt-1">Formula: VO&#8322;max = 15 &#215; (HRmax / HRrest). HRmax estimated using Tanaka (208 - 0.7 &#215; age). A rough but accessible estimate.</p>}
              {m.id === "cooper" && <p className="text-xs text-muted-foreground mt-1">Formula: VO&#8322;max = (distance_meters - 504.9) / 44.73. Developed by Dr. Kenneth Cooper for the US Air Force. Good correlation with lab-tested VO&#8322; max.</p>}
              {m.id === "run-1.5" && <p className="text-xs text-muted-foreground mt-1">Formula: VO&#8322;max = (speed_m/min - 133) / 3.5. The 1.5-mile run is used by the US Navy and Marine Corps for fitness assessment.</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">How to Improve VO&#8322; Max</h2>
        <div className="bg-muted rounded-xl p-6 border border-border space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>The most effective way to improve VO&#8322; max is through high-intensity interval training (HIIT) and
          sustained aerobic exercise at 65-85% of max heart rate:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Zone 2 training:</strong> 30-60 minutes at 65-75% max HR, 3-4 times per week.</li>
            <li><strong>HIIT:</strong> 4-6 intervals of 3-4 minutes at 90-95% max HR, with equal recovery.</li>
            <li><strong>Tempo runs:</strong> 15-30 minutes at 80-85% max HR — &quot;comfortably hard.&quot;</li>
            <li><strong>Consistency:</strong> Significant improvements appear after 8-12 weeks of consistent training.</li>
          </ul>
          <p className="mt-2">Consult your <Link href="/tools/heart-rate-zone-calculator">Heart Rate Zone Calculator</Link> to determine your target training zones.</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              How accurate are these VO&#8322; max estimates?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Field tests (Cooper, 1.5-mile run) have a correlation of r=0.85-0.90 with lab-tested VO&#8322; max,
              meaning they are reasonably accurate for most people. The resting HR method is a rougher
              estimate with more variability. For precise measurement, a metabolic cart test in a lab is required.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              What is a good VO&#8322; max for my age?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              See the norms table in the calculator. Generally, values above 40 ml/kg/min for men in their 30s
              and above 35 ml/kg/min for women in their 30s are considered good. Elite endurance athletes
              can reach values of 60-85 ml/kg/min.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Can I improve my VO&#8322; max after 40?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Yes. While VO&#8322; max naturally declines with age, consistent endurance training can improve it
              at any age. Studies show 10-20% improvements in previously sedentary adults over 50 who
              started a structured walking and jogging program.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              How does altitude affect VO&#8322; max?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              VO&#8322; max decreases by approximately 7-8% per 1,000 meters of altitude gain above 1,500 meters.
              This is due to lower oxygen partial pressure at altitude. After 2-3 weeks of acclimatization,
              some of this loss is regained through increased red blood cell production.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              What is the relationship between VO&#8322; max and longevity?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Higher VO&#8322; max is strongly associated with lower all-cause mortality. A landmark study found
              that cardiorespiratory fitness is a stronger predictor of longevity than smoking status,
              hypertension, or diabetes. Each 3.5 ml/kg/min increase in VO&#8322; max is associated with a
              10-15% reduction in mortality risk.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
