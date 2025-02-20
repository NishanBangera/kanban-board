"use server";

import { z } from "zod";
import { taskActionSchema, userSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
import { Section, Task } from "@/types";

export async function reorderTask(
  active: Task,
  over: Task | Section,
  sortedList: Task[]
) {
  try {
    if ("sectionId" in over) {
      // when task is dropped over another task
      await prisma.$transaction(async (tx) => {
        if (active.sectionId === over.sectionId) {
          // when task is dropped over another task in the same column
          const filteredTasksOrder = sortedList
            .filter((task) => task.sectionId === over.sectionId)
            .map((task) => task.id);
          return await tx.section.update({
            where: { id: over.sectionId },
            data: { tasksOrder: filteredTasksOrder },
          });
        } else {
          // when task is dropped over another task of different column
          const filteredTasksOrder1 = sortedList
            .filter((task) => task.sectionId === active.sectionId)
            .map((task) => task.id);
          const filteredTasksOrder2 = sortedList
            .filter((task) => task.sectionId === over.sectionId)
            .map((task) => task.id);
          await tx.task.update({
            where: { id: active.id },
            data: { sectionId: over.sectionId },
          });
          await tx.section.update({
            where: { id: active.sectionId },
            data: { tasksOrder: filteredTasksOrder1 },
          });
          await tx.section.update({
            where: { id: over.sectionId },
            data: { tasksOrder: filteredTasksOrder2 },
          });
        }
      });
    } else if ("tasksOrder" in over) {
      // when task is dropped over another column
      await prisma.$transaction(async (tx) => {
        const filteredTasksOrder1 = sortedList
          .filter((task) => task.sectionId === active.sectionId)
          .map((task) => task.id);
        const filteredTasksOrder2 = sortedList
          .filter((task) => task.sectionId === over.id)
          .map((task) => task.id);
        await tx.task.update({
          where: { id: active.id },
          data: { sectionId: over.id },
        });
        await tx.section.update({
          where: { id: active.sectionId },
          data: { tasksOrder: filteredTasksOrder1 },
        });
        await tx.section.update({
          where: { id: over.id },
          data: { tasksOrder: filteredTasksOrder2 },
        });
      });
    }
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function addTask(
  data: z.infer<typeof taskActionSchema> & { user: z.infer<typeof userSchema> }
) {
  try {
    const newTask = taskActionSchema.parse(data);
    const response = await prisma.$transaction(async (tx) => {
      // Fetch the current section
      const section = await tx.section.findUnique({
        where: { id: newTask.sectionId },
        select: { tasksOrder: true },
      });

      if (!section) {
        throw new Error("Section not found");
      }

      const { tasksOrder } = section;
      const task = await tx.task.create({ data: newTask });
      tasksOrder.push(task.id);

      const sectionUpdate = await tx.section.update({
        where: { id: task.sectionId },
        data: { tasksOrder },
      });

      return {
        task: task,
        tasksOrder: sectionUpdate.tasksOrder,
      };
    });

    return {
      success: true,
      data: {
        task: response.task,
        tasksOrder: response.tasksOrder,
      },
      message: `${response.task.title} task has been deleted successfully`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function deleteTaskAndUpdateTaskOrder(
  id: string,
  sectionId: string
) {
  try {
    const { title, data } = await prisma.$transaction(async (tx) => {
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
        data: updatedSection,
      };
    });
    return {
      success: true,
      data,
      message: `${title} task has been deleted successfully`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
