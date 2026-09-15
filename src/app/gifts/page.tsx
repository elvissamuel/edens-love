import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { GiftRegistry } from "@/components/GiftRegistry";
import { Navbar } from "@/components/Navbar";
import { wedding } from "@/data/content";

export const metadata: Metadata = {
  title: `Gift list — ${wedding.partnerOne} & ${wedding.partnerTwo}`,
  description:
    "A living list of gifts for Omodolapo and Omotehinse. Mark what has already been received so others know what is still needed.",
};

export default function GiftsPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex-1 pt-12 sm:pt-16">
        <GiftRegistry />
        <div className="px-5 pb-20 text-center">
          <Link
            href="/#rsvp"
            className="inline-flex rounded-full border border-gold px-7 py-3 font-sans text-[0.68rem] uppercase tracking-[0.28em] text-gold-deep transition hover:bg-gold hover:text-white"
          >
            Return to the celebration
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
