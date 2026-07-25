"use client";

import { useState, useMemo, useCallback } from "react";
import ResultBox from "@/components/tools/tool-uis/shared/ResultBox";

interface BodyFatCategory {
  label: string;
  range: string;
  min: number;
  max: number;
  color: string;
}

interface BodyFatResult {
  bf: number;
  leanMass: number;
  fatMass: number;
  category: BodyFatCategory;
  catIndex: number;
  pctInCategory: number;
  catList: BodyFatCategory[];
}

const categories: Record<string, BodyFatCategory[]> = {
  male: [
    { label: "Essential Fat", range: "2-5%", min: 0, max: 5, color: "bg-blue-400" },
    { label: "Athletes", range: "6-13%", min: 5, max: 13, color: "bg-green-400" },
    { label: "Fitness", range: "14-17%", min: 13, max: 17, color: "bg-yellow-400" },
    { label: "Average", range: "18-24%", min: 17, max: 24, color: "bg-orange-400" },
    { label: "Obese", range: "25%+", min: 24, max: 100, color: "bg-red-400" },
  ],
  female: [
    { label: "Essential Fat", range: "10-13%", min: 0, max: 13, color: "bg-blue-400" },
    { label: "Athletes", range: "14-20%", min: 13, max: 20, color: "bg-green-400" },
    { label: "Fitness", range: "21-24%", min: 20, max: 24, color: "bg-yellow-400" },
    { label: "Average", range: "25-31%", min: 24, max: 31, color: "bg-orange-400" },
    { label: "Obese", range: "32%+", min: 31, max: 100, color: "bg-red-400" },
  ],
};

const categoryDescriptions: Record<string, string> = {
  "Essential Fat": "The minimum amount of fat necessary for basic health. Below this range may compromise immune function and vitamin absorption.",
  "Athletes": "Typical for athletes with higher muscle mass and lower body fat. This range often correlates with peak performance.",
  "Fitness": "A healthy range associated with good fitness levels. Common among regular exercisers and fitness enthusiasts.",
  "Average": "Within the acceptable range for the general population. No immediate health concerns, but room for improvement.",
  "Obese": "Excess body fat associated with increased health risks. Consider consulting a healthcare professional for guidance.",
};

export default function BodyFatCalculator() {
  const [unit, setUnit] = useState<string>("metric");
  const [gender, setGender] = useState<string>("male");
  const [waist, setWaist] = useState<string>("");
  const [neck, setNeck] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [hip, setHip] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const result = useMemo((): BodyFatResult | null => {
    const waistNum = parseFloat(waist);
    const neckNum = parseFloat(neck);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (!waist || !neck || !height || !weight || isNaN(waistNum) || isNaN(neckNum) || isNaN(heightNum) || isNaN(weightNum) || waistNum <= 0 || neckNum <= 0 || heightNum <= 0 || weightNum <= 0)
      return null;

    if (gender === "female") {
      const hipNum = parseFloat(hip);
      if (!hip || isNaN(hipNum) || hipNum <= 0) return null;
    }

    let waistIn = waistNum;
    let neckIn = neckNum;
    let heightIn = heightNum;
    let hipIn = gender === "female" ? parseFloat(hip) : 0;

    if (unit === "metric") {
      waistIn = waistNum / 2.54;
      neckIn = neckNum / 2.54;
      heightIn = heightNum / 2.54;
      if (gender === "female") hipIn = hipIn / 2.54;
    }

    let bf: number;
    if (gender === "male") {
      bf = 86.01 * Math.log10(waistIn - neckIn) - 70.041 * Math.log10(heightIn) + 36.76;
    } else {
      bf = 163.205 * Math.log10(waistIn + hipIn - neckIn) - 97.684 * Math.log10(heightIn) - 78.387;
    }

    bf = Math.max(2, Math.min(bf, 70));
    bf = Math.round(bf * 10) / 10;

    const leanMass = weightNum * (1 - bf / 100);
    const catList = categories[gender];
    const category = catList.find((c) => bf > c.min && bf <= c.max) || catList[catList.length - 1];
    const catIndex = catList.indexOf(category);
    const pctInCategory = ((bf - category.min) / (category.max - category.min)) * 100;

    return {
      bf,
      leanMass: Math.round(leanMass * 10) / 10,
      fatMass: Math.round((weightNum - leanMass) * 10) / 10,
      category,
      catIndex,
      pctInCategory: Math.min(100, Math.max(0, pctInCategory)),
      catList,
    };
  }, [gender, waist, neck, height, hip, weight, unit]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    const lines = [
      "Body Fat Calculator Results:",
      `Body Fat: ${result.bf}%`,
      `Category: ${result.category.label} (${result.category.range})`,
      `Fat Mass: ${result.fatMass} ${unit === "metric" ? "kg" : "lbs"}`,
      `Lean Mass: ${result.leanMass} ${unit === "metric" ? "kg" : "lbs"}`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  }, [result, unit]);

  const handleReset = useCallback(() => {
    setUnit("metric");
    setGender("male");
    setWaist("");
    setNeck("");
    setHeight("");
    setHip("");
    setWeight("");
    setCopied(false);
  }, []);

  const inputClasses = "w-full px-4 py-3 rounded-lg border border-border bg-[var(--bg-card)] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-base";
  const labelClasses = "block text-sm font-medium text-foreground mb-2";

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
                  ? "border-brand bg-brand-light text-primary"
                  : "border-border bg-[var(--bg-card)] text-muted-foreground hover:border-brand-light"
              }`}
              aria-pressed={unit === "metric"}
            >
              Metric
            </button>
            <button
              onClick={() => setUnit("imperial")}
              className={`flex-1 px-4 py-3 rounded-lg border-2 text-center font-medium transition-all ${
                unit === "imperial"
                  ? "border-brand bg-brand-light text-primary"
                  : "border-border bg-[var(--bg-card)] text-muted-foreground hover:border-brand-light"
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
            Waist {unit === "metric" ? "(cm)" : "(inches)"}
          </label>
          <input
            type="number"
            value={waist}
            onChange={(e) => setWaist(e.target.value)}
            placeholder={unit === "metric" ? "e.g. 82" : "e.g. 32"}
            min="0"
            step="0.1"
            className={inputClasses}
            aria-label="Waist measurement"
          />
        </div>
        <div>
          <label className={labelClasses}>
            Neck {unit === "metric" ? "(cm)" : "(inches)"}
          </label>
          <input
            type="number"
            value={neck}
            onChange={(e) => setNeck(e.target.value)}
            placeholder={unit === "metric" ? "e.g. 36" : "e.g. 14"}
            min="0"
            step="0.1"
            className={inputClasses}
            aria-label="Neck measurement"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
        <div>
          <label className={labelClasses}>
            Height {unit === "metric" ? "(cm)" : "(inches)"}
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder={unit === "metric" ? "e.g. 175" : "e.g. 69"}
            min="0"
            step="0.1"
            className={inputClasses}
            aria-label="Height"
          />
        </div>
        <div>
          <label className={labelClasses}>
            Weight {unit === "metric" ? "(kg)" : "(lbs)"}
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

      {gender === "female" && (
        <div className="mb-6">
          <label className={labelClasses}>
            Hip {unit === "metric" ? "(cm)" : "(inches)"}
          </label>
          <input
            type="number"
            value={hip}
            onChange={(e) => setHip(e.target.value)}
            placeholder={unit === "metric" ? "e.g. 94" : "e.g. 37"}
            min="0"
            step="0.1"
            className={inputClasses}
            aria-label="Hip measurement"
          />
        </div>
      )}

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
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Body Fat</div>
            <div className="text-2xl font-bold text-foreground">{result?.bf}%</div>
            <div className="text-xs text-muted-foreground">{result?.category.label}</div>
          </div>
          <div className="bg-[var(--bg-soft)] rounded-xl p-4 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Fat Mass</div>
            <div className="text-2xl font-bold text-foreground">{result?.fatMass}</div>
            <div className="text-xs text-muted-foreground">{unit === "metric" ? "kg" : "lbs"}</div>
          </div>
          <div className="bg-[var(--bg-soft)] rounded-xl p-4 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Lean Mass</div>
            <div className="text-2xl font-bold text-foreground">{result?.leanMass}</div>
            <div className="text-xs text-muted-foreground">{unit === "metric" ? "kg" : "lbs"}</div>
          </div>
        </div>

        <h3 className="text-base font-bold text-foreground mb-3">Body Fat Category</h3>
        <div className="space-y-2 mb-4">
          {result?.catList.map((cat, i) => {
            const isActive = i === result!.catIndex;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-24 shrink-0 text-xs font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                  {cat.label}
                </div>
                <div className="flex-1 h-6 bg-[var(--bg-soft)] rounded-lg overflow-hidden border border-border relative">
                  {isActive && (
                    <div
                      className={`h-full rounded-lg transition-all duration-500 ${cat.color}`}
                      style={{ width: `${result!.pctInCategory}%` }}
                    />
                  )}
                </div>
                <div className="w-16 shrink-0 text-right">
                  <span className={`text-xs font-semibold ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                    {cat.range}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-[var(--bg-soft)] rounded-xl p-4 border border-border mb-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Category:</strong> {result?.category.label} ({result?.category.range})<br />
            {categoryDescriptions[result?.category.label ?? ""]}
          </p>
        </div>
      </ResultBox>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">How Body Fat Percentage Is Calculated</h2>
        <div className="bg-[var(--bg-soft)] rounded-xl p-6 border border-border space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>This calculator uses the <strong>US Navy Method</strong>, a circumference-based approach that estimates body density using simple tape measurements. The formula was developed by the US Navy and is widely used due to its accessibility and reasonable accuracy.</p>
          <p><strong>For men:</strong> Body fat is calculated from waist and neck circumferences relative to height. The abdomen measurement is taken at the navel level, and the neck at its narrowest point.</p>
          <p><strong>For women:</strong> The calculation additionally includes hip circumference (widest point), since women naturally store more fat in the hip and gluteal region.</p>
          <p>All measurements should be taken with a flexible tape measure placed directly against the skin, not over clothing. For best accuracy, measure in the morning before eating or exercising.</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Understanding Body Fat Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories[gender].map((cat) => (
            <div key={cat.label} className="bg-[var(--bg-soft)] rounded-xl p-4 border border-border">
              <div className={`h-2 rounded-full mb-3 ${cat.color}`} />
              <h3 className="font-semibold text-foreground text-sm mb-1">{cat.label}</h3>
              <p className="text-xs text-muted-foreground">Range: {cat.range}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              How accurate is the US Navy Method?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              The US Navy Method has an accuracy of about ±3% compared to DEXA scans or hydrostatic weighing
              for the general population. It is one of the most reliable circumference-based methods but should
              be considered an estimate rather than a precise measurement.
            </p>
          </details>
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Where exactly should I measure?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              <strong>Waist (men):</strong> At the navel level, with the tape horizontal.<br />
              <strong>Waist (women):</strong> At the narrowest point, usually above the navel.<br />
              <strong>Neck:</strong> Just below the larynx, at the narrowest point.<br />
              <strong>Hip (women):</strong> At the widest point around the glutes.<br />
              Keep the tape snug but not compressing the skin, and measure bare skin for best results.
            </p>
          </details>
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              What is a healthy body fat percentage?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              For men, 14-24% body fat is generally considered healthy. For women, 21-31% is the healthy range.
              Athletes tend to be lower (6-13% for men, 14-20% for women), while essential fat minimums are
              2-5% for men and 10-13% for women. Below these minimums, health risks increase significantly.
            </p>
          </details>
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Why do women have higher body fat percentages?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Women biologically require more essential fat (10-13%) than men (2-5%) for hormonal function,
              childbearing, and other reproductive processes. This includes fat stored in the breasts, pelvis,
              and hips that is not present in the same amounts in men.
            </p>
          </details>
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              How can I reduce my body fat percentage?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Reducing body fat requires a sustainable calorie deficit through a combination of nutrition and
              exercise. Focus on whole foods with adequate protein to preserve muscle, strength training to
              maintain metabolic rate, and consistent cardiovascular activity. Aim for 0.5-1% body fat loss
              per week for sustainable results.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
