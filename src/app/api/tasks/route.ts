import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();
    const tasks = await db.task.findMany({
      where: session ? { userId: session.id } : {},
      include: { project: true },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ status: "success", count: tasks.length, data: tasks });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
