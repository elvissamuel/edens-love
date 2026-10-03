import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { readGifts, updateGift } from "@/lib/store";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const gifts = await readGifts(true);
  return NextResponse.json({ gifts });
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as {
    id?: string;
    price?: number | null;
    draft?: boolean;
  };

  if (!body.id) {
    return NextResponse.json({ error: "Gift id is required." }, { status: 400 });
  }

  const gift = await updateGift(body.id, {
    price: body.price,
    draft: body.draft,
  });

  if (!gift) {
    return NextResponse.json({ error: "Gift not found." }, { status: 404 });
  }

  return NextResponse.json({ gift });
}
