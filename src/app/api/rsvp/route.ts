import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    attending?: boolean;
    guests?: number;
    message?: string;
  };

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";

  if (!name || !email) {
    return NextResponse.json(
      { error: "Please share your name and email." },
      { status: 400 },
    );
  }

  if (typeof body.attending !== "boolean") {
    return NextResponse.json(
      { error: "Please tell us if you will be present." },
      { status: 400 },
    );
  }

  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!scriptUrl) {
    return NextResponse.json(
      { error: "RSVP is not connected yet. Please try again soon." },
      { status: 503 },
    );
  }

  const guests = body.attending
    ? Math.min(8, Math.max(1, Number(body.guests) || 1))
    : 0;

  const payload = {
    name,
    email,
    attending: body.attending,
    guests,
    message: body.message?.trim() ?? "",
  };

  const response = await fetch(scriptUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
    redirect: "follow",
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "We could not save your reply. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
