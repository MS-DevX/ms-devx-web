"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ResultBox from "@/components/tools/tool-uis/shared/ResultBox";

interface IntervalOption {
  value: number;
  label: string;
  recommended?: boolean;
}

const intervals: IntervalOption[] = [
  { value: 5, label: "5 min" },
  { value: 10, label: "10 min" },
  { value: 15, label: "15 min" },
  { value: 20, label: "20 min", recommended: true },
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "60 min" },
];

interface BreakDuration {
  value: number;
  label: string;
  recommended?: boolean;
}

const breakDurations: BreakDuration[] = [
  { value: 20, label: "20 sec" },
  { value: 30, label: "30 sec" },
  { value: 60, label: "1 min" },
  { value: 120, label: "2 min", recommended: true },
  { value: 300, label: "5 min" },
];

interface SoundOption {
  value: string;
  label: string;
}

const soundOptions: SoundOption[] = [
  { value: "bell", label: "Bell" },
  { value: "chime", label: "Chime" },
  { value: "beep", label: "Beep" },
  { value: "soft", label: "Soft Tone" },
];

const eyeTips: string[] = [
  "Look at something 20 feet away for 20 seconds.",
  "Close your eyes and gently roll them in circles.",
  "Palming: rub palms together, cup over closed eyes.",
  "Blink slowly 10 times to moisturize your eyes.",
  "Focus on a far-away object, then a near one. Repeat.",
  "Trace a figure-8 with your eyes.",
  "Look up, down, left, and right slowly."
];

const stretchTips: string[] = [
  "Roll your shoulders backward and forward.",
  "Gently tilt your head side to side.",
  "Stand up and touch your toes.",
  "Interlace fingers and stretch arms overhead.",
  "Rotate your wrists and ankles.",
  "Stand and do 5 slow squats.",
  "Shrug shoulders up to ears, hold, release."
];

function playSound(type: string): void {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "bell") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.setValueAtTime(600, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } else if (type === "chime") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.12);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.24);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.6);
    } else if (type === "beep") {
      osc.type = "square";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } else {
      osc.type = "sine";
      osc.frequency.setValueAtTime(432, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.8);
    }
  } catch { /* audio unavailable */ }
}

type TimerStatus = "idle" | "work" | "paused";

export default function ScreenTimeBreakReminder() {
  const [intervalMin, setIntervalMin] = useState<number>(20);
  const [breakSec, setBreakSec] = useState<number>(60);
  const [sound, setSound] = useState<string>("bell");
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [productivityMode, setProductivityMode] = useState<boolean>(false);

  const [status, setStatus] = useState<TimerStatus>("idle");
  const [timeLeft, setTimeLeft] = useState<number>(20 * 60);
  const [breakTimeLeft, setBreakTimeLeft] = useState<number>(60);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [todayBreaks, setTodayBreaks] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("screenBreak_msdevx");
      if (saved) {
        const data = JSON.parse(saved);
        if (data.date === new Date().toDateString()) {
          return data.breaks || 0;
        }
      }
    } catch { /* ignore */ }
    return 0;
  });
  const [todayBreakSecs, setTodayBreakSecs] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("screenBreak_msdevx");
      if (saved) {
        const data = JSON.parse(saved);
        if (data.date === new Date().toDateString()) {
          return data.breakSecs || 0;
        }
      }
    } catch { /* ignore */ }
    return 0;
  });
  const [tipIndex, setTipIndex] = useState<number>(0);
  const [prevTabTitle, setPrevTabTitle] = useState<string>("");

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const breakIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setTimeLeft(intervalMin * 60);
  }, [intervalMin]);

  useEffect(() => {
    setBreakTimeLeft(breakSec);
  }, [breakSec]);

  const saveStats = useCallback((breaks: number, secs: number): void => {
    try {
      localStorage.setItem("screenBreak_msdevx", JSON.stringify({
        date: new Date().toDateString(),
        breaks,
        breakSecs: secs,
      }));
    } catch { /* ignore */ }
  }, []);

  const showBreakOverlay = useCallback((): void => {
    setShowOverlay(true);
    setTipIndex(Math.floor(Math.random() * eyeTips.length));
    setBreakTimeLeft(breakSec);

    if (productivityMode) {
      try {
        setPrevTabTitle(document.title);
        document.title = "⏰ Time for a break!";
      } catch { /* ignore */ }
    }

    if (soundOn) playSound(sound);

    breakIntervalRef.current = setInterval(() => {
      setBreakTimeLeft((prev: number) => {
        if (prev <= 1) {
          clearInterval(breakIntervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [breakSec, soundOn, sound, productivityMode]);

  const dismissBreak = useCallback((): void => {
    clearInterval(breakIntervalRef.current!);
    setShowOverlay(false);
    setTimeLeft(intervalMin * 60);
    setStatus("work");
    setTodayBreaks((p: number) => {
      const newVal = p + 1;
      setTodayBreakSecs((s: number) => {
        saveStats(newVal, s + breakSec);
        return s + breakSec;
      });
      return newVal;
    });

    if (productivityMode) {
      try { document.title = prevTabTitle; } catch { /* ignore */ }
    }
  }, [intervalMin, breakSec, productivityMode, prevTabTitle, saveStats]);

  const startTimer = useCallback((): void => {
    if (status === "idle" || status === "paused") {
      setStatus("work");
    }
  }, [status]);

  const pauseTimer = useCallback((): void => {
    if (status === "work") {
      setStatus("paused");
    }
  }, [status]);

  const resetTimer = useCallback((): void => {
    clearInterval(intervalRef.current!);
    clearInterval(breakIntervalRef.current!);
    setStatus("idle");
    setTimeLeft(intervalMin * 60);
    setShowOverlay(false);
    if (productivityMode) {
      try { document.title = prevTabTitle; } catch { /* ignore */ }
    }
  }, [intervalMin, productivityMode, prevTabTitle]);

  useEffect(() => {
    if (status === "work") {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev: number) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            showBreakOverlay();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      try { setPrevTabTitle(document.title); } catch { /* ignore */ }
    }

    return () => {
      clearInterval(intervalRef.current!);
    };
  }, [status, showBreakOverlay]);

  const totalMins: number = intervalMin;
  const elapsedSecs: number = totalMins * 60 - timeLeft;
  const pctComplete: number = Math.min(100, (elapsedSecs / (totalMins * 60)) * 100);

  const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent): void => {
    if (e.key === " " && showOverlay) {
      e.preventDefault();
      dismissBreak();
    }
  }, [showOverlay, dismissBreak]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Break Interval</label>
          <div className="flex flex-wrap gap-1.5">
            {intervals.map((i: IntervalOption) => (
              <button key={i.value} onClick={() => { setIntervalMin(i.value); if (status === "idle") setTimeLeft(i.value * 60); }} disabled={status === "work"} className={`px-3 py-2 rounded-lg text-xs font-medium border-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${intervalMin === i.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-[var(--bg-card)] text-muted-foreground hover:border-primary/50"}`} aria-pressed={intervalMin === i.value}>{i.label}{i.recommended ? " ★" : ""}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Break Duration</label>
          <div className="flex flex-wrap gap-1.5">
            {breakDurations.map((b: BreakDuration) => (
              <button key={b.value} onClick={() => setBreakSec(b.value)} disabled={status === "work"} className={`px-3 py-2 rounded-lg text-xs font-medium border-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${breakSec === b.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-[var(--bg-card)] text-muted-foreground hover:border-primary/50"}`} aria-pressed={breakSec === b.value}>{b.label}{b.recommended ? " ★" : ""}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Notification Sound</label>
          <div className="flex items-center gap-2">
            <button onClick={() => setSoundOn((p: boolean) => !p)} className={`px-3 py-2 rounded-lg text-xs font-medium border-2 transition-all cursor-pointer ${soundOn ? "border-primary bg-primary/10 text-primary" : "border-border bg-[var(--bg-card)] text-muted-foreground hover:border-primary/50"}`} aria-pressed={soundOn}>{soundOn ? "Sound On" : "Sound Off"}</button>
            <select value={sound} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSound(e.target.value)} disabled={!soundOn} className="flex-1 px-3 py-2 rounded-lg border border-border bg-[var(--bg-card)] text-foreground text-xs focus:border-primary focus:outline-none disabled:opacity-50" aria-label="Sound type">
              {soundOptions.map((s: SoundOption) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <button onClick={() => { if (soundOn) playSound(sound); }} disabled={!soundOn} className="shrink-0 px-2.5 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all cursor-pointer disabled:opacity-40 text-xs" aria-label="Preview sound">▶</button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={productivityMode} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProductivityMode(e.target.checked)} disabled={status === "work"} className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 disabled:opacity-50" />
          <span className="text-sm text-foreground font-medium">Productivity Mode</span>
        </label>
        <span className="text-xs text-muted-foreground">Changes the page title and shows tab notification during breaks.</span>
      </div>

      <div className="bg-muted rounded-2xl p-8 border border-border mb-6 text-center">
        <div className="relative inline-flex items-center justify-center mb-4">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border)" strokeWidth="8" />
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--primary)" strokeWidth="8" strokeDasharray={`${2 * Math.PI * 52}`} strokeDashoffset={`${2 * Math.PI * 52 * (1 - pctComplete / 100)}`} strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-foreground font-mono tracking-wider">{formatTime(timeLeft)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {status === "idle" ? "Ready" : status === "paused" ? "Paused" : "Working"}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          {(status === "idle" || status === "paused") && (
            <button onClick={startTimer} className="px-6 py-2.5 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition-all cursor-pointer text-sm">Start</button>
          )}
          {status === "work" && (
            <button onClick={pauseTimer} className="px-6 py-2.5 rounded-xl bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition-all cursor-pointer text-sm">Pause</button>
          )}
          {status !== "idle" && (
            <button onClick={resetTimer} className="px-6 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-red-400 transition-all cursor-pointer text-sm">Reset</button>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          {status === "idle" && "Set your preferences and click Start to begin tracking."}
          {status === "work" && `Next break in ${formatTime(timeLeft)}. Keep going!`}
          {status === "paused" && "Timer paused. Click Start to resume."}
        </p>
      </div>

      {showOverlay && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onKeyDown={handleKeyDown} tabIndex={0} ref={(el: HTMLDivElement | null) => el?.focus()}>
          <div className="bg-[var(--bg-card)] rounded-3xl shadow-2xl max-w-lg w-full p-8 md:p-10 text-center border border-border">
            <div className="text-5xl mb-4">🧘</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Time for a Break!</h2>
            <p className="text-muted-foreground text-sm mb-6">Stand up, stretch, and rest your eyes.</p>

            <div className="text-4xl font-bold text-primary font-mono mb-6">{formatTime(breakTimeLeft)}</div>

            <div className="bg-muted rounded-xl p-4 border border-border mb-6">
              <p className="text-xs text-muted-foreground font-semibold mb-2">👁️ Eye Care Tip</p>
              <p className="text-sm text-foreground">{eyeTips[tipIndex % eyeTips.length]}</p>
              <p className="text-xs text-muted-foreground font-semibold mt-3 mb-1">🤸 Stretch Suggestion</p>
              <p className="text-sm text-foreground">{stretchTips[tipIndex % stretchTips.length]}</p>
            </div>

            <button onClick={dismissBreak} className="w-full px-6 py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition-all cursor-pointer text-base">
              {breakTimeLeft > 0 ? "Skip Break" : "Back to Work"}
            </button>
            <p className="text-xs text-muted-foreground mt-3">Press Space to dismiss</p>
          </div>
        </div>
      )}

      <ResultBox show={todayBreaks > 0}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-muted rounded-xl p-4 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Breaks Today</div>
            <div className="text-2xl font-bold text-foreground">{todayBreaks}</div>
          </div>
          <div className="bg-muted rounded-xl p-4 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Break Time Today</div>
            <div className="text-2xl font-bold text-foreground">{formatTime(todayBreakSecs)}</div>
          </div>
          <div className="bg-muted rounded-xl p-4 text-center border border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Avg Break Length</div>
            <div className="text-2xl font-bold text-foreground">{todayBreaks > 0 ? formatTime(Math.round(todayBreakSecs / todayBreaks)) : "0:00"}</div>
          </div>
        </div>
      </ResultBox>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Why Take Screen Breaks?</h2>
        <div className="bg-muted rounded-xl p-6 border border-border space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>Staring at screens for prolonged periods can cause <strong>digital eye strain</strong>, also known as computer vision syndrome. Symptoms include dry eyes, headaches, blurred vision, and neck or shoulder pain.</p>
          <p>Taking regular breaks using the <strong>20-20-20 rule</strong> — every 20 minutes, look at something 20 feet away for 20 seconds — can significantly reduce eye strain and improve focus throughout the day.</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Tips for Effective Breaks</h2>
        <div className="bg-muted rounded-xl p-6 border border-border space-y-3 text-sm text-muted-foreground leading-relaxed">
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Stand up and move:</strong> Sitting for hours is linked to multiple health risks.</li>
            <li><strong>Change your focus:</strong> Look at distant objects to relax your eye muscles.</li>
            <li><strong>Hydrate:</strong> Drink water during your break.</li>
            <li><strong>Stretch:</strong> Brief stretches reduce muscle tension in your neck, shoulders, and back.</li>
            <li><strong>Blink:</strong> We blink less when staring at screens, leading to dry eyes.</li>
            <li><strong>Adjust lighting:</strong> Reduce screen glare and ensure your room is well lit.</li>
            <li><strong>Use the 20-20-20 rule:</strong> Every 20 min, look 20 feet away for 20 seconds.</li>
          </ul>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              What is the ideal break interval?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              The 20-20-20 rule suggests breaks every 20 minutes. For deep focus work, a 45-60 minute
              session with a 5-minute break is popular (often called the Pomodoro Technique). Choose
              what fits your workflow best.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              What does Productivity Mode do?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Productivity Mode changes your browser tab title to &quot;⏰ Time for a break!&quot; when a break
              is due, making it easier to notice even if you are looking at another tab or window. The
              title reverts when you dismiss the break. This only affects this browser tab.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Does this work if I close the browser tab?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              No. Like all web-based timers, the timer only runs while the page is open. However, the
              sound and fullscreen overlay will trigger if the tab is in the background when the break
              is due, as long as the browser tab remains open.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Can I customize the notification sound?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Yes. Choose from Bell, Chime, Beep, or Soft Tone in the sound selector. Even with sound
              off, the fullscreen overlay will appear to remind you. Sounds are generated locally in
              your browser using the Web Audio API — no audio files are loaded.
            </p>
          </details>
          <details className="bg-muted rounded-xl border border-border p-4 group">
            <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
              Does the timer continue if I switch tabs?
              <span className="text-muted-foreground text-xl transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Yes. JavaScript timers using setInterval continue running in background tabs in most
              modern browsers. The break overlay will appear when the timer expires, and if sound is
              enabled, you will hear the notification.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
