import { userSchema } from "@/lib/validators"
import { z } from "zod"

export type Task = {
    id: string,
    title: string,
    createdAt: Date,
    sectionId: string,
    tag: string,
    dueDate: Date,
    user: z.infer<typeof userSchema>,
    updatedAt: Date
  }

export type StructuredSection = {
  id: string,
  title: string,
  createdAt: Date,
  tasks: Task[]
}