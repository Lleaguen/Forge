/*
  Warnings:

  - A unique constraint covering the columns `[userId,organizationId]` on the table `memberships` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "memberships_userId_organizationId_key" ON "memberships"("userId", "organizationId");
