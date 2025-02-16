/*
  Warnings:

  - You are about to drop the column `name` on the `Section` table. All the data in the column will be lost.
  - Added the required column `title` to the `Section` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Section" DROP COLUMN "name",
ADD COLUMN     "title" TEXT NOT NULL;
