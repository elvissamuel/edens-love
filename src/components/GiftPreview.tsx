import Link from "next/link";
import { FadeIn, SectionHeading } from "@/components/FadeIn";
import { initialGifts } from "@/data/content";

const previewGifts = initialGifts.slice(0, 3);

export function GiftPreview() {
  return (
    <section id="gifts" className="px-5 py-24 sm:py-32">
      <FadeIn>
        <SectionHeading
          kicker="With gratitude"
          title="A list of possible gifts"
          subtitle="Your presence is the dearest gift. If you wish to bring something more, here is a glimpse of what would bless the new home."
        />
      </FadeIn>
      <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-3">
        {previewGifts.map((gift, index) => (
          <FadeIn key={gift.id} delay={index * 0.06}>
            <article className="overflow-hidden rounded-3xl border border-gold/25 bg-white">
              <img
                src={gift.image}
                alt={gift.name}
                className="h-40 w-full object-cover"
              />
              <div className="p-5">
                <h3 className="font-serif text-xl text-ink">{gift.name}</h3>
                <p className="mt-2 font-sans text-sm leading-6 text-ink-muted">
                  {gift.detail}
                </p>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
      <FadeIn delay={0.2} className="mt-10 text-center">
        <Link
          href="/gifts"
          className="inline-flex rounded-full bg-burgundy px-6 py-3 font-sans text-[0.68rem] uppercase tracking-[0.28em] text-white transition hover:bg-burgundy-deep"
        >
          See the full gift list
        </Link>
      </FadeIn>
    </section>
  );
}
