import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { db } from "@/lib/db";
import { setSession } from "@/lib/session";

export const runtime = "nodejs";

function decodeJwtPayload(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = Buffer.from(parts[1], "base64").toString("utf8");
    return JSON.parse(payload);
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

    let uid: string | undefined;
    let email: string | undefined;
    let name: string | undefined;
    let photoUrl: string | undefined;

    // 1. Try Firebase Admin verification if configured
    try {
      const adminAuth = getAdminAuth();
      if (adminAuth) {
        const decoded = await adminAuth.verifyIdToken(idToken);
        uid = decoded.uid;
        email = decoded.email;
        name = decoded.name;
        photoUrl = decoded.picture;
      }
    } catch (adminErr) {
      console.warn("[auth/sync] Admin verification fallback:", adminErr);
    }

    // 2. Fallback to decoding ID token payload if Admin SDK unavailable
    if (!uid) {
      const payload = decodeJwtPayload(idToken);
      if (!payload || !payload.sub) {
        return NextResponse.json({ error: "Invalid token payload" }, { status: 400 });
      }
      uid = payload.sub;
      email = payload.email;
      name = payload.name;
      photoUrl = payload.picture;
    }

    if (!uid) {
      return NextResponse.json({ error: "Could not identify user from token" }, { status: 400 });
    }

    // 3. Find existing user by firebaseUid or email to avoid unique index conflicts
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
          email: email ?? user.email,
          name: name ?? user.name,
          photoUrl: photoUrl ?? user.photoUrl,
        },
      });
    } else {
      user = await db.user.create({
        data: {
          firebaseUid: uid,
          email: email ?? "",
          name: name ?? null,
          photoUrl: photoUrl ?? null,
        },
      });
    }

    // 4. Set session cookie
    await setSession({
      id: user.id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      name: user.name,
      photoUrl: user.photoUrl,
    });

    return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err: any) {
    console.error("[auth/sync] Fatal error:", err);
    return NextResponse.json({ error: err?.message || "Authentication failed" }, { status: 500 });
  }
}
