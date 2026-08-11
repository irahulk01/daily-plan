import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { db } from "@/lib/db";
import { setSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    // 1. Verify Firebase token server-side
    const adminAuth = getAdminAuth();
    const decoded = await adminAuth.verifyIdToken(idToken);

    // 2. Upsert user in our DB
    const user = await db.user.upsert({
      where: { firebaseUid: decoded.uid },
      update: {
        email: decoded.email ?? "",
        name: decoded.name ?? null,
        photoUrl: decoded.picture ?? null,
      },
      create: {
        firebaseUid: decoded.uid,
        email: decoded.email ?? "",
        name: decoded.name ?? null,
        photoUrl: decoded.picture ?? null,
      },
    });

    // 3. Set session cookie
    await setSession({
      id: user.id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      name: user.name,
      photoUrl: user.photoUrl,
    });

    return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err: any) {
    console.error("[auth/sync] error:", err);
    return NextResponse.json({ error: err?.message || "Authentication failed" }, { status: 401 });
  }
}
