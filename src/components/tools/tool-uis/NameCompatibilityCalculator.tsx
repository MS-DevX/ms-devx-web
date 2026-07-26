"use client";

import { useState, useEffect, useCallback } from "react";
import { useShare } from "@/hooks/useShare";

function cleanName(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z]/g, "");
}

function letterValue(char: string): number {
  return char.charCodeAt(0) - 96;
}

function getNumerologyValue(name: string): number {
  const cleaned = cleanName(name);
  if (!cleaned) return 0;

  let sum = 0;
  for (let i = 0; i < cleaned.length; i++) {
    sum += letterValue(cleaned[i]);
  }

  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum
      .toString()
      .split("")
      .reduce<number>((a, b) => a + parseInt(b), 0);
  }

  return sum;
}

function getLoveScore(name1: string, name2: string): number | null {
  const n1 = cleanName(name1);
  const n2 = cleanName(name2);

  if (!n1 || !n2) return null;

  const seed = n1.length + n2.length + n1.charCodeAt(0) + n2.charCodeAt(0);

  const num1 = getNumerologyValue(name1);
  const num2 = getNumerologyValue(name2);

  let baseScore = 50;

  if (num1 === num2) baseScore += 15;
  if (Math.abs(num1 - num2) === 1) baseScore += 10;
  if (Math.abs(num1 - num2) === 2) baseScore += 8;
  if (Math.abs(num1 - num2) === 3) baseScore += 5;
  if (num1 === 11 || num1 === 22) baseScore += 3;
  if (num2 === 11 || num2 === 22) baseScore += 3;

  if (n1[0] === n2[0]) baseScore += 5;
  if (n1[n1.length - 1] === n2[n2.length - 1]) baseScore += 5;
  if (n1.length === n2.length) baseScore += 3;

  const commonLetters = new Set([...n1].filter((c) => n2.includes(c))).size;
  baseScore += Math.min(commonLetters * 2, 12);

  const pseudoRandom = ((seed * 13 + 7) % 21) - 10;
  baseScore += pseudoRandom;

  return Math.max(10, Math.min(99, baseScore));
}

interface Category {
  label: string;
  color: string;
  bg: string;
}

function getCategory(score: number): Category {
  if (score >= 90) return { label: "🔥 Divine Connection", color: "#e63946", bg: "#fff1f2" };
  if (score >= 80) return { label: "💫 Soulmates", color: "#ff6b6b", bg: "#fff5f5" };
  if (score >= 70) return { label: "💕 Great Match", color: "#f4a261", bg: "#fff8f0" };
  if (score >= 60) return { label: "😊 Good Chemistry", color: "#2a9d8f", bg: "#f0f9f8" };
  if (score >= 50) return { label: "🤝 Growing Potential", color: "#219ebc", bg: "#f0f8ff" };
  if (score >= 40) return { label: "🌱 Opposites Attract", color: "#8ecae6", bg: "#f5f9ff" };
  return { label: "⚡ It's Complicated", color: "#6c757d", bg: "#f8f9fa" };
}

function getSummary(name1: string, name2: string, score: number): string {
  const clean1 = cleanName(name1);
  const clean2 = cleanName(name2);
  const num1 = getNumerologyValue(name1);
  const num2 = getNumerologyValue(name2);

  const summaries: Record<string, string[]> = {
    high: [
      `The stars are truly aligned for ${name1} and ${name2}! With a numerology match of ${num1} & ${num2}, this connection goes beyond the ordinary.`,
      `${name1} and ${name2} share something special. The cosmic energy between your numbers (${num1} and ${num2}) suggests a bond that can last a lifetime.`,
      `Unbelievable chemistry! ${name1}'s energy (${num1}) and ${name2}'s vibe (${num2}) create a perfect harmony that others will notice.`,
    ],
    mid: [
      `${name1} and ${name2} have genuine potential. Your numbers ${num1} and ${num2} suggest that with patience and understanding, something beautiful can grow.`,
      `There's a spark between ${name1} and ${name2}! Numerology ${num1} meets ${num2} — this relationship will teach you both valuable lessons.`,
      `${name1} (${num1}) and ${name2} (${num2}) have interesting dynamics at play. Your differences are actually your greatest strengths!`,
    ],
    low: [
      `${name1} and ${name2} — your story is still being written. Numbers ${num1} and ${num2} suggest this connection will defy expectations in the most interesting ways.`,
      `Every great love story has its chapters. For ${name1} (${num1}) and ${name2} (${num2}), the journey matters more than the destination.`,
      `${name1} and ${name2} share a unique bond. Your numerology ${num1} & ${num2} indicates this is a connection of growth, learning, and unexpected surprises.`,
    ],
  };

  const bucket = score >= 70 ? "high" : score >= 50 ? "mid" : "low";
  const index = (clean1.length + clean2.length) % summaries[bucket].length;
  return summaries[bucket][index];
}

interface Trait {
  label: string;
  value: number;
  icon: string;
}

function getTraits(score: number): Trait[] {
  if (score >= 85) {
    return [
      { label: "Romantic Spark", value: 95, icon: "❤️" },
      { label: "Communication", value: 90, icon: "💬" },
      { label: "Trust Level", value: 92, icon: "🤝" },
      { label: "Shared Values", value: 88, icon: "🎯" },
      { label: "Passion", value: 94, icon: "🔥" },
    ];
  }
  if (score >= 70) {
    return [
      { label: "Romantic Spark", value: 78, icon: "❤️" },
      { label: "Communication", value: 82, icon: "💬" },
      { label: "Trust Level", value: 80, icon: "🤝" },
      { label: "Shared Values", value: 75, icon: "🎯" },
      { label: "Passion", value: 77, icon: "🔥" },
    ];
  }
  if (score >= 55) {
    return [
      { label: "Romantic Spark", value: 62, icon: "❤️" },
      { label: "Communication", value: 65, icon: "💬" },
      { label: "Trust Level", value: 58, icon: "🤝" },
      { label: "Shared Values", value: 60, icon: "🎯" },
      { label: "Passion", value: 55, icon: "🔥" },
    ];
  }
  return [
    { label: "Romantic Spark", value: 45, icon: "❤️" },
    { label: "Communication", value: 42, icon: "💬" },
    { label: "Trust Level", value: 48, icon: "🤝" },
    { label: "Shared Values", value: 38, icon: "🎯" },
    { label: "Passion", value: 50, icon: "🔥" },
  ];
}

function stripEmojis(str: string): string {
  return str.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}]/gu, "").trim();
}

function buildShareUrl(name1: string, name2: string, score: number, category: string): string {
  const params = new URLSearchParams({
    name1: name1.trim(),
    name2: name2.trim(),
    score: String(score),
    category: stripEmojis(category),
  });
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}

interface ResultData {
  score: number;
  name1: string;
  name2: string;
  category: Category;
  summary: string;
  traits: Trait[];
  num1: number;
  num2: number;
}

export default function NameCompatibilityCalculator() {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [result, setResult] = useState<ResultData | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [showTraits, setShowTraits] = useState(false);
  const {
    share: _hookShare,
    shareWhatsApp: hookWhatsApp,
    shareTelegram,
    buildToolResultMessage,
  } = useShare();

  const calculate = useCallback(() => {
    if (!name1.trim() || !name2.trim()) return;

    setIsAnimating(true);
    setShowTraits(false);
    setDisplayScore(0);

    const score = getLoveScore(name1, name2)!;

    let current = 0;
    const target = score;
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;

    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(interval);
        setIsAnimating(false);
        setShowTraits(true);
      }
      setDisplayScore(Math.floor(current));
    }, duration / steps);

    const category = getCategory(score);
    const summary = getSummary(name1, name2, score);
    const traits = getTraits(score);

    setResult({
      score,
      name1: name1.trim(),
      name2: name2.trim(),
      category,
      summary,
      traits,
      num1: getNumerologyValue(name1),
      num2: getNumerologyValue(name2),
    });
  }, [name1, name2]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlName1 = params.get("name1");
    const urlName2 = params.get("name2");

    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (urlName1) setName1(urlName1);
    if (urlName2) setName2(urlName2);
  }, []);

  const handleShare = async () => {
    if (!result) return;

    const shareUrl = buildShareUrl(result.name1, result.name2, result.score, result.category.label);
    const text = buildToolResultMessage("Name Compatibility Calculator", "compatibility score", `${result.score}%`, shareUrl);

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Name Compatibility Result",
          text,
          url: shareUrl,
        });
        setShareError(null);
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          handleCopyText();
        }
      }
    } else {
      handleCopyText();
    }
  };

  const fallbackCopyText = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch {
      document.body.removeChild(textArea);
      return false;
    }
  };

  const handleCopyText = async () => {
    if (!result) return;
    const shareUrl = buildShareUrl(result.name1, result.name2, result.score, result.category.label);
    const text = buildToolResultMessage("Name Compatibility Calculator", "compatibility score", `${result.score}%`, shareUrl);

    try {
      let success = false;

      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(text);
          success = true;
        } catch {
          success = fallbackCopyText(text);
        }
      } else {
        success = fallbackCopyText(text);
      }

      if (success) {
        setCopiedText(true);
        setCopiedUrl(false);
        setShareError(null);
        setTimeout(() => setCopiedText(false), 2000);
      } else {
        setShareError("Could not copy to clipboard. Please try selecting and copying manually.");
      }
    } catch {
      setShareError("Could not copy to clipboard. Please try selecting and copying manually.");
    }
  };

  const handleWhatsApp = () => {
    if (!result) return;
    const shareUrl = buildShareUrl(result.name1, result.name2, result.score, result.category.label);
    const text = buildToolResultMessage("Name Compatibility Calculator", "compatibility score", `${result.score}%`, shareUrl);
    hookWhatsApp(text);
  };

  const handleTelegram = () => {
    if (!result) return;
    const shareUrl = buildShareUrl(result.name1, result.name2, result.score, result.category.label);
    const text = buildToolResultMessage("Name Compatibility Calculator", "compatibility score", `${result.score}%`, shareUrl);
    shareTelegram(text);
  };

  const handleCopyUrl = async () => {
    if (!result) return;
    const url = buildShareUrl(result.name1, result.name2, result.score, result.category.label);

    try {
      let success = false;

      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(url);
          success = true;
        } catch {
          success = fallbackCopyText(url);
        }
      } else {
        success = fallbackCopyText(url);
      }

      if (success) {
        setCopiedUrl(true);
        setCopiedText(false);
        setShareError(null);
        setTimeout(() => setCopiedUrl(false), 2000);
      } else {
        setShareError("Could not copy to clipboard. Please try selecting and copying manually.");
      }
    } catch {
      setShareError("Could not copy to clipboard. Please try selecting and copying manually.");
    }
  };

  const canCalculate = name1.trim().length > 0 && name2.trim().length > 0;

  return (
    <div>
      {/* Disclaimer Banner */}
      <div className="mb-6 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-center text-xs text-amber-700 dark:text-amber-300">
        ✨ <strong>Disclaimer:</strong> This tool uses fun name numerology and character algorithms for <em>entertainment & novelty purposes only</em>. It is not a scientific or psychological calculation!
      </div>

      {/* Heart Animation Container */}
      <div className="text-center mb-8">
        <div
          className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 transition-all duration-500 ${
            result
              ? "bg-primary/10"
              : "bg-muted"
          }`}
          style={result ? {
            animation: "heartPulse 1.5s ease-in-out infinite",
          } : {}}
        >
          <span className="text-5xl">
            {result ? "💕" : "💘"}
          </span>
        </div>
      </div>

      {/* Names Input */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 items-end">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Your Name
          </label>
          <input
            type="text"
            value={name1}
            onChange={(e) => setName1(e.target.value)}
            placeholder="Enter name..."
            className="w-full px-5 py-4 rounded-xl border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background text-lg"
            disabled={isAnimating}
          />
        </div>

        <div className="text-center">
          <span className="text-4xl">💞</span>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Partner&apos;s Name
          </label>
          <input
            type="text"
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            placeholder="Enter name..."
            className="w-full px-5 py-4 rounded-xl border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background text-lg"
            disabled={isAnimating}
          />
        </div>
      </div>

      {/* Calculate Button */}
      <div className="text-center mb-8">
        <button
          onClick={calculate}
          disabled={!canCalculate || isAnimating}
          className="px-10 py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-primary-dark transition-all shadow-[0_4px_14px_rgba(30,64,175,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnimating ? "✨ Calculating compatibility..." : "🔮 Check Compatibility"}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Glowing Score Display */}
          <div
            className="text-center p-8 rounded-2xl border-2 transition-all duration-500"
            style={{
              borderColor: result.category.color,
              backgroundColor: result.category.bg,
            boxShadow: result.score >= 80
              ? `0 0 60px ${result.category.color}45`
              : result.score >= 60
                ? `0 0 40px ${result.category.color}30`
                : `0 0 20px ${result.category.color}15`,
            }}
          >
            <div className="text-lg text-muted-foreground mb-2">
              {result.name1} & {result.name2}
            </div>

            <div className="relative inline-block">
              <div
                className="text-7xl md:text-8xl font-black"
                style={{
                  color: result.category.color,
                  textShadow: `0 0 30px ${result.category.color}40`,
                }}
              >
                {displayScore}%
              </div>
            </div>

            <div
              className="mt-3 inline-block px-4 py-1.5 rounded-full font-semibold text-base"
              style={{
                color: result.category.color,
                backgroundColor: "white",
                border: `2px solid ${result.category.color}`,
              }}
            >
              {result.category.label}
            </div>

            {/* Numerology Numbers */}
            <div className="mt-4 flex justify-center gap-8 text-sm text-muted-foreground">
              <span>
                <span className="font-bold text-foreground">{result.name1}:</span> Numerology #{result.num1}
              </span>
              <span className="text-primary">✦</span>
              <span>
                <span className="font-bold text-foreground">{result.name2}:</span> Numerology #{result.num2}
              </span>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-background rounded-xl border border-border p-6 shadow-card">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <span>✨</span> The Reading
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {result.summary}
            </p>
          </div>

          {/* Traits with Animated Progress Bars */}
          {showTraits && (
            <div className="bg-background rounded-xl border border-border p-6 shadow-card">
              <h3 className="font-semibold text-foreground mb-5 flex items-center gap-2">
                <span>📊</span> Compatibility Breakdown
              </h3>

              <div className="space-y-5">
                {result.traits.map((trait, idx) => (
                  <TraitBar
                    key={idx}
                    trait={trait}
                    delay={idx * 150}
                    primaryColor={result.category.color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Entertainment Disclaimer */}
          <div className="text-center mb-6">
            <p className="text-xs text-muted-foreground opacity-60">
              ⚠️ For entertainment purposes only. Real relationships are built on communication, respect, and mutual growth.
            </p>
          </div>

          {/* Share Section */}
          <div className="text-center">
            <h3 className="font-semibold text-foreground mb-4">✨ Share Your Result</h3>

            {/* Primary Share Button */}
            <button
              onClick={handleShare}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-[0_4px_14px_rgba(30,64,175,0.25)] mb-4"
            >
              📤 Share Result
            </button>

            {/* Secondary Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <button
                onClick={handleCopyText}
                className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                  copiedText
                    ? "bg-green-50 text-green-700 border-2 border-green-200"
                    : "bg-background text-foreground border-2 border-border hover:border-primary hover:text-primary"
                }`}
              >
                {copiedText ? "✓ Copied!" : "📋 Copy Text"}
              </button>

              <button
                onClick={handleWhatsApp}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all text-white hover:opacity-90"
                style={{ backgroundColor: "#25D366" }}
              >
                💬 WhatsApp
              </button>

              <button
                onClick={handleTelegram}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all text-white hover:opacity-90"
                style={{ backgroundColor: "#0088cc" }}
              >
                ✈️ Telegram
              </button>

              <button
                onClick={handleCopyUrl}
                className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                  copiedUrl
                    ? "bg-green-50 text-green-700 border-2 border-green-200"
                    : "bg-background text-foreground border-2 border-border hover:border-primary hover:text-primary"
                }`}
              >
                {copiedUrl ? "✓ Copied!" : "🔗 Copy Link"}
              </button>
            </div>

            {/* Feedback Messages */}
            {copiedText && (
              <p className="text-sm text-green-600 mt-3 font-semibold">
                ✓ Result text copied to clipboard!
              </p>
            )}
            {copiedUrl && (
              <p className="text-sm text-green-600 mt-3 font-semibold">
                ✓ Link copied to clipboard!
              </p>
            )}
            {shareError && (
              <p className="text-sm text-red-600 mt-3 font-semibold">
                ⚠️ {shareError}
              </p>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes barFill {
          from { width: 0%; }
        }
      `}</style>
    </div>
  );
}

interface TraitBarProps {
  trait: Trait;
  delay: number;
  primaryColor: string;
}

function TraitBar({ trait, delay, primaryColor }: TraitBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(trait.value);
    }, delay);

    return () => clearTimeout(timer);
  }, [trait.value, delay]);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-foreground text-sm flex items-center gap-1.5">
          <span>{trait.icon}</span>
          {trait.label}
        </span>
        <span className="font-bold text-sm" style={{ color: primaryColor }}>
          {trait.value}%
        </span>
      </div>
      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${primaryColor}dd, ${primaryColor})`,
          }}
        />
      </div>
    </div>
  );
}
