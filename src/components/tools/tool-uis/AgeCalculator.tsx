"use client";
import { useState, useMemo, useEffect } from "react";
import ResultBox from "@/components/tools/tool-uis/shared/ResultBox";
import ResultItem from "@/components/tools/tool-uis/shared/ResultItem";

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

interface DateFields {
  month: number;
  day: number;
  year: number;
}

interface AgeResult {
  error?: string;
  totalDays?: number;
  weeks?: number;
  ageYears?: number;
  totalHours?: number;
  totalMinutes?: number;
  totalSeconds?: number;
  nextBirthday?: string;
  daysToBirthday?: number;
}

export default function AgeCalculator() {
  const [now, setNow] = useState<Date>(() => new Date(2000, 0, 1));

  useEffect(() => {
    setNow(new Date());
  }, []);

  const [dob, setDob] = useState<DateFields>({
    month: 0,
    day: 1,
    year: 2000,
  });

  const [refDate, setRefDate] = useState<DateFields>({
    month: now.getMonth(),
    day: now.getDate(),
    year: now.getFullYear(),
  });

  const result = useMemo((): AgeResult => {
    const birthDate = new Date(dob.year, dob.month, dob.day);
    const referenceDate = new Date(refDate.year, refDate.month, refDate.day);

    if (birthDate > referenceDate) {
      return {
        error: "Invalid dates — date of birth must be before the reference date.",
      };
    }

    const diffMs = referenceDate.getTime() - birthDate.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7);

    const nextBirthday = new Date(
      referenceDate.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate()
    );

    if (nextBirthday < referenceDate) {
      nextBirthday.setFullYear(referenceDate.getFullYear() + 1);
    }

    const daysToBirthday = Math.ceil(
      (nextBirthday.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    let ageYears = referenceDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = referenceDate.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birthDate.getDate())) {
      ageYears--;
    }

    return {
      totalDays,
      weeks,
      ageYears,
      totalHours: totalDays * 24,
      totalMinutes: totalDays * 24 * 60,
      totalSeconds: totalDays * 24 * 60 * 60,
      nextBirthday: nextBirthday.toDateString(),
      daysToBirthday,
    };
  }, [dob, refDate]);

  const years = Array.from({ length: 200 }, (_, i) => now.getFullYear() - i);
  const futureYears = Array.from({ length: 150 }, (_, i) => 1900 + i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const selectClasses = "px-3 py-2.5 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm bg-background";

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Date of Birth
          </label>
          <div className="grid grid-cols-3 gap-2">
            <select
              value={dob.month}
              onChange={(e) => setDob({ ...dob, month: parseInt(e.target.value) })}
              className={selectClasses}
            >
              {monthNames.map((m, i) => (
                <option key={i} value={i}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={dob.day}
              onChange={(e) => setDob({ ...dob, day: parseInt(e.target.value) })}
              className={selectClasses}
            >
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              value={dob.year}
              onChange={(e) => setDob({ ...dob, year: parseInt(e.target.value) })}
              className={selectClasses}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Reference Date
          </label>
          <div className="grid grid-cols-3 gap-2">
            <select
              value={refDate.month}
              onChange={(e) => setRefDate({ ...refDate, month: parseInt(e.target.value) })}
              className={selectClasses}
            >
              {monthNames.map((m, i) => (
                <option key={i} value={i}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={refDate.day}
              onChange={(e) => setRefDate({ ...refDate, day: parseInt(e.target.value) })}
              className={selectClasses}
            >
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              value={refDate.year}
              onChange={(e) => setRefDate({ ...refDate, year: parseInt(e.target.value) })}
              className={selectClasses}
            >
              {futureYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {result && (
        <ResultBox show={true}>
          {result.error ? (
            <p className="text-red-500 font-medium">{result.error}</p>
          ) : (
            <div>
              <h3 className="font-semibold text-foreground mb-4 text-lg">Age</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <ResultItem label="Years" value={result.ageYears!.toLocaleString()} />
                <ResultItem label="Total Days" value={result.totalDays!.toLocaleString()} />
                <ResultItem label="Weeks" value={result.weeks!.toLocaleString()} />
                <ResultItem label="Hours" value={result.totalHours!.toLocaleString()} />
                <ResultItem label="Minutes" value={result.totalMinutes!.toLocaleString()} />
                <ResultItem label="Seconds" value={result.totalSeconds!.toLocaleString()} />
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <h3 className="font-semibold text-foreground mb-3">Next Birthday</h3>
                <ResultItem label="Date" value={result.nextBirthday!} />
                <ResultItem label="Days Remaining" value={`${result.daysToBirthday} days`} />
              </div>
            </div>
          )}
        </ResultBox>
      )}
    </div>
  );
}
