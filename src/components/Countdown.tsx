"use client";

import { useEffect, useMemo, useState } from "react";
import { wedding } from "@/data/content";
import { FadeIn } from "@/components/FadeIn";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function Countdown() {
  const target = useMemo(() => new Date(wedding.isoDate).getTime(), []);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const remaining = Math.max(0, target - (now ?? target));
  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);

  const units = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  return (
    <section className="-mt-16 relative z-20 px-5">
      <FadeIn className="mx-auto max-w-4xl rounded-3xl border border-gold/25 bg-white/90 px-6 py-8 shadow-[0_24px_80px_rgba(74,16,32,0.12)] backdrop-blur-md sm:px-10">
        <p className="text-center font-sans text-[0.68rem] uppercase tracking-[0.4em] text-gold-deep">
          Until we say I do
        </p>
        <div className="mt-6 grid grid-cols-4 gap-3 sm:gap-6">
          {units.map((unit) => (
            <div key={unit.label} className="text-center">
              <p className="font-serif text-3xl text-ink sm:text-5xl">
                {now === null ? "—" : pad(unit.value)}
              </p>
              <p className="mt-2 font-sans text-[0.62rem] uppercase tracking-[0.24em] text-ink-muted">
                {unit.label}
              </p>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
