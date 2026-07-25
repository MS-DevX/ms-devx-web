"use client";

import { useState, useMemo, useCallback } from "react";
import ResultBox from "@/components/tools/tool-uis/shared/ResultBox";

interface Method {
  id: string;
  label: string;
  desc: string;
}

interface Milestone {
  week: number;
  label: string;
  desc: string;
}

interface TrimesterData {
  num: number;
  label: string;
  range: string;
  color: string;
  textColor: string;
  desc: string;
}

interface Result {
  dueDate: Date;
  dueDateFormatted: string;
  dueDateShort: string;
  dueWeekday: string;
  gestationalWeeks: number;
  gestationalDays: number;
  trimester: number;
  trimesterLabel: string;
  trimesterRange: string;
  trimesterDesc: string;
  trimesterColor: string;
  triColor: string;
  source: string;
  upcoming: Milestone[];
  passed: Milestone[];
  weeksLeft: number;
  daysLeft: number;
  totalPct: number;
}

const methods: Method[] = [
  { id: "lmp", label: "Last Menstrual Period", desc: "Common method using the first day of your last period." },
  { id: "conception", label: "Conception Date", desc: "If you know the exact date of conception." },
  { id: "ultrasound", label: "Ultrasound Date", desc: "Use a prior ultrasound date and gestational age." },
];

const milestones: Milestone[] = [
  { week: 2, label: "Conception", desc: "Fertilization occurs, typically around week 2 of pregnancy." },
  { week: 4, label: "Missed Period", desc: "Pregnancy test may show a positive result. HCG levels rise." },
  { week: 6, label: "First Heartbeat", desc: "Baby&apos;s heart begins to beat. Visible on ultrasound." },
  { week: 8, label: "Morning Sickness Peak", desc: "Nausea and fatigue are most common during this time." },
  { week: 12, label: "End of First Trimester", desc: "Risk of miscarriage drops significantly. Nausea often subsides." },
  { week: 16, label: "Movements May Begin", desc: "Some women feel the first fluttering movements (quickening)." },
  { week: 20, label: "Anatomy Scan", desc: "Mid-pregnancy ultrasound checks baby&apos;s anatomy and development." },
  { week: 24, label: "Viability", desc: "Baby has a chance of survival outside the womb with medical support." },
  { week: 27, label: "End of Second Trimester", desc: "Baby can open and close eyes. Hearing is well developed." },
  { week: 28, label: "Third Trimester Begins", desc: "Baby gains weight rapidly. Brain and lungs continue maturing." },
  { week: 36, label: "Lightening (Baby Drops)", desc: "Baby moves into head-down position. Breathing becomes easier." },
  { week: 37, label: "Early Term", desc: "Baby is considered early term. Lungs are likely mature." },
  { week: 39, label: "Full Term", desc: "Baby is full term. Optimal time for delivery." },
  { week: 40, label: "Due Date", desc: "Estimated due date. Only about 5% of babies arrive exactly on their due date." },
  { week: 41, label: "Late Term", desc: "Induction may be recommended if labor hasn&apos;t started naturally." },
];

const trimesterData: TrimesterData[] = [
  { num: 1, label: "First Trimester", range: "Weeks 1-13", color: "bg-green-400", textColor: "text-green-500", desc: "Rapid development of all major organs and systems. Common symptoms include fatigue, nausea, and breast tenderness." },
  { num: 2, label: "Second Trimester", range: "Weeks 14-27", color: "bg-blue-400", textColor: "text-blue-500", desc: "Baby grows significantly. Many women feel more energetic. Baby movements become noticeable." },
  { num: 3, label: "Third Trimester", range: "Weeks 28-40+", color: "bg-purple-400", textColor: "text-purple-500", desc: "Baby gains weight and matures. The body prepares for labor. Braxton Hicks contractions may occur." },
];

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function daysBetween(d1: Date, d2: Date): number {
  const diff = Math.abs(d2.getTime() - d1.getTime());
  return Math.round(diff / 86400000);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function formatShort(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getWeekDay(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

export default function PregnancyDueDateCalculator() {
  const [method, setMethod] = useState("lmp");
  const [lmpDate, setLmpDate] = useState("");
  const [conceptionDate, setConceptionDate] = useState("");
  const [usDate, setUsDate] = useState("");
  const [usWeeks, setUsWeeks] = useState("");
  const [usDays, setUsDays] = useState("");
  const [copied, setCopied] = useState(false);

  const today = useMemo(() => new Date(), []);

  const result = useMemo<Result | null>(() => {
    let dueDate: Date | null = null;
    let gestationalWeeks = 0;
    let gestationalDays = 0;
    let source = "";

    if (method === "lmp" && lmpDate) {
      const lmp = new Date(lmpDate + "T12:00:00");
      if (isNaN(lmp.getTime())) return null;
      dueDate = addDays(lmp, 280);
      const diffDays = daysBetween(lmp, today);
      gestationalWeeks = Math.floor(diffDays / 7);
      gestationalDays = diffDays % 7;
      source = "Naegele's Rule (LMP + 280 days)";
    } else if (method === "conception" && conceptionDate) {
      const conc = new Date(conceptionDate + "T12:00:00");
      if (isNaN(conc.getTime())) return null;
      dueDate = addDays(conc, 266);
      const diffDays = daysBetween(conc, today);
      gestationalWeeks = Math.floor((diffDays + 14) / 7);
      gestationalDays = (diffDays + 14) % 7;
      source = "Conception Date + 266 days";
    } else if (method === "ultrasound" && usDate && usWeeks) {
      const us = new Date(usDate + "T12:00:00");
      const weeks = parseInt(usWeeks, 10);
      const days = parseInt(usDays, 10) || 0;
      if (isNaN(us.getTime()) || isNaN(weeks)) return null;
      const daysRemaining = 280 - (weeks * 7 + days);
      dueDate = addDays(us, daysRemaining);
      const diffDays = daysBetween(us, today);
      gestationalWeeks = Math.floor((weeks * 7 + days + diffDays) / 7);
      gestationalDays = (weeks * 7 + days + diffDays) % 7;
      source = "Ultrasound dating";
    } else {
      return null;
    }

    if (gestationalWeeks < 0) gestationalWeeks = 0;
    if (gestationalDays < 0) gestationalDays = 0;

    let trimester = 1;
    const totalDays = gestationalWeeks * 7 + gestationalDays;
    if (totalDays >= 14 * 7) trimester = 2;
    if (totalDays >= 27 * 7) trimester = 3;

    const triInfo = trimesterData[trimester - 1];

    const filteredMilestones = milestones.filter((m) => m.week >= gestationalWeeks);
    const upcoming = filteredMilestones.slice(0, 4);
    const passed = milestones.filter((m) => m.week < gestationalWeeks).slice(-4);

    const dueWeekday = getWeekDay(dueDate!);

    const weeksLeft = Math.max(0, Math.floor((dueDate!.getTime() - today.getTime()) / 86400000 / 7));
    const daysLeft = Math.max(0, Math.round((dueDate!.getTime() - today.getTime()) / 86400000) % 7);

    return {
      dueDate: dueDate!,
      dueDateFormatted: formatDate(dueDate!),
      dueDateShort: formatShort(dueDate!),
      dueWeekday,
      gestationalWeeks,
      gestationalDays,
      trimester,
      trimesterLabel: triInfo.label,
      trimesterRange: triInfo.range,
      trimesterDesc: triInfo.desc,
      trimesterColor: triInfo.textColor,
      triColor: triInfo.color,
      source,
      upcoming,
      passed,
      weeksLeft,
      daysLeft,
      totalPct: Math.min(100, Math.round((totalDays / 280) * 100)),
    };
  }, [method, lmpDate, conceptionDate, usDate, usWeeks, usDays, today]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    const lines = [
      "Pregnancy Due Date Estimator Results:",
      `Due Date: ${result.dueDateFormatted}`,
      `Weeks Pregnant: ${result.gestationalWeeks}w ${result.gestationalDays}d`,
      `Trimester: ${result.trimesterLabel}`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  }, [result]);

  const handleReset = useCallback(() => {
    setMethod("lmp");
    setLmpDate("");
    setConceptionDate("");
    setUsDate("");
    setUsWeeks("");
    setUsDays("");
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
        <label className={labelClasses}>Calculation Method</label>
        <div className="flex flex-wrap gap-2">
          {methods.map((m) => (
            <button key={m.id} onClick={() => setMethod(m.id)} className={selectCardClasses(method === m.id)} title={m.desc} aria-pressed={method === m.id}>
              <div className="text-sm">{m.label}</div>
              <div className="text-xs opacity-70 mt-0.5">{m.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {method === "lmp" && (
        <div className="mb-6">
          <label className={labelClasses}>First Day of Last Menstrual Period</label>
          <input type="date" value={lmpDate} onChange={(e) => setLmpDate(e.target.value)} className={inputClasses} aria-label="Last menstrual period date" />
          <p className="text-xs text-muted-foreground mt-1.5">Naegele&apos;s Rule: Due date is 280 days (40 weeks) from the first day of your LMP.</p>
        </div>
      )}

      {method === "conception" && (
        <div className="mb-6">
          <label className={labelClasses}>Date of Conception</label>
          <input type="date" value={conceptionDate} onChange={(e) => setConceptionDate(e.target.value)} className={inputClasses} aria-label="Conception date" />
          <p className="text-xs text-muted-foreground mt-1.5">Due date is 266 days (38 weeks) from conception. Ovulation typically occurs around day 14 of the menstrual cycle.</p>
        </div>
      )}

      {method === "ultrasound" && (
        <div className="mb-6">
          <label className={labelClasses}>Ultrasound Date</label>
          <input type="date" value={usDate} onChange={(e) => setUsDate(e.target.value)} className={inputClasses} aria-label="Ultrasound date" />
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div>
              <label className={labelClasses}>Gestational Age (Weeks)</label>
              <input type="number" value={usWeeks} onChange={(e) => setUsWeeks(e.target.value)} placeholder="e.g. 12" min="4" max="40" className={inputClasses} aria-label="Gestational weeks" />
            </div>
            <div>
              <label className={labelClasses}>Additional Days</label>
              <input type="number" value={usDays} onChange={(e) => setUsDays(e.target.value)} placeholder="e.g. 3" min="0" max="6" className={inputClasses} aria-label="Gestational days" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">Enter the gestational age from your ultrasound report (weeks + days). First trimester measurements are most accurate for dating.</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-muted rounded-xl p-5 text-center border-2 border-primary">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Due Date</div>
            <div className="text-xl font-bold text-foreground">{result?.dueDateShort}</div>
            <div className="text-sm text-muted-foreground">{result?.dueWeekday}</div>
          </div>
          <div className="bg-muted rounded-xl p-5 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Weeks Pregnant</div>
            <div className="text-2xl font-bold text-foreground">{result?.gestationalWeeks}<span className="text-lg">w</span> {result?.gestationalDays}<span className="text-lg">d</span></div>
            <div className="text-xs text-muted-foreground mt-1">Time until due date: {result?.weeksLeft}w {result?.daysLeft}d</div>
          </div>
          <div className="bg-muted rounded-xl p-5 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Current Trimester</div>
            <div className={`text-lg font-bold ${result?.trimesterColor}`}>{result?.trimesterLabel}</div>
            <div className="text-xs text-muted-foreground">{result?.trimesterRange}</div>
          </div>
        </div>

        <div className="bg-muted rounded-xl p-5 border border-border mb-6">
          <h3 className="text-sm font-bold text-foreground mb-3">Pregnancy Progress</h3>
          <div className="h-5 bg-background rounded-lg overflow-hidden border border-border flex">
            {[1, 2, 3].map((t) => {
              const start = t === 1 ? 0 : t === 2 ? 13 * 7 / 280 * 100 : 27 * 7 / 280 * 100;
              const end = t === 1 ? 13 * 7 / 280 * 100 : t === 2 ? 27 * 7 / 280 * 100 : 100;
              const isActive = result?.trimester === t;
              return (
                <div key={t} className={`h-full transition-all ${isActive ? trimesterData[t - 1].color : trimesterData[t - 1].color + " opacity-20"}`} style={{ width: `${end - start}%` }} title={trimesterData[t - 1].label} />
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>Week 1</span>
            <span>Week 13</span>
            <span>Week 27</span>
            <span>Week 40</span>
          </div>
          <div className="mt-2 bg-background rounded-lg h-2 border border-border">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${result?.totalPct}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">{result?.totalPct}% of pregnancy completed</p>
        </div>

        <div className="bg-muted rounded-xl p-5 border border-border mb-6">
          <h3 className="text-sm font-bold text-foreground mb-1">{result?.trimesterLabel}</h3>
          <p className="text-xs text-muted-foreground">{result?.trimesterDesc}</p>
          <p className="text-xs text-muted-foreground mt-1.5">Estimated using: {result?.source}</p>
        </div>

        {result && result.upcoming.length > 0 && (
          <div className="bg-muted rounded-xl p-5 border border-border mb-4">
            <h3 className="text-sm font-bold text-foreground mb-3">Upcoming Milestones</h3>
            <div className="space-y-2">
              {result.upcoming.map((m) => {
                const weekDiff = m.week - result.gestationalWeeks;
                const date = new Date(today.getTime() + weekDiff * 7 * 86400000);
                return (
                  <div key={m.week} className="flex items-start gap-3 bg-background rounded-lg p-3 border border-border">
                    <div className="shrink-0 bg-primary/10 text-primary rounded-lg px-2.5 py-1 text-xs font-bold">{m.week}w</div>
                    <div className="min-w-0">
                      <div className="font-semibold text-foreground text-sm">{m.label}</div>
                      <div className="text-xs text-muted-foreground">{m.desc}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Est. {formatShort(date)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground bg-muted rounded-lg p-3 border border-border">
          Due dates are estimates. Only about 5% of babies are born on their exact due date. Normal pregnancy
          lasts 37-42 weeks. Consult your healthcare provider for personalized medical advice.
        </div>
      </ResultBox>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Understanding Your Pregnancy Due Date</h2>
        <div className="bg-muted rounded-xl p-6 border border-border space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>A due date is an estimate of when your baby will be born, calculated as 40 weeks (280 days)
          from the first day of your last menstrual period. Only about 5% of births occur exactly on the
          due date. A full-term pregnancy ranges from <strong>37 to 42 weeks</strong>.</p>
          <p><strong>Factors that affect due date accuracy:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Cycle length:</strong> Women with longer or shorter cycles may ovulate on a different day than the assumed day 14.</li>
            <li><strong>Ultrasound timing:</strong> First-trimester ultrasounds (weeks 8-13) are the most accurate for dating ±5-7 days.</li>
            <li><strong>Irregular cycles:</strong> Women with irregular periods may need adjustment based on ultrasound measurements.</li>
            <li><strong>Multiple pregnancies:</strong> Twins and multiples are typically delivered earlier than 40 weeks.</li>
          </ul>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Pregnancy Timeline by Trimester</h2>
        <div className="space-y-4">
          {trimesterData.map((tri) => (
            <div key={tri.num} className="bg-muted rounded-xl p-5 border border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className={`px-3 py-1 rounded-lg text-white text-xs font-bold ${tri.color}`}>T{tri.num}</div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{tri.label}</h3>
                  <p className="text-xs text-muted-foreground">{tri.range}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{tri.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Pregnancy Milestones</h2>
        <div className="bg-muted rounded-xl border border-border overflow-hidden">
          <div className="divide-y divide-border">
            {milestones.map((m) => (
              <div key={m.week} className="px-4 py-3 flex items-start gap-3">
                <div className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold ${m.week <= (result?.gestationalWeeks ?? 0) ? "bg-primary/10 text-primary" : "bg-background text-muted-foreground border border-border"}`}>{m.week}w</div>
                <div className="min-w-0">
                  <div className={`text-sm font-semibold ${m.week <= (result?.gestationalWeeks ?? 0) ? "text-foreground" : "text-muted-foreground"}`}>{m.label}</div>
                  <div className="text-xs text-muted-foreground">{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              How accurate are due date calculations?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Due dates calculated from LMP have a margin of error of about 1-2 weeks. First-trimester
              ultrasound dating is the most accurate method (±5-7 days). Remember that a &quot;normal&quot; pregnancy
              can range from 37-42 weeks, so your baby may arrive earlier or later than the estimated date.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              How is the due date calculated from ultrasound?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Ultrasound measures the baby&apos;s size (crown-rump length in first trimester, head circumference,
              femur length, and abdominal circumference in later trimesters) and compares it to standard growth
              charts to estimate gestational age. The due date is then calculated as 40 weeks from the estimated
              start of pregnancy.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              What if my cycle is longer or shorter than 28 days?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Naegele&apos;s Rule assumes a 28-day cycle with ovulation on day 14. If your cycle is longer, you
              may ovulate later and your due date should be adjusted accordingly. For a 35-day cycle, add 7
              days to the calculated due date. For a 21-day cycle, subtract 7 days. Your healthcare provider
              will typically use ultrasound dating for the most accurate estimate.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              What does it mean if I go past my due date?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Going past 40 weeks is common — about 60% of first-time mothers deliver after 40 weeks.
              Post-term pregnancy is defined as 42+ weeks. Healthcare providers typically recommend
              additional monitoring starting at 41 weeks and may discuss induction between 41-42 weeks.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Do twins have a different due date?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Yes. Most twin pregnancies deliver between 34-37 weeks (vs 37-42 for singletons). The
              calculator provides a 40-week estimate based on standard dating, but your healthcare provider
              will adjust the expected delivery window based on the type of twins and overall pregnancy health.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
