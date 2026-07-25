"use client";
import { useState, useMemo } from "react";
import { currencies, type Currency } from "@/data/currencies";

const monthNames: string[] = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

interface SavingsResult {
  remaining: number;
  months: number;
  completionDate: string;
  progressPercent: number;
}

export default function SavingsGoalTracker() {
  const [goalAmount, setGoalAmount] = useState<string>("");
  const [savedSoFar, setSavedSoFar] = useState<string>("");
  const [monthlySave, setMonthlySave] = useState<string>("");
  const [currency, setCurrency] = useState<string>("$");

  const result = useMemo<SavingsResult>(() => {
    const goal = parseFloat(goalAmount) || 0;
    const saved = parseFloat(savedSoFar) || 0;
    const monthly = parseFloat(monthlySave) || 0;

    const remaining = Math.max(0, goal - saved);
    const months = monthly > 0 ? Math.ceil(remaining / monthly) : 0;
    const progressPercent = goal > 0 ? Math.min(100, (saved / goal) * 100) : 0;

    const now = new Date();
    now.setMonth(now.getMonth() + months);
    const completionDate =
      months > 0
        ? `${monthNames[now.getMonth()]} ${now.getFullYear()}`
        : "";

    return {
      remaining,
      months,
      completionDate,
      progressPercent,
    };
  }, [goalAmount, savedSoFar, monthlySave]);

  const formatCurrency = (value: number): string => {
    return `${currency}${value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Savings Goal
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {currency}
            </span>
            <input
              type="number"
              min="0"
              value={goalAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGoalAmount(e.target.value)}
              placeholder="10000"
              className="w-full px-4 py-3 pl-10 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Saved So Far
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {currency}
            </span>
            <input
              type="number"
              min="0"
              value={savedSoFar}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSavedSoFar(e.target.value)}
              placeholder="2500"
              className="w-full px-4 py-3 pl-10 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Monthly Savings
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {currency}
            </span>
            <input
              type="number"
              min="0"
              value={monthlySave}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMonthlySave(e.target.value)}
              placeholder="500"
              className="w-full px-4 py-3 pl-10 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Currency
          </label>
          <select
            value={currency}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCurrency(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background"
          >
            {currencies.map((c: Currency) => (
              <option key={c.code} value={c.symbol}>
                {c.code} {c.symbol} — {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-background rounded-2xl border border-border shadow-card p-6 md:p-8">
        <h3 className="font-semibold text-foreground mb-6 text-lg text-center">
          🎯 Savings Progress
        </h3>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm font-bold text-primary">
              {Math.round(result.progressPercent)}% complete
            </span>
          </div>
          <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary-dark transition-all duration-500 ease-out"
              style={{ width: `${result.progressPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-muted rounded-xl p-5 text-center border border-border">
            <div className="text-sm text-muted-foreground mb-1">Remaining</div>
            <div className="text-2xl font-extrabold text-foreground">
              {formatCurrency(result.remaining)}
            </div>
          </div>
          <div className="bg-muted rounded-xl p-5 text-center border border-border">
            <div className="text-sm text-muted-foreground mb-1">Months Needed</div>
            <div className="text-2xl font-extrabold text-primary">
              {result.months || "—"}
            </div>
          </div>
          {result.completionDate && (
            <div className="bg-muted rounded-xl p-5 text-center border border-border">
              <div className="text-sm text-muted-foreground mb-1">Est. Completion</div>
              <div className="text-2xl font-extrabold text-foreground">
                {result.completionDate}
              </div>
            </div>
          )}
        </div>

        <div className="p-5 bg-primary-light rounded-xl">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Goal</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(parseFloat(goalAmount) || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Saved</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(parseFloat(savedSoFar) || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
