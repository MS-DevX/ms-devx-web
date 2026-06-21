"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ToolUiProps } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function CoverLetterWriter({ className }: ToolUiProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [experience, setExperience] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setShowOutput(false);

    setTimeout(() => {
      const role =
        jobDescription.split("\n")[0]?.slice(0, 80) ||
        "the role at your organization";

      setOutput(
        `Dear Hiring Manager,\n\n` +
          `I am excited to apply for ${role}. ` +
          `With a strong background in building modern software and delivering measurable outcomes, ` +
          `I am confident I can contribute immediately to your team.\n\n` +
          `${experience || "Throughout my career, I have led projects that improved efficiency, user experience, and product quality. I collaborate effectively across design, engineering, and business stakeholders."}\n\n` +
          `I am particularly drawn to this opportunity because it aligns with my passion for shipping useful, ` +
          `well-crafted products. I would welcome the chance to discuss how my experience can support your goals.\n\n` +
          `Thank you for your time and consideration.\n\n` +
          `Sincerely,\n` +
          `A motivated MS DevX candidate`
      );
      setShowOutput(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className={cn("grid gap-6 lg:grid-cols-2", className)}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="job-description" className="text-sm font-medium">
            Job description
          </label>
          <Textarea
            id="job-description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={6}
            placeholder="Paste the job posting here..."
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="your-experience" className="text-sm font-medium">
            Your experience
          </label>
          <Textarea
            id="your-experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            rows={6}
            placeholder="Highlight relevant roles, skills, and achievements..."
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-electric text-white hover:bg-electric/90"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              Writing cover letter...
            </>
          ) : (
            <>
              <Sparkles />
              Generate cover letter
            </>
          )}
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-muted/30 p-4 lg:min-h-[320px]">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-electric">
          Cover letter preview
        </p>
        {showOutput && output ? (
          <p className="animate-in fade-in whitespace-pre-wrap text-sm leading-relaxed text-foreground duration-300">
            {output}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Your AI-generated cover letter will appear here after you click
            generate.
          </p>
        )}
      </div>
    </div>
  );
}
