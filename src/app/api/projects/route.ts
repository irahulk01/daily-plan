import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();
    const projects = await db.project.findMany({
      where: session ? { userId: session.id } : {},
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ status: "success", count: projects.length, data: projects });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
