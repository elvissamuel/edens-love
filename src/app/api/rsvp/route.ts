import { NextResponse } from "next/server";
import { addRsvp } from "@/lib/store";

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

  const guests = Math.min(8, Math.max(1, Number(body.guests) || 1));

  const rsvp = await addRsvp({
    name,
    email,
    attending: body.attending,
    guests: body.attending ? guests : 0,
    message: body.message?.trim() ?? "",
  });

  return NextResponse.json({ rsvp });
}
