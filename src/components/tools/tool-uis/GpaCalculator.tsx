"use client";

import { useState, useMemo } from "react";

interface Grade {
  letter: string;
  points: number;
}

interface GradingScale {
  label: string;
  grades: Grade[];
}

const GRADING_SCALES: Record<string, GradingScale> = {
  standard: {
    label: "Standard 4.0",
    grades: [
      { letter: "A", points: 4.0 },
      { letter: "A-", points: 3.7 },
      { letter: "B+", points: 3.3 },
      { letter: "B", points: 3.0 },
      { letter: "B-", points: 2.7 },
      { letter: "C+", points: 2.3 },
      { letter: "C", points: 2.0 },
      { letter: "C-", points: 1.7 },
      { letter: "D+", points: 1.3 },
      { letter: "D", points: 1.0 },
      { letter: "F", points: 0.0 },
    ],
  },
  simple: {
    label: "Simple 4.0",
    grades: [
      { letter: "A", points: 4.0 },
      { letter: "B", points: 3.0 },
      { letter: "C", points: 2.0 },
      { letter: "D", points: 1.0 },
      { letter: "F", points: 0.0 },
    ],
  },
  scale433: {
    label: "4.33 Scale",
    grades: [
      { letter: "A+", points: 4.33 },
      { letter: "A", points: 4.0 },
      { letter: "A-", points: 3.67 },
      { letter: "B+", points: 3.33 },
      { letter: "B", points: 3.0 },
      { letter: "B-", points: 2.67 },
      { letter: "C+", points: 2.33 },
      { letter: "C", points: 2.0 },
      { letter: "C-", points: 1.67 },
      { letter: "D+", points: 1.33 },
      { letter: "D", points: 1.0 },
      { letter: "F", points: 0.0 },
    ],
  },
  nigerian: {
    label: "Nigerian 5.0",
    grades: [
      { letter: "A", points: 5.0 },
      { letter: "B", points: 4.0 },
      { letter: "C", points: 3.0 },
      { letter: "D", points: 2.0 },
      { letter: "E", points: 1.0 },
      { letter: "F", points: 0.0 },
    ],
  },
};

const GRADE_TABLE = [
  { min: 3.5, max: 4.0, label: "First Class Honours", color: "text-emerald-500" },
  { min: 3.0, max: 3.49, label: "Second Class Upper", color: "text-blue-500" },
  { min: 2.0, max: 2.99, label: "Second Class Lower", color: "text-indigo-500" },
  { min: 1.5, max: 1.99, label: "Third Class", color: "text-yellow-500" },
  { min: 1.0, max: 1.49, label: "Pass", color: "text-orange-500" },
  { min: 0.0, max: 0.99, label: "Fail", color: "text-red-500" },
];

interface CourseRow {
  id: number;
  name: string;
  credits: string;
  grade: string;
}

function createRow(): CourseRow {
  return { id: Date.now() + Math.random(), name: "", credits: "3", grade: "" };
}

interface SemesterResult {
  gpa: number;
  points: number;
  credits: number;
}

export default function GpaCalculator() {
  const [scaleKey, setScaleKey] = useState("standard");
  const [rows, setRows] = useState<CourseRow[]>([createRow(), createRow()]);
  const [prevGpa, setPrevGpa] = useState("");
  const [prevCredits, setPrevCredits] = useState("");
  const scale = GRADING_SCALES[scaleKey];

  function addRow() {
    if (rows.length < 15) setRows([...rows, createRow()]);
  }

  function removeRow(id: number) {
    if (rows.length > 1) setRows(rows.filter((r) => r.id !== id));
  }

  function updateRow(id: number, field: keyof CourseRow, value: string) {
    setRows(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  const semesterGpa = useMemo<SemesterResult | null>(() => {
    let totalPoints = 0;
    let totalCredits = 0;

    rows.forEach((r) => {
      const cr = parseFloat(r.credits);
      const gradeObj = scale.grades.find((g) => g.letter === r.grade);
      if (cr > 0 && gradeObj) {
        totalPoints += gradeObj.points * cr;
        totalCredits += cr;
      }
    });

    if (totalCredits > 0) {
      const sgpa = totalPoints / totalCredits;
      return { gpa: sgpa, points: totalPoints, credits: totalCredits };
    }
    return null;
  }, [rows, scale.grades]);

  const cumulativeGpa = useMemo<SemesterResult | null>(() => {
    if (!semesterGpa) {
      return null;
    }

    const prev = parseFloat(prevGpa);
    const prevCr = parseFloat(prevCredits);

    if (!isNaN(prev) && !isNaN(prevCr) && prevCr > 0) {
      const prevPoints = prev * prevCr;
      const totalPoints = prevPoints + semesterGpa.points;
      const totalCredits = prevCr + semesterGpa.credits;
      const cgpa = totalPoints / totalCredits;
      return { gpa: cgpa, points: totalPoints, credits: totalCredits };
    }
    return semesterGpa;
  }, [semesterGpa, prevGpa, prevCredits]);

  function getGpaClass(gpa: number) {
    const entry = GRADE_TABLE.find((g) => gpa >= g.min && gpa <= g.max);
    return entry ? entry : GRADE_TABLE[GRADE_TABLE.length - 1];
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Grading Scale
          </label>
          <select
            value={scaleKey}
            onChange={(e) => setScaleKey(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background dark:bg-background appearance-none cursor-pointer"
          >
            {Object.entries(GRADING_SCALES).map(([key, s]) => (
              <option key={key} value={key}>{s.label}</option>
            ))}
          </select>
        </div>

        <button
          onClick={addRow}
          disabled={rows.length >= 15}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Course
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted text-muted-foreground text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left font-medium w-[35%]">Course</th>
              <th className="px-4 py-3 text-center font-medium w-[20%]">Credits</th>
              <th className="px-4 py-3 text-center font-medium w-[25%]">Grade</th>
              <th className="px-4 py-3 text-center font-medium w-[20%]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) => updateRow(row.id, "name", e.target.value)}
                    placeholder="Course name"
                    className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-transparent text-sm"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={row.credits}
                    onChange={(e) => updateRow(row.id, "credits", e.target.value)}
                    min="0.5"
                    max="6"
                    step="0.5"
                    className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-transparent text-sm text-center"
                  />
                </td>
                <td className="px-3 py-2">
                  <select
                    value={row.grade}
                    onChange={(e) => updateRow(row.id, "grade", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-transparent text-sm appearance-none cursor-pointer text-center"
                  >
                    <option value="">—</option>
                    {scale.grades.map((g) => (
                      <option key={g.letter} value={g.letter}>{g.letter} ({g.points})</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2 text-center">
                  <button
                    onClick={() => removeRow(row.id)}
                    disabled={rows.length <= 1}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                    title="Remove course"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-muted rounded-xl p-5 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Previous Cumulative GPA</h3>
            <span className="text-xs text-muted-foreground">Optional</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Previous CGPA</label>
              <input
                type="number"
                value={prevGpa}
                onChange={(e) => setPrevGpa(e.target.value)}
                placeholder="e.g., 3.2"
                min="0"
                max="4"
                step="0.01"
                className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background dark:bg-background text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Total Credits Completed</label>
              <input
                type="number"
                value={prevCredits}
                onChange={(e) => setPrevCredits(e.target.value)}
                placeholder="e.g., 60"
                min="0"
                step="1"
                className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background dark:bg-background text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-muted rounded-xl p-5 border border-border flex flex-col justify-center">
          <p className="text-xs text-muted-foreground mb-1">Scale Summary</p>
          <p className="text-sm text-foreground font-medium">{scale.label}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {scale.grades.slice(0, 6).map((g) => (
              <span key={g.letter} className="text-xs text-muted-foreground">{g.letter} = {g.points}</span>
            ))}
            {scale.grades.length > 6 && (
              <span className="text-xs text-muted-foreground">+{scale.grades.length - 6} more</span>
            )}
          </div>
        </div>
      </div>

      {semesterGpa && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20 p-6 text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Semester GPA</p>
            <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">
              {semesterGpa.gpa.toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground">
              {semesterGpa.points.toFixed(1)} grade points ÷ {semesterGpa.credits.toFixed(0)} credits
            </p>
            <p className={`text-sm font-semibold mt-1 ${getGpaClass(semesterGpa.gpa).color}`}>
              {getGpaClass(semesterGpa.gpa).label}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 rounded-xl border border-blue-500/20 p-6 text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
              {prevGpa && prevCredits ? "Cumulative GPA" : "Overall GPA"}
            </p>
            <div className="text-4xl md:text-5xl font-extrabold text-blue-500 mb-2">
              {cumulativeGpa ? cumulativeGpa.gpa.toFixed(2) : semesterGpa.gpa.toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground">
              {cumulativeGpa
                ? `${cumulativeGpa.points.toFixed(1)} grade points ÷ ${cumulativeGpa.credits.toFixed(0)} credits`
                : `${semesterGpa.points.toFixed(1)} grade points ÷ ${semesterGpa.credits.toFixed(0)} credits`}
            </p>
            <p className={`text-sm font-semibold mt-1 ${getGpaClass(cumulativeGpa ? cumulativeGpa.gpa : semesterGpa.gpa).color}`}>
              {getGpaClass(cumulativeGpa ? cumulativeGpa.gpa : semesterGpa.gpa).label}
            </p>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-foreground mb-3">GPA Classification Reference</h3>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted text-muted-foreground text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left font-medium">GPA Range</th>
                <th className="px-4 py-3 text-left font-medium">Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {GRADE_TABLE.map((row) => (
                <tr key={row.label} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-2.5 text-foreground">
                    {row.min.toFixed(1)} — {row.max.toFixed(1)}
                  </td>
                  <td className={`px-4 py-2.5 font-medium ${row.color}`}>{row.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
