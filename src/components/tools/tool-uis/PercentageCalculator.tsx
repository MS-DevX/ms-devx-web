"use client";

import { useState, useMemo } from "react";
import ResultBox from "@/components/tools/tool-uis/shared/ResultBox";
import type { ToolUiProps } from "@/lib/types";

interface PercentageResult {
  percentage: string;
  value: number;
  total: number;
}

export default function PercentageCalculator({ className }: ToolUiProps) {
  const [value, setValue] = useState("");
  const [total, setTotal] = useState("");

  const result = useMemo<PercentageResult | null>(() => {
    const val = parseFloat(value);
    const tot = parseFloat(total);

    if (
      (isNaN(val) && val !== 0) ||
      (isNaN(tot) && tot !== 0) ||
      tot === 0
    ) {
      return null;
    }

    const percentage = (val / tot) * 100;
    return {
      percentage: percentage.toFixed(2),
      value: val,
      total: tot,
    };
  }, [value, total]);

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Value
          </label>
          <input
            type="number"
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
            placeholder="e.g., 25"
            className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Total
          </label>
          <input
            type="number"
            value={total}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTotal(e.target.value)}
            placeholder="e.g., 200"
            className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background"
          />
        </div>
      </div>

      <div className="text-center mb-4 text-muted-foreground">
        What percentage is <span className="font-semibold text-foreground">Value</span> of{" "}
        <span className="font-semibold text-foreground">Total</span>?
      </div>

      {result && (
        <ResultBox show={true}>
          <div className="text-center">
            <div className="mb-6">
              <span className="text-4xl md:text-5xl font-extrabold text-primary">
                {result.percentage}%
              </span>
            </div>
            <p className="text-muted-foreground">
              {result.value} is {result.percentage}% of {result.total}
            </p>
          </div>
        </ResultBox>
      )}
    </div>
  );
}
