"use client";

import { useState, useEffect, useRef } from "react";

interface StudySession {
  id: number;
  name: string;
  duration: number;
  startTime: number;
  endTime: number;
  date: string;
}

interface TodayStats {
  count: number;
  totalMs: number;
  totalSeconds: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface WeeklyDay {
  date: string;
  dayName: string;
  ms: number;
  percentage: number;
  isToday: boolean;
}

interface TotalStats {
  totalSessions: number;
  totalMs: number;
  totalSeconds: number;
  hours: number;
  minutes: number;
  uniqueDays: number;
}

const StudyTimer = () => {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessions, setSessions] = useState<StudySession[]>(() => {
    try {
      const saved = localStorage.getItem("studySessions_msdevx");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [sessionName, setSessionName] = useState<string>("");
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimestampRef = useRef<number | null>(null);
  const accumulatedRef = useRef<number>(0);

  useEffect(() => {
    try {
      localStorage.setItem("studySessions_msdevx", JSON.stringify(sessions));
    } catch {
      // ignore
    }
  }, [sessions]);

  useEffect(() => {
    if (isRunning) {
      startTimestampRef.current = Date.now() - accumulatedRef.current;
      intervalRef.current = setInterval(() => {
        accumulatedRef.current = Date.now() - startTimestampRef.current!;
        setTime(accumulatedRef.current);
      }, 10);
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
  }, [isRunning]);

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);

    return [hours, minutes, seconds, centiseconds]
      .map((val: number) => String(val).padStart(2, "0"))
      .join(":")
      .replace(/^00:/g, "")
      .replace(/^00:/g, "");
  };

  const formatTimeLong = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);

    return parts.join(" ");
  };

  const handleStart = (): void => {
    setIsRunning(true);
  };

  const handlePause = (): void => {
    setIsRunning(false);
  };

  const handleReset = (): void => {
    setIsRunning(false);
    accumulatedRef.current = 0;
    setTime(0);
  };

  const handleSave = (): void => {
    if (time < 1000) return;

    const newSession: StudySession = {
      id: Date.now(),
      name: sessionName.trim() || "Unnamed Session",
      duration: time,
      startTime: Date.now() - time,
      endTime: Date.now(),
      date: new Date().toISOString().split("T")[0],
    };

    setSessions((prev: StudySession[]) => [newSession, ...prev]);
    handleReset();
    setSessionName("");
  };

  const handleDeleteSession = (id: number): void => {
    setSessions((prev: StudySession[]) => prev.filter((s: StudySession) => s.id !== id));
  };

  const handleClearHistory = (): void => {
    setSessions([]);
    localStorage.removeItem("studySessions_msdevx");
  };

  const getTodayStats = (): TodayStats => {
    const today = new Date().toISOString().split("T")[0];
    const todaySessions = sessions.filter((s: StudySession) => s.date === today);
    const totalMs = todaySessions.reduce((sum: number, s: StudySession) => sum + s.duration, 0);
    const totalSeconds = Math.floor(totalMs / 1000);

    return {
      count: todaySessions.length,
      totalMs,
      totalSeconds,
      hours: Math.floor(totalSeconds / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    };
  };

  const getWeeklyStats = (): WeeklyDay[] => {
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 6);
    weekAgo.setHours(0, 0, 0, 0);

    const weeklyData: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekAgo);
      d.setDate(weekAgo.getDate() + i);
      const key = d.toISOString().split("T")[0];
      weeklyData[key] = 0;
    }

    sessions.forEach((s: StudySession) => {
      if (weeklyData[s.date] !== undefined) {
        weeklyData[s.date] += s.duration;
      }
    });

    const maxMs = Math.max(...Object.values(weeklyData), 1);
    const dayNames: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return Object.entries(weeklyData).map(([date, ms]: [string, number]) => {
      const d = new Date(date + "T00:00:00");
      const isToday = date === new Date().toISOString().split("T")[0];
      return {
        date,
        dayName: dayNames[d.getDay()],
        ms,
        percentage: Math.round((ms / maxMs) * 100),
        isToday,
      };
    });
  };

  const getTotalStats = (): TotalStats => {
    const totalMs = sessions.reduce((sum: number, s: StudySession) => sum + s.duration, 0);
    const totalSeconds = Math.floor(totalMs / 1000);
    const uniqueDays = new Set(sessions.map((s: StudySession) => s.date)).size;

    return {
      totalSessions: sessions.length,
      totalMs,
      totalSeconds,
      hours: Math.floor(totalSeconds / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      uniqueDays,
    };
  };

  const todayStats = getTodayStats();
  const weeklyStats = getWeeklyStats();
  const totalStats = getTotalStats();

  const getDisplayTime = (): string => {
    if (time === 0) return "00:00";
    const display = formatTime(time);
    return display.length <= 5 ? display : display;
  };

  const getCentiseconds = (): string => {
    if (time === 0) return ".00";
    const cs = Math.floor((time % 1000) / 10);
    return `.${String(cs).padStart(2, "0")}`;
  };

  const hoursFromTime = Math.floor(time / 3600000);
  const minutesFromTime = Math.floor((time % 3600000) / 60000);
  const hasHours = hoursFromTime > 0;
  const hasMinutes = minutesFromTime > 0 || hoursFromTime > 0;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📚</span>
            <div>
              <h1 className="text-xl font-bold text-white">Study Timer</h1>
              <p className="text-green-100 text-sm">Track your focus and study sessions</p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className={`text-6xl md:text-8xl font-mono font-bold tracking-tight transition-colors ${
                isRunning ? "text-green-600 dark:text-green-400" : "text-gray-800 dark:text-white"
              }`}>
                <span>{getDisplayTime()}</span>
                <span className="text-3xl md:text-5xl text-gray-400 dark:text-gray-500">{getCentiseconds()}</span>
              </div>
              <div className={`absolute -top-2 -right-8 flex items-center gap-1 ${
                isRunning ? "text-green-600 dark:text-green-400" : "text-gray-400"
              }`}>
                {isRunning && (
                  <>
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs font-medium uppercase tracking-wider">Running</span>
                  </>
                )}
                {!isRunning && time > 0 && (
                  <>
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    <span className="text-xs font-medium uppercase tracking-wider text-yellow-600 dark:text-yellow-400">Paused</span>
                  </>
                )}
              </div>
            </div>
            {time > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">
                {hasHours && <span className="mr-3">{hoursFromTime}h</span>}
                {hasMinutes && <span className="mr-3">{minutesFromTime}m</span>}
                <span>{Math.floor((time % 60000) / 1000)}s</span>
              </p>
            )}
          </div>

          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={sessionName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSessionName(e.target.value)}
                placeholder="What are you studying? (e.g., Math, Physics, Essay...)"
                className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600">
                ✏️
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="px-8 py-3.5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold rounded-xl shadow-lg shadow-green-600/25 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span className="text-lg">▶</span>
                Start
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="px-8 py-3.5 bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white font-semibold rounded-xl shadow-lg shadow-yellow-500/25 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span className="text-lg">⏸</span>
                Pause
              </button>
            )}

            <button
              onClick={handleReset}
              disabled={time === 0}
              className="px-6 py-3.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-all"
            >
              Reset
            </button>

            <button
              onClick={handleSave}
              disabled={time < 1000}
              className="px-8 py-3.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-teal-600/25 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span className="text-lg">💾</span>
              Save Session
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800/30">
              <div className="text-sm text-green-600 dark:text-green-400 font-medium mb-1">Today</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {todayStats.hours > 0 ? `${todayStats.hours}h ` : ""}
                {todayStats.minutes}m
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {todayStats.count} session{todayStats.count !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30">
              <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Total Sessions</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {totalStats.totalSessions}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                across {totalStats.uniqueDays} day{totalStats.uniqueDays !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800/30">
              <div className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">Total Time</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {totalStats.hours}h {totalStats.minutes}m
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                all time
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-4 border border-orange-100 dark:border-orange-800/30">
              <div className="text-sm text-orange-600 dark:text-orange-400 font-medium mb-1">Avg/Session</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {totalStats.totalSessions > 0
                  ? Math.floor(totalStats.totalSeconds / totalStats.totalSessions / 60)
                  : 0}m
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                average duration
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <span>📊</span> Weekly Overview
              </h3>
              <button
                onClick={() => setShowStats(!showStats)}
                className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors"
              >
                {showStats ? "Hide" : "Show Details"}
              </button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex items-end justify-between gap-2 h-32">
                {weeklyStats.map((day: WeeklyDay) => (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col items-center justify-end h-20">
                      {day.ms > 0 && showStats && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
                          {Math.floor(day.ms / 60000)}m
                        </div>
                      )}
                      <div
                        className={`w-full max-w-[40px] rounded-t-lg transition-all ${
                          day.isToday
                            ? "bg-gradient-to-t from-green-600 to-green-400 dark:from-green-500 dark:to-green-400"
                            : "bg-gradient-to-t from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-500"
                        }`}
                        style={{
                          height: day.ms === 0 ? "4px" : `${Math.max(day.percentage * 0.8, 10)}%`,
                          minHeight: "4px",
                          maxHeight: "100%",
                        }}
                      />
                    </div>
                    <div className={`text-xs font-medium ${
                      day.isToday
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {day.dayName}
                    </div>
                    {day.isToday && (
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <span>📋</span> Session History
                {sessions.length > 0 && (
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2 py-0.5 rounded-full">
                    {sessions.length}
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-3">
                {sessions.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors"
                >
                  {showHistory ? "Collapse" : `View ${sessions.length > 0 ? "All" : ""}`}
                </button>
              </div>
            </div>

            {sessions.length === 0 && (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-10 text-center border border-gray-200 dark:border-gray-700 border-dashed">
                <div className="text-5xl mb-4">⏱️</div>
                <h4 className="text-gray-700 dark:text-gray-300 font-semibold mb-2">No sessions yet</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                  Start the timer above and save your first study session to begin tracking your progress.
                </p>
              </div>
            )}

            {sessions.length > 0 && !showHistory && (
              <div className="space-y-2">
                {sessions.slice(0, 3).map((session: StudySession) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-xl px-5 py-3.5 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-800 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/40 dark:to-teal-900/40 rounded-lg flex items-center justify-center text-lg">
                        📖
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white">
                          {session.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(session.endTime).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-mono font-semibold text-gray-800 dark:text-white">
                          {formatTimeLong(session.duration)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-all p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                        aria-label="Delete session"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
                {sessions.length > 3 && (
                  <button
                    onClick={() => setShowHistory(true)}
                    className="w-full py-3 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors"
                  >
                    Show {sessions.length - 3} more session{sessions.length - 3 !== 1 ? "s" : ""}
                  </button>
                )}
              </div>
            )}

            {sessions.length > 0 && showHistory && (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {sessions.map((session: StudySession) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-xl px-5 py-3.5 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-800 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/40 dark:to-teal-900/40 rounded-lg flex items-center justify-center text-lg">
                        📖
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white">
                          {session.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(session.endTime).toLocaleString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-mono font-semibold text-gray-800 dark:text-white">
                          {formatTimeLong(session.duration)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-all p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                        aria-label="Delete session"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
        Sessions are automatically saved to your browser&apos;s local storage.
      </div>
    </div>
  );
};

export default StudyTimer;
