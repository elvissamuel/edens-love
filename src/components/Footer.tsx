import { wedding } from "@/data/content";

export function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-white/70 px-5 py-12 text-center">
      <p className="font-serif text-3xl text-burgundy">
        {wedding.partnerOne} & {wedding.partnerTwo}
      </p>
      <p className="mt-3 font-sans text-[0.7rem] uppercase tracking-[0.32em] text-gold-deep">
        {wedding.displayDate} · {wedding.venue.city}
      </p>
      <p className="mt-6 font-sans text-sm text-ink-muted">
        With love, from {wedding.siteName}.
      </p>
    </footer>
  );
}
