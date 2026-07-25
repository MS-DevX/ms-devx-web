"use client";

import { useState, useMemo, useCallback } from "react";
import ResultBox from "@/components/tools/tool-uis/shared/ResultBox";

interface StrengthOption {
  val: string;
  label: string;
  mg: number;
}

interface Beverage {
  id: string;
  label: string;
  defaultMg: number;
  options?: StrengthOption[];
  icon: string;
}

interface BeverageDetail extends Beverage {
  qty: number;
  mgPerUnit: number;
  total: number;
}

interface CaffeineZone {
  min: number;
  max: number;
  label: string;
  color: string;
  advice: string;
}

interface CaffeineResult {
  totalMg: number;
  details: BeverageDetail[];
  zone: CaffeineZone;
  pctOf400: number;
  overPregnant: boolean;
  pregnantLimit: number;
  after4h: number;
  after8h: number;
  after12h: number;
}

const beverages: Beverage[] = [
  { id: "coffee-drip", label: "Coffee (drip)", defaultMg: 95, options: [{ val: "light", label: "Light", mg: 40 }, { val: "medium", label: "Medium", mg: 95 }, { val: "strong", label: "Strong", mg: 145 }], icon: "\u2615" },
  { id: "espresso", label: "Espresso (shot)", defaultMg: 63, icon: "\u2615" },
  { id: "coffee-instant", label: "Instant Coffee", defaultMg: 62, icon: "\u2615" },
  { id: "tea-black", label: "Black Tea", defaultMg: 47, icon: "\uD83E\uDED6" },
  { id: "tea-green", label: "Green Tea", defaultMg: 28, icon: "\uD83E\uDED6" },
  { id: "energy-drink", label: "Energy Drink", defaultMg: 150, icon: "\u26A1" },
  { id: "cola", label: "Cola / Soda", defaultMg: 34, icon: "\uD83E\uDD64" },
  { id: "diet-cola", label: "Diet Cola", defaultMg: 42, icon: "\uD83E\uDD64" },
];

const strengthBeverages = ["coffee-drip"];

const zones: CaffeineZone[] = [
  { min: 0, max: 200, label: "Safe", color: "bg-green-400", advice: "No concerns for most adults." },
  { min: 200, max: 400, label: "Moderate", color: "bg-yellow-400", advice: "Within the FDA-recommended limit of 400 mg/day." },
  { min: 400, max: 600, label: "Elevated", color: "bg-orange-400", advice: "Approaching the upper limit. May cause jitters or sleep issues." },
  { min: 600, max: 9999, label: "Excessive", color: "bg-red-500", advice: "Above recommended limits. Consider reducing intake." },
];

const pregnantLimit = 200;

export default function CaffeineCalculator() {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [strengths, setStrengths] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<boolean>(false);

  const updateQty = useCallback((id: string, val: number | string) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(0, parseInt(String(val), 10) || 0) }));
  }, []);

  const updateStrength = useCallback((id: string, val: string) => {
    setStrengths((prev) => ({ ...prev, [id]: val }));
  }, []);

  const result = useMemo((): CaffeineResult | null => {
    const details = beverages.map((b) => {
      const qty = quantities[b.id] || 0;
      if (qty === 0) return null;

      let mgPerUnit = b.defaultMg;
      if (strengthBeverages.includes(b.id) && b.options) {
        const sel = strengths[b.id] || "medium";
        const opt = b.options.find((o) => o.val === sel);
        if (opt) mgPerUnit = opt.mg;
      }

      const total = mgPerUnit * qty;
      return { ...b, qty, mgPerUnit, total };
    }).filter((b): b is BeverageDetail => b !== null);

    const totalMg = details.reduce((s, d) => s + d.total, 0);

    const zone = zones.find((z) => totalMg >= z.min && totalMg < z.max) || zones[zones.length - 1];
    const pctOf400 = Math.round((totalMg / 400) * 100);
    const overPregnant = totalMg > pregnantLimit;

    const halfLifeDecay = (mg: number, hours: number) => Math.round(mg * Math.pow(0.5, hours / 5) * 10) / 10;

    return {
      totalMg,
      details,
      zone,
      pctOf400: Math.min(pctOf400, 200),
      overPregnant,
      pregnantLimit,
      after4h: halfLifeDecay(totalMg, 4),
      after8h: halfLifeDecay(totalMg, 8),
      after12h: halfLifeDecay(totalMg, 12),
    };
  }, [quantities, strengths]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    const lines = [
      "Caffeine Intake Results:",
      `Total: ${result.totalMg} mg`,
      ...result.details.map((d) => `  ${d.icon} ${d.label}: ${d.qty} x ${d.mgPerUnit}mg = ${d.total}mg`),
      `Status: ${result.zone.label} (${result.zone.advice})`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  }, [result]);

  const handleReset = useCallback(() => {
    setQuantities({});
    setStrengths({});
    setCopied(false);
  }, []);

  const inputClasses = "w-20 px-3 py-2 rounded-lg border border-border bg-[var(--bg-card)] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-base text-center";
  const labelClasses = "block text-sm font-medium text-foreground mb-2";
  const selectClasses = "px-2.5 py-2 rounded-lg border border-border bg-[var(--bg-card)] text-foreground focus:border-primary focus:outline-none text-sm";

  return (
    <div>
      <div className="mb-6">
        <label className={labelClasses}>How many servings did you have today?</label>
        <div className="space-y-3">
          {beverages.map((b) => {
            const qty = quantities[b.id] || 0;
            const mgPerUnit = strengthBeverages.includes(b.id) && b.options
              ? b.options.find((o) => o.val === (strengths[b.id] || "medium"))?.mg || b.defaultMg
              : b.defaultMg;
            return (
              <div key={b.id} className="flex items-center gap-3 bg-[var(--bg-soft)] rounded-xl p-3 border border-border">
                <span className="text-lg">{b.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{b.label}</div>
                  <div className="text-xs text-muted-foreground">{qty > 0 ? `${mgPerUnit}mg each` : "Enter quantity"}</div>
                </div>
                {strengthBeverages.includes(b.id) && b.options && (
                  <select
                    value={strengths[b.id] || "medium"}
                    onChange={(e) => updateStrength(b.id, e.target.value)}
                    className={selectClasses}
                    aria-label={`${b.label} strength`}
                  >
                    {b.options.map((o) => (
                      <option key={o.val} value={o.val}>{o.label}</option>
                    ))}
                  </select>
                )}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQty(b.id, qty - 1)}
                    className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-brand-light transition-all cursor-pointer text-sm"
                    aria-label={`Decrease ${b.label}`}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={qty || ""}
                    onChange={(e) => updateQty(b.id, e.target.value)}
                    placeholder="0"
                    min="0"
                    className={inputClasses}
                    aria-label={`${b.label} quantity`}
                  />
                  <button
                    onClick={() => updateQty(b.id, qty + 1)}
                    className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-brand-light transition-all cursor-pointer text-sm"
                    aria-label={`Increase ${b.label}`}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3 mt-4 mb-6">
        <button onClick={handleCopy} disabled={!result || result.totalMg === 0} className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-brand-light transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-sm">
          {copied ? "Copied!" : "Copy Results"}
        </button>
        <button onClick={handleReset} className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-red-400 transition-all cursor-pointer text-sm">
          Reset
        </button>
      </div>

      <ResultBox show={result !== null && result!.totalMg > 0}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-[var(--bg-soft)] rounded-xl p-5 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Caffeine</div>
            <div className="text-3xl font-bold text-foreground">{result?.totalMg}</div>
            <div className="text-sm text-muted-foreground">mg today</div>
          </div>
          <div className={`rounded-xl p-5 text-center border-2 ${result?.zone.color.replace("bg-", "border-")} bg-[var(--bg-soft)]`}>
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Status</div>
            <div className={`text-xl font-bold ${result?.zone.color.replace("bg-", "text-")}`}>{result?.zone.label}</div>
            <div className="text-xs text-muted-foreground mt-1">{result?.zone.advice}</div>
          </div>
        </div>

        <div className="h-6 bg-[var(--bg-card)] rounded-full overflow-hidden border border-border mb-4 flex">
          {zones.map((z, i) => {
            const zoneMax = Math.min(z.max, 800);
            const prevMax = i === 0 ? 0 : Math.min(zones[i - 1].max, 800);
            const width = ((zoneMax - prevMax) / 800) * 100;
            const isActive = result?.zone.label === z.label;
            return (
              <div
                key={z.label}
                className={`h-full transition-all duration-500 ${isActive ? z.color : z.color + " opacity-20"}`}
                style={{ width: `${width}%` }}
                title={`${z.label}: ${z.min}-${z.max === 9999 ? "\u221E" : z.max} mg`}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mb-4">
          <span>0 mg</span>
          <span>200 mg</span>
          <span>400 mg (FDA limit)</span>
          <span>600 mg</span>
        </div>

        {result && result.details.length > 0 && (
          <>
            <h3 className="text-base font-bold text-foreground mb-3">By Beverage</h3>
            <div className="space-y-2 mb-4">
              {result.details.map((d) => {
                const maxTotal = Math.max(...result!.details.map((x) => x.total), 1);
                const pct = (d.total / maxTotal) * 100;
                return (
                  <div key={d.id} className="flex items-center gap-3">
                    <span className="text-sm">{d.icon}</span>
                    <div className="w-20 shrink-0 text-xs text-muted-foreground truncate">{d.label}</div>
                    <div className="flex-1 h-6 bg-[var(--bg-soft)] rounded-lg overflow-hidden border border-border">
                      <div className="h-full rounded-lg bg-brand transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="w-20 shrink-0 text-right text-sm font-semibold text-foreground">{d.total}mg</div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <h3 className="text-base font-bold text-foreground mb-3">Caffeine Elimination Timeline</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="bg-[var(--bg-soft)] rounded-xl p-3 text-center border border-border">
            <div className="text-xs text-muted-foreground">After 4 hours</div>
            <div className="text-lg font-bold text-foreground">{result?.after4h} mg</div>
            <div className="text-xs text-muted-foreground">half-life estimate</div>
          </div>
          <div className="bg-[var(--bg-soft)] rounded-xl p-3 text-center border border-border">
            <div className="text-xs text-muted-foreground">After 8 hours</div>
            <div className="text-lg font-bold text-foreground">{result?.after8h} mg</div>
            <div className="text-xs text-muted-foreground">half-life estimate</div>
          </div>
          <div className="bg-[var(--bg-soft)] rounded-xl p-3 text-center border border-border">
            <div className="text-xs text-muted-foreground">After 12 hours</div>
            <div className="text-lg font-bold text-foreground">{result?.after12h} mg</div>
            <div className="text-xs text-muted-foreground">half-life estimate</div>
          </div>
        </div>

        {result?.overPregnant && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-xl p-4 mb-4">
            <p className="text-sm text-red-700 dark:text-red-300 font-medium">
              This exceeds the recommended 200 mg/day limit during pregnancy.
            </p>
          </div>
        )}

        <div className="text-xs text-muted-foreground bg-[var(--bg-soft)] rounded-lg p-3 border border-border">
          Caffeine content is approximate and varies by brand, brewing method, and serving size.
          FDA recommends up to 400 mg/day for most adults. Caffeine has a half-life of ~5 hours.
        </div>
      </ResultBox>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Caffeine Reference Guide</h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground border-b border-border">
                <th className="text-left py-2 pr-4">Beverage</th>
                <th className="text-right py-2 pr-4">Serving</th>
                <th className="text-right py-2">Caffeine</th>
              </tr>
            </thead>
            <tbody>
              {beverages.map((b) => {
                const mgDisplay = b.options
                  ? `${b.options[0].mg}-${b.options[2].mg}`
                  : `${b.defaultMg}`;
                return (
                  <tr key={b.id} className="border-b border-border">
                    <td className="py-2 pr-4 text-foreground">{b.icon} {b.label}</td>
                    <td className="py-2 pr-4 text-right text-muted-foreground">1 serving</td>
                    <td className="py-2 text-right font-semibold text-foreground">{mgDisplay} mg</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Safe Caffeine Guidelines</h2>
        <div className="bg-[var(--bg-soft)] rounded-xl p-6 border border-border space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p><strong>FDA recommends:</strong> Up to 400 mg of caffeine per day for healthy adults &mdash; roughly 4 cups of brewed coffee.</p>
          <p><strong>Pregnancy:</strong> The American College of Obstetricians and Gynecologists recommends limiting to 200 mg per day during pregnancy.</p>
          <p><strong>Children and teens:</strong> The American Academy of Pediatrics recommends against caffeine for children and adolescents.</p>
          <p><strong>Sensitivity:</strong> Caffeine metabolism varies significantly between individuals due to genetics. Some people experience side effects at doses below 200 mg.</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Caffeine Half-Life Explained</h2>
        <div className="bg-[var(--bg-soft)] rounded-xl p-6 border border-border text-sm text-muted-foreground leading-relaxed">
          <p className="mb-2">Caffeine has an average half-life of about 5 hours in healthy adults. This means after 5 hours, half of the caffeine is still in your system:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>If you consume 200 mg at 8 AM, you still have ~100 mg at 1 PM</li>
            <li>~50 mg at 6 PM</li>
            <li>~25 mg at 11 PM &mdash; enough to disrupt sleep for sensitive individuals</li>
            <li>Factors that prolong half-life: pregnancy, liver disease, oral contraceptives</li>
            <li>Factors that shorten half-life: smoking, high altitude</li>
          </ul>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              How much caffeine is too much?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              The FDA recommends a maximum of 400 mg per day for healthy adults. Consuming more than
              600 mg per day regularly increases the risk of insomnia, anxiety, heart palpitations,
              and digestive issues. Acute caffeine overdose requires consumption of ~1,000-1,500 mg
              in a short period.
            </p>
          </details>
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              When should I stop drinking caffeine during the day?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Given caffeine&apos;s 5-hour half-life, stop consuming caffeine by 12-2 PM to minimize sleep
              disruption. Sensitive individuals may need to stop by 10 AM. Consider your bedtime &mdash; if
              you sleep at 10 PM, stopping by 2 PM gives caffeine ~8 hours to mostly clear your system.
            </p>
          </details>
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Can caffeine help with weight loss?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Caffeine can temporarily boost metabolism by 3-11% and enhance fat burning, especially
              during exercise. However, the effect diminishes with regular use as tolerance builds.
              Caffeine is not a substitute for proper diet and exercise for weight management.
            </p>
          </details>
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              What is the best time to drink coffee?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Cortisol (your natural alertness hormone) peaks shortly after waking. Drinking coffee
              during this peak may build tolerance faster. Waiting 1-2 hours after waking allows
              cortisol to naturally decrease, making caffeine more effective. Mid-morning (9-11 AM)
              is often the optimal window.
            </p>
          </details>
          <details className="bg-[var(--bg-soft)] rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Does caffeine cause dehydration?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">&#9662;</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Moderate caffeine consumption (up to 400 mg/day) does not cause significant dehydration.
              While caffeine has a mild diuretic effect, the water content of coffee and tea more than
              compensates for it. Caffeinated beverages contribute to your daily fluid intake.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
