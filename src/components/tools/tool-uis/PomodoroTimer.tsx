"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const MODES = {
  FOCUS: "focus",
  SHORT_BREAK: "shortBreak",
  LONG_BREAK: "longBreak",
} as const;

type ModeKey = typeof MODES[keyof typeof MODES];

interface ModeConfig {
  label: string;
  icon: string;
  labelShort: string;
  gradientFrom: string;
  gradientTo: string;
  bgFrom: string;
  bgTo: string;
  bgDarkFrom: string;
  bgDarkTo: string;
  borderColor: string;
  textColor: string;
}

const MODE_CONFIG: Record<ModeKey, ModeConfig> = {
  [MODES.FOCUS]: {
    label: "Focus",
    icon: "🎯",
    labelShort: "Focus",
    gradientFrom: "from-red-500",
    gradientTo: "to-orange-500",
    bgFrom: "from-red-50",
    bgTo: "to-orange-50",
    bgDarkFrom: "from-red-900/30",
    bgDarkTo: "to-orange-900/30",
    borderColor: "border-red-200 dark:border-red-800/30",
    textColor: "text-red-600 dark:text-red-400",
  },
  [MODES.SHORT_BREAK]: {
    label: "Short Break",
    icon: "☕",
    labelShort: "Short",
    gradientFrom: "from-green-500",
    gradientTo: "to-emerald-500",
    bgFrom: "from-green-50",
    bgTo: "to-emerald-50",
    bgDarkFrom: "from-green-900/30",
    bgDarkTo: "to-emerald-900/30",
    borderColor: "border-green-200 dark:border-green-800/30",
    textColor: "text-green-600 dark:text-green-400",
  },
  [MODES.LONG_BREAK]: {
    label: "Long Break",
    icon: "🌴",
    labelShort: "Long",
    gradientFrom: "from-blue-500",
    gradientTo: "to-cyan-500",
    bgFrom: "from-blue-50",
    bgTo: "to-cyan-50",
    bgDarkFrom: "from-blue-900/30",
    bgDarkTo: "to-cyan-900/30",
    borderColor: "border-blue-200 dark:border-blue-800/30",
    textColor: "text-blue-600 dark:text-blue-400",
  },
};

interface PomodoroSession {
  id: number;
  mode: ModeKey;
  duration: number;
  date: string;
  completedAt: number;
}

interface Durations {
  [MODES.FOCUS]: number;
  [MODES.SHORT_BREAK]: number;
  [MODES.LONG_BREAK]: number;
}

const PomodoroTimer = () => {
  const [mode, setMode] = useState<ModeKey>(MODES.FOCUS);
  const [durations, setDurations] = useState<Durations>(() => {
    try {
      const saved = localStorage.getItem("pomodoroDurations_msdevx");
      return saved ? JSON.parse(saved) : {
        [MODES.FOCUS]: 25,
        [MODES.SHORT_BREAK]: 5,
        [MODES.LONG_BREAK]: 15,
      };
    } catch {
      return {
        [MODES.FOCUS]: 25,
        [MODES.SHORT_BREAK]: 5,
        [MODES.LONG_BREAK]: 15,
      };
    }
  });
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [sessions, setSessions] = useState<PomodoroSession[]>(() => {
    try {
      const saved = localStorage.getItem("pomodoroSessions_msdevx");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const completedPomodoros: number = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return sessions.filter((s: PomodoroSession) => s.date === today).length;
  }, [sessions]);
  const [justCompleted, setJustCompleted] = useState<boolean>(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerContainerRef = useRef<HTMLDivElement>(null);

  const currentDuration: number = durations[mode] * 60;
  const progress: number = currentDuration > 0 ? ((currentDuration - timeLeft) / currentDuration) * 100 : 0;
  const currentModeConfig: ModeConfig = MODE_CONFIG[mode];

  useEffect(() => {
    try {
      localStorage.setItem("pomodoroDurations_msdevx", JSON.stringify(durations));
    } catch {
      // ignore
    }
  }, [durations]);

  useEffect(() => {
    try {
      localStorage.setItem("pomodoroSessions_msdevx", JSON.stringify(sessions));
    } catch {
      // ignore
    }
  }, [sessions]);

  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(durations[mode] * 60);
    }
  }, [mode, isRunning, durations]);

  const handleSessionComplete = useCallback((): void => {
    setIsRunning(false);
    setJustCompleted(true);

    if (mode === MODES.FOCUS) {
      const newSession: PomodoroSession = {
        id: Date.now(),
        mode: MODES.FOCUS,
        duration: durations[MODES.FOCUS],
        date: new Date().toISOString().split("T")[0],
        completedAt: Date.now(),
      };
      setSessions((prev: PomodoroSession[]) => [newSession, ...prev]);
    }

    setTimeout(() => {
      setJustCompleted(false);
    }, 3000);

    try {
      if (Notification.permission === "granted") {
        new Notification("Pomodoro Complete", {
          body: mode === MODES.FOCUS
            ? `Great job! Your ${durations[MODES.FOCUS]} minute focus session is complete.`
            : "Break time is over! Ready for another focus session?",
          icon: "🍅",
        });
      }
    } catch {
      // ignore notification errors
    }
  }, [mode, durations]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev: number) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, handleSessionComplete]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleStart = (): void => {
    setIsRunning(true);
    setJustCompleted(false);
  };

  const handlePause = (): void => {
    setIsRunning(false);
  };

  const handleReset = (): void => {
    setIsRunning(false);
    setTimeLeft(durations[mode] * 60);
    setJustCompleted(false);
  };

  const handleSkip = (): void => {
    setIsRunning(false);
    if (mode === MODES.FOCUS) {
      setMode(MODES.SHORT_BREAK);
      setTimeLeft(durations[MODES.SHORT_BREAK] * 60);
    } else if (mode === MODES.SHORT_BREAK) {
      setMode(MODES.FOCUS);
      setTimeLeft(durations[MODES.FOCUS] * 60);
    } else {
      setMode(MODES.FOCUS);
      setTimeLeft(durations[MODES.FOCUS] * 60);
    }
    setJustCompleted(false);
  };

  const handleModeChange = (newMode: ModeKey): void => {
    if (isRunning) return;
    setMode(newMode);
    setTimeLeft(durations[newMode] * 60);
    setJustCompleted(false);
  };

  const handleDurationChange = (m: ModeKey, value: number): void => {
    const numValue = parseInt(String(value)) || 1;
    const clamped = Math.max(1, Math.min(90, numValue));
    setDurations((prev: Durations) => ({
      ...prev,
      [m]: clamped,
    }));
    if (m === mode && !isRunning) {
      setTimeLeft(clamped * 60);
    }
  };

  const handleFullscreen = async (): Promise<void> => {
    try {
      const el = timerContainerRef.current;
      if (!el) return;

      if (!document.fullscreenElement) {
        await el.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // ignore fullscreen errors
    }
  };

  useEffect(() => {
    const handleFullscreenChange = (): void => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const requestNotificationPermission = async (): Promise<void> => {
    try {
      if ("Notification" in window && Notification.permission === "default") {
        await Notification.requestPermission();
      }
    } catch {
      // ignore
    }
  };

  const circleSize = 260;
  const strokeWidth = 8;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getModeGradientColor = (): string => {
    if (mode === MODES.FOCUS) return "#ef4444";
    if (mode === MODES.SHORT_BREAK) return "#22c55e";
    return "#3b82f6";
  };

  return (
    <div className="w-full max-w-4xl mx-auto" ref={timerContainerRef}>
      <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none overflow-auto" : ""
      }`}>
        {!isFullscreen && (
          <div className={`bg-gradient-to-r ${currentModeConfig.gradientFrom} ${currentModeConfig.gradientTo} px-6 py-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🍅</span>
                <div>
                  <h1 className="text-xl font-bold text-white">Pomodoro Timer</h1>
                  <p className="text-white/80 text-sm">Boost your productivity with focused sessions</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={requestNotificationPermission}
                  className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  🔔 Notifications
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                  aria-label="Settings"
                >
                  ⚙️
                </button>
              </div>
            </div>
          </div>
        )}

        {isFullscreen && (
          <div className={`bg-gradient-to-r ${currentModeConfig.gradientFrom} ${currentModeConfig.gradientTo} px-6 py-3`}>
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🍅</span>
                <span className="font-bold text-white">Pomodoro Timer</span>
              </div>
              <button
                onClick={handleFullscreen}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg transition-colors"
              >
                ✕ Exit Fullscreen
              </button>
            </div>
          </div>
        )}

        <div className={`p-6 md:p-8 ${isFullscreen ? "max-w-2xl mx-auto" : ""}`}>
          {showSettings && !isFullscreen && (
            <div className={`mb-8 p-5 rounded-xl bg-gradient-to-br ${currentModeConfig.bgFrom} ${currentModeConfig.bgTo} dark:from-gray-900 dark:to-gray-900 border ${currentModeConfig.borderColor} dark:border-gray-700`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-semibold ${currentModeConfig.textColor} flex items-center gap-2`}>
                  <span>⚙️</span> Customize Durations
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(MODE_CONFIG).map(([m, config]) => (
                  <div key={m} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span>{config.icon}</span>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {config.label}
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDurationChange(m as ModeKey, durations[m as ModeKey] - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-gray-600 dark:text-gray-300 font-bold transition-colors"
                      >
                        −
                      </button>
                      <div className="flex-1 text-center">
                        <input
                          type="number"
                          min="1"
                          max="90"
                          value={durations[m as ModeKey]}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDurationChange(m as ModeKey, parseInt(e.target.value))}
                          className="w-full text-center text-2xl font-bold bg-transparent border-none focus:outline-none text-gray-800 dark:text-white"
                        />
                        <div className="text-xs text-gray-400 dark:text-gray-500">minutes</div>
                      </div>
                      <button
                        onClick={() => handleDurationChange(m as ModeKey, durations[m as ModeKey] + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-gray-600 dark:text-gray-300 font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 mb-8">
            {Object.entries(MODE_CONFIG).map(([m, config]) => (
              <button
                key={m}
                onClick={() => handleModeChange(m as ModeKey)}
                disabled={isRunning}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all transform ${
                  mode === m
                    ? `bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} text-white shadow-lg scale-105`
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
                }`}
              >
                <span className="mr-1.5">{config.icon}</span>
                {config.labelShort}
              </button>
            ))}
          </div>

          <div className="flex flex-col items-center mb-8">
            <div className={`relative ${justCompleted ? "animate-bounce" : ""}`}>
              <svg
                width={circleSize}
                height={circleSize}
                className="transform -rotate-90"
              >
                <circle
                  cx={circleSize / 2}
                  cy={circleSize / 2}
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  className="text-gray-100 dark:text-gray-700"
                />
                <circle
                  cx={circleSize / 2}
                  cy={circleSize / 2}
                  r={radius}
                  fill="none"
                  stroke={getModeGradientColor()}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-linear"
                  style={{
                    filter: `drop-shadow(0 0 12px ${getModeGradientColor()}40)`,
                  }}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`text-xs font-semibold uppercase tracking-widest mb-1 ${currentModeConfig.textColor}`}>
                  {currentModeConfig.icon} {currentModeConfig.label}
                </div>
                <div className={`text-6xl md:text-7xl font-mono font-bold tracking-tight ${
                  justCompleted ? "text-green-500 dark:text-green-400" : "text-gray-800 dark:text-white"
                }`}>
                  {justCompleted ? "✓" : formatTime(timeLeft)}
                </div>
                {justCompleted && (
                  <div className="text-sm font-medium text-green-600 dark:text-green-400 mt-1 animate-pulse">
                    Session Complete!
                  </div>
                )}
                {!justCompleted && isRunning && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Running</span>
                  </div>
                )}
                {!justCompleted && !isRunning && timeLeft < currentDuration && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Paused</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {!isRunning ? (
              <button
                onClick={handleStart}
                disabled={timeLeft === 0}
                className={`px-10 py-3.5 bg-gradient-to-r ${currentModeConfig.gradientFrom} ${currentModeConfig.gradientTo} hover:opacity-90 active:opacity-80 disabled:opacity-40 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2`}
              >
                <span className="text-lg">▶</span>
                Start
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="px-10 py-3.5 bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white font-semibold rounded-xl shadow-lg shadow-yellow-500/25 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span className="text-lg">⏸</span>
                Pause
              </button>
            )}

            <button
              onClick={handleReset}
              disabled={timeLeft === currentDuration && !isRunning}
              className="px-6 py-3.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-all"
            >
              ↺ Reset
            </button>

            <button
              onClick={handleSkip}
              disabled={isRunning && timeLeft === currentDuration}
              className="px-6 py-3.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-all"
            >
              ⏭ Skip
            </button>

            <button
              onClick={handleFullscreen}
              className="px-6 py-3.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-all"
            >
              {isFullscreen ? "✕ Exit" : "⛶ Full"}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`bg-gradient-to-br ${MODE_CONFIG[MODES.FOCUS].bgFrom} ${MODE_CONFIG[MODES.FOCUS].bgTo} dark:from-gray-900 dark:to-gray-900 rounded-xl p-4 border ${MODE_CONFIG[MODES.FOCUS].borderColor} dark:border-gray-700`}>
              <div className={`text-sm ${MODE_CONFIG[MODES.FOCUS].textColor} font-medium mb-1 flex items-center gap-1.5`}>
                <span>{MODE_CONFIG[MODES.FOCUS].icon}</span> Focus
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {durations[MODES.FOCUS]}m
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">per session</div>
            </div>

            <div className={`bg-gradient-to-br ${MODE_CONFIG[MODES.SHORT_BREAK].bgFrom} ${MODE_CONFIG[MODES.SHORT_BREAK].bgTo} dark:from-gray-900 dark:to-gray-900 rounded-xl p-4 border ${MODE_CONFIG[MODES.SHORT_BREAK].borderColor} dark:border-gray-700`}>
              <div className={`text-sm ${MODE_CONFIG[MODES.SHORT_BREAK].textColor} font-medium mb-1 flex items-center gap-1.5`}>
                <span>{MODE_CONFIG[MODES.SHORT_BREAK].icon}</span> Short Break
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {durations[MODES.SHORT_BREAK]}m
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">after each focus</div>
            </div>

            <div className={`bg-gradient-to-br ${MODE_CONFIG[MODES.LONG_BREAK].bgFrom} ${MODE_CONFIG[MODES.LONG_BREAK].bgTo} dark:from-gray-900 dark:to-gray-900 rounded-xl p-4 border ${MODE_CONFIG[MODES.LONG_BREAK].borderColor} dark:border-gray-700`}>
              <div className={`text-sm ${MODE_CONFIG[MODES.LONG_BREAK].textColor} font-medium mb-1 flex items-center gap-1.5`}>
                <span>{MODE_CONFIG[MODES.LONG_BREAK].icon}</span> Long Break
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {durations[MODES.LONG_BREAK]}m
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">every 4 sessions</div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1 flex items-center gap-1.5">
                <span>🏆</span> Today
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {completedPomodoros} 🍅
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                pomodor{completedPomodoros === 1 ? "o" : "i"}
              </div>
            </div>
          </div>

          {completedPomodoros > 0 && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-3 uppercase tracking-wider">
                Today&apos;s Progress
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: completedPomodoros }, (_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-lg flex items-center justify-center text-sm border border-red-200 dark:border-red-800/30"
                  >
                    🍅
                  </div>
                ))}
              </div>
              {completedPomodoros >= 4 && (
                <div className="mt-3 text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-1.5">
                  <span>🎉</span>
                  You&apos;ve earned a long break!
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
        The Pomodoro Technique uses 25-minute focused sessions with short breaks to maximize productivity.
        <br />
        Durations are automatically saved to your browser.
      </div>
    </div>
  );
};

export default PomodoroTimer;
