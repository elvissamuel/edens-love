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
  const solid = scrolled || pathname !== "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid
          ? "bg-ivory/90 shadow-[0_10px_40px_rgba(74,16,32,0.1)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          href="/"
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
              className={`font-sans text-[0.7rem] uppercase tracking-[0.28em] transition-colors duration-300 hover:text-gold ${
                solid ? "text-ink-muted" : "text-ivory/85"
              } ${pathname === "/gifts" && link.href === "/gifts" ? "text-gold" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <Link
          href="/#rsvp"
          className={`rounded-full border px-4 py-2 font-sans text-[0.65rem] uppercase tracking-[0.24em] transition-all duration-300 ${
            solid
              ? "border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
              : "border-ivory/50 text-ivory hover:border-ivory hover:bg-ivory/10"
          }`}
        >
          Will you come
        </Link>
      </nav>
      <div
        className={`flex gap-5 overflow-x-auto px-5 pb-3 md:hidden ${
          solid ? "text-ink-muted" : "text-ivory/85"
        }`}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap font-sans text-[0.65rem] uppercase tracking-[0.22em]"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
