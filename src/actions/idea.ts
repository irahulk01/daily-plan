"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

async function requireUser() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function createIdea(data: {
  title: string;
  content?: string;
  category?: string;
  color?: string;
}) {
  try {
    const user = await requireUser();
    const newIdea = await db.idea.create({
      data: {
        title: data.title,
        content: data.content || "",
        category: data.category || "Idea",
        color: data.color || "lime",
        userId: user.id,
      },
    });

    revalidatePath("/ideas");
    revalidatePath("/");
    return { success: true, idea: newIdea };
  } catch (error: any) {
    console.error("Failed to create idea:", error);
    return { success: false, error: error?.message || "Failed to create idea" };
  }
}

export async function deleteIdea(id: string) {
  try {
    await db.idea.delete({
      where: { id },
    });

    revalidatePath("/ideas");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete idea:", error);
    return { success: false, error: error?.message || "Failed to delete idea" };
  }
}

export async function togglePinIdea(id: string, currentPinned: boolean) {
  try {
    await db.idea.update({
      where: { id },
      data: { isPinned: !currentPinned },
    });

    revalidatePath("/ideas");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to toggle pin on idea:", error);
    return { success: false, error: error?.message || "Failed to update idea" };
  }
}
