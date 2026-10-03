"use client";

import { useEffect, useState } from "react";
import { FadeIn, SectionHeading } from "@/components/FadeIn";
import { wedding } from "@/data/content";
import type { GiftRecord } from "@/types";

function formatPrice(price: number | null) {
  if (price == null) return null;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
}

function whatsappHref(itemName: string) {
  const text = `Hello, I would like to get the ${itemName} for ${wedding.partnerOne} and ${wedding.partnerTwo}.`;
  return `https://wa.me/${wedding.giving.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function GiftRegistry() {
  const [gifts, setGifts] = useState<GiftRecord[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    void fetch("/api/gifts", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload: { gifts: GiftRecord[] }) => setGifts(payload.gifts ?? []));
  }, []);

  async function copyAccount() {
    await navigator.clipboard.writeText(wedding.giving.accountNumber);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section id="gifts" className="px-5 py-24 sm:py-32">
      <FadeIn>
        <SectionHeading
          kicker="With gratitude"
          title="A list of possible gifts"
          subtitle="Your presence is the dearest gift. If you wish to bless the new home with something from this list, you can transfer to the account below or send a WhatsApp message."
        />
      </FadeIn>

      <FadeIn delay={0.08} className="mx-auto mt-10 max-w-2xl rounded-[2rem] border border-gold/25 bg-white p-6 text-center sm:p-8">
        <p className="font-sans text-[0.68rem] uppercase tracking-[0.24em] text-gold-deep">
          Give a gift
        </p>
        <p className="mt-3 font-serif text-2xl text-ink">
          {wedding.giving.accountName} · {wedding.giving.accountNumber}
        </p>
        <p className="mt-3 font-sans text-sm leading-6 text-ink-muted">
          Transfer to this Palmpay account and put the <strong className="font-medium text-ink">item name in the description</strong>, or chat on WhatsApp.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => void copyAccount()}
            className="rounded-full border border-gold px-5 py-2.5 font-sans text-[0.65rem] uppercase tracking-[0.22em] text-gold-deep transition hover:bg-gold hover:text-white"
          >
            {copied ? "Account copied" : "Copy account number"}
          </button>
          <a
            href={`https://wa.me/${wedding.giving.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-burgundy px-5 py-2.5 font-sans text-[0.65rem] uppercase tracking-[0.22em] text-white transition hover:bg-burgundy-deep"
          >
            WhatsApp {wedding.giving.whatsappDisplay}
          </a>
        </div>
      </FadeIn>

      <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2">
        {gifts.map((gift, index) => (
          <FadeIn key={gift.id} delay={index * 0.04}>
            <article className="overflow-hidden rounded-3xl border border-gold/25 bg-white transition duration-500 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(107,28,49,0.12)]">
              {gift.image ? (
                <img
                  src={gift.image}
                  alt={gift.name}
                  className="h-64 w-full object-cover sm:h-80"
                />
              ) : null}
              <div className="p-6">
                <h3 className="font-serif text-2xl text-ink">{gift.name}</h3>
                {formatPrice(gift.price) ? (
                  <p className="mt-2 font-sans text-sm uppercase tracking-[0.18em] text-burgundy">
                    {formatPrice(gift.price)}
                  </p>
                ) : null}
                <p className="mt-2 font-sans text-sm leading-6">{gift.detail}</p>
                <p className="mt-3 font-sans text-xs italic text-gold-deep">
                  {gift.hint}
                </p>
                <a
                  href={whatsappHref(gift.name)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex rounded-full border border-burgundy px-4 py-2 font-sans text-[0.65rem] uppercase tracking-[0.22em] text-burgundy transition hover:bg-burgundy hover:text-white"
                >
                  Message about this gift
                </a>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
