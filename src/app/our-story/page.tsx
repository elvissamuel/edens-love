import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn, SectionHeading } from "@/components/FadeIn";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { wedding } from "@/data/content";

export const metadata: Metadata = {
  title: `Our Story — ${wedding.partnerOne} & ${wedding.partnerTwo}`,
  description:
    "The rainy Thursday in Ogudu that became the night Omotehinse asked Omodolapo out.",
};

const storyPhotos: Partial<Record<number, (typeof wedding.photos)[number]>> = {
  0: wedding.photos[1],
  2: wedding.photos[2],
  4: wedding.photos[5],
};

export default function OurStoryPage() {
  const paragraphs = wedding.story.paragraphs;

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex-1 pb-24 pt-28 sm:pt-32">
        <section className="px-5">
          <FadeIn>
            <SectionHeading
              kicker={wedding.story.kicker}
              title={wedding.story.title}
              subtitle="A rainy Thursday, a walk to Ojota, and a question asked under the lights of an MRS filling station."
            />
            <p className="mt-6 text-center font-sans text-[0.72rem] uppercase tracking-[0.32em] text-burgundy">
              {wedding.story.toldBy}
            </p>
          </FadeIn>
        </section>

        <div className="mx-auto mt-16 max-w-5xl px-5">
          <FadeIn>
            <img
              src={wedding.photos[3].src}
              alt={wedding.photos[3].alt}
              className="h-[320px] w-full rounded-[2rem] object-cover object-[center_20%] shadow-[0_20px_60px_rgba(74,16,32,0.16)] sm:h-[460px]"
            />
          </FadeIn>
        </div>

        <article className="mx-auto mt-16 max-w-3xl space-y-8 px-5">
          {paragraphs.map((paragraph, index) => {
            const photo = storyPhotos[index];
            return (
            <div key={paragraph.slice(0, 32)}>
              <FadeIn delay={0.05}>
                <p className="font-sans text-[1.08rem] leading-8 text-ink-muted">
                  {paragraph}
                </p>
              </FadeIn>
              {photo ? (
                <FadeIn delay={0.08} className="py-10">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="h-64 w-full rounded-[1.75rem] object-cover object-center md:object-[center_25%] shadow-[0_16px_40px_rgba(74,16,32,0.12)] sm:h-80 lg:h-[520px]"
                  />
                </FadeIn>
              ) : null}
            </div>
            );
          })}
          <FadeIn>
            <p className="pt-4 text-right font-serif text-xl italic text-burgundy">
              — Omotehinse
            </p>
            <p className="mt-1 text-right font-sans text-[0.68rem] uppercase tracking-[0.24em] text-gold-deep">
              The groom
            </p>
          </FadeIn>
        </article>

        <FadeIn className="mt-16 px-5 text-center">
          <Link
            href="/#rsvp"
            className="inline-flex rounded-full bg-burgundy px-7 py-3 font-sans text-[0.68rem] uppercase tracking-[0.28em] text-white transition hover:bg-burgundy-deep"
          >
            Return to the celebration
          </Link>
        </FadeIn>
      </main>
      <Footer />
    </div>
  );
}
