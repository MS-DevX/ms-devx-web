"use client";

import { useState, useMemo } from "react";

interface Formula {
  label: string;
  multiplier: number;
  offset: number;
  desc: string;
}

interface FormulaGroup {
  label: string;
  formulas: Record<string, Formula>;
}

const FORMULA_GROUPS: FormulaGroup[] = [
  {
    label: "India (10.0 Scale)",
    formulas: {
      cbse: { label: "CBSE Standard", multiplier: 9.5, offset: 0, desc: "Percentage = CGPA × 9.5" },
      vtu: { label: "VTU", multiplier: 10, offset: -7.5, desc: "Percentage = (CGPA - 0.75) × 10" },
      anna: { label: "Anna University", multiplier: 10, offset: 0, desc: "Percentage = CGPA × 10" },
      mumbai: { label: "Mumbai University", multiplier: 7.75, offset: 11.25, desc: "Percentage = CGPA × 7.75 + 11.25" },
      ktu: { label: "KTU", multiplier: 10, offset: -5, desc: "Percentage = (CGPA - 0.5) × 10" },
      makaut: { label: "MAKAUT", multiplier: 10, offset: -7.5, desc: "Percentage = CGPA × 10 - 7.5" },
    },
  },
  {
    label: "Pakistan (4.0 Scale)",
    formulas: {
      hec: { label: "HEC Pakistan", multiplier: 25, offset: 0, desc: "Percentage = CGPA × 25" },
      nust: { label: "NUST (Relative)", multiplier: 25, offset: 0, desc: "Percentage = CGPA × 25" },
      ucp: { label: "UCP Lahore", multiplier: 22.5, offset: 20, desc: "Percentage = CGPA × 22.5 + 20" },
    },
  },
  {
    label: "China (4.0 Scale)",
    formulas: {
      china: { label: "China Standard", multiplier: 25, offset: 0, desc: "Percentage = CGPA × 25" },
      tsinghua: { label: "Tsinghua University", multiplier: 20, offset: 20, desc: "Percentage = CGPA × 20 + 20" },
    },
  },
  {
    label: "Other Asia (4.0 Scale)",
    formulas: {
      singapore: { label: "Singapore NUS/NTU", multiplier: 25, offset: 0, desc: "Percentage = CGPA × 25" },
      malaysia: { label: "Malaysia Standard", multiplier: 25, offset: 0, desc: "Percentage = CGPA × 25" },
      bangladesh: { label: "Bangladesh Standard", multiplier: 25, offset: 0, desc: "Percentage = CGPA × 25" },
      srilanka: { label: "Sri Lanka Standard", multiplier: 25, offset: 0, desc: "Percentage = CGPA × 25" },
    },
  },
  {
    label: "Custom",
    formulas: {
      custom: { label: "Custom Formula", multiplier: 9.5, offset: 0, desc: "Set your own multiplier and offset" },
    },
  },
];

const ALL_FORMULAS: Record<string, Formula> = {};
FORMULA_GROUPS.forEach((g) => Object.assign(ALL_FORMULAS, g.formulas));

const QUICK_4 = [2.0, 2.5, 3.0, 3.33, 3.5, 3.67, 4.0];
const QUICK_10 = [7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0];

interface GradeInfo {
  grade: string;
  label: string;
  class: string;
  color: string;
}

function getGradeInfo(pct: number): GradeInfo {
  if (pct >= 90) return { grade: "O", label: "Outstanding", class: "First Class with Distinction", color: "text-emerald-500" };
  if (pct >= 80) return { grade: "A+", label: "Excellent", class: "First Class with Distinction", color: "text-green-500" };
  if (pct >= 70) return { grade: "A", label: "Very Good", class: "First Class", color: "text-blue-500" };
  if (pct >= 60) return { grade: "B+", label: "Good", class: "First Class", color: "text-indigo-500" };
  if (pct >= 50) return { grade: "B", label: "Average", class: "Second Class", color: "text-yellow-500" };
  if (pct >= 40) return { grade: "C", label: "Pass", class: "Pass Class", color: "text-orange-500" };
  return { grade: "F", label: "Fail", class: "Fail", color: "text-red-500" };
}

const GRADE_TABLE = [
  { min: 90, max: 100, grade: "O", label: "Outstanding", class: "First Class with Distinction" },
  { min: 80, max: 89, grade: "A+", label: "Excellent", class: "First Class with Distinction" },
  { min: 70, max: 79, grade: "A", label: "Very Good", class: "First Class" },
  { min: 60, max: 69, grade: "B+", label: "Good", class: "First Class" },
  { min: 50, max: 59, grade: "B", label: "Average", class: "Second Class" },
  { min: 40, max: 49, grade: "C", label: "Pass", class: "Pass Class" },
  { min: 0, max: 39, grade: "F", label: "Fail", class: "Fail" },
];

interface ResultData {
  cgpa: number;
  percentage: string;
  grade: string;
  gradeLabel: string;
  classDivision: string;
  color: string;
  formula: string;
  formulaUsed: string;
}

export default function CgpaToPercentage() {
  const [cgpa, setCgpa] = useState("");
  const [formulaKey, setFormulaKey] = useState("cbse");
  const [customMultiplier, setCustomMultiplier] = useState("9.5");
  const [customOffset, setCustomOffset] = useState("0");
  const [maxScale, setMaxScale] = useState(10);
  const quickValues = maxScale === 4 ? QUICK_4 : QUICK_10;

  const result = useMemo<ResultData | null>(() => {
    const cgpaNum = parseFloat(cgpa);
    if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > maxScale) {
      return null;
    }

    const formula = ALL_FORMULAS[formulaKey];
    const multiplier = formulaKey === "custom" ? parseFloat(customMultiplier) : formula.multiplier;
    const offset = formulaKey === "custom" ? parseFloat(customOffset) : formula.offset;

    if (isNaN(multiplier) || isNaN(offset)) {
      return null;
    }

    const percentage = cgpaNum * multiplier + offset;
    const clampedPct = Math.max(0, Math.min(100, percentage));
    const gradeInfo = getGradeInfo(clampedPct);

    return {
      cgpa: cgpaNum,
      percentage: clampedPct.toFixed(2),
      grade: gradeInfo.grade,
      gradeLabel: gradeInfo.label,
      classDivision: gradeInfo.class,
      color: gradeInfo.color,
      formula: formulaKey === "custom"
        ? `Percentage = ${cgpaNum} × ${multiplier} + ${offset >= 0 ? "+ " + offset : offset}`
        : formula.desc.replace("CGPA", String(cgpaNum)),
      formulaUsed: formulaKey === "custom" ? "Custom" : ALL_FORMULAS[formulaKey].label,
    };
  }, [cgpa, formulaKey, customMultiplier, customOffset, maxScale]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            CGPA
          </label>
          <input
            type="number"
            value={cgpa}
            onChange={(e) => setCgpa(e.target.value)}
            placeholder={`e.g., ${maxScale === 4 ? "3.5" : "8.5"} (0 - ${maxScale})`}
            step="0.01"
            min="0"
            max={maxScale}
            className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-white dark:bg-background"
          />
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-muted-foreground">Max Scale:</span>
            {[4, 10].map((s) => (
              <button
                key={s}
                onClick={() => { setMaxScale(s); setCgpa(""); }}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-all ${
                  maxScale === s
                    ? "bg-primary text-white border-primary"
                    : "bg-transparent text-muted-foreground border-border hover:border-primary hover:text-primary"
                }`}
              >
                {s}.0
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Formula
          </label>
          <select
            value={formulaKey}
            onChange={(e) => setFormulaKey(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-white dark:bg-background appearance-none cursor-pointer"
          >
            {FORMULA_GROUPS.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {Object.entries(group.formulas).map(([key, f]) => (
                  <option key={key} value={key}>{f.label}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-1.5">
            {ALL_FORMULAS[formulaKey].desc}
          </p>
        </div>
      </div>

      {formulaKey === "custom" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-muted border border-border">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Multiplier
            </label>
            <input
              type="number"
              value={customMultiplier}
              onChange={(e) => setCustomMultiplier(e.target.value)}
              step="0.1"
              placeholder="e.g., 9.5"
              className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-white dark:bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Offset
            </label>
            <input
              type="number"
              value={customOffset}
              onChange={(e) => setCustomOffset(e.target.value)}
              step="0.1"
              placeholder="e.g., 0"
              className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-white dark:bg-background"
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-xs text-muted-foreground self-center mr-1">Quick Select:</span>
        {quickValues.map((val) => (
          <button
            key={val}
            onClick={() => { if (val <= maxScale) setCgpa(String(val)); }}
            disabled={val > maxScale}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all ${
              cgpa === String(val)
                ? "bg-primary text-white border-primary shadow-sm"
                : val > maxScale
                  ? "bg-transparent text-muted-foreground/30 border-border/50 cursor-not-allowed"
                  : "bg-transparent text-muted-foreground border-border hover:border-primary hover:text-primary"
            }`}
          >
            {val}
          </button>
        ))}
      </div>

      {result && (
        <div className="bg-muted rounded-xl border border-border overflow-hidden transition-all duration-300 animate-fadeIn">
          <div className="p-6 md:p-8 text-center border-b border-border">
            <p className="text-sm text-muted-foreground mb-1">Your Percentage</p>
            <div className="text-5xl md:text-6xl font-extrabold text-primary mb-2 tracking-tight">
              {result.percentage}%
            </div>
            <p className="text-sm text-muted-foreground">{result.formula}</p>
            <p className="text-xs text-muted-foreground mt-1">Formula: {result.formulaUsed}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-y md:divide-y-0 border-border">
            <div className="p-4 md:p-5 text-center">
              <p className="text-xs text-muted-foreground mb-1">CGPA</p>
              <p className="text-xl font-bold text-foreground">{result.cgpa} / {maxScale}.0</p>
            </div>
            <div className="p-4 md:p-5 text-center">
              <p className="text-xs text-muted-foreground mb-1">Letter Grade</p>
              <p className={`text-xl font-bold ${result.color}`}>{result.grade}</p>
            </div>
            <div className="p-4 md:p-5 text-center col-span-2 md:col-span-1">
              <p className="text-xs text-muted-foreground mb-1">Grade Description</p>
              <p className="text-lg font-semibold text-foreground">{result.gradeLabel}</p>
            </div>
            <div className="p-4 md:p-5 text-center col-span-2 md:col-span-3 border-t md:border-t-0 border-border">
              <p className="text-xs text-muted-foreground mb-1">Class / Division</p>
              <p className="text-lg font-semibold text-primary">{result.classDivision}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-foreground mb-3">Grade Reference Table</h3>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted text-muted-foreground text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left font-medium">Percentage</th>
                <th className="px-4 py-3 text-left font-medium">Grade</th>
                <th className="px-4 py-3 text-left font-medium">Description</th>
                <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Class / Division</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {GRADE_TABLE.map((row) => (
                <tr key={row.grade} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-2.5 text-foreground">{row.min}%{row.max < 100 ? ` - ${row.max}%` : "%"}</td>
                  <td className={`px-4 py-2.5 font-bold ${
                    row.grade === "O" ? "text-emerald-500" :
                    row.grade === "A+" ? "text-green-500" :
                    row.grade === "A" ? "text-blue-500" :
                    row.grade === "B+" ? "text-indigo-500" :
                    row.grade === "B" ? "text-yellow-500" :
                    row.grade === "C" ? "text-orange-500" :
                    "text-red-500"
                  }`}>{row.grade}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{row.label}</td>
                  <td className="px-4 py-2.5 text-muted-foreground hidden md:table-cell">{row.class}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
