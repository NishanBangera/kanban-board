import { userSchema } from "@/lib/validators";
import { z } from "zod";

export type Task = {
  id: string;
  title: string;
  createdAt: Date;
  sectionId: string;
  position: number;
  tag: string;
  dueDate: Date;
  user: z.infer<typeof userSchema>;
};

export type StructuredSection = {
  id: string;
  title: string;
  createdAt: Date;
  tasks: Task[];
  updatedAt: Date;
};

export type Section =  {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
};
