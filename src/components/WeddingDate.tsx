import { wedding } from "@/data/content";
import { FadeIn, SectionHeading } from "@/components/FadeIn";

const details = [
  { label: "The date", value: wedding.displayDate },
  ...wedding.schedule,
  { label: "Attire", value: wedding.dressCode },
];

export function WeddingDate() {
  return (
    <section id="day" className="bg-white/55 px-5 py-24 sm:py-32">
      <FadeIn>
        <SectionHeading
          kicker="Save the date"
          title="A day written in gold"
          subtitle="We would be honoured to have you with us as we begin this next chapter."
        />
      </FadeIn>
      <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2">
        {details.map((detail, index) => (
          <FadeIn key={detail.label} delay={index * 0.08}>
            <article className="h-full rounded-3xl border border-gold/20 bg-white p-8 transition duration-500 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_16px_40px_rgba(107,28,49,0.12)]">
              <p className="font-sans text-[0.68rem] uppercase tracking-[0.32em] text-gold-deep">
                {detail.label}
              </p>
              <p className="mt-4 font-serif text-2xl leading-snug text-ink sm:text-[1.7rem]">
                {detail.value}
              </p>
            </article>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
