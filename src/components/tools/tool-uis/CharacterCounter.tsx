"use client";

import { useState, useEffect, useRef, type ChangeEvent } from "react";

const SAMPLE_TEXT = `The quick brown fox jumps over the lazy dog. This classic sentence contains every letter of the alphabet, making it perfect for testing typing skills and character counters.

Character counting is essential for writers, editors, and students. Whether you're crafting a tweet (280 character limit), writing an academic paper, or optimizing content for SEO, knowing exactly how many characters and words you've used is crucial.

Professional writers often rely on character counters to ensure their content meets platform requirements. Social media platforms like Twitter, Instagram captions, and meta descriptions all have specific character limits that can impact visibility and engagement.

Reading time is another important metric. The average adult reads at approximately 200-250 words per minute (WPM). This helps content creators estimate how long it will take their audience to consume their content, allowing for better planning and pacing.`;

interface TimeResult {
  minutes: number;
  seconds: number;
  display: string;
}

function getReadingTime(wordCount: number, wordsPerMinute: number = 200): TimeResult {
  if (wordCount === 0) return { minutes: 0, seconds: 0, display: "0:00" };
  const totalMinutes = wordCount / wordsPerMinute;
  const minutes = Math.floor(totalMinutes);
  const seconds = Math.round((totalMinutes - minutes) * 60);
  return {
    minutes,
    seconds,
    display: `${minutes}:${seconds.toString().padStart(2, "0")}`,
  };
}

function getSpeakingTime(wordCount: number, wordsPerMinute: number = 130): TimeResult {
  return getReadingTime(wordCount, wordsPerMinute);
}

interface StatCard {
  label: string;
  value: number;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export default function CharacterCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

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

  const t = text.trim();
  const hasContent = t.length > 0;

  const charactersWithSpaces = text.length;
  const charactersWithoutSpaces = text.replace(/\s/g, "").length;
  const words = hasContent ? t.split(/\s+/).length : 0;
  const sentences = hasContent
    ? text
        .split(/[.!?]+/)
        .filter((s) => s.trim().length > 0).length
    : 0;
  const paragraphs = hasContent
    ? text
        .split(/\n\s*\n/)
        .filter((p) => p.trim().length > 0).length
    : 0;
  const lines = text.length > 0 ? text.split(/\n/).length : 0;

  const readingTime = getReadingTime(words);
  const speakingTime = getSpeakingTime(words);

  const handleCopy = async () => {
    if (!hasContent) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setText("");
    setCleared(true);
    setTimeout(() => setCleared(false), 2000);
    textAreaRef.current?.focus();
  };

  const handlePasteSample = () => {
    setText(SAMPLE_TEXT);
    textAreaRef.current?.focus();
  };

  const handleRemoveExtraSpaces = () => {
    let processed = text.replace(/ +/g, " ");
    processed = processed.replace(/\n\s+\n/g, "\n\n");
    processed = processed.replace(/^\s+|\s+$/g, "");
    setText(processed);
  };

  const handleRemoveLineBreaks = () => {
    let processed = text.replace(/\n/g, " ");
    processed = processed.replace(/ +/g, " ");
    setText(processed);
  };

  const handleTrim = () => {
    let processed = text.replace(/^\s+|\s+$/g, "");
    processed = processed.replace(/\n\s+/g, "\n");
    setText(processed);
  };

  const bgCard = "bg-[var(--bg-card)]";
  const bgSoft = "bg-[var(--bg-soft)]";
  const borderColor = "border-[var(--border)]";
  const textColor = "text-[var(--text)]";
  const textMuted = "text-[var(--text-muted)]";
  const brandColor = "text-primary";
  const bgBrandLight = "bg-[var(--brand-light)]";

  const statCards: StatCard[] = [
    {
      label: "Characters (with spaces)",
      value: charactersWithSpaces,
      icon: "📊",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      label: "Characters (no spaces)",
      value: charactersWithoutSpaces,
      icon: "📈",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
    },
    {
      label: "Words",
      value: words,
      icon: "📝",
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-800",
    },
    {
      label: "Sentences",
      value: sentences,
      icon: "💬",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
    },
    {
      label: "Paragraphs",
      value: paragraphs,
      icon: "📄",
      color: "text-pink-500",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
      borderColor: "border-pink-200 dark:border-pink-800",
    },
    {
      label: "Lines",
      value: lines,
      icon: "📏",
      color: "text-cyan-500",
      bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
      borderColor: "border-cyan-200 dark:border-cyan-800",
    },
  ];

  return (
    <div className="space-y-6">
      <div className={`${bgCard} rounded-2xl border ${borderColor} shadow-card overflow-hidden`}>
        <div
          className={`px-5 py-3 border-b ${borderColor} flex items-center justify-between`}
          style={{ backgroundColor: isDarkMode ? "#1e3a5f" : "#eff6ff" }}
        >
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className={`ml-2 text-sm font-medium ${textColor}`}>
              character-counter.md
            </span>
          </div>
          <div className={`text-xs ${textMuted}`}>
            {hasContent ? `${words} words · ${charactersWithSpaces} chars` : "Ready to count"}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 p-5 border-b" style={{ borderColor: isDarkMode ? "#2a2a3e" : "#e5e7eb" }}>
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className={`text-center p-4 rounded-xl border transition-all ${stat.bgColor} ${stat.borderColor}`}
            >
              <div className="text-lg mb-1">{stat.icon}</div>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value.toLocaleString()}
              </div>
              <div className={`text-xs ${textMuted} mt-1`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 border-b" style={{ borderColor: isDarkMode ? "#2a2a3e" : "#e5e7eb" }}>
          <div className={`text-center p-4 rounded-xl ${bgSoft} border ${borderColor}`}>
            <div className={`text-xs font-medium ${textMuted} uppercase tracking-wide mb-1`}>
              Reading Time
            </div>
            <div className={`text-2xl font-bold ${brandColor}`}>
              {readingTime.display}
            </div>
            <div className={`text-xs ${textMuted}`}>
              @ 200 WPM (avg.)
            </div>
          </div>
          <div className={`text-center p-4 rounded-xl ${bgSoft} border ${borderColor}`}>
            <div className={`text-xs font-medium ${textMuted} uppercase tracking-wide mb-1`}>
              Speaking Time
            </div>
            <div className="text-2xl font-bold text-purple-500">
              {speakingTime.display}
            </div>
            <div className={`text-xs ${textMuted}`}>
              @ 130 WPM (avg.)
            </div>
          </div>
          <div className={`text-center p-4 rounded-xl ${bgSoft} border ${borderColor}`}>
            <div className={`text-xs font-medium ${textMuted} uppercase tracking-wide mb-1`}>
              Unique Words
            </div>
            <div className="text-2xl font-bold text-green-500">
              {hasContent ? new Set(t.toLowerCase().split(/\s+/).filter((w) => w.length > 0)).size : 0}
            </div>
            <div className={`text-xs ${textMuted}`}>
              distinct words
            </div>
          </div>
          <div className={`text-center p-4 rounded-xl ${bgSoft} border ${borderColor}`}>
            <div className={`text-xs font-medium ${textMuted} uppercase tracking-wide mb-1`}>
              Avg. Word Length
            </div>
            <div className="text-2xl font-bold text-blue-500">
              {words > 0 && charactersWithoutSpaces > 0 ? (charactersWithoutSpaces / words).toFixed(1) : "0.0"}
            </div>
            <div className={`text-xs ${textMuted}`}>
              characters per word
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h3 className={`text-sm font-semibold ${textColor}`}>
              Your Text
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handlePasteSample}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${bgSoft} ${textColor} border ${borderColor} hover:${bgBrandLight}`}
              >
                Sample Text
              </button>
              <button
                onClick={handleCopy}
                disabled={!hasContent}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all border ${borderColor} disabled:opacity-40 disabled:cursor-not-allowed ${
                  copied
                    ? `${bgBrandLight} ${brandColor}`
                    : `${bgSoft} ${textColor} hover:${bgBrandLight}`
                }`}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={handleClear}
                disabled={!hasContent}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all border ${borderColor} ${bgSoft} ${textColor} hover:bg-red-50 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {cleared ? "Cleared!" : "Clear"}
              </button>
            </div>
          </div>

          <textarea
            ref={textAreaRef}
            value={text}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
            placeholder="Start typing or paste your text here. All counts update in real-time..."
            rows={10}
            className={`w-full p-4 text-base font-serif leading-relaxed rounded-xl border-2 ${borderColor} focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none ${textColor}`}
            style={{ backgroundColor: isDarkMode ? "#0d0d14" : "#fafafa", minHeight: "240px" }}
            spellCheck={false}
          />

          <div className="mt-4">
            <h4 className={`text-xs font-semibold ${textMuted} uppercase tracking-wide mb-2`}>
              Text Cleanup Tools
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleRemoveExtraSpaces}
                disabled={!hasContent}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all border ${borderColor} ${bgSoft} ${textColor} hover:${bgBrandLight} disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                Remove Extra Spaces
              </button>
              <button
                onClick={handleRemoveLineBreaks}
                disabled={!hasContent}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all border ${borderColor} ${bgSoft} ${textColor} hover:${bgBrandLight} disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                Remove Line Breaks
              </button>
              <button
                onClick={handleTrim}
                disabled={!hasContent}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all border ${borderColor} ${bgSoft} ${textColor} hover:${bgBrandLight} disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                Trim Whitespace
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`${bgCard} rounded-xl border ${borderColor} p-5`}>
          <h4 className={`text-sm font-semibold ${textColor} mb-3 flex items-center gap-2`}>
            <span>📖</span> Reading Time Guide
          </h4>
          <ul className={`space-y-2 text-sm ${textMuted}`}>
            <li className="flex justify-between">
              <span>200 WPM (Average adult)</span>
              <span className={brandColor}>Standard</span>
            </li>
            <li className="flex justify-between">
              <span>250 WPM (Fast reader)</span>
              <span className="text-blue-500">Fast</span>
            </li>
            <li className="flex justify-between">
              <span>300+ WPM (Speed reader)</span>
              <span className="text-green-500">Expert</span>
            </li>
          </ul>
        </div>

        <div className={`${bgCard} rounded-xl border ${borderColor} p-5`}>
          <h4 className={`text-sm font-semibold ${textColor} mb-3 flex items-center gap-2`}>
            <span>🔤</span> Character Limits
          </h4>
          <ul className={`space-y-2 text-sm ${textMuted}`}>
            <li className="flex justify-between">
              <span>Twitter / X</span>
              <span className={brandColor}>280 chars</span>
            </li>
            <li className="flex justify-between">
              <span>Meta Description</span>
              <span className="text-blue-500">150-160 chars</span>
            </li>
            <li className="flex justify-between">
              <span>Google Title</span>
              <span className="text-green-500">50-60 chars</span>
            </li>
          </ul>
        </div>

        <div className={`${bgCard} rounded-xl border ${borderColor} p-5`}>
          <h4 className={`text-sm font-semibold ${textColor} mb-3 flex items-center gap-2`}>
            <span>📊</span> What Counts?
          </h4>
          <ul className={`space-y-2 text-sm ${textMuted}`}>
            <li><strong className={textColor}>Words:</strong> Separated by whitespace</li>
            <li><strong className={textColor}>Sentences:</strong> End with . ! ?</li>
            <li><strong className={textColor}>Paragraphs:</strong> Separated by blank lines</li>
            <li><strong className={textColor}>Lines:</strong> Each newline counts</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
