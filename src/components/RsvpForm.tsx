"use client";

import { FormEvent, useState } from "react";
import { FadeIn, SectionHeading } from "@/components/FadeIn";

type Status = "idle" | "saving" | "done" | "error";

export function RsvpForm() {
  const [attending, setAttending] = useState<boolean | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (attending === null) {
      setError("Please tell us whether you will be physically present.");
      setStatus("error");
      return;
    }

    const form = new FormData(event.currentTarget);
    setStatus("saving");
    setError("");

    const response = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        attending,
        guests: form.get("guests"),
        message: form.get("message"),
      }),
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error ?? "Something went gently wrong. Please try again.");
      setStatus("error");
      return;
    }

    setStatus("done");
  }

  return (
    <section id="rsvp" className="bg-white/55 px-5 py-24 sm:py-32">
      <FadeIn>
        <SectionHeading
          kicker="Your presence"
          title="Will you be with us?"
          subtitle="Kindly let us know if you will be physically present. Your answer helps us set the table with care."
        />
      </FadeIn>
      <FadeIn delay={0.12} className="mx-auto mt-14 max-w-2xl">
        {status === "done" ? (
          <div className="rounded-[2rem] border border-gold/30 bg-cream px-8 py-16 text-center">
            <p className="font-serif text-3xl text-ink">Thank you, dear friend.</p>
            <p className="mt-4 font-sans text-ink-muted">
              We have received your reply. If you are coming, we cannot wait to
              embrace you. If you cannot, you will still be with us in spirit.
            </p>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="rounded-[2rem] border border-gold/20 bg-white p-6 shadow-[0_20px_60px_rgba(74,16,32,0.08)] sm:p-10"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block font-sans text-[0.68rem] uppercase tracking-[0.24em] text-gold-deep">
                  Full name
                </span>
                <input
                  required
                  name="name"
                  placeholder="Your name"
                  className="w-full rounded-2xl border border-gold/20 bg-cream px-4 py-3 font-sans text-ink outline-none transition focus:border-gold"
                />
              </label>
              <label className="block">
                <span className="mb-2 block font-sans text-[0.68rem] uppercase tracking-[0.24em] text-gold-deep">
                  Email
                </span>
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="you@email.com"
                  className="w-full rounded-2xl border border-gold/20 bg-cream px-4 py-3 font-sans text-ink outline-none transition focus:border-gold"
                />
              </label>
            </div>

            <p className="mt-8 font-sans text-[0.68rem] uppercase tracking-[0.24em] text-gold-deep">
              Will you be physically present?
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {[
                { value: true, label: "Joyfully, yes" },
                { value: false, label: "With love, I cannot" },
              ].map((option) => (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => setAttending(option.value)}
                  className={`rounded-2xl border px-4 py-4 font-serif text-lg transition ${
                    attending === option.value
                      ? "border-burgundy bg-burgundy text-white shadow-[0_10px_30px_rgba(107,28,49,0.35)]"
                      : "border-gold/20 bg-cream text-ink hover:border-gold/50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {attending ? (
              <label className="mt-6 block">
                <span className="mb-2 block font-sans text-[0.68rem] uppercase tracking-[0.24em] text-gold-deep">
                  Number of guests, including you
                </span>
                <input
                  name="guests"
                  type="number"
                  min={1}
                  max={8}
                  defaultValue={1}
                  className="w-full rounded-2xl border border-gold/20 bg-cream px-4 py-3 font-sans text-ink outline-none transition focus:border-gold"
                />
              </label>
            ) : null}

            <label className="mt-6 block">
              <span className="mb-2 block font-sans text-[0.68rem] uppercase tracking-[0.24em] text-gold-deep">
                A note for the couple
              </span>
              <textarea
                name="message"
                rows={4}
                placeholder="A blessing, a memory, a song you hope to hear..."
                className="w-full resize-none rounded-2xl border border-gold/20 bg-cream px-4 py-3 font-sans text-ink outline-none transition focus:border-gold"
              />
            </label>

            {error ? (
              <p className="mt-4 font-sans text-sm text-rose-800">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={status === "saving"}
              className="mt-8 w-full rounded-full bg-burgundy py-4 font-sans text-[0.72rem] uppercase tracking-[0.32em] text-white transition hover:bg-burgundy-deep disabled:opacity-60"
            >
              {status === "saving" ? "Sending with love..." : "Send our reply"}
            </button>
          </form>
        )}
      </FadeIn>
    </section>
  );
}
