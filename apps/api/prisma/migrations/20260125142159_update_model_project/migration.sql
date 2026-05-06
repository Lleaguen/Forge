/*
  Warnings:

  - Added the required column `userId` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "projects"
ADD COLUMN "userId" TEXT,
ADD COLUMN "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
ALTER COLUMN "organizationId" DROP NOT NULL;
-- Backfill userId si corresponde (ejemplo)
-- UPDATE "projects" SET "userId" = 'SOME_USER_ID';

-- Hacer userId obligatorio
ALTER TABLE "projects"
ALTER COLUMN "userId" SET NOT NULL;