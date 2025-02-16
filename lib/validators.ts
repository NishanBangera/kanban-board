import z from "zod"

export const createSectionSchema = z.object({
    title: z.string().min(3, "Title must be atleast 3 characters")
})