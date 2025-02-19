"use server";

import { prisma } from "@/db/prisma";
import { z } from "zod";
import { addSectionSchema, updateSectionSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { convertToPlainObject, formatError } from "../utils";
import { StructuredSection } from "@/types";

export async function getAllSections() {
  const data = await prisma.section.findMany({
    orderBy: {createdAt: "asc"},
    include: {
      tasks: true,
    },
  });
  return convertToPlainObject(data as unknown as StructuredSection[]);
}

export async function addSection(data: z.infer<typeof addSectionSchema>) {
  try {
    const section = addSectionSchema.parse(data);
    const newSection = await prisma.section.create({ data: section });

    return {
      success: true,
      data: newSection,
      message: "New section has been successfully created",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function deleteOrUpdateSection(
  prevState: unknown,
  formData: FormData
) {
  try {
    if (formData.get("action") === "update") {
      const data = updateSectionSchema.parse({
        sectionId: formData.get("sectionId"),
        title: formData.get("title"),
      });

      const updatedSection = await prisma.section.update({
        where: { id: data.sectionId },
        data: { title: data.title },
      });

      return {
        success: true,
        data: updatedSection,
        message: "Section updated successfully",
      };
    } else if (formData.get("action") === "delete") {
      const sectionId = formData.get("sectionId") as string;

      const deletedSection = await prisma.section.delete({
        where: { id: sectionId },
      });

      return {
        success: true,
        data: deletedSection,
        message: `${deletedSection.title} section and all its related tasks deleted successfully`,
      };
    }
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function revalidate() {
  revalidatePath("/");
}
