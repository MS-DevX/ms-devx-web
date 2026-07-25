"use client";

import { useState, useEffect, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";

const loremWords: string[] = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing",
  "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore",
  "et", "dolore", "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam",
  "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "ut",
  "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure",
  "dolor", "in", "reprehenderit", "in", "voluptate", "velit", "esse",
  "cillum", "dolore", "eu", "fugiat", "nulla", "pariatur", "excepteur",
  "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "in", "culpa",
  "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum",
];

function randomWord(): string {
  return loremWords[Math.floor(Math.random() * loremWords.length)];
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function generateSentence(): string {
  const count = Math.floor(Math.random() * 10) + 5;
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(randomWord());
  }
  return capitalize(words.join(" ")) + ".";
}

function generateParagraph(): string {
  const count = Math.floor(Math.random() * 5) + 4;
  const sentences: string[] = [];
  for (let i = 0; i < count; i++) {
    sentences.push(generateSentence());
  }
  return sentences.join(" ");
}

type UnitType = "paragraphs" | "sentences" | "words";

export default function LoremIpsumGenerator() {
  const [unitType, setUnitType] = useState<UnitType>("paragraphs");
  const [amount, setAmount] = useState("3");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const generateLorem = () => {
    const amt = parseInt(amount) || 3;
    const result: string[] = [];

    if (unitType === "paragraphs") {
      for (let i = 0; i < amt; i++) {
        result.push(generateParagraph());
      }
      setOutput(result.join("\n\n"));
    } else if (unitType === "sentences") {
      for (let i = 0; i < amt; i++) {
        result.push(generateSentence());
      }
      setOutput(result.join(" "));
    } else if (unitType === "words") {
      for (let i = 0; i < amt; i++) {
        result.push(randomWord());
      }
      setOutput(result.join(" "));
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    generateLorem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyText = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silent
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Generate
          </label>
          <select
            value={unitType}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setUnitType(e.target.value as UnitType)}
            className="px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Amount
          </label>
          <input
            type="number"
            min={1}
            max={100}
            value={amount}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
            className="w-32 px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Button onClick={generateLorem}>Generate</Button>
        {output && (
          <Button variant="outline" onClick={copyText}>
            {copied ? "Copied!" : "Copy"}
          </Button>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Output
        </label>
        <textarea
          value={output}
          readOnly
          rows={12}
          className="w-full px-4 py-3 rounded-lg border border-border bg-muted text-foreground resize-none cursor-default font-serif leading-relaxed"
        />
      </div>
    </div>
  );
}
