"use client";
import { useState, useMemo } from "react";
import { currencies, type Currency } from "@/data/currencies";

interface BudgetCategory {
  id: string;
  name: string;
}

interface ExpenseValues {
  housing: string;
  food: string;
  transport: string;
  utilities: string;
  insurance: string;
  entertainment: string;
  savings: string;
  other: string;
}

interface CategoryResult extends BudgetCategory {
  amount: number;
  percentage: number;
}

interface BudgetResults {
  totalExpenses: number;
  remaining: number;
  remainingPct: number;
  categories: CategoryResult[];
}

const budgetCategories: BudgetCategory[] = [
  { id: "housing", name: "Housing" },
  { id: "food", name: "Food & Groceries" },
  { id: "transport", name: "Transportation" },
  { id: "utilities", name: "Utilities" },
  { id: "insurance", name: "Insurance" },
  { id: "entertainment", name: "Entertainment" },
  { id: "savings", name: "Savings" },
  { id: "other", name: "Other" },
];

export default function BudgetPercentageCalculator() {
  const [currency, setCurrency] = useState<string>("$");
  const [income, setIncome] = useState<string>("");
  const [expenses, setExpenses] = useState<ExpenseValues>({
    housing: "",
    food: "",
    transport: "",
    utilities: "",
    insurance: "",
    entertainment: "",
    savings: "",
    other: "",
  });

  const results = useMemo<BudgetResults>(() => {
    const inc = parseFloat(income) || 0;
    const catResults: CategoryResult[] = budgetCategories.map((cat: BudgetCategory) => {
      const val = parseFloat(expenses[cat.id as keyof ExpenseValues]) || 0;
      const pct = inc > 0 ? (val / inc) * 100 : 0;
      return {
        ...cat,
        amount: val,
        percentage: pct,
      };
    });

    const totalExpenses = catResults.reduce((sum: number, c: CategoryResult) => sum + c.amount, 0);
    const remaining = Math.max(0, inc - totalExpenses);
    const remainingPct = inc > 0 ? (remaining / inc) * 100 : 0;

    return {
      totalExpenses,
      remaining,
      remainingPct,
      categories: catResults,
    };
  }, [income, expenses]);

  const updateExpense = (id: string, value: string): void => {
    setExpenses((prev: ExpenseValues) => ({ ...prev, [id]: value }));
  };

  const formatCurrency = (value: number, decimals = 2): string => {
    return `${currency}${value.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Monthly Income
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {currency}
            </span>
            <input
              type="number"
              min="0"
              value={income}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIncome(e.target.value)}
              placeholder="5000"
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

      <div className="mb-8">
        <h3 className="font-semibold text-foreground mb-4 text-lg">
          📋 Monthly Expenses
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgetCategories.map((cat: BudgetCategory) => (
            <div key={cat.id}>
              <label className="block text-sm font-medium text-foreground mb-1">
                {cat.name}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  {currency}
                </span>
                <input
                  type="number"
                  min="0"
                  value={expenses[cat.id as keyof ExpenseValues]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateExpense(cat.id, e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2.5 pl-10 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-background rounded-2xl border border-border shadow-card p-6 md:p-8">
        <h3 className="font-semibold text-foreground mb-6 text-lg text-center">
          📊 Budget Breakdown
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="text-left py-3 px-4 text-foreground font-semibold">
                  Category
                </th>
                <th className="text-right py-3 px-4 text-foreground font-semibold">
                  Amount
                </th>
                <th className="text-right py-3 px-4 text-foreground font-semibold">
                  %
                </th>
                <th className="text-left py-3 px-4 text-foreground font-semibold">
                  Share
                </th>
              </tr>
            </thead>
            <tbody>
              {results.categories.map((cat: CategoryResult) => (
                <tr key={cat.id} className="border-b border-border last:border-b-0">
                  <td className="py-3 px-4 text-foreground">{cat.name}</td>
                  <td className="py-3 px-4 text-foreground font-medium text-right">
                    {formatCurrency(cat.amount)}
                  </td>
                  <td className="py-3 px-4 text-foreground font-medium text-right">
                    {cat.percentage.toFixed(1)}%
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-full max-w-32 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${Math.min(cat.percentage * 2, 100)}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="border-b-2 border-border bg-muted">
                <td className="py-3 px-4 font-semibold text-foreground">
                  Total Expenses
                </td>
                <td className="py-3 px-4 font-semibold text-foreground text-right">
                  {formatCurrency(results.totalExpenses)}
                </td>
                <td className="py-3 px-4 font-semibold text-foreground text-right">
                  {parseFloat(income) > 0
                    ? ((results.totalExpenses / parseFloat(income)) * 100).toFixed(1)
                    : "0.0"}
                  %
                </td>
                <td className="py-3 px-4"></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-lg text-green-600">
                  Remaining
                </td>
                <td className="py-3 px-4 font-bold text-lg text-green-600 text-right">
                  {formatCurrency(results.remaining)}
                </td>
                <td className="py-3 px-4 font-bold text-lg text-green-600 text-right">
                  {results.remainingPct.toFixed(1)}%
                </td>
                <td className="py-3 px-4">
                  <div className="w-full max-w-32 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-green-500 transition-all duration-500"
                      style={{
                        width: `${Math.min(results.remainingPct * 2, 100)}%`,
                      }}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
