"use server";

import { prisma } from "@/db/prisma";
import { z } from "zod";
import { createSectionSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { convertToPlainObject, formatError } from "../utils";

export async function getAllSections(){
    const data = await prisma.section.findMany({
        include: {
            tasks: true
        }
    })

    return convertToPlainObject(data)
}


export async function addSection(data: z.infer<typeof createSectionSchema>) {
  try{
      const section = createSectionSchema.parse(data)
      await prisma.section.create({ data: section });

      revalidatePath("/")

      return {success:true, message: "New section has been successfully created"}
  }  
  catch(error){
    return { success: false, message: formatError(error) };
  }

}
