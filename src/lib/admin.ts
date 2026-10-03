import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "edens_admin";

export function adminToken() {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return null;
  return createHmac("sha256", secret).update("edens-gift-admin").digest("hex");
}

export async function isAdmin() {
  const expected = adminToken();
  if (!expected) return false;
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token || token.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  };
}

export { COOKIE_NAME };
