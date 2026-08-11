"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  projectId: z.string().optional().nullable(),
  priority: z.string().default("Medium"),
  dueDate: z.string().optional().nullable(),
  isImportant: z.boolean().default(false),
});

export async function createTask(data: z.infer<typeof taskSchema>) {
  try {
    const parsed = taskSchema.parse(data);
    
    await db.task.create({
      data: {
        title: parsed.title,
        description: parsed.description,
        priority: parsed.priority,
        projectId: parsed.projectId || null,
        dueDate: parsed.dueDate ? new Date(parsed.dueDate) : null,
        isImportant: parsed.isImportant,
        status: "Todo",
      }
    });

    revalidatePath("/");
    revalidatePath("/tasks");
    revalidatePath("/calendar");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to create task", error);
    return { success: false, error: "Failed to create task" };
  }
}

export async function getTask(id: string) {
  try {
    const task = await db.task.findUnique({
      where: { id },
    });
    return { success: true, data: task };
  } catch (error) {
    console.error("Failed to fetch task", error);
    return { success: false, error: "Failed to fetch task" };
  }
}

export async function editTask(id: string, data: z.infer<typeof taskSchema>) {
  try {
    const parsed = taskSchema.parse(data);
    
    await db.task.update({
      where: { id },
      data: {
        title: parsed.title,
        description: parsed.description,
        priority: parsed.priority,
        projectId: parsed.projectId || null,
        dueDate: parsed.dueDate ? new Date(parsed.dueDate) : null,
        isImportant: parsed.isImportant,
      }
    });

    revalidatePath("/");
    revalidatePath("/tasks");
    revalidatePath("/calendar");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to edit task", error);
    return { success: false, error: "Failed to edit task" };
  }
}

export async function toggleTaskCompletion(id: string, currentStatus: string) {
  try {
    const isCompleted = currentStatus === "Completed";
    await db.task.update({
      where: { id },
      data: {
        status: isCompleted ? "Todo" : "Completed",
        completedAt: isCompleted ? null : new Date(),
      }
    });

    revalidatePath("/");
    revalidatePath("/tasks");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle task", error);
    return { success: false, error: "Failed to toggle task" };
  }
}

export async function deleteTask(id: string) {
  try {
    await db.task.delete({
      where: { id }
    });

    revalidatePath("/");
    revalidatePath("/tasks");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete task", error);
    return { success: false, error: "Failed to delete task" };
  }
}
