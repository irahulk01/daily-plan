import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { SESSION_COOKIE, MAX_AGE, encode } from "@/lib/session";

export const runtime = "nodejs";

function decodeJwtPayload(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf8");
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    const payload = decodeJwtPayload(idToken);
    if (!payload || !payload.sub) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 400 });
    }

    const uid = payload.sub;
    const email = payload.email ?? "";
    const name = payload.name ?? null;
    const photoUrl = payload.picture ?? null;

    // Find existing user by firebaseUid or email to avoid unique index conflicts
    let user = await db.user.findFirst({
      where: {
        OR: [
          { firebaseUid: uid },
          ...(email ? [{ email }] : []),
        ],
      },
    });

    if (user) {
      user = await db.user.update({
        where: { id: user.id },
        data: {
          firebaseUid: uid,
          email: email || user.email,
          name: name || user.name,
          photoUrl: photoUrl || user.photoUrl,
        },
      });
    } else {
      user = await db.user.create({
        data: {
          firebaseUid: uid,
          email,
          name,
          photoUrl,
        },
      });
    }

    const sessionData = {
      id: user.id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      name: user.name,
      photoUrl: user.photoUrl,
    };

    const res = NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email } });
    res.cookies.set(SESSION_COOKIE, encode(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: MAX_AGE,
      path: "/",
    });

    return res;
  } catch (err: any) {
    console.error("[auth/sync] Error:", err);
    return NextResponse.json({ error: err?.message || "Authentication failed" }, { status: 500 });
  }
}
