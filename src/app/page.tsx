"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TimeLeft = {
  hours: number;
  minutes: number;
  seconds: number;
};

export default function ComingSoonPage() {
  const [targetTimestamp, setTargetTimestamp] = useState<number | null>(null);

  const calculateTimeLeft = (): TimeLeft => {
    if (targetTimestamp === null) {
      return { hours: 48, minutes: 0, seconds: 0 };
    }

    const now = Date.now();
    const diff = targetTimestamp - now;

    return {
      hours: Math.max(Math.floor(diff / (1000 * 60 * 60)), 0),
      minutes: Math.max(Math.floor((diff / 1000 / 60) % 60), 0),
      seconds: Math.max(Math.floor((diff / 1000) % 60), 0),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => ({
    hours: 48,
    minutes: 0,
    seconds: 0,
  }));

  useEffect(() => {
    setTargetTimestamp(Date.now() + 48 * 60 * 60 * 1000);

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTimestamp]);

  return (
    <main className="min-h-dvh flex items-center justify-center bg-navy text-offwhite px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold">
          MS <span className="text-electric">DEVX</span>
        </h1>

        <p className="mt-4 text-lg text-offwhite/70">Build smarter. Ship faster.</p>

        <div className="mt-10 grid grid-cols-3 gap-4 text-center">
          <div className="bg-offwhite/10 p-4 rounded-xl">
            <div className="text-3xl font-bold">{timeLeft.hours}</div>
            <div className="text-sm text-offwhite/60">Hours</div>
          </div>

          <div className="bg-offwhite/10 p-4 rounded-xl">
            <div className="text-3xl font-bold">{timeLeft.minutes}</div>
            <div className="text-sm text-offwhite/60">Minutes</div>
          </div>

          <div className="bg-offwhite/10 p-4 rounded-xl">
            <div className="text-3xl font-bold">{timeLeft.seconds}</div>
            <div className="text-sm text-offwhite/60">Seconds</div>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Input
            type="email"
            placeholder="Enter email for early access"
            className="w-full sm:w-72 bg-offwhite text-ink placeholder:text-ink/60"
          />
          <Button className="bg-electric text-white hover:bg-electric/90">
            Notify Me
          </Button>
        </div>

        <p className="mt-6 text-sm text-offwhite/40">
          Something big is loading... AI tools, apps, and dev utilities.
        </p>
      </div>
    </main>
  );
}

