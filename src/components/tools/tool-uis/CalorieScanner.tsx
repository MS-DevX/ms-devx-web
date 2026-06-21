"use client";

import { ImageIcon, Loader2, Sparkles } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { NutritionResult, ToolUiProps } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function CalorieScanner({ className }: ToolUiProps) {
  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NutritionResult | null>(null);
  const [showOutput, setShowOutput] = useState(false);

  const handleFileChange = (file: File | undefined) => {
    if (!file) {
      setFileName("");
      setPreviewUrl(null);
      setResult(null);
      setShowOutput(false);
      return;
    }

    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setShowOutput(false);
  };

  const handleAnalyze = () => {
    if (!fileName) return;

    setLoading(true);
    setShowOutput(false);

    setTimeout(() => {
      const seed = fileName.length;

      setResult({
        label: fileName.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
        calories: 320 + seed * 12,
        protein: 18 + (seed % 10),
        carbs: 35 + (seed % 15),
        fat: 12 + (seed % 8),
      });
      setShowOutput(true);
      setLoading(false);
    }, 1800);
  };

  return (
    <div className={cn("grid gap-6 lg:grid-cols-2", className)}>
      <div className="space-y-4">
        <div className="rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center">
          <ImageIcon className="mx-auto mb-2 size-10 text-electric" />
          <p className="text-sm font-medium text-foreground">
            Upload a food photo
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            AI vision analysis is simulated — no image leaves your browser
          </p>
          <Input
            type="file"
            accept="image/*"
            className="mx-auto mt-4 max-w-xs"
            onChange={(e) => handleFileChange(e.target.files?.[0])}
          />
          {fileName && (
            <p className="mt-2 text-xs text-electric">{fileName}</p>
          )}
        </div>

        {previewUrl && (
          <div className="overflow-hidden rounded-lg border border-border">
            <Image
              src={previewUrl}
              alt="Food preview"
              width={400}
              height={192}
              unoptimized
              className="max-h-48 w-full object-cover"
            />
          </div>
        )}

        <Button
          type="button"
          onClick={handleAnalyze}
          disabled={loading || !fileName}
          className="w-full bg-electric text-white hover:bg-electric/90"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              Analyzing nutrition...
            </>
          ) : (
            <>
              <Sparkles />
              Analyze meal
            </>
          )}
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-muted/20 p-4 lg:min-h-[280px]">
        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-electric">
          Nutrition estimate
        </p>

        {showOutput && result ? (
          <div className="animate-in fade-in space-y-4 duration-300">
            <p className="text-lg font-semibold capitalize text-foreground">
              {result.label}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-background p-3">
                <p className="text-xs text-muted-foreground">Calories</p>
                <p className="text-xl font-bold text-electric">
                  {result.calories}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <p className="text-xs text-muted-foreground">Protein</p>
                <p className="text-xl font-bold text-foreground">
                  {result.protein}g
                </p>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <p className="text-xs text-muted-foreground">Carbs</p>
                <p className="text-xl font-bold text-foreground">
                  {result.carbs}g
                </p>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <p className="text-xs text-muted-foreground">Fat</p>
                <p className="text-xl font-bold text-foreground">
                  {result.fat}g
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Upload a photo and click analyze to see mock nutrition breakdown.
          </p>
        )}
      </div>
    </div>
  );
}
