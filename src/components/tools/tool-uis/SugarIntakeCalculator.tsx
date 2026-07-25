"use client";

import { useState, useMemo, useCallback } from "react";
import ResultBox from "@/components/tools/tool-uis/shared/ResultBox";

interface SugarItem {
  id: string;
  label: string;
  grams: number;
  icon: string;
}

interface ItemDetail extends SugarItem {
  qty: number;
  total: number;
}

interface Zone {
  min: number;
  max: number;
  label: string;
  color: string;
  textColor: string;
  advice: string;
}

interface Result {
  totalGrams: number;
  totalTeaspoons: number;
  zone: Zone;
  pctOf25: number;
  drinkDetails: ItemDetail[];
  snackDetails: ItemDetail[];
  customG: number;
  sugarLumps: number;
  sugarCubes: number;
  walkMinutes: number;
  runMinutes: number;
}

const drinkItems: SugarItem[] = [
  { id: "soda", label: "Regular Soda (12oz)", grams: 39, icon: "🥤" },
  { id: "fruit-juice", label: "Fruit Juice (8oz)", grams: 22, icon: "🧃" },
  { id: "sports-drink", label: "Sports Drink (20oz)", grams: 34, icon: "⚡" },
  { id: "energy-drink", label: "Energy Drink (16oz)", grams: 52, icon: "🔋" },
  { id: "sweetened-tea", label: "Sweetened Iced Tea (12oz)", grams: 24, icon: "🫖" },
  { id: "flavored-coffee", label: "Flavored Coffee (16oz)", grams: 30, icon: "☕" },
  { id: "milkshake", label: "Milkshake (12oz)", grams: 45, icon: "🥤" },
  { id: "chocolate-milk", label: "Chocolate Milk (8oz)", grams: 24, icon: "🥛" },
  { id: "hot-chocolate", label: "Hot Chocolate (8oz)", grams: 24, icon: "☕" },
];

const snackItems: SugarItem[] = [
  { id: "candy-bar", label: "Candy Bar", grams: 30, icon: "🍫" },
  { id: "cookie", label: "Cookie (1)", grams: 8, icon: "🍪" },
  { id: "brownie", label: "Brownie", grams: 20, icon: "🍫" },
  { id: "doughnut", label: "Doughnut", grams: 15, icon: "🍩" },
  { id: "ice-cream", label: "Ice Cream (1 scoop)", grams: 14, icon: "🍦" },
  { id: "cake-slice", label: "Cake Slice", grams: 30, icon: "🍰" },
  { id: "cereal", label: "Cereal Bowl", grams: 15, icon: "🥣" },
  { id: "fruit-yogurt", label: "Fruit Yogurt", grams: 19, icon: "🥄" },
  { id: "granola-bar", label: "Granola Bar", grams: 12, icon: "🫘" },
  { id: "pancakes-syrup", label: "Pancakes w/ Syrup", grams: 18, icon: "🥞" },
];

const zones: Zone[] = [
  { min: 0, max: 25, label: "Optimal", color: "bg-green-400", textColor: "text-green-500", advice: "Excellent! Your added sugar intake is below the WHO ideal goal of 25g." },
  { min: 25, max: 50, label: "Moderate", color: "bg-yellow-400", textColor: "text-yellow-500", advice: "Within the WHO maximum limit (50g). Try to reduce a little more." },
  { min: 50, max: 100, label: "Elevated", color: "bg-orange-400", textColor: "text-orange-500", advice: "Above the WHO recommended limit. Consider ways to cut back." },
  { min: 100, max: 99999, label: "Excessive", color: "bg-red-500", textColor: "text-red-500", advice: "Well above recommended limits. High added sugar intake poses health risks." },
];

export default function SugarIntakeCalculator() {
  const [drinkQtys, setDrinkQtys] = useState<Record<string, number>>({});
  const [snackQtys, setSnackQtys] = useState<Record<string, number>>({});
  const [customGrams, setCustomGrams] = useState("");
  const [copied, setCopied] = useState(false);

  const updateDrink = useCallback((id: string, val: number) => {
    setDrinkQtys((prev) => ({ ...prev, [id]: Math.max(0, parseInt(String(val), 10) || 0) }));
  }, []);

  const updateSnack = useCallback((id: string, val: number) => {
    setSnackQtys((prev) => ({ ...prev, [id]: Math.max(0, parseInt(String(val), 10) || 0) }));
  }, []);

  const result = useMemo<Result | null>(() => {
    const drinkDetails = drinkItems.map((item) => {
      const qty = drinkQtys[item.id] || 0;
      if (qty === 0) return null;
      return { ...item, qty, total: item.grams * qty };
    }).filter(Boolean) as ItemDetail[];

    const snackDetails = snackItems.map((item) => {
      const qty = snackQtys[item.id] || 0;
      if (qty === 0) return null;
      return { ...item, qty, total: item.grams * qty };
    }).filter(Boolean) as ItemDetail[];

    const customG = parseFloat(customGrams) || 0;
    const drinkTotal = drinkDetails.reduce((s, d) => s + d.total, 0);
    const snackTotal = snackDetails.reduce((s, d) => s + d.total, 0);
    const totalGrams = drinkTotal + snackTotal + customG;

    if (totalGrams === 0) return null;

    const totalTeaspoons = Math.round(totalGrams / 4 * 10) / 10;
    const zone = zones.find((z) => totalGrams >= z.min && totalGrams < z.max) || zones[zones.length - 1];
    const pctOf25 = Math.min(200, Math.round((totalGrams / 25) * 100));

    const sugarLumps = Math.round(totalGrams / 4);
    const sugarCubes = Math.round(totalGrams / 2.5);
    const walkMinutes = Math.round(totalGrams * 35 / 10) * 10;
    const runMinutes = Math.round(totalGrams * 15 / 10) * 10;

    return {
      totalGrams,
      totalTeaspoons,
      zone,
      pctOf25,
      drinkDetails,
      snackDetails,
      customG,
      sugarLumps,
      sugarCubes,
      walkMinutes,
      runMinutes,
    };
  }, [drinkQtys, snackQtys, customGrams]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    const lines = [
      "Sugar Intake Calculator Results:",
      `Total: ${result.totalGrams}g (${result.totalTeaspoons} tsp)`,
      `Status: ${result.zone.label}`,
      ...result.drinkDetails.map((d) => `  ${d.icon} ${d.label}: ${d.qty} × ${d.grams}g = ${d.total}g`),
      ...result.snackDetails.map((d) => `  ${d.icon} ${d.label}: ${d.qty} × ${d.grams}g = ${d.total}g`),
      result.customG > 0 ? `  Added sugar: ${result.customG}g` : "",
    ].filter(Boolean);

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  }, [result]);

  const handleReset = useCallback(() => {
    setDrinkQtys({});
    setSnackQtys({});
    setCustomGrams("");
    setCopied(false);
  }, []);

  const inputQtyClasses = "w-16 px-2 py-2 rounded-lg border border-border bg-[var(--bg-card)] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-base text-center";
  const labelClasses = "block text-sm font-medium text-foreground mb-3";

  const itemRow = (item: SugarItem, qty: number, updateFn: (id: string, val: number) => void) => (
    <div key={item.id} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2.5 border border-border">
      <span className="text-base shrink-0">{item.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-foreground truncate">{item.label}</div>
        <div className="text-[10px] text-muted-foreground">{item.grams}g each</div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => updateFn(item.id, qty - 1)} className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/60 transition-all cursor-pointer text-xs" aria-label={`Decrease ${item.label}`}>−</button>
        <input type="number" value={qty || ""} onChange={(e) => updateFn(item.id, parseInt(e.target.value) || 0)} placeholder="0" min="0" className={inputQtyClasses} aria-label={`${item.label} quantity`} />
        <button onClick={() => updateFn(item.id, qty + 1)} className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/60 transition-all cursor-pointer text-xs" aria-label={`Increase ${item.label}`}>+</button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <label className={labelClasses}>🥤 Drinks</label>
        <div className="space-y-2">
          {drinkItems.map((item) => itemRow(item, drinkQtys[item.id] || 0, updateDrink))}
        </div>
      </div>

      <div className="mb-6">
        <label className={labelClasses}>🍪 Snacks & Desserts</label>
        <div className="space-y-2">
          {snackItems.map((item) => itemRow(item, snackQtys[item.id] || 0, updateSnack))}
        </div>
      </div>

      <div className="mb-6">
        <label className={labelClasses}>Custom Added Sugar</label>
        <div className="flex gap-2">
          <input type="number" value={customGrams} onChange={(e) => setCustomGrams(e.target.value)} placeholder="Grams" min="0" step="0.1" className="w-full px-4 py-3 rounded-lg border border-border bg-[var(--bg-card)] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-base" aria-label="Custom sugar grams" />
          <div className="shrink-0 px-3 py-3 rounded-lg bg-muted border border-border text-muted-foreground text-sm">grams</div>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">Add sugar from sources not listed above, like honey, syrups, or other foods.</p>
      </div>

      <div className="flex gap-3 mb-6">
        <button onClick={handleCopy} disabled={!result} className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/60 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-sm">
          {copied ? "Copied!" : "Copy Results"}
        </button>
        <button onClick={handleReset} className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-red-400 transition-all cursor-pointer text-sm">
          Reset
        </button>
      </div>

      <ResultBox show={result !== null}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className={`rounded-xl p-5 text-center border-2 ${result?.zone.color.replace("bg-", "border-")} bg-muted`}>
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Sugar</div>
            <div className="text-3xl font-bold text-foreground">{result?.totalGrams}<span className="text-lg ml-0.5">g</span></div>
            <div className="text-sm text-muted-foreground">{result?.totalTeaspoons} tsp</div>
          </div>
          <div className="bg-muted rounded-xl p-5 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Status</div>
            <div className={`text-2xl font-bold ${result?.zone.textColor}`}>{result?.zone.label}</div>
            <div className="text-xs text-muted-foreground mt-1">{(result?.totalGrams ?? 0) <= 25 ? "≤25g ideal" : (result?.totalGrams ?? 0) <= 50 ? "≤50g max" : ">50g excess"}</div>
          </div>
          <div className="bg-muted rounded-xl p-5 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Visualized</div>
            <div className="text-xl font-bold text-foreground">{result?.sugarLumps} sugar lumps</div>
            <div className="text-xs text-muted-foreground">or {result?.sugarCubes} sugar cubes</div>
          </div>
        </div>

        <div className="bg-muted rounded-xl p-5 border border-border mb-6">
          <h3 className="text-sm font-bold text-foreground mb-3">WHO Recommendation Meter</h3>
          <div className="h-5 bg-background rounded-lg overflow-hidden border border-border flex">
            {zones.map((z, i) => {
              const width = i === 0 ? 25 : i === 1 ? 25 : i === 2 ? 33.33 : 16.67;
              const isActive = result?.zone === z;
              return (
                <div key={z.label} className={`h-full transition-all ${isActive ? z.color : z.color + " opacity-20"}`} style={{ width: `${width}%` }} title={z.label}>
                  <span className="text-[8px] leading-5 block text-center text-white font-bold truncate px-0.5">{z.label}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
            <span>0g</span>
            <span>25g</span>
            <span>50g</span>
            <span>100g</span>
            <span>150g+</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">{result?.zone.advice}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="bg-muted rounded-xl p-4 border border-border">
            <h3 className="text-sm font-bold text-foreground mb-2">Activity Equivalent</h3>
            <p className="text-xs text-muted-foreground">To burn off this sugar, you would need to walk about <strong className="text-foreground">{result?.walkMinutes} minutes</strong> or run about <strong className="text-foreground">{result?.runMinutes} minutes</strong>.</p>
          </div>
          <div className="bg-muted rounded-xl p-4 border border-border">
            <h3 className="text-sm font-bold text-foreground mb-2">Daily Calorie Context</h3>
            <p className="text-xs text-muted-foreground">This sugar adds about <strong className="text-foreground">{(result?.totalGrams ?? 0) * 4}</strong> empty calories ({Math.round((result?.totalGrams ?? 0) * 4 / 2000 * 100)}% of a 2,000 calorie diet).</p>
          </div>
        </div>

        <h3 className="text-sm font-bold text-foreground mb-3">Breakdown by Source</h3>
        <div className="bg-muted rounded-xl p-4 border border-border mb-4">
          {result?.drinkDetails.length === 0 && result?.snackDetails.length === 0 && result?.customG === 0 && (
            <p className="text-xs text-muted-foreground">No items selected.</p>
          )}
          {result?.drinkDetails && result.drinkDetails.length > 0 && (
            <div className="mb-2">
              <p className="text-xs font-semibold text-foreground mb-1">Drinks</p>
              {result.drinkDetails.map((d) => (
                <div key={d.id} className="flex justify-between text-xs text-muted-foreground py-0.5">
                  <span>{d.icon} {d.label} ×{d.qty}</span>
                  <span>{d.total}g</span>
                </div>
              ))}
            </div>
          )}
          {result?.snackDetails && result.snackDetails.length > 0 && (
            <div className="mb-2">
              <p className="text-xs font-semibold text-foreground mb-1">Snacks</p>
              {result.snackDetails.map((d) => (
                <div key={d.id} className="flex justify-between text-xs text-muted-foreground py-0.5">
                  <span>{d.icon} {d.label} ×{d.qty}</span>
                  <span>{d.total}g</span>
                </div>
              ))}
            </div>
          )}
          {result?.customG && result.customG > 0 && (
            <div className="flex justify-between text-xs text-muted-foreground py-0.5">
              <span>Custom added sugar</span>
              <span>{result.customG}g</span>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground bg-muted rounded-lg p-3 border border-border">
          WHO recommends adults consume no more than 25g (6 tsp) of added sugar per day for optimal health,
          and no more than 50g (12 tsp) as an upper limit. 1 teaspoon = 4 grams of sugar.
        </div>
      </ResultBox>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Why Track Your Sugar Intake?</h2>
        <div className="bg-muted rounded-xl p-6 border border-border space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>The average American consumes about <strong>77 grams (19 tsp) of added sugar per day</strong> —
          more than triple the WHO ideal recommendation of 25 grams (6 tsp). Much of this comes from
          hidden sources like sodas, processed foods, and sweetened beverages.</p>
          <p>According to the World Health Organization (WHO), high sugar intake is linked to:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Weight gain and obesity</li>
            <li>Increased risk of type 2 diabetes</li>
            <li>Dental cavities and tooth decay</li>
            <li>Cardiovascular disease risk factors</li>
            <li>Non-alcoholic fatty liver disease</li>
            <li>Increased triglyceride levels</li>
          </ul>
          <p>The WHO strongly recommends reducing added sugar to <strong>&lt;10% of total energy intake</strong>
          (~50g), with a conditional recommendation of <strong>&lt;5%</strong> (~25g) for additional health benefits.</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Hidden Sugars to Watch For</h2>
        <div className="bg-muted rounded-xl p-6 border border-border space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>Sugar hides under many names on ingredient labels. Look for these common aliases:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {["High fructose corn syrup", "Cane sugar", "Agave nectar", "Honey", "Maple syrup", "Coconut sugar", "Brown rice syrup", "Maltose", "Dextrose", "Fructose", "Glucose", "Sucrose", "Molasses", "Fruit juice concentrate", "Evaporated cane juice", "Malt syrup"].map((name) => (
              <div key={name} className="bg-background rounded-lg px-3 py-2 text-center border border-border">
                <span className="text-xs text-muted-foreground">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Tips to Reduce Added Sugar</h2>
        <div className="bg-muted rounded-xl p-6 border border-border space-y-3 text-sm text-muted-foreground leading-relaxed">
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Swap sugary drinks for water:</strong> One 12oz soda contains 39g of sugar — nearly 10 teaspoons.</li>
            <li><strong>Choose unsweetened versions:</strong> Opt for unsweetened tea, coffee, and yogurt.</li>
            <li><strong>Read nutrition labels:</strong> Check &quot;Added Sugars&quot; on the Nutrition Facts panel.</li>
            <li><strong>Eat whole fruits instead of juice</strong> — fiber slows sugar absorption.</li>
            <li><strong>Reduce gradually:</strong> Cut your usual sugar addition in half, then half again.</li>
            <li><strong>Watch condiments:</strong> Ketchup, BBQ sauce, and salad dressings often have hidden sugar.</li>
            <li><strong>Try alternatives:</strong> Cinnamon, vanilla extract, or fresh fruit can sweeten without added sugar.</li>
          </ul>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Is natural sugar different from added sugar?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Yes. Natural sugars are found in whole fruits (fructose) and dairy (lactose) and come packaged
              with fiber, vitamins, and minerals. Added sugars are incorporated during processing or
              preparation. The WHO guidelines apply to free sugars, which include both added sugars and
              naturally occurring sugars in honey, syrups, and fruit juices.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              How many grams of sugar should I eat per day?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              The WHO recommends less than 25g (6 tsp) of added sugar per day for optimal health benefits,
              and no more than 50g (12 tsp) as an upper limit. The American Heart Association recommends
              no more than 36g (9 tsp) for men and 25g (6 tsp) for women per day.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              What is the difference between sugar in grams and teaspoons?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              One teaspoon of granulated sugar equals approximately 4 grams. To convert grams to teaspoons,
              divide by 4. A 12oz soda with 39g of sugar contains nearly 10 teaspoons — visualize that as
              10 single-serve sugar packets poured into your drink.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Is fruit juice bad for sugar intake?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              While 100% fruit juice contains natural sugars and vitamins, it lacks the fiber of whole
              fruit and can spike blood sugar quickly. An 8oz glass of orange juice has about 22g of
              sugar — similar to a candy bar. The WHO counts juice sugars as free sugars. Eating whole
              fruit is the healthier choice.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              What are sugar alcohols and artificial sweeteners?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Sugar alcohols (erythritol, xylitol, sorbitol) and artificial sweeteners (aspartame,
              sucralose, stevia) are low-calorie alternatives. They don&apos;t count as added sugar and
              don&apos;t spike blood glucose. However, some may cause digestive issues or affect gut
              bacteria. Use them in moderation as part of a gradual sugar reduction strategy.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
