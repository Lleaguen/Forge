-- CreateEnum
CREATE TYPE "invitation_statuses" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "invitations" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "projectId" TEXT,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "status" "invitation_statuses" NOT NULL DEFAULT 'PENDING',
    "invitedById" TEXT NOT NULL,
    "invitedUserId" TEXT,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invitations_token_key" ON "invitations"("token");

-- CreateIndex
CREATE INDEX "invitations_email_idx" ON "invitations"("email");

-- CreateIndex
CREATE INDEX "invitations_organizationId_idx" ON "invitations"("organizationId");

-- CreateIndex
CREATE INDEX "invitations_projectId_idx" ON "invitations"("projectId");

-- CreateIndex
CREATE INDEX "invitations_token_idx" ON "invitations"("token");

-- CreateIndex
CREATE INDEX "invitations_status_idx" ON "invitations"("status");

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invitedUserId_fkey" FOREIGN KEY ("invitedUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
