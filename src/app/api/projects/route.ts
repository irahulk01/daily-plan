import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const projects = await db.project.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ status: "success", count: projects.length, data: projects });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
