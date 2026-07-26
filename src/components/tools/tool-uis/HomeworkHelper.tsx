"use client";

import { Clock, FileText, Sparkles, Upload } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ToolUiProps } from "@/lib/types";
import { cn } from "@/lib/utils";

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "History",
  "English",
] as const;

export default function HomeworkHelper({ className }: ToolUiProps) {
  const [inputMode, setInputMode] = useState<"text" | "file">("text");
  const [question, setQuestion] = useState("");
  const [fileName, setFileName] = useState("");
  const [subject, setSubject] = useState<string>(SUBJECTS[0]);

  return (
    <div className={cn("grid gap-8 lg:grid-cols-2", className)}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={inputMode === "text" ? "default" : "outline"}
            size="sm"
            onClick={() => setInputMode("text")}
            className={inputMode === "text" ? "bg-blue-600 text-white dark:bg-electric dark:text-slate-950 font-semibold" : ""}
          >
            <FileText className="size-4" />
            Text input
          </Button>
          <Button
            type="button"
            variant={inputMode === "file" ? "default" : "outline"}
            size="sm"
            onClick={() => setInputMode("file")}
            className={inputMode === "file" ? "bg-blue-600 text-white dark:bg-electric dark:text-slate-950 font-semibold" : ""}
          >
            <Upload className="size-4" />
            File upload
          </Button>
        </div>

        <div className="space-y-2">
          <label htmlFor="homework-subject" className="text-xs font-medium text-muted-foreground">
            Subject
          </label>
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger id="homework-subject" className="w-full text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map((item) => (
                <SelectItem key={item} value={item} className="text-xs">
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {inputMode === "text" ? (
          <div className="space-y-2">
            <label htmlFor="homework-question" className="text-xs font-medium text-muted-foreground">
              Your question
            </label>
            <Textarea
              id="homework-question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={5}
              placeholder="Type or paste your question here to preview the prompt layout..."
              className="text-sm"
            />
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center">
            <Upload className="mx-auto mb-2 size-8 text-blue-700 dark:text-electric" />
            <p className="text-sm font-semibold">Upload homework file</p>
            <input
              type="file"
              accept="image/*,.pdf,.txt"
              className="mx-auto mt-4 block text-xs text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-foreground hover:file:bg-muted/80"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
            />
            {fileName && (
              <p className="mt-2 text-xs font-medium text-blue-700 dark:text-electric">{fileName}</p>
            )}
          </div>
        )}

        <Button
          type="button"
          disabled
          className="w-full bg-muted text-muted-foreground cursor-not-allowed"
        >
          <Sparkles className="size-4" />
          Generate Explanation — Coming Soon
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-6 text-center min-h-[300px]">
        <div className="rounded-full bg-amber-500/10 p-3 text-amber-600 dark:text-amber-400 mb-3 border border-amber-500/20">
          <Clock className="size-6" />
        </div>

        <span className="mb-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 border border-amber-500/20">
          Under Development
        </span>

        <h3 className="text-base font-bold text-foreground mb-1">
          AI Problem Solver Coming Soon
        </h3>

        <p className="max-w-sm text-xs text-muted-foreground leading-relaxed">
          Real step-by-step problem solving requires a secure server-side LLM API integration. Rather than returning generic simulated text, this tool is being updated to connect directly to an AI API service.
        </p>
      </div>
    </div>
  );
}
