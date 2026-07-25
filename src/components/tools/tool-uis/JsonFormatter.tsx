"use client";

import { useState, useEffect, useCallback, useRef, useMemo, type ChangeEvent } from "react";

const sampleJson = `{
  "name": "MS DevX Tools",
  "version": 1.0,
  "features": ["calculators", "converters", "utilities"],
  "isActive": true,
  "config": {
    "theme": "dark",
    "maxResults": 100,
    "settings": null
  }
}`;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

interface SyntaxColors {
  key: string;
  string: string;
  number: string;
  boolean: string;
  null: string;
  bracket: string;
  colon: string;
  comma: string;
}

function syntaxHighlight(json: string, isDarkMode: boolean): string {
  if (!json) return "";

  const colors: SyntaxColors = isDarkMode
    ? {
        key: "#9cdcfe",
        string: "#ce9178",
        number: "#b5cea8",
        boolean: "#569cd6",
        null: "#569cd6",
        bracket: "#ffd700",
        colon: "#d4d4d4",
        comma: "#d4d4d4",
      }
    : {
        key: "#0451a5",
        string: "#a31515",
        number: "#098658",
        boolean: "#0000ff",
        null: "#0000ff",
        bracket: "#800000",
        colon: "#000000",
        comma: "#000000",
      };

  let escaped = escapeHtml(json);

  escaped = escaped.replace(
    /"([^"\\]*(\\.[^"\\]*)*)":\s*/g,
    `<span style="color: ${colors.key}">"$1"</span><span style="color: ${colors.colon}">: </span>`
  );

  escaped = escaped.replace(
    /:\s*"([^"\\]*(\\.[^"\\]*)*)"/g,
    `: <span style="color: ${colors.string}">"$1"</span>`
  );

  escaped = escaped.replace(
    /:\s*(-?\d+\.?\d*([eE][+-]?\d+)?)/g,
    `: <span style="color: ${colors.number}">$1</span>`
  );

  escaped = escaped.replace(
    /:\s*(true|false)/gi,
    `: <span style="color: ${colors.boolean}">$1</span>`
  );

  escaped = escaped.replace(
    /:\s*(null)/gi,
    `: <span style="color: ${colors.null}">$1</span>`
  );

  escaped = escaped.replace(
    /(\{|\}|\[|\])/g,
    `<span style="color: ${colors.bracket}">$1</span>`
  );

  return escaped;
}

interface ValidationError {
  message: string;
  line: number | null;
}

interface FormatResult {
  output: string;
  validationError: ValidationError | null;
  isValid: boolean;
}

export default function JsonFormatter() {
  const [input, setInput] = useState(sampleJson);
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState(2);
  const outputRef = useRef<HTMLPreElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const validateJson = useCallback((str: string) => {
    if (!str.trim()) {
      return null;
    }
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  }, []);

  function extractLineNumber(errorMessage: string, jsonStr: string): number | null {
    const match = errorMessage.match(/position (\d+)/);
    if (match) {
      const position = parseInt(match[1]);
      const lines = jsonStr.substring(0, position).split("\n");
      return lines.length;
    }
    return null;
  }

  const { output, validationError, isValid } = useMemo<FormatResult>(() => {
    if (!input.trim()) {
      return { output: "", validationError: null, isValid: true };
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indentSize);
      return { output: formatted, validationError: null, isValid: true };
    } catch (e) {
      const error = e as Error;
      return {
        output: "",
        validationError: {
          message: error.message,
          line: extractLineNumber(error.message, input),
        },
        isValid: false,
      };
    }
  }, [input, indentSize]);

  const handleMinify = () => {
    const parsed = validateJson(input);
    if (parsed !== null) {
      const minified = JSON.stringify(parsed);
      setInput(minified);
    }
  };

  const handleBeautify = () => {
    const parsed = validateJson(input);
    if (parsed !== null) {
      const beautified = JSON.stringify(parsed, null, indentSize);
      setInput(beautified);
    }
  };

  const handleCopy = async () => {
    const textToCopy = output || input;
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setInput("");
  };

  const handleSample = () => {
    setInput(sampleJson);
  };

  const bgCard = "bg-[var(--bg-card)]";
  const bgSoft = "bg-[var(--bg-soft)]";
  const borderColor = "border-[var(--border)]";
  const textColor = "text-[var(--text)]";
  const textMuted = "text-[var(--text-muted)]";
  const editorBg = isDarkMode ? "#1e1e1e" : "#ffffff";
  const editorBorder = isDarkMode ? "#3c3c3c" : "#e5e7eb";
  const lineNumbersColor = isDarkMode ? "#858585" : "#9ca3af";

  return (
    <div className="space-y-4">
      <div className={`${bgCard} rounded-2xl border ${borderColor} shadow-card overflow-hidden`}>
        <div
          className={`flex items-center justify-between px-4 py-2 border-b ${borderColor}`}
          style={{ backgroundColor: isDarkMode ? "#252526" : "#f3f4f6" }}
        >
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className={`ml-2 text-sm font-medium ${textMuted}`}>
              json-formatter.json
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-2 text-xs ${textMuted}`}>
              <span>Indent:</span>
              <select
                value={indentSize}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setIndentSize(parseInt(e.target.value))}
                className={`px-2 py-1 rounded text-sm border ${borderColor} focus:outline-none focus:ring-1 focus:ring-primary`}
                style={{ backgroundColor: editorBg, color: isDarkMode ? "#d4d4d4" : "#1f2937" }}
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={8}>8 spaces</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x" style={{ borderColor: editorBorder }}>
          <div className="flex flex-col">
            <div
              className={`flex items-center justify-between px-3 py-2 border-b ${borderColor}`}
              style={{ backgroundColor: isDarkMode ? "#2d2d2d" : "#f9fafb" }}
            >
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${textColor}`}>Input</span>
                {isValid ? (
                  <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Valid JSON
                  </span>
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    Invalid
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleSample}
                  className={`px-2 py-1 text-xs rounded transition-all hover:opacity-80 ${textMuted} hover:${textColor}`}
                  title="Load sample JSON"
                >
                  Sample
                </button>
                <button
                  onClick={handleClear}
                  className={`px-2 py-1 text-xs rounded transition-all hover:opacity-80 ${textMuted} hover:${textColor}`}
                  title="Clear all"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="relative" style={{ minHeight: "320px" }}>
              <textarea
                value={input}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                placeholder="Paste your JSON here..."
                className="w-full h-full min-h-[320px] p-3 font-mono text-sm resize-none focus:outline-none"
                style={{ backgroundColor: editorBg, color: isDarkMode ? "#d4d4d4" : "#1f2937", border: "none", lineHeight: "1.6", tabSize: indentSize }}
                spellCheck={false}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div
              className={`flex items-center justify-between px-3 py-2 border-b ${borderColor}`}
              style={{ backgroundColor: isDarkMode ? "#2d2d2d" : "#f9fafb" }}
            >
              <span className={`text-sm font-semibold ${textColor}`}>Output</span>
              <button
                onClick={handleCopy}
                disabled={!output && !input}
                className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  copied
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : `${textMuted} hover:${textColor}`
                }`}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div
              className="relative overflow-auto"
              style={{ minHeight: "320px", backgroundColor: editorBg }}
            >
              {output ? (
                <pre
                  ref={outputRef}
                  className="p-3 font-mono text-sm whitespace-pre-wrap"
                  style={{ lineHeight: "1.6", color: isDarkMode ? "#d4d4d4" : "#1f2937" }}
                  dangerouslySetInnerHTML={{ __html: syntaxHighlight(output, isDarkMode) }}
                />
              ) : input.trim() && !isValid ? (
                <div className="p-3">
                  <p className="text-sm opacity-50 italic" style={{ color: lineNumbersColor }}>
                    Fix JSON errors to see formatted output...
                  </p>
                </div>
              ) : (
                <div className="p-3">
                  <p className="text-sm opacity-50 italic" style={{ color: lineNumbersColor }}>
                    Formatted output will appear here...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {validationError && (
          <div
            className={`px-4 py-3 border-t ${borderColor}`}
            style={{ backgroundColor: isDarkMode ? "rgba(248, 113, 113, 0.1)" : "#fef2f2" }}
          >
            <div className="flex items-start gap-2">
              <span className="text-red-500 text-lg">!</span>
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  JSON Validation Error
                </p>
                <p className="text-sm text-red-500 dark:text-red-300 mt-1">
                  {validationError.message}
                </p>
                {validationError.line && (
                  <p className="text-xs mt-1" style={{ color: lineNumbersColor }}>
                    Near line {validationError.line}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div
          className={`flex flex-wrap items-center gap-2 px-4 py-3 border-t ${borderColor}`}
          style={{ backgroundColor: isDarkMode ? "#007acc" : "#3b82f6" }}
        >
          <button
            onClick={handleBeautify}
            disabled={!isValid || !input.trim()}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed bg-white/10 hover:bg-white/20"
          >
            Beautify
          </button>
          <button
            onClick={handleMinify}
            disabled={!isValid || !input.trim()}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed bg-white/10 hover:bg-white/20"
          >
            Minify
          </button>
          <button
            onClick={handleValidate}
            disabled={!input.trim()}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed bg-white/10 hover:bg-white/20"
          >
            Validate
          </button>
          <div className="flex-1"></div>
          <button
            onClick={handleCopy}
            disabled={!output && !input}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              copied
                ? "bg-green-500 text-white"
                : "text-white bg-white/10 hover:bg-white/20"
            }`}
          >
            {copied ? "Copied!" : "Copy Output"}
          </button>
        </div>
      </div>

      <div className={`${bgCard} rounded-xl border ${borderColor} p-5`}>
        <h3 className={`text-sm font-semibold ${textColor} mb-3`}>
          Quick Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className={`p-3 rounded-lg ${bgSoft}`}>
            <p className={`font-medium ${textColor} mb-1`}>Auto-Formatting</p>
            <p className={textMuted}>
              Your JSON is automatically formatted and validated as you type. No need to click buttons!
            </p>
          </div>
          <div className={`p-3 rounded-lg ${bgSoft}`}>
            <p className={`font-medium ${textColor} mb-1`}>Syntax Highlighting</p>
            <p className={textMuted}>
              Output is color-coded: keys in blue, strings in orange, numbers in green, booleans/null in purple.
            </p>
          </div>
          <div className={`p-3 rounded-lg ${bgSoft}`}>
            <p className={`font-medium ${textColor} mb-1`}>Indentation Control</p>
            <p className={textMuted}>
              Use the indent selector to switch between 2, 4, or 8 spaces for your preferred formatting style.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function handleValidate(): void {
  // validation is automatic via useMemo; this button exists for UX
}
