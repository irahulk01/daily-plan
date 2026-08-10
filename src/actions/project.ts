"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createProject(data: { name: string; color: string }) {
  try {
    await db.project.create({
      data: {
        name: data.name,
        color: data.color,
        status: "Planning",
        priority: "Medium"
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
