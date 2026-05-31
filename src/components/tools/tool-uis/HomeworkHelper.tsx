"use client";

import { FileText, Loader2, Sparkles, Upload } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type InputMode = "text" | "file";

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
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [question, setQuestion] = useState("");
  const [fileName, setFileName] = useState("");
  const [subject, setSubject] = useState<string>(SUBJECTS[0]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const handleGenerate = () => {
    if (inputMode === "text" && !question.trim()) return;
    if (inputMode === "file" && !fileName) return;

    setLoading(true);
    setShowOutput(false);

    setTimeout(() => {
      const prompt =
        inputMode === "text"
          ? question.trim()
          : `Content extracted from "${fileName}"`;

      setAnswer(
        `Subject: ${subject}\n\n` +
          `Question:\n${prompt}\n\n` +
          `Explanation:\n` +
          `Step 1 — Identify what the problem is asking. Break the prompt into known values, unknowns, and constraints.\n\n` +
          `Step 2 — Apply the core ${subject.toLowerCase()} concept. ` +
          `For this mock response, we simulate identifying the correct formula or reasoning path based on keywords in your input.\n\n` +
          `Step 3 — Solve and verify. Work through the logic systematically, then check whether the answer satisfies the original question.\n\n` +
          `Suggested approach: Start by restating the problem in your own words, list given data, show each transformation, and box your final answer with units where applicable.`
      );
      setShowOutput(true);
      setLoading(false);
    }, 1600);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={inputMode === "text" ? "default" : "outline"}
          size="sm"
          onClick={() => setInputMode("text")}
          className={inputMode === "text" ? "bg-electric text-white" : ""}
        >
          <FileText />
          Text input
        </Button>
        <Button
          type="button"
          variant={inputMode === "file" ? "default" : "outline"}
          size="sm"
          onClick={() => setInputMode("file")}
          className={inputMode === "file" ? "bg-electric text-white" : ""}
        >
          <Upload />
          File upload
        </Button>
      </div>

      <div className="space-y-2">
        <label htmlFor="homework-subject" className="text-sm font-medium">
          Subject
        </label>
        <Select value={subject} onValueChange={setSubject}>
          <SelectTrigger id="homework-subject" className="w-full sm:w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SUBJECTS.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {inputMode === "text" ? (
        <div className="space-y-2">
          <label htmlFor="homework-question" className="text-sm font-medium">
            Your question
          </label>
          <Textarea
            id="homework-question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={5}
            placeholder="Paste your homework question here..."
          />
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-white/20 bg-muted/20 p-6 text-center">
          <Upload className="mx-auto mb-2 size-8 text-electric" />
          <p className="text-sm font-medium">Upload homework file</p>
          <Input
            type="file"
            accept="image/*,.pdf,.txt"
            className="mx-auto mt-4 max-w-xs"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
          />
          {fileName && (
            <p className="mt-2 text-xs text-electric">{fileName}</p>
          )}
        </div>
      )}

      <Button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-electric text-white hover:bg-electric/90"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" />
            Generating explanation...
          </>
        ) : (
          <>
            <Sparkles />
            Generate answer
          </>
        )}
      </Button>

      {showOutput && answer && (
        <div className="animate-in fade-in rounded-lg border border-white/10 bg-muted/30 p-4 duration-300">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-electric">
            AI explanation
          </p>
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-navy dark:text-white">
            {answer}
          </pre>
        </div>
      )}
    </div>
  );
}
