"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { wedding } from "@/data/content";

export function PhotoCarousel() {
  const photos = wedding.photos;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback(
    (next: number, dir: number) => {
      setDirection(dir);
      setIndex((next + photos.length) % photos.length);
    },
    [photos.length],
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      goTo(index + 1, 1);
    }, 5600);
    return () => window.clearInterval(timer);
  }, [goTo, index]);

  return (
    <section id="top" className="relative h-[100svh] min-h-[640px] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-10">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={photos[index].src}
            src={photos[index].src}
            alt={photos[index].alt}
            custom={direction}
            initial={{ opacity: 0, scale: 1.08, x: direction * 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 1.04, x: direction * -48 }}
            transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto absolute inset-0 h-full w-full object-cover object-center md:object-[center_20%]"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70) goTo(index + 1, 1);
              if (info.offset.x > 70) goTo(index - 1, -1);
            }}
          />
        </AnimatePresence>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-b from-burgundy-deep/70 via-burgundy/35 to-cream" />
      <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,rgba(74,16,32,0.38)_0%,rgba(74,16,32,0.22)_55%,rgba(74,16,32,0.5)_100%)]" />

      <div className="pointer-events-none relative z-30 flex h-full flex-col items-center justify-center px-6 text-center text-ivory [text-shadow:0_8px_40px_rgba(74,16,32,0.55)]">
        <p className="animate-rise font-sans text-[0.72rem] uppercase tracking-[0.52em] text-gold-soft">
          Together with their families
        </p>
        <h1 className="animate-rise-delayed mt-6 px-2 font-serif text-5xl leading-tight sm:text-6xl md:text-7xl">
          <span className="block">{wedding.partnerOne}</span>
          <span className=" inline-block font-sans text-2xl font-light italic text-gold-soft sm:text-3xl">
            &
          </span>
          <span className="block">{wedding.partnerTwo}</span>
        </h1>
        <p className="animate-rise-late mt-8 max-w-md font-sans text-sm tracking-[0.18em] text-ivory/90 sm:text-base">
          {wedding.displayDate}
        </p>
        <a
          href="#story"
          className="animate-rise-late pointer-events-auto mt-12 rounded-full border border-ivory/40 px-7 py-3 font-sans text-[0.68rem] uppercase tracking-[0.32em] text-ivory transition hover:border-gold hover:bg-gold/20"
        >
          Enter the celebration
        </a>
      </div>

      <div className="absolute bottom-10 left-0 right-0 z-30 flex items-center justify-center gap-3">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            aria-label={`View photo ${i + 1}`}
            onClick={() => goTo(i, i > index ? 1 : -1)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === index ? "w-10 bg-gold" : "w-3 bg-ivory/45 hover:bg-ivory"
            }`}
          />
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous photo"
        onClick={() => goTo(index - 1, -1)}
        className="absolute left-4 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/30 text-ivory backdrop-blur-sm transition hover:border-gold hover:text-gold sm:flex"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Next photo"
        onClick={() => goTo(index + 1, 1)}
        className="absolute right-4 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/30 text-ivory backdrop-blur-sm transition hover:border-gold hover:text-gold sm:flex"
      >
        ›
      </button>
    </section>
  );
}
