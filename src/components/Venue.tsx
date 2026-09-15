import { wedding } from "@/data/content";
import { FadeIn, SectionHeading } from "@/components/FadeIn";

export function Venue() {
  const { venue } = wedding;

  return (
    <section id="venue" className="px-5 py-24 sm:py-32">
      <FadeIn>
        <SectionHeading
          kicker="Find us"
          title="Direction to the venue"
          subtitle="Asup Hall is on the campus of The Federal Polytechnic Ilaro. The map below will take you to the entrance."
        />
      </FadeIn>
      <div className="mx-auto mt-14 grid max-w-6xl overflow-hidden rounded-[2rem] border border-gold/20 bg-white shadow-[0_24px_70px_rgba(74,16,32,0.1)] lg:grid-cols-[1fr_1.2fr]">
        <FadeIn className="flex flex-col justify-center p-8 sm:p-12">
          <p className="font-sans text-[0.68rem] uppercase tracking-[0.32em] text-gold-deep">
            Ceremony & reception
          </p>
          <h3 className="mt-3 font-serif text-3xl text-ink">{venue.name}</h3>
          <p className="mt-4 font-sans text-base leading-7 text-ink-muted">
            {venue.address}
            <br />
            {venue.city}
          </p>
          <p className="mt-6 font-sans text-sm leading-7 text-ink-muted">
            {venue.notes}
          </p>
          <a
            href={venue.directionsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex w-fit items-center rounded-full bg-burgundy px-6 py-3 font-sans text-[0.68rem] uppercase tracking-[0.28em] text-white transition hover:bg-burgundy-deep"
          >
            Open directions
          </a>
        </FadeIn>
        <div className="min-h-[340px] lg:min-h-[480px]">
          <iframe
            title="Map to Asup Hall, Federal Polytechnic Ilaro"
            src={venue.mapsEmbed}
            className="h-full w-full border-0 grayscale-[20%] contrast-[1.05]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
