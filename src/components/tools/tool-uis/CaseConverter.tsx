"use client";

import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";

type CaseType = "lower" | "upper" | "title" | "sentence" | "toggle";

const caseOptions: { id: CaseType; label: string }[] = [
  { id: "lower", label: "lowercase" },
  { id: "upper", label: "UPPERCASE" },
  { id: "title", label: "Title Case" },
  { id: "sentence", label: "Sentence case" },
  { id: "toggle", label: "tOGGLE cASE" },
];

function convertTo(text: string, caseType: CaseType): string {
  switch (caseType) {
    case "lower":
      return text.toLowerCase();
    case "upper":
      return text.toUpperCase();
    case "title":
      return text.replace(/\w\S*/g, (w) => {
        return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
      });
    case "sentence":
      return text.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => {
        return c.toUpperCase();
      });
    case "toggle":
      return text.replace(/[a-zA-Z]/g, (c) => {
        return c === c.toLowerCase() ? c.toUpperCase() : c.toLowerCase();
      });
    default:
      return text;
  }
}

export default function CaseConverter() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [currentCase, setCurrentCase] = useState<CaseType>("lower");

  const handleCaseChange = (caseType: CaseType) => {
    setCurrentCase(caseType);
    setOutputText(convertTo(inputText, caseType));
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setInputText(newText);
    setOutputText(convertTo(newText, currentCase));
  };

  const clearText = () => {
    setInputText("");
    setOutputText("");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
    } catch {
      // silent
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {caseOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleCaseChange(option.id)}
            className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              currentCase === option.id
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-border"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Input
          </label>
          <textarea
            value={inputText}
            onChange={handleInputChange}
            placeholder="Enter or paste your text here..."
            rows={10}
            className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Output
          </label>
          <textarea
            value={outputText}
            readOnly
            rows={10}
            className="w-full px-4 py-3 rounded-lg border border-border bg-muted text-foreground resize-none cursor-default"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-6">
        <Button variant="secondary" onClick={clearText}>
          Clear All
        </Button>
        {outputText && (
          <Button variant="outline" onClick={copyToClipboard}>
            Copy to Clipboard
          </Button>
        )}
      </div>
    </div>
  );
}
