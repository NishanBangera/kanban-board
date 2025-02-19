/*
  Warnings:

  - You are about to drop the column `position` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Section" ADD COLUMN     "tasksOrder" TEXT[];

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "position";
