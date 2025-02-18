import z from "zod"

export const addSectionSchema = z.object({
    title: z.string().min(3, "Title must be atleast of 3 characters")
})

export const updateSectionSchema = z.object({
    sectionId: z.string().min(1, "section id is required"),
    title: z.string().min(3, "Title must be atleast of 3 characters")
})

export const taskSchema = z.object({
    title: z.string().min(3, "Title must be atleast of 3 characters"),
    tag: z.string().min(3, "Title must be atleast of 3 characters"),
    
})

export const userSchema = z.object({
    id: z.number(),
    name: z.string().min(3, "name must be atleast of 3 characters"),
    avatar: z.string().min(3, "url must be atleast of 3 characters")
})

export const taskActionSchema = taskSchema.extend({
    sectionId: z.string().min(1, "section id is required"),
    dueDate: z.date(),
    position:z.coerce.number(),
    user: userSchema
})

export const addFormTaskSchema = taskSchema.extend({
    user: z.string().min(1, "id must be atleast of 1 character"),
    dueDate: z.string()
})

