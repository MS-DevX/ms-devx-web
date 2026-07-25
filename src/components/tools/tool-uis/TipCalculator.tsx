"use client";
import { useState, useMemo } from "react";
import { currencies, type Currency } from "@/data/currencies";

const tipOptions: number[] = [10, 15, 18, 20, 25];

interface TipResult {
  tip: number;
  total: number;
  perPerson: number;
}

export default function TipCalculator() {
  const [billAmount, setBillAmount] = useState<string>("");
  const [currentTip, setCurrentTip] = useState<number>(18);
  const [peopleCount, setPeopleCount] = useState<string>("1");
  const [currency, setCurrency] = useState<string>("$");

  const result = useMemo<TipResult>(() => {
    const bill = parseFloat(billAmount) || 0;
    const people = parseInt(peopleCount) || 1;

    const tip = bill * (currentTip / 100);
    const total = bill + tip;
    const perPerson = total / people;

    return { tip, total, perPerson };
  }, [billAmount, currentTip, peopleCount]);

  const formatCurrency = (value: number): string => {
    return `${currency}${value.toFixed(2)}`;
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Bill Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {currency}
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={billAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBillAmount(e.target.value)}
              placeholder="0.00"
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
        <label className="block text-sm font-medium text-foreground mb-3">
          Tip Percentage
        </label>
        <div className="flex flex-wrap gap-3">
          {tipOptions.map((pct: number) => (
            <button
              key={pct}
              onClick={() => setCurrentTip(pct)}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                currentTip === pct
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-border hover:text-foreground"
              }`}
            >
              {pct}%
            </button>
          ))}
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="100"
              value={currentTip}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentTip(parseInt(e.target.value) || 0)}
              className="w-20 px-3 py-2.5 rounded-lg border border-border text-center text-foreground bg-background"
            />
            <span className="text-muted-foreground">%</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-foreground mb-2">
          Split Between
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              setPeopleCount(Math.max(1, parseInt(peopleCount) - 1).toString())
            }
            className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-foreground font-bold hover:bg-border transition-colors"
          >
            −
          </button>
          <input
            type="number"
            min="1"
            value={peopleCount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPeopleCount(e.target.value)}
            className="w-24 px-4 py-2.5 rounded-lg border border-border text-center text-lg font-semibold text-foreground bg-background"
          />
          <button
            onClick={() =>
              setPeopleCount((parseInt(peopleCount) + 1).toString())
            }
            className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-foreground font-bold hover:bg-border transition-colors"
          >
            +
          </button>
          <span className="text-muted-foreground ml-2">
            {parseInt(peopleCount) === 1 ? "person" : "people"}
          </span>
        </div>
      </div>

      <div className="bg-background rounded-2xl border border-border shadow-card p-6 md:p-8">
        <h3 className="font-semibold text-foreground mb-6 text-lg text-center">
          💵 Result
        </h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold text-foreground">
              {formatCurrency(parseFloat(billAmount) || 0)}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-muted-foreground">
              Tip ({currentTip}%)
            </span>
            <span className="font-semibold text-primary">
              {formatCurrency(result.tip)}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-foreground font-semibold text-lg">Total</span>
            <span className="font-extrabold text-foreground text-xl">
              {formatCurrency(result.total)}
            </span>
          </div>
          {parseInt(peopleCount) > 1 && (
            <div className="flex justify-between items-center py-4">
              <span className="text-foreground font-semibold">Per Person</span>
              <span className="font-extrabold text-primary text-2xl">
                {formatCurrency(result.perPerson)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
