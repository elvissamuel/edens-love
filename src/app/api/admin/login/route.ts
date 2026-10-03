import { NextResponse } from "next/server";
import { adminCookieOptions, adminToken, COOKIE_NAME } from "@/lib/admin";

export async function POST(request: Request) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: "Admin password is not configured." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as { password?: string };
  if (body.password !== expected) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const token = adminToken();
  if (!token) {
    return NextResponse.json({ error: "Could not start a session." }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, token, adminCookieOptions());
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, "", { ...adminCookieOptions(), maxAge: 0 });
  return response;
}
