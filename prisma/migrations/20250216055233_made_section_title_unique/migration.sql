/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Section` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "section_title_idx" ON "Section"("title");
