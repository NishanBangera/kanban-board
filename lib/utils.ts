import { Task } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//Convert prisma object into a regular JS object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function formatError(error: any) {
  if (error.name === "ZodError") {
    //Handle Zod error
    const fieldErrors = Object.keys(error.errors).map(
      (field) => error.errors[field].message
    );
    return fieldErrors.join(". ");
  } else if (
    error.name === "PrismaClientKnownRequestError" &&
    error.code === "P2002"
  ) {
    //Handle Prisma error
    const field = error.meta?.target ? error.meta.target[0] : "Field";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
  } else {
    //Handle other errors
    return typeof error.message === "string"
      ? error.message
      : JSON.stringify(error.message);
  }
}

export function reorderTask(sortedTasks: Task[]) {
  const sectionMap = new Map<string, Task[]>();

  sortedTasks.forEach((task) => {
    if (!sectionMap.has(task.sectionId)) {
      sectionMap.set(task.sectionId, []);
    }
    sectionMap.get(task.sectionId)!.push(task);
  });
  
  let updates = []

  for (const [sectionId, tasks] of sectionMap.entries()) {
    tasks.forEach((task, index) => {
      updates.push({
        id: task.id,
        sectionId: task.sectionId, // Ensure sectionId is set correctly
        position: index + 1, // Reset position within the section
      });
    });
  }
}
