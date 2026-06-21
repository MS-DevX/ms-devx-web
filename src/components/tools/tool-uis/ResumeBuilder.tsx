"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ToolUiProps } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ResumeBuilder({ className }: ToolUiProps) {
  const [name, setName] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [generated, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const livePreview = useMemo(() => {
    const skillList = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    return {
      name: name || "Your Name",
      skills: skillList.length ? skillList : ["Skill 1", "Skill 2"],
      experience:
        experience ||
        "Add your experience to see a live preview of your professional summary.",
    };
  }, [name, skills, experience]);

  const handleGenerate = () => {
    setLoading(true);
    setShowOutput(false);

    setTimeout(() => {
      const skillList = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .join(" • ");

      setGenerated(
        `${name || "Professional Candidate"}\n\n` +
          `SUMMARY\n` +
          `Results-driven professional with expertise in ${skillList || "modern technologies"}. ` +
          `Proven track record of delivering high-impact solutions and collaborating across teams.\n\n` +
          `EXPERIENCE\n${experience || "• Led cross-functional initiatives with measurable outcomes.\n• Optimized workflows and improved delivery velocity."}\n\n` +
          `SKILLS\n${skillList || "Leadership • Problem Solving • Communication • Technical Execution"}`
      );
      setShowOutput(true);
      setLoading(false);
    }, 1400);
  };

  return (
    <div className={cn("grid gap-6 lg:grid-cols-2", className)}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="resume-name" className="text-sm font-medium">
            Full name
          </label>
          <Input
            id="resume-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Developer"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="resume-skills" className="text-sm font-medium">
            Skills (comma-separated)
          </label>
          <Input
            id="resume-skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="React, TypeScript, Node.js"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="resume-experience" className="text-sm font-medium">
            Experience
          </label>
          <Textarea
            id="resume-experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            rows={6}
            placeholder="Senior Engineer at MS DevX (2022–Present)..."
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-electric text-white hover:bg-electric/90 sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              Generating AI resume...
            </>
          ) : (
            <>
              <Sparkles />
              Generate AI resume
            </>
          )}
        </Button>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-electric">
            Live preview
          </p>
          <h3 className="text-lg font-bold text-foreground">
            {livePreview.name}
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {livePreview.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
          <p className="mt-4 whitespace-pre-wrap text-sm text-muted-foreground">
            {livePreview.experience}
          </p>
        </div>

        {showOutput && generated && (
          <div className="animate-in fade-in rounded-lg border border-teal/30 bg-teal/5 p-4 duration-300">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-teal">
              AI-generated resume
            </p>
            <pre className="whitespace-pre-wrap font-sans text-sm text-foreground">
              {generated}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
