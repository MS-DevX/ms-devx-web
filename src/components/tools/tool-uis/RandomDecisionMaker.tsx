"use client";
import { useState, useRef, useCallback } from "react";

interface Mode {
  id: string;
  label: string;
  icon: string;
}

const MODES: Mode[] = [
  { id: "yesno", label: "Yes / No", icon: "🤔" },
  { id: "coin", label: "Coin Flip", icon: "🪙" },
  { id: "custom", label: "Custom Options", icon: "📝" },
  { id: "wheel", label: "Picker Wheel", icon: "🎡" },
];

const WHEEL_COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4",
  "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F",
  "#BB8FCE", "#85C1E9", "#F8B500", "#82E0AA",
];

function getWheelColors(count: number): string[] {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(WHEEL_COLORS[i % WHEEL_COLORS.length]);
  }
  return colors;
}

function createWheelPath(startAngle: number, endAngle: number, radius: number): string {
  const startRadians = (startAngle - 90) * (Math.PI / 180);
  const endRadians = (endAngle - 90) * (Math.PI / 180);

  const x1 = radius + radius * Math.cos(startRadians);
  const y1 = radius + radius * Math.sin(startRadians);
  const x2 = radius + radius * Math.cos(endRadians);
  const y2 = radius + radius * Math.sin(endRadians);

  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return `M ${radius},${radius} L ${x1},${y1} A ${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`;
}

function getTextPosition(angle: number, radius: number) {
  const radians = (angle - 90) * (Math.PI / 180);
  const textRadius = radius * 0.65;
  return {
    x: radius + textRadius * Math.cos(radians),
    y: radius + textRadius * Math.sin(radians),
    rotation: angle,
  };
}

export default function RandomDecisionMaker() {
  const [activeMode, setActiveMode] = useState("yesno");
  const [isAnimating, setIsAnimating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const [customOptions, setCustomOptions] = useState(["Pizza", "Burger", "Sushi"]);
  const [newOptionText, setNewOptionText] = useState("");

  const [wheelRotation, setWheelRotation] = useState(0);
  const [wheelOptions, setWheelOptions] = useState([
    "Pizza", "Burger", "Sushi", "Taco", "Pasta", "Salad"
  ]);
  const [newWheelText, setNewWheelText] = useState("");

  const _audioRef = useRef(null);
  const resultTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const playClickSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch {
    }
  }, []);

  const playWinSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

      [440, 554, 659, 880].forEach((freq, i) => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.frequency.value = freq;
        oscillator.type = "sine";

        const startTime = audioCtx.currentTime + i * 0.08;
        gainNode.gain.setValueAtTime(0.1, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.15);
      });
    } catch {
    }
  }, []);

  const runYesNoAnimation = useCallback(() => {
    if (isAnimating) return;

    setIsAnimating(true);
    setShowResult(false);
    setResult(null);

    let count = 0;
    const maxCount = 12;
    const options = ["YES", "NO", "MAYBE?", "YES", "NO", "ASK AGAIN"];

    const interval = setInterval(() => {
      playClickSound();
      setResult(options[Math.floor(Math.random() * options.length)]);
      count++;

      if (count >= maxCount) {
        clearInterval(interval);
        const finalAnswer = Math.random() > 0.5 ? "YES" : "NO";
        setResult(finalAnswer);
        setShowResult(true);
        setIsAnimating(false);
        playWinSound();
      }
    }, 150);
  }, [isAnimating, playClickSound, playWinSound]);

  const runCoinFlip = useCallback(() => {
    if (isAnimating) return;

    setIsAnimating(true);
    setShowResult(false);
    setResult(null);

    let count = 0;
    const maxCount = 10;

    const interval = setInterval(() => {
      playClickSound();
      setResult(count % 2 === 0 ? "HEADS" : "TAILS");
      count++;

      if (count >= maxCount) {
        clearInterval(interval);
        const finalResult = Math.random() > 0.5 ? "HEADS" : "TAILS";
        setResult(finalResult);
        setShowResult(true);
        setIsAnimating(false);
        playWinSound();
      }
    }, 200);
  }, [isAnimating, playClickSound, playWinSound]);

  const runCustomPicker = useCallback(() => {
    if (isAnimating || customOptions.length === 0) return;

    setIsAnimating(true);
    setShowResult(false);
    setResult(null);

    let count = 0;
    const maxCount = 15;

    const interval = setInterval(() => {
      playClickSound();
      setResult(customOptions[Math.floor(Math.random() * customOptions.length)]);
      count++;

      if (count >= maxCount) {
        clearInterval(interval);
        const finalResult = customOptions[Math.floor(Math.random() * customOptions.length)];
        setResult(finalResult);
        setShowResult(true);
        setIsAnimating(false);
        playWinSound();
      }
    }, 120);
  }, [isAnimating, customOptions, playClickSound, playWinSound]);

  const runWheelSpin = useCallback(() => {
    if (isAnimating || wheelOptions.length < 2) return;

    setIsAnimating(true);
    setShowResult(false);
    setResult(null);

    const optionCount = wheelOptions.length;
    const segmentAngle = 360 / optionCount;

    const spins = 5 + Math.random() * 5;
    const randomIndex = Math.floor(Math.random() * optionCount);
    const targetAngle = randomIndex * segmentAngle + segmentAngle / 2;

    const totalRotation = wheelRotation + (spins * 360) + (360 - targetAngle);

    setWheelRotation(totalRotation);

    if (resultTimeoutRef.current) {
      clearTimeout(resultTimeoutRef.current);
    }

    resultTimeoutRef.current = setTimeout(() => {
      setResult(wheelOptions[randomIndex]);
      setShowResult(true);
      setIsAnimating(false);
      playWinSound();
    }, 4000);
  }, [isAnimating, wheelOptions, wheelRotation, playWinSound]);

  const addCustomOption = () => {
    if (newOptionText.trim() && customOptions.length < 20) {
      setCustomOptions([...customOptions, newOptionText.trim()]);
      setNewOptionText("");
    }
  };

  const removeCustomOption = (index: number) => {
    setCustomOptions(customOptions.filter((_, i) => i !== index));
  };

  const addWheelOption = () => {
    if (newWheelText.trim() && wheelOptions.length < 12) {
      setWheelOptions([...wheelOptions, newWheelText.trim()]);
      setNewWheelText("");
    }
  };

  const removeWheelOption = (index: number) => {
    if (wheelOptions.length > 2) {
      setWheelOptions(wheelOptions.filter((_, i) => i !== index));
    }
  };

  const wheelSize = 300;
  const wheelRadius = wheelSize / 2;
  const colors = getWheelColors(wheelOptions.length);
  const segmentAngle = 360 / wheelOptions.length;

  return (
    <div>
      {/* Mode Tabs */}
      <div className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                setActiveMode(mode.id);
                setResult(null);
                setShowResult(false);
              }}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                activeMode === mode.id
                  ? "border-primary bg-primary/10 shadow-md"
                  : "border-border bg-background hover:border-primary/50"
              }`}
            >
              <span className="text-2xl mb-1 block">{mode.icon}</span>
              <span className={`font-semibold text-sm ${
                activeMode === mode.id ? "text-primary" : "text-foreground"
              }`}>
                {mode.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Yes/No Mode */}
      {activeMode === "yesno" && (
        <div className="text-center">
          <div
            className={`mb-8 p-8 rounded-2xl border-2 transition-all duration-300 ${
              showResult
                ? "bg-primary/10 border-primary shadow-lg"
                : isAnimating
                ? "bg-muted border-border animate-pulse"
                : "bg-background border-border"
            }`}
          >
            {result ? (
              <div className={`text-6xl md:text-8xl font-black ${
                showResult
                  ? result === "YES" ? "text-green-600" : "text-red-500"
                  : "text-muted-foreground"
              }`}>
                {result}
              </div>
            ) : (
              <div className="text-5xl md:text-7xl font-black text-muted-foreground">
                ?
              </div>
            )}
            {showResult && (
              <p className="text-lg text-foreground mt-4 font-semibold">
                🎉 The Oracle has spoken!
              </p>
            )}
          </div>

          <button
            onClick={runYesNoAnimation}
            disabled={isAnimating}
            className="px-10 py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-primary-dark transition-all shadow-[0_4px_14px_rgba(30,64,175,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnimating ? "🔮 Consulting the Oracle..." : "🎯 Ask Yes or No Question"}
          </button>
        </div>
      )}

      {/* Coin Flip Mode */}
      {activeMode === "coin" && (
        <div className="text-center">
          <div
            className={`mb-8 p-8 rounded-2xl border-2 transition-all duration-300 ${
              showResult
                ? "bg-primary/10 border-primary shadow-lg"
                : isAnimating
                ? "bg-muted border-border"
                : "bg-background border-border"
            }`}
          >
            <div className={`text-6xl md:text-8xl font-black mb-2 ${
              showResult ? "text-primary" : isAnimating ? "text-muted-foreground" : "text-muted-foreground"
            }`}
              style={isAnimating ? {
                animation: "coinBounce 0.2s ease-in-out infinite alternate"
              } : {}}
            >
              {result || "🪙"}
            </div>
            {!result && !isAnimating && (
              <p className="text-muted-foreground text-lg">Click to flip!</p>
            )}
            {showResult && (
              <p className="text-lg text-foreground mt-2 font-semibold">
                🎉 It landed on {result}!
              </p>
            )}
          </div>

          <button
            onClick={runCoinFlip}
            disabled={isAnimating}
            className="px-10 py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-primary-dark transition-all shadow-[0_4px_14px_rgba(30,64,175,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnimating ? "🪙 Coin in the air..." : "🎰 Flip the Coin"}
          </button>
        </div>
      )}

      {/* Custom Options Mode */}
      {activeMode === "custom" && (
        <div>
          {/* Options List */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-foreground mb-3">
              Your Options ({customOptions.length}/20)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 max-h-64 overflow-y-auto p-1">
              {customOptions.map((option, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-3 bg-background rounded-xl border border-border group"
                >
                  <span className="text-muted-foreground text-sm font-mono mr-1">
                    {idx + 1}.
                  </span>
                  <span className="flex-1 text-foreground font-medium truncate">
                    {option}
                  </span>
                  <button
                    onClick={() => removeCustomOption(idx)}
                    className="text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 text-lg"
                    disabled={isAnimating}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Add Option */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newOptionText}
                onChange={(e) => setNewOptionText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomOption()}
                placeholder="Type an option..."
                className="flex-1 px-4 py-3 rounded-xl border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background"
                disabled={isAnimating}
              />
              <button
                onClick={addCustomOption}
                disabled={!newOptionText.trim() || isAnimating || customOptions.length >= 20}
                className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Result */}
          {(result || isAnimating) && (
            <div
              className={`mb-6 p-6 rounded-2xl border-2 text-center transition-all duration-300 ${
                showResult
                  ? "bg-primary/10 border-primary shadow-lg"
                  : "bg-muted border-border animate-pulse"
              }`}
            >
              <div className={`text-3xl md:text-5xl font-black ${
                showResult ? "text-primary" : "text-muted-foreground"
              }`}>
                {result}
              </div>
              {showResult && (
                <p className="text-lg text-foreground mt-3 font-semibold">
                  🎉 The randomness chose:
                </p>
              )}
            </div>
          )}

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={runCustomPicker}
              disabled={isAnimating || customOptions.length < 2}
              className="px-10 py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-primary-dark transition-all shadow-[0_4px_14px_rgba(30,64,175,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnimating
                ? "🎲 Picking..."
                : customOptions.length < 2
                ? "⚠️ Add at least 2 options"
                : "🎲 Let Fate Decide!"}
            </button>
          </div>
        </div>
      )}

      {/* Picker Wheel Mode */}
      {activeMode === "wheel" && (
        <div>
          {/* Wheel Display */}
          <div className="flex flex-col items-center mb-6">
            {/* Pointer */}
            <div className="relative mb-[-20px] z-10">
              <div className="w-0 h-0" style={{
                borderLeft: "16px solid transparent",
                borderRight: "16px solid transparent",
                borderTop: "32px solid #1e40af",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
              }} />
            </div>

            {/* Wheel SVG */}
            <div
              className="relative"
              style={{ width: wheelSize, height: wheelSize }}
            >
              <div
                className="absolute inset-0"
                style={{
                  transform: `rotate(${wheelRotation}deg)`,
                  transition: isAnimating
                    ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
                    : "none",
                }}
              >
                <svg
                  width={wheelSize}
                  height={wheelSize}
                  viewBox={`0 0 ${wheelSize} ${wheelSize}`}
                >
                  <circle
                    cx={wheelRadius}
                    cy={wheelRadius}
                    r={wheelRadius - 2}
                    fill="none"
                    stroke="#1e40af"
                    strokeWidth="4"
                  />

                  {wheelOptions.map((option, idx) => {
                    const startAngle = idx * segmentAngle;
                    const endAngle = (idx + 1) * segmentAngle;
                    const midAngle = startAngle + segmentAngle / 2;
                    const textPos = getTextPosition(midAngle, wheelRadius);

                    return (
                      <g key={idx}>
                        <path
                          d={createWheelPath(startAngle, endAngle, wheelRadius - 4)}
                          fill={colors[idx]}
                          stroke="white"
                          strokeWidth="1"
                        />
                        <text
                          x={textPos.x}
                          y={textPos.y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="white"
                          fontSize="11"
                          fontWeight="bold"
                          style={{
                            transform: `rotate(${textPos.rotation}deg)`,
                            transformOrigin: `${textPos.x}px ${textPos.y}px`,
                            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                          }}
                        >
                          {option.length > 8 ? option.slice(0, 8) + ".." : option}
                        </text>
                      </g>
                    );
                  })}

                  <circle
                    cx={wheelRadius}
                    cy={wheelRadius}
                    r="24"
                    fill="white"
                    stroke="#1e40af"
                    strokeWidth="3"
                  />
                  <text
                    x={wheelRadius}
                    y={wheelRadius}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#1e40af"
                    fontSize="18"
                    fontWeight="bold"
                  >
                    ?
                  </text>
                </svg>
              </div>
            </div>
          </div>

          {/* Result */}
          {showResult && result && (
            <div className="mb-6 p-6 rounded-2xl border-2 border-primary bg-primary/10 shadow-lg text-center">
              <p className="text-lg text-foreground mb-2 font-semibold">
                🎉 The wheel landed on:
              </p>
              <div className="text-3xl md:text-5xl font-black text-primary">
                {result}
              </div>
            </div>
          )}

          {/* Wheel Options */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-foreground mb-3">
              Wheel Options ({wheelOptions.length}/12)
            </label>

            <div className="flex flex-wrap gap-2 mb-4">
              {wheelOptions.map((option, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-white group"
                  style={{ backgroundColor: colors[idx] }}
                >
                  {option}
                  <button
                    onClick={() => removeWheelOption(idx)}
                    disabled={isAnimating || wheelOptions.length <= 2}
                    className="ml-1 hover:opacity-70 transition-opacity opacity-0 group-hover:opacity-100 disabled:cursor-not-allowed"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newWheelText}
                onChange={(e) => setNewWheelText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addWheelOption()}
                placeholder="Add wheel option..."
                className="flex-1 px-4 py-3 rounded-xl border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground bg-background"
                disabled={isAnimating}
              />
              <button
                onClick={addWheelOption}
                disabled={!newWheelText.trim() || isAnimating || wheelOptions.length >= 12}
                className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Spin Button */}
          <div className="text-center">
            <button
              onClick={runWheelSpin}
              disabled={isAnimating || wheelOptions.length < 2}
              className="px-10 py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-primary-dark transition-all shadow-[0_4px_14px_rgba(30,64,175,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnimating
                ? "🎡 Spinning..."
                : wheelOptions.length < 2
                ? "⚠️ Add at least 2 options"
                : "🎡 SPIN THE WHEEL!"}
            </button>
          </div>
        </div>
      )}

      {/* Inline Styles for Animations */}
      <style>{`
        @keyframes coinBounce {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-10px) scale(1.05); }
        }
      `}</style>
    </div>
  );
}
