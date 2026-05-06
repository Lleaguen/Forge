/*
  Warnings:

  - The `status` column on the `tasks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `createdById` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "task_categories" AS ENUM ('DEVELOPMENT', 'DESIGN', 'ARCHITECTURE', 'TESTING', 'DOCUMENTATION', 'RESEARCH', 'DEPLOYMENT', 'MAINTENANCE', 'PLANNING', 'REVIEW');

-- CreateEnum
CREATE TYPE "task_priorities" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT', 'CRITICAL');

-- CreateEnum
CREATE TYPE "task_statuses" AS ENUM ('TODO', 'IN_PROGRESS', 'IN_REVIEW', 'BLOCKED', 'DONE', 'CANCELLED');

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "actualHours" INTEGER DEFAULT 0,
ADD COLUMN     "assigneeId" TEXT,
ADD COLUMN     "category" "task_categories" NOT NULL DEFAULT 'DEVELOPMENT',
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "estimatedHours" INTEGER,
ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "priority" "task_priorities" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "task_statuses" NOT NULL DEFAULT 'TODO';

-- CreateIndex
CREATE INDEX "tasks_assigneeId_idx" ON "tasks"("assigneeId");

-- CreateIndex
CREATE INDEX "tasks_status_idx" ON "tasks"("status");

-- CreateIndex
CREATE INDEX "tasks_priority_idx" ON "tasks"("priority");

-- CreateIndex
CREATE INDEX "tasks_dueDate_idx" ON "tasks"("dueDate");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
