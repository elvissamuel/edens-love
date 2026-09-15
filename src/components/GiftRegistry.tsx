"use client";

import { useEffect, useState } from "react";
import { FadeIn, SectionHeading } from "@/components/FadeIn";
import { initialGifts } from "@/data/content";
import type { GiftRecord } from "@/types";

const emptyGifts: GiftRecord[] = initialGifts.map((gift) => ({
  ...gift,
  claimed: false,
  claimedBy: null,
  claimedAt: null,
}));

export function GiftRegistry() {
  const [gifts, setGifts] = useState<GiftRecord[]>(emptyGifts);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [name, setName] = useState("");

  async function loadGifts() {
    const response = await fetch("/api/gifts", { cache: "no-store" });
    const payload = (await response.json()) as { gifts: GiftRecord[] };
    setGifts(payload.gifts);
  }

  useEffect(() => {
    void loadGifts();
  }, []);

  async function toggle(id: string) {
    const gift = gifts.find((item) => item.id === id);
    if (!gift) return;
    if (!gift.claimed && !name.trim()) {
      setClaimingId(id);
      return;
    }

    setGifts((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              claimed: !item.claimed,
              claimedBy: item.claimed ? null : name.trim() || "A loved one",
            }
          : item,
      ),
    );

    await fetch("/api/gifts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, claimedBy: name }),
    });
    setClaimingId(null);
    await loadGifts();
  }

  return (
    <section id="gifts" className="px-5 py-24 sm:py-32">
      <FadeIn>
        <SectionHeading
          kicker="With gratitude"
          title="A list of possible gifts"
          subtitle="Your presence is the dearest gift. If you wish to bring something more, please choose from this list — and check off what has already been received so no one buys what we already have."
        />
      </FadeIn>

      <FadeIn delay={0.1} className="mx-auto mt-10 max-w-xl">
        <label className="block">
          <span className="mb-2 block text-center font-sans text-[0.68rem] uppercase tracking-[0.24em] text-gold-deep">
            Your name, when marking a gift
          </span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="So the couple knows who to thank"
            className="w-full rounded-full border border-gold/25 bg-white px-5 py-3 text-center font-sans text-ink outline-none transition focus:border-gold"
          />
        </label>
      </FadeIn>

      <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
        {gifts.map((gift, index) => (
          <FadeIn key={gift.id} delay={index * 0.04}>
            <article
              className={`relative overflow-hidden rounded-3xl border transition duration-500 ${
                gift.claimed
                  ? "border-gold/10 bg-white/50 text-ink-muted"
                  : "border-gold/25 bg-white hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(107,28,49,0.12)]"
              }`}
            >
              {gift.claimed ? (
                <span className="absolute right-4 top-4 z-10 rounded-full bg-ivory/90 px-3 py-1 font-sans text-[0.62rem] uppercase tracking-[0.2em] text-burgundy">
                  Received
                </span>
              ) : null}
              {gift.image ? (
                <img
                  src={gift.image}
                  alt={gift.name}
                  className={`h-44 w-full object-cover ${gift.claimed ? "opacity-55 grayscale-[30%]" : ""}`}
                />
              ) : null}
              <div className="p-6">
              <h3
                className={`pr-20 font-serif text-2xl text-ink ${
                  gift.claimed ? "line-through decoration-gold/60" : ""
                }`}
              >
                {gift.name}
              </h3>
              <p className="mt-2 font-sans text-sm leading-6">{gift.detail}</p>
              <p className="mt-3 font-sans text-xs italic text-gold-deep">
                {gift.hint}
              </p>
              {gift.claimed && gift.claimedBy ? (
                <p className="mt-3 font-sans text-xs uppercase tracking-[0.18em] text-ink-muted">
                  Kindly given by {gift.claimedBy}
                </p>
              ) : null}
              <button
                type="button"
                onClick={() => void toggle(gift.id)}
                className={`mt-5 rounded-full border px-4 py-2 font-sans text-[0.65rem] uppercase tracking-[0.22em] transition ${
                  gift.claimed
                    ? "border-gold/20 text-ink-muted hover:border-gold hover:text-gold-deep"
                    : "border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
                }`}
              >
                {gift.claimed ? "Unmark this gift" : "We already have this"}
              </button>
              {claimingId === gift.id && !name.trim() ? (
                <p className="mt-3 font-sans text-xs text-rose-800">
                  Please add your name above before marking a gift.
                </p>
              ) : null}
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
