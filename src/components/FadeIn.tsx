"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="font-sans text-[0.7rem] font-medium uppercase tracking-[0.42em] text-gold-deep">
        {kicker}
      </p>
      <h2 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl">
        {title}
      </h2>
      <span className="mx-auto mt-5 block h-px w-16 bg-gold" />
      {subtitle ? (
        <p className="mt-5 font-sans text-base leading-relaxed text-ink-muted">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
