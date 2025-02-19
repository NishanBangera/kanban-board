"use server";

import { z } from "zod";
import { taskActionSchema, userSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
import { Section, Task } from "@/types";

export async function reorderTask(active: Task, over: Task | Section) {
  if ("sectionId" in over) {
    await prisma.$transaction(async (tx) => {
      if (active.sectionId === over.sectionId) {
      }
    });
  }
}

export async function addTask(
  data: z.infer<typeof taskActionSchema> & { user: z.infer<typeof userSchema> }
) {
  try {
    const newTask = taskActionSchema.parse(data);
    const response = await prisma.task.create({ data: newTask });

    return {
      success: true,
      data: response,
      message: `New task has been successfully assigned to ${newTask.user.name}`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function deleteTaskAndUpdateTaskOrder(id: string, sectionId: string) {
  try {
    const {title,data} =await prisma.$transaction(async (tx) => {
      // Fetch the current section
      const section = await tx.section.findUnique({
        where: { id: sectionId },
        select: { tasksOrder: true },
      });

      if (!section) throw new Error("Section not found");

      // Remove the task ID from tasksOrder
      const updatedTasksOrder = section.tasksOrder.filter(
        (taskId) => id !== taskId
      );

      // Update the section with the new order
      const updatedSection = await tx.section.update({
        where: { id: sectionId },
        data: { tasksOrder: updatedTasksOrder },
      });

      const deletedTask = await tx.task.delete({
        where: { id },
      });

      return {
        title: deletedTask.title,
        data: updatedSection
      }
    });
    return {
      success: true,
      data,
      message: `${title} task has been deleted successfully`
    }
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
