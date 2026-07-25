"use client";

import { useState, useEffect, useRef, useCallback, type ChangeEvent, type KeyboardEvent } from "react";

type Difficulty = "easy" | "medium" | "hard";

const TYPING_TEXT: Record<Difficulty, string[]> = {
  easy: [
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is perfect for practicing typing skills.",
    "A journey of a thousand miles begins with a single step. Every great achievement starts with the decision to try something new.",
    "Life is what happens when you are busy making other plans. Make sure to take time to enjoy the simple things each day.",
    "The best way to predict the future is to create it. Take action today to build the tomorrow you want to see.",
    "In the middle of difficulty lies opportunity. Every challenge you face is a chance to grow and become stronger.",
  ],
  medium: [
    "Programming is the art of telling a computer what to do through a set of instructions. It requires logical thinking, attention to detail, and creative problem-solving abilities.",
    "Web development combines creativity with technical skills. Frontend developers focus on user experience, while backend developers handle server logic and database management.",
    "Technology continues to evolve at an unprecedented pace. Artificial intelligence, machine learning, and quantum computing are reshaping industries worldwide.",
    "Effective communication is essential in the workplace. Clear writing, active listening, and thoughtful feedback help teams collaborate successfully on complex projects.",
    "Data analysis transforms raw information into actionable insights. Using statistical methods and visualization tools, analysts help organizations make informed decisions.",
  ],
  hard: [
    "Quantum computing leverages quantum mechanical phenomena like superposition and entanglement to process information in fundamentally different ways than classical computers, potentially solving problems beyond current computational capabilities.",
    "The implementation of microservices architecture involves decomposing monolithic applications into loosely coupled services that communicate via APIs, enabling independent deployment, scalability, and technology diversity across different business domains.",
    "Cryptographic hash functions are deterministic algorithms that map input data of arbitrary size to fixed-size output values, designed to be collision-resistant, preimage-resistant, and second-preimage-resistant for secure applications like password storage and digital signatures.",
    "Reinforcement learning is a type of machine learning where an agent learns to make decisions by performing actions in an environment to maximize cumulative reward, using techniques such as Q-learning, policy gradients, and deep neural networks for complex state representations.",
    "The CAP theorem states that in a distributed data store, only two of three properties—consistency, availability, and partition tolerance—can be simultaneously achieved, requiring careful tradeoffs when designing systems that must operate across multiple network locations.",
  ],
};

interface DifficultyOption {
  id: Difficulty;
  name: string;
  color: string;
}

const DIFFICULTIES: DifficultyOption[] = [
  { id: "easy", name: "Easy", color: "green" },
  { id: "medium", name: "Medium", color: "orange" },
  { id: "hard", name: "Hard", color: "red" },
];

function getRandomText(difficulty: Difficulty): string {
  const texts = TYPING_TEXT[difficulty];
  return texts[Math.floor(Math.random() * texts.length)];
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

interface PerformanceMessage {
  text: string;
  emoji: string;
}

export default function TypingSpeedTest() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [targetText, setTargetText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);
  const [correctTyped, setCorrectTyped] = useState(0);

  const inputRef = useRef<HTMLTextAreaElement>(null);
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

  const loadNewText = useCallback((diff: Difficulty = difficulty) => {
    setTargetText(getRandomText(diff));
    setUserInput("");
    setIsStarted(false);
    setIsFinished(false);
    setStartTime(null);
    setElapsedTime(0);
    setMistakes(0);
    setTotalTyped(0);
    setCorrectTyped(0);
  }, [difficulty]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadNewText();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isStarted || isFinished) return;

    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - (startTime ?? Date.now())) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, isFinished, startTime]);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    if (!isStarted && value.length > 0) {
      setIsStarted(true);
      setStartTime(Date.now());
    }

    if (isFinished) return;

    setTotalTyped(value.length);

    let correctCount = 0;
    let mistakeCount = 0;

    for (let i = 0; i < value.length; i++) {
      if (value[i] === targetText[i]) {
        correctCount++;
      } else {
        mistakeCount++;
      }
    }

    setCorrectTyped(correctCount);
    setMistakes(mistakeCount);
    setUserInput(value);

    if (value.length === targetText.length) {
      setIsFinished(true);
      setElapsedTime(Math.floor((Date.now() - (startTime ?? Date.now())) / 1000));
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
    }
  };

  const handleRestart = () => {
    loadNewText();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleNewText = () => {
    loadNewText();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleDifficultyChange = (diff: Difficulty) => {
    setDifficulty(diff);
    loadNewText(diff);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const minutes = elapsedTime > 0 ? elapsedTime / 60 : 0.01;
  const wpm = minutes > 0 ? Math.round((correctTyped / 5) / minutes) : 0;
  const accuracy = totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 100;

  const bgCard = "bg-[var(--bg-card)]";
  const bgSoft = "bg-[var(--bg-soft)]";
  const borderColor = "border-[var(--border)]";
  const textColor = "text-[var(--text)]";
  const textMuted = "text-[var(--text-muted)]";
  const brandColor = "text-primary";
  const bgBrandLight = "bg-[var(--brand-light)]";

  const renderHighlightedText = () => {
    const chars = [];

    for (let i = 0; i < targetText.length; i++) {
      let charClass = textMuted;
      let bgClass = "";

      if (i < userInput.length) {
        if (userInput[i] === targetText[i]) {
          charClass = "text-green-500";
        } else {
          charClass = "text-red-500";
          bgClass = isDarkMode ? "bg-red-900/30" : "bg-red-100";
        }
      } else if (i === userInput.length) {
        charClass = textColor;
        bgClass = bgBrandLight;
      }

      chars.push(
        <span
          key={i}
          className={`font-mono text-lg leading-relaxed ${charClass} ${bgClass} ${
            i === userInput.length && isStarted ? "animate-pulse" : ""
          }`}
        >
          {targetText[i]}
        </span>
      );
    }

    return chars;
  };

  const getPerformanceMessage = (): PerformanceMessage => {
    if (wpm < 20) return { text: "Keep practicing! You're getting better.", emoji: "🌱" };
    if (wpm < 40) return { text: "Good speed! You're above average.", emoji: "👍" };
    if (wpm < 60) return { text: "Great job! You're a fast typist.", emoji: "🚀" };
    if (wpm < 80) return { text: "Excellent! Professional typing speed.", emoji: "⚡" };
    return { text: "Incredible! You're among the fastest typists.", emoji: "🏆" };
  };

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
              typing-test.js
            </span>
          </div>
          <div className="flex items-center gap-2">
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff.id}
                onClick={() => handleDifficultyChange(diff.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  difficulty === diff.id
                    ? `${bgBrandLight} ${brandColor} shadow-sm`
                    : `${bgCard} ${textColor} border ${borderColor} hover:${bgSoft}`
                }`}
              >
                {diff.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 p-5 border-b" style={{ borderColor: isDarkMode ? "#2a2a3e" : "#e5e7eb" }}>
          <div className={`text-center p-4 rounded-xl ${bgSoft}`}>
            <div className={`text-3xl font-bold ${brandColor}`}>{wpm}</div>
            <div className={`text-xs ${textMuted} mt-1`}>WPM</div>
          </div>
          <div className={`text-center p-4 rounded-xl ${bgSoft}`}>
            <div className={`text-3xl font-bold ${accuracy >= 95 ? "text-green-500" : accuracy >= 80 ? "text-yellow-500" : "text-red-500"}`}>
              {accuracy}%
            </div>
            <div className={`text-xs ${textMuted} mt-1`}>Accuracy</div>
          </div>
          <div className={`text-center p-4 rounded-xl ${bgSoft}`}>
            <div className={`text-3xl font-bold ${mistakes > 0 ? "text-red-500" : "text-green-500"}`}>
              {mistakes}
            </div>
            <div className={`text-xs ${textMuted} mt-1`}>Mistakes</div>
          </div>
          <div className={`text-center p-4 rounded-xl ${bgSoft}`}>
            <div className={`text-3xl font-bold ${textColor}`}>
              {formatTime(elapsedTime)}
            </div>
            <div className={`text-xs ${textMuted} mt-1`}>Time</div>
          </div>
        </div>

        <div className="p-6">
          <div
            className={`p-6 rounded-xl border ${borderColor} mb-6 cursor-text`}
            style={{ backgroundColor: isDarkMode ? "#0d0d14" : "#fafafa" }}
            onClick={() => inputRef.current?.focus()}
          >
            <div className="leading-loose">
              {renderHighlightedText()}
            </div>
            <div className="mt-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${(userInput.length / targetText.length) * 100}%` }}
              />
            </div>
            <div className={`flex justify-between mt-2 text-xs ${textMuted}`}>
              <span>{userInput.length} / {targetText.length} characters</span>
              <span>{Math.round((userInput.length / targetText.length) * 100)}% complete</span>
            </div>
          </div>

          <textarea
            ref={inputRef}
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isFinished}
            placeholder={isStarted ? "" : "Start typing to begin the test..."}
            className={`w-full p-4 text-lg font-mono rounded-xl border-2 ${borderColor} focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none ${
              isFinished ? "opacity-50 cursor-not-allowed" : ""
            } ${textColor}`}
            style={{ backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff", height: "100px" }}
            autoFocus
            spellCheck={false}
          />

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={handleRestart}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all border-2 ${borderColor} ${textColor} hover:${bgBrandLight} hover:border-primary`}
            >
              Restart
            </button>
            <button
              onClick={handleNewText}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all text-white bg-primary hover:opacity-90 shadow-lg shadow-primary/20"
            >
              New Text
            </button>
            {!isStarted && (
              <button
                onClick={() => inputRef.current?.focus()}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all ${bgSoft} ${textColor} hover:${bgBrandLight}`}
              >
                Click here to start
              </button>
            )}
          </div>
        </div>
      </div>

      {isFinished && (
        <div className={`${bgCard} rounded-2xl border ${borderColor} shadow-card overflow-hidden`}>
          <div
            className="px-6 py-4 text-center"
            style={{ backgroundColor: isDarkMode ? "#1e3a5f" : "#eff6ff" }}
          >
            <div className="text-4xl mb-2">{getPerformanceMessage().emoji}</div>
            <h3 className={`text-xl font-bold ${textColor}`}>Test Complete!</h3>
            <p className={`text-sm ${textMuted} mt-1`}>{getPerformanceMessage().text}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
            <div className={`text-center p-5 rounded-xl ${bgSoft}`}>
              <div className={`text-4xl font-bold ${brandColor} mb-2`}>{wpm}</div>
              <div className={`text-sm font-medium ${textColor}`}>WPM</div>
              <div className={`text-xs ${textMuted}`}>Words Per Minute</div>
            </div>
            <div className={`text-center p-5 rounded-xl ${bgSoft}`}>
              <div className={`text-4xl font-bold ${accuracy >= 95 ? "text-green-500" : accuracy >= 80 ? "text-yellow-500" : "text-red-500"} mb-2`}>
                {accuracy}%
              </div>
              <div className={`text-sm font-medium ${textColor}`}>Accuracy</div>
              <div className={`text-xs ${textMuted}`}>{correctTyped}/{totalTyped} correct</div>
            </div>
            <div className={`text-center p-5 rounded-xl ${bgSoft}`}>
              <div className={`text-4xl font-bold ${textColor} mb-2`}>
                {formatTime(elapsedTime)}
              </div>
              <div className={`text-sm font-medium ${textColor}`}>Time</div>
              <div className={`text-xs ${textMuted}`}>{elapsedTime} seconds</div>
            </div>
            <div className={`text-center p-5 rounded-xl ${bgSoft}`}>
              <div className={`text-4xl font-bold ${mistakes > 0 ? "text-red-500" : "text-green-500"} mb-2`}>
                {mistakes}
              </div>
              <div className={`text-sm font-medium ${textColor}`}>Mistakes</div>
              <div className={`text-xs ${textMuted}`}>{totalTyped - correctTyped} errors</div>
            </div>
          </div>

          <div className={`p-6 border-t ${borderColor} flex flex-wrap gap-3 justify-center`}>
            <button
              onClick={handleRestart}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl transition-all border-2 ${borderColor} ${textColor} hover:${bgBrandLight} hover:border-primary`}
            >
              Try Again
            </button>
            <button
              onClick={handleNewText}
              className="flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl transition-all text-white bg-primary hover:opacity-90 shadow-lg shadow-primary/20"
            >
              New Challenge
            </button>
          </div>
        </div>
      )}

      <div className={`${bgCard} rounded-xl border ${borderColor} p-5`}>
        <h3 className={`text-sm font-semibold ${textColor} mb-3`}>
          Tips for Better Typing
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className={`p-3 rounded-lg ${bgSoft}`}>
            <p className={`font-medium ${textColor} mb-1`}>Focus on Accuracy</p>
            <p className={textMuted}>
              Speed comes with accuracy. It&apos;s better to type slowly and correctly than fast with many mistakes.
            </p>
          </div>
          <div className={`p-3 rounded-lg ${bgSoft}`}>
            <p className={`font-medium ${textColor} mb-1`}>Proper Posture</p>
            <p className={textMuted}>
              Sit up straight, keep your feet flat on the floor, and rest your wrists lightly on the desk.
            </p>
          </div>
          <div className={`p-3 rounded-lg ${bgSoft}`}>
            <p className={`font-medium ${textColor} mb-1`}>Practice Daily</p>
            <p className={textMuted}>
              Consistent practice is key. Even 10-15 minutes of daily practice can significantly improve your speed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
