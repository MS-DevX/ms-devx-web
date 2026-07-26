"use client";

import { useState, useMemo, useCallback } from "react";
import ResultBox from "@/components/tools/tool-uis/shared/ResultBox";

interface HrZone {
  id: string;
  label: string;
  subtitle: string;
  minPct: number;
  maxPct: number;
  color: string;
  textColor: string;
  benefits: string;
  perceived: string;
  duration: string;
}

interface ZoneDetail extends HrZone {
  standardLow: number;
  standardHigh: number;
  tanakaLow: number;
  tanakaHigh: number;
  pctMaxStandardLow: number;
  pctMaxStandardHigh: number;
}

interface HrResult {
  age: number;
  rhr: number;
  maxHrStandard: number;
  maxHrTanaka: number;
  hrrStandard: number;
  zoneDetails: ZoneDetail[];
}

const zones: HrZone[] = [
  {
    id: "warmup",
    label: "Warm-Up",
    subtitle: "Very Light",
    minPct: 50,
    maxPct: 60,
    color: "bg-blue-400",
    textColor: "text-blue-600 dark:text-blue-300",
    benefits: "Improves blood flow and prepares muscles for activity. Ideal for recovery days and cool-downs.",
    perceived: "Very easy, relaxed breathing.",
    duration: "10-20 minute warm-up or cool-down.",
  },
  {
    id: "fat-burn",
    label: "Fat Burn",
    subtitle: "Light",
    minPct: 60,
    maxPct: 70,
    color: "bg-green-400",
    textColor: "text-green-600 dark:text-green-300",
    benefits: "Maximizes fat as a fuel source. Improves basic endurance and aerobic capacity. Sustainable for long durations.",
    perceived: "Easy to moderate, slightly elevated breathing, can hold a conversation.",
    duration: "30-60+ minute steady sessions.",
  },
  {
    id: "cardio",
    label: "Cardio",
    subtitle: "Moderate",
    minPct: 70,
    maxPct: 80,
    color: "bg-yellow-400",
    textColor: "text-yellow-600 dark:text-yellow-300",
    benefits: "Improves cardiovascular fitness and stroke volume. The sweet spot for aerobic conditioning.",
    perceived: "Moderate effort, breathing deeper, conversation is possible but not effortless.",
    duration: "20-40 minute intervals or steady-state.",
  },
  {
    id: "anaerobic",
    label: "Anaerobic",
    subtitle: "Hard",
    minPct: 80,
    maxPct: 90,
    color: "bg-orange-400",
    textColor: "text-orange-600 dark:text-orange-300",
    benefits: "Increases lactate threshold and high-end endurance. Improves speed and power output.",
    perceived: "Hard, rapid breathing, can only speak short phrases.",
    duration: "2-10 minute intervals with recovery periods.",
  },
  {
    id: "peak",
    label: "Peak",
    subtitle: "Maximum",
    minPct: 90,
    maxPct: 100,
    color: "bg-red-500",
    textColor: "text-red-600 dark:text-red-300",
    benefits: "Builds top-end speed and power. Improves neuromuscular coordination and explosive performance.",
    perceived: "All-out effort, cannot speak, gasping for breath.",
    duration: "30 seconds to 2 minutes with full recovery.",
  },
];

export default function HeartRateZoneCalculator() {
  const [age, setAge] = useState<string>("");
  const [restingHr, setRestingHr] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const result = useMemo((): HrResult | null => {
    const ageNum = parseInt(age, 10);
    const rhrNum = parseInt(restingHr, 10);
    if (!age || !restingHr || isNaN(ageNum) || isNaN(rhrNum) || ageNum < 10 || ageNum > 120 || rhrNum < 30 || rhrNum > 120)
      return null;

    const maxHrStandard = 220 - ageNum;
    const maxHrTanaka = Math.round(208 - 0.7 * ageNum);

    const hrrStandard = maxHrStandard - rhrNum;
    const hrrTanaka = maxHrTanaka - rhrNum;

    const zoneDetails = zones.map((z) => {
      const standardLow = Math.round(z.minPct / 100 * hrrStandard + rhrNum);
      const standardHigh = Math.round(z.maxPct / 100 * hrrStandard + rhrNum);
      const tanakaLow = Math.round(z.minPct / 100 * hrrTanaka + rhrNum);
      const tanakaHigh = Math.round(z.maxPct / 100 * hrrTanaka + rhrNum);

      const pctMaxStandardLow = Math.round(standardLow / maxHrStandard * 100);
      const pctMaxStandardHigh = Math.round(standardHigh / maxHrStandard * 100);

      return {
        ...z,
        standardLow,
        standardHigh,
        tanakaLow,
        tanakaHigh,
        pctMaxStandardLow,
        pctMaxStandardHigh,
      };
    });

    return {
      age: ageNum,
      rhr: rhrNum,
      maxHrStandard,
      maxHrTanaka,
      hrrStandard,
      zoneDetails,
    };
  }, [age, restingHr]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    const lines = [
      "Heart Rate Zone Results:",
      `Max HR (220-age): ${result.maxHrStandard} bpm`,
      `Max HR (Tanaka): ${result.maxHrTanaka} bpm`,
      `Resting HR: ${result.rhr} bpm`,
      "Zones (Karvonen):",
      ...result.zoneDetails.map((z) =>
        `  ${z.label} (${z.subtitle}): ${z.standardLow}-${z.standardHigh} bpm`
      ),
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  }, [result]);

  const handleReset = useCallback(() => {
    setAge("");
    setRestingHr("");
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
          <label className={labelClasses}>Resting Heart Rate (bpm)</label>
          <div className="mb-2">
            <input
              type="number"
              value={restingHr}
              onChange={(e) => setRestingHr(e.target.value)}
              placeholder="e.g. 65"
              min="30"
              max="120"
              className={inputClasses}
              aria-label="Resting heart rate in beats per minute"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Measure your resting HR first thing in the morning before getting out of bed. Take it for 3
            consecutive days and use the average.
          </p>
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

      {result && (
        <ResultBox show={true}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-[var(--bg-soft)] rounded-xl p-4 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Max HR (220 - Age)</div>
            <div className="text-2xl font-bold text-foreground">{result?.maxHrStandard}</div>
            <div className="text-xs text-muted-foreground">bpm</div>
          </div>
          <div className="bg-[var(--bg-soft)] rounded-xl p-4 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Max HR (Tanaka)</div>
            <div className="text-2xl font-bold text-foreground">{result?.maxHrTanaka}</div>
            <div className="text-xs text-muted-foreground">bpm</div>
          </div>
          <div className="bg-[var(--bg-soft)] rounded-xl p-4 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Heart Rate Reserve</div>
            <div className="text-2xl font-bold text-foreground">{result?.hrrStandard}</div>
            <div className="text-xs text-muted-foreground">bpm (max - resting)</div>
          </div>
        </div>

        <h3 className="text-base font-bold text-foreground mb-4">Your Heart Rate Zones (Karvonen Method)</h3>

        <div className="space-y-3 mb-6">
          {result?.zoneDetails.map((zone) => {
            const totalRange = result!.maxHrStandard - result!.rhr;
            const zoneStart = ((zone.standardLow - result!.rhr) / totalRange) * 100;
            const zoneWidth = ((zone.standardHigh - zone.standardLow) / totalRange) * 100;

            return (
              <div key={zone.id} className="bg-[var(--bg-soft)] rounded-xl border border-border overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className={`font-semibold text-sm ${zone.textColor}`}>{zone.label}</span>
                      <span className="text-xs text-muted-foreground ml-2">({zone.subtitle})</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {zone.standardLow} - {zone.standardHigh} <span className="text-xs font-normal text-muted-foreground">bpm</span>
                    </span>
                  </div>
                  <div className="h-5 bg-[var(--bg-card)] rounded-lg overflow-hidden border border-border relative mb-2">
                    <div
                      className={`h-full rounded-lg ${zone.color} transition-all duration-500 opacity-80`}
                      style={{ marginLeft: `${zoneStart}%`, width: `${Math.max(zoneWidth, 2)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{zone.minPct}% HRR</span>
                    <span>{zone.perceived}</span>
                    <span>{zone.maxPct}% HRR</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-[var(--bg-soft)] rounded-lg p-3 border border-border text-xs text-muted-foreground mb-4">
          Zones calculated using the <strong>Karvonen formula</strong>: Target HR = (HRR x intensity%) + Resting HR,
          where HRR = Max HR - Resting HR. Shown using the standard max HR formula (220 - age).
          <span className="block mt-1">Tanaka max HR formula (208 - 0.7 x age): {result?.maxHrTanaka} bpm</span>
        </div>
      </ResultBox>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Understanding Your Zones</h2>
        <div className="space-y-3">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="bg-[var(--bg-soft)] rounded-xl border border-border p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg ${zone.color} flex items-center justify-center text-white font-bold text-sm`}>
                  {zone.minPct}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{zone.label}</h3>
                  <p className="text-xs text-muted-foreground">{zone.subtitle} &mdash; {zone.minPct}-{zone.maxPct}% HRR</p>
                </div>
              </div>
              <div className="space-y-1.5 text-sm text-muted-foreground leading-relaxed">
                <p><strong>Benefits:</strong> {zone.benefits}</p>
                <p><strong>Feels like:</strong> {zone.perceived}</p>
                <p><strong>Typical duration:</strong> {zone.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">How to Measure Your Resting Heart Rate</h2>
        <div className="bg-[var(--bg-soft)] rounded-xl p-6 border border-border space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>Your resting heart rate is the number of times your heart beats per minute while at complete rest. To get an accurate measurement:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Measure first thing in the morning before getting out of bed.</li>
            <li>Place your index and middle fingers on your wrist (radial artery) or neck (carotid artery).</li>
            <li>Count the beats for 30 seconds and multiply by 2.</li>
            <li>Repeat for 3 consecutive days and use the average.</li>
          </ol>
          <p className="mt-2">A normal resting heart rate for adults ranges from 60 to 100 bpm. Well-trained athletes may have resting rates as low as 40-50 bpm.</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Which max HR formula should I use?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              The &quot;220 minus age&quot; formula is the most widely used and easiest to remember. The Tanaka formula
              (208 - 0.7 x age) is more accurate for older adults. Both provide estimates &mdash; individual max HR
              can vary by \u00B110-15 bpm from these formulas. For precise results, a maximal exercise test with
              ECG monitoring is needed.
            </p>
          </details>
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              What is the difference between HRR and % of Max HR?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              The Karvonen method (HRR) accounts for your resting heart rate, making it more personalized.
              The straight percentage of max HR method is simpler but less accurate, especially for fit
              individuals with low resting heart rates. This calculator uses the Karvonen method as the
              primary calculation.
            </p>
          </details>
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Which zone should I train in?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              It depends on your goals. For general fitness, spend most of your time in Zone 2 (fat burn) and
              Zone 3 (cardio). For performance, incorporate Zone 4 (anaerobic) and Zone 5 (peak) intervals.
              A well-rounded program includes training across multiple zones.
            </p>
          </details>
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Can I use a heart rate monitor for zone training?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Yes. Chest strap heart rate monitors are the most accurate for zone training. Wrist-based
              optical sensors (smartwatches) are convenient but can be less accurate during high-intensity
              intervals or strength training. Use the zones from this calculator to set your monitor&apos;s
              custom zones.
            </p>
          </details>
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Should I train in the fat burn zone to lose weight?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              The &quot;fat burn zone&quot; name is misleading. While a higher percentage of calories burned in this
              zone come from fat, higher-intensity zones burn more total calories &mdash; which matters more for
              weight loss. The best approach is to train at various intensities and focus on total calorie
              expenditure rather than optimizing for fat percentage.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
