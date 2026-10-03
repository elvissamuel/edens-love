import { NextResponse } from "next/server";
import { readGifts } from "@/lib/store";

export async function GET() {
  const gifts = await readGifts(false);
  return NextResponse.json({ gifts });
}
