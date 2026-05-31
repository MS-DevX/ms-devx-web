"use client";

import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ToolUiProps } from "@/lib/types";
import { cn } from "@/lib/utils";

type ConvertCategory = "Length" | "Weight" | "Temperature" | "Speed";

const UNITS: Record<ConvertCategory, string[]> = {
  Length: ["Meters", "Kilometers", "Miles", "Feet"],
  Weight: ["Kilograms", "Grams", "Pounds", "Ounces"],
  Temperature: ["Celsius", "Fahrenheit", "Kelvin"],
  Speed: ["km/h", "m/s", "mph", "knots"],
};

function convertValue(
  category: ConvertCategory,
  value: number,
  from: string,
  to: string
): number {
  if (from === to) return value;

  if (category === "Length") {
    const toMeters: Record<string, number> = {
      Meters: 1,
      Kilometers: 1000,
      Miles: 1609.34,
      Feet: 0.3048,
    };
    const meters = value * (toMeters[from] ?? 1);
    return meters / (toMeters[to] ?? 1);
  }

  if (category === "Weight") {
    const toKg: Record<string, number> = {
      Kilograms: 1,
      Grams: 0.001,
      Pounds: 0.453592,
      Ounces: 0.0283495,
    };
    const kg = value * (toKg[from] ?? 1);
    return kg / (toKg[to] ?? 1);
  }

  if (category === "Temperature") {
    let celsius = value;
    if (from === "Fahrenheit") celsius = ((value - 32) * 5) / 9;
    if (from === "Kelvin") celsius = value - 273.15;
    if (to === "Celsius") return celsius;
    if (to === "Fahrenheit") return (celsius * 9) / 5 + 32;
    return celsius + 273.15;
  }

  const toMs: Record<string, number> = {
    "m/s": 1,
    "km/h": 1 / 3.6,
    mph: 0.44704,
    knots: 0.514444,
  };
  const ms = value * (toMs[from] ?? 1);
  return ms / (toMs[to] ?? 1);
}

function formatConvertedValue(result: number): string {
  if (!Number.isFinite(result)) return "";
  return result.toFixed(4).replace(/\.?0+$/, "");
}

export default function UnitConverter({ className }: ToolUiProps) {
  const [category, setCategory] = useState<ConvertCategory>("Length");
  const [fromUnit, setFromUnit] = useState(UNITS.Length[0]);
  const [toUnit, setToUnit] = useState(UNITS.Length[1]);
  const [fromValue, setFromValue] = useState("1");

  const toValue = useMemo(() => {
    const parsed = parseFloat(fromValue);
    if (Number.isNaN(parsed)) return "";
    return formatConvertedValue(
      convertValue(category, parsed, fromUnit, toUnit)
    );
  }, [category, fromUnit, toUnit, fromValue]);

  const handleCategoryChange = (value: ConvertCategory) => {
    const units = UNITS[value];
    setCategory(value);
    setFromUnit(units[0]);
    setToUnit(units[1] ?? units[0]);
    setFromValue("1");
  };

  const handleToValueChange = (value: string) => {
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed)) {
      setFromValue("");
      return;
    }
    setFromValue(
      formatConvertedValue(
        convertValue(category, parsed, toUnit, fromUnit)
      )
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2">
        <label htmlFor="convert-category" className="text-sm font-medium">
          Category
        </label>
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger id="convert-category" className="w-full sm:w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Length">Length</SelectItem>
            <SelectItem value="Weight">Weight</SelectItem>
            <SelectItem value="Temperature">Temperature</SelectItem>
            <SelectItem value="Speed">Speed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-3 rounded-lg border border-white/10 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            From
          </p>
          <Select value={fromUnit} onValueChange={setFromUnit}>
            <SelectTrigger className="w-full" aria-label="From unit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {UNITS[category].map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            inputMode="decimal"
            value={fromValue}
            onChange={(e) => setFromValue(e.target.value)}
            placeholder="0"
            aria-label="From value"
          />
        </div>

        <div className="space-y-3 rounded-lg border border-white/10 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            To
          </p>
          <Select value={toUnit} onValueChange={setToUnit}>
            <SelectTrigger className="w-full" aria-label="To unit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {UNITS[category].map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            inputMode="decimal"
            value={toValue}
            onChange={(e) => handleToValueChange(e.target.value)}
            placeholder="0"
            aria-label="To value"
          />
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Conversions update instantly using standard formulas.
      </p>
    </div>
  );
}
