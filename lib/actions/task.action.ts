"use server";

import { z } from "zod";
import { taskActionSchema, updatedTaskActionSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
import { Section, Task } from "@/types";

export async function reorderTask(
  active: Task,
  over: Task | Section,
  sortedList: Task[]
) {
  try {
    const filterActiveTaskSection = sortedList
      .filter((task) => task.sectionId === active.sectionId)
      .map((task) => task.id);
    if ("sectionId" in over) {
      // when task is dropped over another task

      await prisma.$transaction(async (tx) => {
        if (active.sectionId === over.sectionId) {
          // when task is dropped over another task in the same column
          return await tx.section.update({
            where: { id: over.sectionId },
            data: { tasksOrder: filterActiveTaskSection },
          });
        } else {
          // when task is dropped over another task of different column
          const pushOverTaskSection = sortedList
            .filter((task) => task.sectionId === over.sectionId)
            .map((task) => task.id);
          await tx.task.update({
            where: { id: active.id },
            data: { sectionId: over.sectionId },
          });
          await tx.section.update({
            where: { id: active.sectionId },
            data: { tasksOrder: filterActiveTaskSection },
          });
          await tx.section.update({
            where: { id: over.sectionId },
            data: { tasksOrder: pushOverTaskSection },
          });
        }
      });
    } else if ("tasksOrder" in over) {
      // when task is dropped over another column
      await prisma.$transaction(async (tx) => {
        const pushOverTaskSection = sortedList
          .filter((task) => task.sectionId === over.id)
          .map((task) => task.id);
        await tx.task.update({
          where: { id: active.id },
          data: { sectionId: over.id },
        });
        await tx.section.update({
          where: { id: active.sectionId },
          data: { tasksOrder: filterActiveTaskSection },
        });
        await tx.section.update({
          where: { id: over.id },
          data: { tasksOrder: pushOverTaskSection },
        });
      });
    }
    return {
      success: true,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function addTask(data: z.infer<typeof taskActionSchema>) {
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
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateTaskDb(
  data: z.infer<typeof taskActionSchema>,
  id: string
) {
  try {
    const validatedTask = updatedTaskActionSchema.parse({ ...data, id });

    const updatedTask = await prisma.task.update({
      where: { id: validatedTask.id },
      data: {
        title: validatedTask.title,
        tag: validatedTask.tag,
        dueDate: validatedTask.dueDate,
        user: validatedTask.user,
      },
    });
    return {
      success: true,
      data: updatedTask,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function deleteTaskDb(id: string, sectionId: string) {
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
