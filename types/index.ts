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

export type StructuredSection = {
  id: string;
  title: string;
  createdAt: Date;
  tasksOrder: string[];
  tasks: Task[];
  updatedAt: Date;
};

export type Section =  {
  id: string;
  title: string;
  tasksOrder: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  id: number,
  name: string,
  avatar: string
}
