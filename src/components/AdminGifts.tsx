"use client";

import { FormEvent, useEffect, useState } from "react";
import type { GiftRecord } from "@/types";

function priceLabel(price: number | null) {
  if (price == null) return "No price yet";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
}

export function AdminGifts() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [gifts, setGifts] = useState<GiftRecord[]>([]);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  async function loadGifts() {
    const response = await fetch("/api/admin/gifts", { cache: "no-store" });
    if (response.status === 401) {
      setAuthed(false);
      return;
    }
    const payload = (await response.json()) as { gifts: GiftRecord[] };
    setGifts(payload.gifts);
    setPrices(
      Object.fromEntries(
        payload.gifts.map((gift) => [
          gift.id,
          gift.price == null ? "" : String(gift.price),
        ]),
      ),
    );
    setAuthed(true);
  }

  useEffect(() => {
    void loadGifts();
  }, []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error ?? "Could not sign in.");
      return;
    }
    setPassword("");
    await loadGifts();
  }

  async function savePrice(id: string) {
    const raw = prices[id]?.trim();
    const price = raw === "" ? null : Number(raw.replace(/,/g, ""));
    if (raw !== "" && !Number.isFinite(price)) {
      setError("Enter a valid price, or leave it blank.");
      return;
    }
    setSavingId(id);
    setError("");
    await fetch("/api/admin/gifts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, price }),
    });
    await loadGifts();
    setSavingId(null);
  }

  async function setDraft(id: string, draft: boolean) {
    setSavingId(id);
    await fetch("/api/admin/gifts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, draft }),
    });
    await loadGifts();
    setSavingId(null);
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthed(false);
    setGifts([]);
  }

  if (authed === null) {
    return <p className="text-center font-sans text-sm text-ink-muted">Checking access…</p>;
  }

  if (!authed) {
    return (
      <form
        onSubmit={(event) => void login(event)}
        className="mx-auto max-w-md rounded-[2rem] border border-gold/25 bg-white p-8"
      >
        <h1 className="font-serif text-3xl text-ink">Gift admin</h1>
        <p className="mt-2 font-sans text-sm text-ink-muted">
          Sign in to set prices and hide gifts from the public list.
        </p>
        <label className="mt-6 block">
          <span className="mb-2 block font-sans text-[0.68rem] uppercase tracking-[0.24em] text-gold-deep">
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-full border border-gold/25 px-5 py-3 font-sans text-ink outline-none focus:border-gold"
          />
        </label>
        {error ? <p className="mt-3 font-sans text-sm text-rose-800">{error}</p> : null}
        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-burgundy py-3 font-sans text-[0.68rem] uppercase tracking-[0.28em] text-white"
        >
          Sign in
        </button>
      </form>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="font-sans text-[0.68rem] uppercase tracking-[0.24em] text-gold-deep">
            Private
          </p>
          <h1 className="mt-1 font-serif text-4xl text-ink">Gift admin</h1>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="rounded-full border border-gold/40 px-4 py-2 font-sans text-[0.62rem] uppercase tracking-[0.2em] text-gold-deep"
        >
          Sign out
        </button>
      </div>
      {error ? <p className="mb-4 font-sans text-sm text-rose-800">{error}</p> : null}
      <div className="grid gap-4">
        {gifts.map((gift) => (
          <article
            key={gift.id}
            className={`rounded-3xl border bg-white p-5 sm:flex sm:items-center sm:gap-5 ${
              gift.draft ? "border-gold/15 opacity-70" : "border-gold/25"
            }`}
          >
            <img
              src={gift.image}
              alt=""
              className="h-24 w-full rounded-2xl object-cover sm:h-20 sm:w-28"
            />
            <div className="mt-4 min-w-0 flex-1 sm:mt-0">
              <h2 className="font-serif text-2xl text-ink">{gift.name}</h2>
              <p className="mt-1 font-sans text-xs uppercase tracking-[0.18em] text-ink-muted">
                {gift.draft ? "Draft · hidden from guests" : "Published"} · {priceLabel(gift.price)}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <input
                  inputMode="numeric"
                  placeholder="Price in naira"
                  value={prices[gift.id] ?? ""}
                  onChange={(event) =>
                    setPrices((current) => ({
                      ...current,
                      [gift.id]: event.target.value,
                    }))
                  }
                  className="w-40 rounded-full border border-gold/25 px-4 py-2 font-sans text-sm outline-none focus:border-gold"
                />
                <button
                  type="button"
                  disabled={savingId === gift.id}
                  onClick={() => void savePrice(gift.id)}
                  className="rounded-full border border-gold px-4 py-2 font-sans text-[0.62rem] uppercase tracking-[0.2em] text-gold-deep disabled:opacity-50"
                >
                  Save price
                </button>
                <button
                  type="button"
                  disabled={savingId === gift.id}
                  onClick={() => void setDraft(gift.id, !gift.draft)}
                  className="rounded-full border border-burgundy px-4 py-2 font-sans text-[0.62rem] uppercase tracking-[0.2em] text-burgundy disabled:opacity-50"
                >
                  {gift.draft ? "Publish" : "Move to draft"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
