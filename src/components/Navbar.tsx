"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { wedding } from "@/data/content";

const links = [
  { href: "/#story", label: "Story" },
  { href: "/#day", label: "The Day" },
  { href: "/#venue", label: "Venue" },
  { href: "/#rsvp", label: "RSVP" },
  { href: "/gifts", label: "Gifts" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const solid = scrolled || pathname !== "/" || menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const linkTone = solid ? "text-ink-muted" : "text-ivory/85";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid
          ? "bg-ivory/95 shadow-[0_10px_40px_rgba(74,16,32,0.1)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className={`font-serif text-xl tracking-wide transition-colors duration-300 sm:text-2xl ${
            solid ? "text-ink" : "text-ivory"
          }`}
        >
          {wedding.siteName}
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-sans text-[0.7rem] uppercase tracking-[0.28em] transition-colors duration-300 hover:text-gold ${linkTone} ${
                pathname === "/gifts" && link.href === "/gifts" ? "text-gold" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/#rsvp"
            className={`hidden rounded-full border px-4 py-2 font-sans text-[0.65rem] uppercase tracking-[0.24em] transition-all duration-300 md:inline-flex ${
              solid
                ? "border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
                : "border-ivory/50 text-ivory hover:border-ivory hover:bg-ivory/10"
            }`}
          >
            Will you come
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className={`relative flex h-11 w-11 items-center justify-center rounded-full border md:hidden ${
              solid
                ? "border-gold/30 text-burgundy"
                : "border-ivory/40 text-ivory"
            }`}
          >
            <span
              className={`absolute h-px w-5 bg-current transition duration-300 ${
                menuOpen ? "translate-y-0 rotate-45" : "-translate-y-1.5"
              }`}
            />
            <span
              className={`absolute h-px w-5 bg-current transition duration-300 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute h-px w-5 bg-current transition duration-300 ${
                menuOpen ? "translate-y-0 -rotate-45" : "translate-y-1.5"
              }`}
            />
          </button>
        </div>
      </nav>

      {menuOpen ? (
        <div className="border-t border-gold/15 bg-ivory md:hidden">
          <div className="flex flex-col gap-1 px-5 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-2xl px-4 py-3 font-sans text-[0.72rem] uppercase tracking-[0.28em] text-ink transition hover:bg-cream hover:text-burgundy ${
                  pathname === "/gifts" && link.href === "/gifts" ? "text-gold" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#rsvp"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-full bg-burgundy px-4 py-3 text-center font-sans text-[0.68rem] uppercase tracking-[0.28em] text-white"
            >
              Will you come
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
