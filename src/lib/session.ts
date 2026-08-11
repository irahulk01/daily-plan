import { cookies } from "next/headers";

export interface SessionUser {
  id: string;          // Prisma User._id
  firebaseUid: string;
  email: string;
  name: string | null;
  photoUrl: string | null;
}

export const SESSION_COOKIE = "dp_session";
export const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Encode session payload as a simple base64 JSON (no external deps)
export function encode(payload: SessionUser): string {
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

function decode(raw: string): SessionUser | null {
  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8")) as SessionUser;
  } catch {
    return null;
  }
}

export async function setSession(user: SessionUser) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, encode(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  return decode(raw);
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
