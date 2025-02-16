"use server";

import { prisma } from "@/db/prisma";
import { z } from "zod";
import { addSectionSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { convertToPlainObject, formatError } from "../utils";
import { StructuredSection } from "@/types";



export async function getAllSections(){
    const data = await prisma.section.findMany({
        include: {
            tasks: true
        }
    })
    return convertToPlainObject(data as StructuredSection[])
}


export async function addSection(data: z.infer<typeof addSectionSchema>) {
  try{
      const section = addSectionSchema.parse(data)
      await prisma.section.create({ data: section });

      revalidatePath("/")

      return {success:true, message: "New section has been successfully created"}
  }  
  catch(error){
    return { success: false, message: formatError(error) };
  }

}
