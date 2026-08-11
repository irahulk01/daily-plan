"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

async function requireUser() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function createProject(data: { name: string; color: string }) {
  try {
    const user = await requireUser();
    await db.project.create({
      data: {
        name: data.name,
        color: data.color,
        status: "Planning",
        priority: "Medium",
        userId: user.id,
      }
    });

    revalidatePath("/");
    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    console.error("Failed to create project", error);
    return { success: false, error: "Failed to create project" };
  }
}
