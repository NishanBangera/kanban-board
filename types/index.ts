import { userSchema } from "@/lib/validators";
import { z } from "zod";

export type Task = {
  id: string;
  title: string;
  createdAt: Date;
  sectionId: string;
  tag: string;
  dueDate: Date;
  user: z.infer<typeof userSchema>;
};

export type Section = {
  id: string;
  title: string;
  tasksOrder: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type StructuredSection = Section & {
  tasks: Task[];
};

export type User = z.infer<typeof userSchema>;
