"use client";

import { Copy, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

type NameStyle = "Modern" | "Islamic" | "Tech" | "Startup";

const STYLE_PREFIXES: Record<NameStyle, string[]> = {
  Modern: ["Nova", "Apex", "Pulse", "Vertex", "Lumen"],
  Islamic: ["Noor", "Barakah", "Falah", "Rihla", "Safa"],
  Tech: ["Dev", "Stack", "Byte", "Cloud", "Sync"],
  Startup: ["Launch", "Scale", "Venture", "Spark", "Forge"],
};

const STYLE_SUFFIXES: Record<NameStyle, string[]> = {
  Modern: ["Labs", "Studio", "Works", "Co.", "Group"],
  Islamic: ["Trust", "Collective", "Partners", "Ventures", "Holdings"],
  Tech: ["AI", "Systems", "Hub", "Logic", "Flow"],
  Startup: ["HQ", "Base", "Foundry", "Circle", "Nest"],
};

export default function BusinessNameGenerator({ className }: ToolUiProps) {
  const [keyword, setKeyword] = useState("");
  const [style, setStyle] = useState<NameStyle>("Modern");
  const [names, setNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setShowOutput(false);

    setTimeout(() => {
      const key = keyword.trim() || "DevX";
      const prefixes = STYLE_PREFIXES[style];
      const suffixes = STYLE_SUFFIXES[style];

      const generated = Array.from({ length: 8 }, (_, i) => {
        const prefix = prefixes[i % prefixes.length];
        const suffix = suffixes[(i + 2) % suffixes.length];
        return `${prefix}${key}${suffix}`;
      });

      setNames(generated);
      setShowOutput(true);
      setLoading(false);
    }, 1300);
  };

  const copyName = async (name: string) => {
    await navigator.clipboard.writeText(name);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name-keyword" className="text-sm font-medium">
            Keyword
          </label>
          <Input
            id="name-keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Marth, Dev, Cloud..."
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="name-style" className="text-sm font-medium">
            Style
          </label>
          <Select
            value={style}
            onValueChange={(value) => setStyle(value as NameStyle)}
          >
            <SelectTrigger id="name-style" className="w-full">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Modern">Modern</SelectItem>
              <SelectItem value="Islamic">Islamic</SelectItem>
              <SelectItem value="Tech">Tech</SelectItem>
              <SelectItem value="Startup">Startup</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-electric text-white hover:bg-electric/90"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" />
            Generating names...
          </>
        ) : (
          <>
            <Sparkles />
            Generate business names
          </>
        )}
      </Button>

      {showOutput && names.length > 0 && (
        <div className="animate-in fade-in grid gap-3 sm:grid-cols-2 lg:grid-cols-4 duration-300">
          {names.map((name) => (
            <div
              key={name}
              className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-muted/20 p-3 transition hover:border-electric/40 hover:shadow-md"
            >
              <div>
                <p className="font-medium text-navy dark:text-white">{name}</p>
                <Badge variant="outline" className="mt-1 text-xs">
                  {style}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => copyName(name)}
                aria-label={`Copy ${name}`}
              >
                <Copy className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
