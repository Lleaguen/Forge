/*
  Warnings:

  - You are about to drop the `billing_audit_log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscriptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usage_metrics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_subscription_id_fkey";

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "usage_metrics" DROP CONSTRAINT "usage_metrics_organization_id_fkey";

-- DropTable
DROP TABLE "billing_audit_log";

-- DropTable
DROP TABLE "payments";

-- DropTable
DROP TABLE "subscriptions";

-- DropTable
DROP TABLE "usage_metrics";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "SubscriptionPlan";

-- DropEnum
DROP TYPE "SubscriptionStatus";

-- DropEnum
DROP TYPE "UsageMetricType";
