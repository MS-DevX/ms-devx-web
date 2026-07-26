"use client";

import { Clock, ImageIcon, Sparkles } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { ToolUiProps } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function CalorieScanner({ className }: ToolUiProps) {
  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (file: File | undefined) => {
    if (!file) {
      setFileName("");
      setPreviewUrl(null);
      return;
    }
    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <div className={cn("grid gap-6 lg:grid-cols-2", className)}>
      <div className="space-y-4">
        <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center">
          <ImageIcon className="mx-auto mb-2 size-10 text-blue-700 dark:text-electric" />
          <p className="text-sm font-semibold text-foreground">
            Food Photo Scanner
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Select an image to preview how the AI meal scanner interface works.
          </p>
          <input
            type="file"
            accept="image/*"
            className="mx-auto mt-4 block text-xs text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-foreground hover:file:bg-muted/80"
            onChange={(e) => handleFileChange(e.target.files?.[0])}
          />
          {fileName && (
            <p className="mt-2 text-xs font-medium text-blue-700 dark:text-electric">{fileName}</p>
          )}
        </div>

        {previewUrl && (
          <div className="overflow-hidden rounded-xl border border-border">
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
          disabled
          className="w-full bg-muted text-muted-foreground cursor-not-allowed"
        >
          <Sparkles className="size-4" />
          AI Vision Scanner — Coming Soon
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-6 text-center min-h-[280px]">
        <div className="rounded-full bg-amber-500/10 p-3 text-amber-600 dark:text-amber-400 mb-3 border border-amber-500/20">
          <Clock className="size-6" />
        </div>

        <span className="mb-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 border border-amber-500/20">
          Under Development
        </span>

        <h3 className="text-base font-bold text-foreground mb-1">
          Real AI Vision Integration Coming Soon
        </h3>

        <p className="max-w-sm text-xs text-muted-foreground leading-relaxed">
          Accurate food recognition requires an AI vision model (e.g. Gemini Vision API). Rather than displaying simulated estimates, this feature is currently being integrated and will be released shortly.
        </p>
      </div>
    </div>
  );
}
