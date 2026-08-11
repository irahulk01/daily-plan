"use server";

import { db } from "@/lib/db";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

function getIdeaDelegate() {
  const client = (db as any).idea ? db : new PrismaClient();
  return (client as any).idea;
}

export async function createIdea(data: {
  title: string;
  content?: string;
  category?: string;
  color?: string;
}) {
  try {
    const delegate = getIdeaDelegate();
    const newIdea = await delegate.create({
      data: {
        title: data.title,
        content: data.content || "",
        category: data.category || "Idea",
        color: data.color || "lime",
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
    const delegate = getIdeaDelegate();
    await delegate.delete({
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
    const delegate = getIdeaDelegate();
    await delegate.update({
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
