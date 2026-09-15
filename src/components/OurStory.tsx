import Link from "next/link";
import { wedding } from "@/data/content";
import { FadeIn, SectionHeading } from "@/components/FadeIn";

export function OurStory() {
  return (
    <section id="story" className="px-5 py-24 sm:py-32">
      <FadeIn>
        <SectionHeading
          kicker={wedding.story.kicker}
          title={wedding.story.title}
        />
      </FadeIn>
      <div className="mx-auto mt-14 grid max-w-5xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <FadeIn delay={0.1}>
          <div className="relative">
            <div className="absolute -left-4 -top-4 h-full w-full rounded-[2rem] border border-gold/30" />
            <img
              src="/photos/04.jpg"
              alt="Omodolapo and Omotehinse in warm evening light"
              className="relative z-10 h-[420px] w-full rounded-[2rem] object-cover shadow-[0_20px_60px_rgba(74,16,32,0.18)] sm:h-[520px]"
            />
          </div>
        </FadeIn>
        <div className="space-y-6">
          {wedding.story.teaser.map((paragraph, index) => (
            <FadeIn key={paragraph.slice(0, 24)} delay={0.12 * (index + 1)}>
              <p className="font-sans text-[1.05rem] leading-8 text-ink-muted">
                {paragraph}
              </p>
            </FadeIn>
          ))}
          <FadeIn delay={0.3}>
            <Link
              href="/our-story"
              className="inline-flex rounded-full bg-burgundy px-6 py-3 font-sans text-[0.68rem] uppercase tracking-[0.28em] text-white transition hover:bg-burgundy-deep"
            >
              Continue reading
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
