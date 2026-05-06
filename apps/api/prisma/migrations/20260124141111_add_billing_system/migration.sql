-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'past_due', 'canceled', 'unpaid', 'trialing');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('succeeded', 'failed', 'pending', 'refunded');

-- CreateEnum
CREATE TYPE "UsageMetricType" AS ENUM ('projects', 'users', 'storage_gb', 'api_requests');

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "stripe_customer_id" TEXT NOT NULL,
    "stripe_subscription_id" TEXT,
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'FREE',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'active',
    "current_period_start" TIMESTAMP(3),
    "current_period_end" TIMESTAMP(3),
    "trial_end" TIMESTAMP(3),
    "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "subscription_id" TEXT NOT NULL,
    "stripe_invoice_id" TEXT NOT NULL,
    "amount_cents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "PaymentStatus" NOT NULL,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usage_metrics" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "metric_type" "UsageMetricType" NOT NULL,
    "value" INTEGER NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usage_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billing_audit_log" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "event_data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "billing_audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_organization_id_key" ON "subscriptions"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripe_customer_id_key" ON "subscriptions"("stripe_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripe_subscription_id_key" ON "subscriptions"("stripe_subscription_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripe_invoice_id_key" ON "payments"("stripe_invoice_id");

-- CreateIndex
CREATE INDEX "usage_metrics_organization_id_metric_type_recorded_at_idx" ON "usage_metrics"("organization_id", "metric_type", "recorded_at");

-- CreateIndex
CREATE INDEX "billing_audit_log_organization_id_event_type_created_at_idx" ON "billing_audit_log"("organization_id", "event_type", "created_at");

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_metrics" ADD CONSTRAINT "usage_metrics_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
