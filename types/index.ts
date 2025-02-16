import { createSectionSchema } from "@/lib/validators";
import { z } from "zod";

export type User = {
    id: string;
    image: string;
    name: string;
}

export type Task = {
    id: string;
    title: string;
    tag: string;
    dueDate: string;
    user: User;
}

export type Section = z.infer<typeof createSectionSchema> & {
    createdAt: boolean
    tasks: []
}