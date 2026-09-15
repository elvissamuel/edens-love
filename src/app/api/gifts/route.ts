import { NextResponse } from "next/server";
import { readGifts, toggleGift } from "@/lib/store";

export async function GET() {
  const gifts = await readGifts();
  return NextResponse.json({ gifts });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as { id?: string; claimedBy?: string };
  if (!body.id) {
    return NextResponse.json({ error: "Gift id is required." }, { status: 400 });
  }

  const gift = await toggleGift(body.id, body.claimedBy);
  if (!gift) {
    return NextResponse.json({ error: "Gift not found." }, { status: 404 });
  }

  return NextResponse.json({ gift });
}
