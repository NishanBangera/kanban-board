"use server";

import { z } from "zod";
import { taskActionSchema, userSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { formatError } from "../utils";

export async function addTask(
  data: z.infer<typeof taskActionSchema> & { user: z.infer<typeof userSchema> }
) {
  try {
    const newTask = taskActionSchema.parse(data);
    await prisma.task.create({ data: newTask });

    revalidatePath("/");

    return {
      success: true,
      message: `New task has been successfully assigned to ${newTask.user.name}`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
