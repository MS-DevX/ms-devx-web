"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "msdevx_exam_countdowns";

interface ColorPreset {
  id: string;
  name: string;
  bg: string;
  light: string;
  darkLight: string;
  border: string;
}

const COLOR_PRESETS: ColorPreset[] = [
  { id: "blue", name: "Blue", bg: "bg-blue-500", light: "bg-blue-50", darkLight: "bg-blue-900/20", border: "border-blue-200 dark:border-blue-800" },
  { id: "purple", name: "Purple", bg: "bg-purple-500", light: "bg-purple-50", darkLight: "bg-purple-900/20", border: "border-purple-200 dark:border-purple-800" },
  { id: "orange", name: "Orange", bg: "bg-orange-500", light: "bg-orange-50", darkLight: "bg-orange-900/20", border: "border-orange-200 dark:border-orange-800" },
  { id: "green", name: "Green", bg: "bg-green-500", light: "bg-green-50", darkLight: "bg-green-900/20", border: "border-green-200 dark:border-green-800" },
  { id: "red", name: "Red", bg: "bg-red-500", light: "bg-red-50", darkLight: "bg-red-900/20", border: "border-red-200 dark:border-red-800" },
  { id: "pink", name: "Pink", bg: "bg-pink-500", light: "bg-pink-50", darkLight: "bg-pink-900/20", border: "border-pink-200 dark:border-pink-800" },
];

interface Countdown {
  id: string;
  name: string;
  targetDate: string;
  time: string;
  color: string;
  createdDate: string;
}

function loadCountdowns(): Countdown[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    return [];
  }
  return [];
}

function saveCountdowns(countdowns: Countdown[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(countdowns));
  } catch (e) {
    console.error("Failed to save countdowns:", e);
  }
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isPast: boolean;
}

function getTimeRemaining(targetDate: string): TimeRemaining {
  const now = Date.now();
  const target = new Date(targetDate).getTime();
  const diff = target - now;

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: 0,
      isPast: true,
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    totalMs: diff,
    isPast: false,
  };
}

function getProgressPercentage(createdDate: string, targetDate: string): number {
  const now = Date.now();
  const created = new Date(createdDate).getTime();
  const target = new Date(targetDate).getTime();
  const totalDuration = target - created;
  const elapsed = now - created;

  if (totalDuration <= 0) return 100;
  if (elapsed <= 0) return 0;

  const percentage = (elapsed / totalDuration) * 100;
  return Math.min(Math.max(percentage, 0), 100);
}

function formatDateDisplay(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTimeDisplay(timeStr: string): string {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

interface UrgencyLevel {
  level: string;
  label: string;
  color: string;
  bg: string;
}

function getUrgencyLevel(days: number, isPast: boolean): UrgencyLevel {
  if (isPast) return { level: "past", label: "Exam Passed", color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-800" };
  if (days === 0) return { level: "urgent", label: "Today!", color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" };
  if (days <= 3) return { level: "soon", label: "Very Soon", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" };
  if (days <= 7) return { level: "coming", label: "This Week", color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20" };
  return { level: "planning", label: "Planned", color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" };
}

export default function ExamCountdownTimer() {
  const [countdowns, setCountdowns] = useState<Countdown[]>(() => loadCountdowns());
  const [_currentTime, setCurrentTime] = useState<number>(() => Date.now());
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const [examName, setExamName] = useState<string>("");
  const [examDate, setExamDate] = useState<string>("");
  const [examTime, setExamTime] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("blue");

  useEffect(() => {
    const checkDarkMode = (): void => {
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddCountdown = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!examName.trim() || !examDate) return;

    let targetDateTime = examDate;
    if (examTime) {
      targetDateTime += `T${examTime}`;
    } else {
      targetDateTime += "T00:00";
    }

    const newCountdown: Countdown = {
      id: Date.now().toString(),
      name: examName.trim(),
      targetDate: targetDateTime,
      time: examTime || "",
      color: selectedColor,
      createdDate: new Date().toISOString(),
    };

    const updated = [...countdowns, newCountdown];
    setCountdowns(updated);
    saveCountdowns(updated);

    setExamName("");
    setExamDate("");
    setExamTime("");
    setSelectedColor("blue");
    setShowAddForm(false);
  };

  const handleDeleteCountdown = (id: string): void => {
    const updated = countdowns.filter((c: Countdown) => c.id !== id);
    setCountdowns(updated);
    saveCountdowns(updated);
  };

  const handleDeleteAllPast = (): void => {
    const updated = countdowns.filter((c: Countdown) => {
      const remaining = getTimeRemaining(c.targetDate);
      return !remaining.isPast;
    });
    setCountdowns(updated);
    saveCountdowns(updated);
  };

  const bgCard = "bg-[var(--bg-card)]";
  const bgSoft = "bg-[var(--bg-soft)]";
  const borderColor = "border-[var(--border)]";
  const textColor = "text-[var(--text)]";
  const textMuted = "text-[var(--text-muted)]";

  const sortedCountdowns = [...countdowns].sort((a: Countdown, b: Countdown) => {
    const aRemaining = getTimeRemaining(a.targetDate);
    const bRemaining = getTimeRemaining(b.targetDate);

    if (aRemaining.isPast && !bRemaining.isPast) return 1;
    if (!aRemaining.isPast && bRemaining.isPast) return -1;

    return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
  });

  const pastCount: number = sortedCountdowns.filter((c: Countdown) => getTimeRemaining(c.targetDate).isPast).length;

  const getColorPreset = (colorId: string): ColorPreset => {
    return COLOR_PRESETS.find((c: ColorPreset) => c.id === colorId) || COLOR_PRESETS[0];
  };

  return (
    <div className="space-y-6">
      <div className={`${bgCard} rounded-2xl border ${borderColor} shadow-card overflow-hidden`}>
        <div
          className={`px-5 py-4 border-b ${borderColor} flex flex-wrap items-center justify-between gap-4`}
          style={{
            backgroundColor: isDarkMode ? "#1e3a5f" : "#eff6ff",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div>
              <h2 className={`text-base font-semibold ${textColor}`}>
                📚 Exam Countdown Dashboard
              </h2>
              <p className={`text-xs ${textMuted}`}>
                {sortedCountdowns.length} countdown(s) · {pastCount} passed
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {pastCount > 0 && (
              <button
                onClick={handleDeleteAllPast}
                className={`px-3 py-2 text-xs font-medium rounded-lg transition-all ${bgSoft} ${textColor} border ${borderColor} hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20`}
              >
                🗑️ Clear Past ({pastCount})
              </button>
            )}
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all text-white bg-primary hover:opacity-90 shadow-lg shadow-primary/20`}
            >
              {showAddForm ? "✕ Cancel" : "+ Add Exam"}
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className={`p-5 border-b ${borderColor}`}>
            <h3 className={`text-sm font-semibold ${textColor} mb-4`}>
              ⏰ Create New Countdown
            </h3>
            <form onSubmit={handleAddCountdown} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-2`}>
                    Exam Name *
                  </label>
                  <input
                    type="text"
                    value={examName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExamName(e.target.value)}
                    placeholder="e.g., Final Exam, Midterm, Quiz"
                    className={`w-full px-4 py-3 text-sm rounded-lg border-2 ${borderColor} focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${textColor}`}
                    style={{
                      backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
                    }}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-2`}>
                    Exam Date *
                  </label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExamDate(e.target.value)}
                    className={`w-full px-4 py-3 text-sm rounded-lg border-2 ${borderColor} focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${textColor}`}
                    style={{
                      backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
                    }}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-2`}>
                    Exam Time (Optional)
                  </label>
                  <input
                    type="time"
                    value={examTime}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExamTime(e.target.value)}
                    className={`w-full px-4 py-3 text-sm rounded-lg border-2 ${borderColor} focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${textColor}`}
                    style={{
                      backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
                    }}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${textColor} mb-2`}>
                  Theme Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PRESETS.map((color: ColorPreset) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setSelectedColor(color.id)}
                      className={`w-10 h-10 rounded-lg transition-all ${color.bg} ${
                        selectedColor === color.id
                          ? "ring-2 ring-offset-2 ring-primary scale-110"
                          : "hover:scale-105"
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={!examName.trim() || !examDate}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg transition-all text-white bg-primary hover:opacity-90 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  ⏰ Create Countdown
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-all ${bgSoft} ${textColor} border ${borderColor} hover:opacity-80`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {sortedCountdowns.length === 0 ? (
        <div className={`${bgCard} rounded-2xl border ${borderColor} shadow-card p-10 text-center`}>
          <div className="text-6xl mb-4">📅</div>
          <h3 className={`text-xl font-bold ${textColor} mb-2`}>
            No Exam Countdowns Yet
          </h3>
          <p className={`text-sm ${textMuted} mb-6`}>
            Click &quot;Add Exam&quot; to create your first countdown. Track your exams, tests, and important events!
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg transition-all text-white bg-primary hover:opacity-90 shadow-lg shadow-primary/20`}
          >
            + Create Your First Countdown
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sortedCountdowns.map((countdown: Countdown) => {
            const remaining = getTimeRemaining(countdown.targetDate);
            const urgency = getUrgencyLevel(remaining.days, remaining.isPast);
            const colorPreset = getColorPreset(countdown.color);
            const progress = getProgressPercentage(countdown.createdDate, countdown.targetDate);

            return (
              <div
                key={countdown.id}
                className={`${bgCard} rounded-2xl border ${borderColor} shadow-card overflow-hidden transition-all hover:shadow-lg ${
                  remaining.isPast ? "opacity-70" : ""
                }`}
              >
                <div className={`h-2 ${colorPreset.bg}`} />

                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
                        <span className={`w-3 h-3 rounded-full ${colorPreset.bg}`} />
                        {countdown.name}
                      </h3>
                      <p className={`text-xs ${textMuted} mt-1`}>
                        {formatDateDisplay(countdown.targetDate)}
                        {countdown.time && ` at ${formatTimeDisplay(countdown.time)}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${urgency.bg} ${urgency.color}`}>
                        {urgency.label}
                      </span>
                      <button
                        onClick={() => handleDeleteCountdown(countdown.id)}
                        className={`p-1.5 rounded-lg transition-all ${bgSoft} hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 ${textMuted}`}
                        title="Delete countdown"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {remaining.isPast ? (
                    <div className="text-center py-6">
                      <div className="text-4xl mb-2">✅</div>
                      <p className={`text-lg font-bold ${textColor}`}>
                        Time&apos;s Up!
                      </p>
                      <p className={`text-sm ${textMuted}`}>
                        This countdown has ended
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        <div className={`text-center p-3 rounded-xl ${bgSoft}`}>
                          <div className={`text-2xl md:text-3xl font-bold ${colorPreset.bg.replace("bg-", "text-")}`}>
                            {remaining.days}
                          </div>
                          <div className={`text-xs ${textMuted} uppercase tracking-wide`}>
                            Days
                          </div>
                        </div>
                        <div className={`text-center p-3 rounded-xl ${bgSoft}`}>
                          <div className={`text-2xl md:text-3xl font-bold ${colorPreset.bg.replace("bg-", "text-")}`}>
                            {remaining.hours.toString().padStart(2, "0")}
                          </div>
                          <div className={`text-xs ${textMuted} uppercase tracking-wide`}>
                            Hours
                          </div>
                        </div>
                        <div className={`text-center p-3 rounded-xl ${bgSoft}`}>
                          <div className={`text-2xl md:text-3xl font-bold ${colorPreset.bg.replace("bg-", "text-")}`}>
                            {remaining.minutes.toString().padStart(2, "0")}
                          </div>
                          <div className={`text-xs ${textMuted} uppercase tracking-wide`}>
                            Mins
                          </div>
                        </div>
                        <div className={`text-center p-3 rounded-xl ${bgSoft}`}>
                          <div className={`text-2xl md:text-3xl font-bold ${colorPreset.bg.replace("bg-", "text-")} ${
                            remaining.seconds % 2 === 0 ? "animate-pulse" : ""
                          }`}>
                            {remaining.seconds.toString().padStart(2, "0")}
                          </div>
                          <div className={`text-xs ${textMuted} uppercase tracking-wide`}>
                            Secs
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className={textMuted}>Progress</span>
                          <span className={`font-medium ${textColor}`}>
                            {progress.toFixed(0)}% complete
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${colorPreset.bg} rounded-full transition-all duration-1000`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`${bgCard} rounded-xl border ${borderColor} p-5`}>
          <h4 className={`text-sm font-semibold ${textColor} mb-3 flex items-center gap-2`}>
            <span>💾</span> Auto-Saved
          </h4>
          <p className={`text-sm ${textMuted}`}>
            Your countdowns are automatically saved to your browser&apos;s local storage. They&apos;ll be there when you come back!
          </p>
        </div>
        <div className={`${bgCard} rounded-xl border ${borderColor} p-5`}>
          <h4 className={`text-sm font-semibold ${textColor} mb-3 flex items-center gap-2`}>
            <span>🎨</span> Customizable
          </h4>
          <p className={`text-sm ${textMuted}`}>
            Choose from 6 colorful themes to organize your countdowns. Use different colors for different subjects!
          </p>
        </div>
        <div className={`${bgCard} rounded-xl border ${borderColor} p-5`}>
          <h4 className={`text-sm font-semibold ${textColor} mb-3 flex items-center gap-2`}>
            <span>📊</span> Track Progress
          </h4>
          <p className={`text-sm ${textMuted}`}>
            Visual progress bars show how much time has passed since you created each countdown. Great for motivation!
          </p>
        </div>
      </div>
    </div>
  );
}
