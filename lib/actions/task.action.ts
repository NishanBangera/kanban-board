"use server";

import { z } from "zod";
import { taskActionSchema, userSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { formatError } from "../utils";
import { Task } from "@/types";
import Error from "next/error";
import { getAllSections } from "./section.action";

// export async function reorderTask(activeTask: Task, overTask: Task) {
  // const tasks = sections.reduce((acc, curr) => { return acc.concat(curr.tasks.ma) }, [] as typeof sections[0]["tasks"])
  // const activeTask = tasks.find(task => task.id===activeId)
  // const overTask = tasks.find(task => task.id===overId)

  // try {
  //   console.log('sssssssssssssssssss')
  //   const update = await prisma.section.update({
  //     where: { id: activeTask.sectionId },
  //     data: {
  //       tasks: {
  //         disconnect: [{id:activeTask.id}]  ,
  //       },
  //     },
  //   });

  //   console.log("qqqqqqqqqqqqqqqqqqq", update);

  //   const section = await prisma.section.findFirst({
  //     where: { id: overTask.sectionId },
  //     include: { tasks: true },
  //   });
  //   const overIndex = section?.tasks.findIndex(
  //     (task) => task.id === overTask.id
  //   );
  //   console.log("overIndex", overIndex);

  //   console.log("sectionnnnnnn", section);
  //   section?.tasks.splice(overIndex!, 0, {
  //     ...activeTask,
  //     sectionId: section.id,
  //   });
  //   console.log("reordeeeeeeeeeeee", section?.tasks)
  //   console.log("reorderrrrrrrrr", section?.tasks.map((task) => ({ id: task.id })));
  //   await prisma.section.update({
  //     where: { id: section?.id },
  //     data: {
  //       tasks: {
  //         set: section?.tasks.map((task) => ({ id: task.id })),
  //       },
  //     },
  //   });
  //   // if(overIndex!==undefined && section!==null){
  //   //   section?.tasks.splice(overIndex, 0, {...activeTask,sectionId:section.id})
  //   //   console.log("reorderrrr",section)

  //   // }
  //   const test = await prisma.section.findFirst({
  //     where: { id: overTask.sectionId },
  //     include: { tasks: true },
  //   });
  //   console.log("nishhhhhhhhhhhhhhh", test)
  //   revalidatePath("/");
  // } catch (error) {
  //   console.log("errrrrrrrrrrrrrrrrrrrrrrr", error);
  // }}

export async function addTask(
  data: z.infer<typeof taskActionSchema> & { user: z.infer<typeof userSchema> }
) {
  try {
    const newTask = taskActionSchema.parse(data);
    const response = await prisma.task.create({ data: newTask })

    return {
      success: true,
      data: response,
      message: `New task has been successfully assigned to ${newTask.user.name}`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
