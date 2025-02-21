

import z from "zod";

export const addSectionSchema = z.object({
  title: z.string().min(3, "Title must be atleast of 3 characters"),
});

export const updateSectionSchema = z.object({
  sectionId: z.string().min(1, "section id is required"),
  title: z.string().min(3, "Title must be atleast of 3 characters"),
});

export const userSchema = z.object({
  id: z.number(),
  name: z.string().min(3, "name must be atleast of 3 characters"),
  avatar: z.string().min(3, "url must be atleast of 3 characters"),
});

export const taskActionSchema = z.object({
  title: z.string().min(3, "Title must be atleast of 3 characters"),
  tag: z.string().min(3, "Title must be atleast of 3 characters"),
  sectionId: z.string().min(1, "section id is required"),
  dueDate: z.date(),
  user: userSchema,
});

export const updatedTaskActionSchema = taskActionSchema.extend({
  id: z.string(),
});

export const addFormTaskSchema = z.object({
  title: z.string().min(3, "Title must be atleast of 3 characters"),
  tag: z.string().min(3, "Title must be atleast of 3 characters"),
  user: z.string().min(1, "id must be atleast of 1 character"),
  dueDate: z.string(),
});
