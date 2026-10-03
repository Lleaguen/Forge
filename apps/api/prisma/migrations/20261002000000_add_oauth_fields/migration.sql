-- AlterTable: make passwordHash optional and add OAuth fields
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "oauth_provider" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "oauth_id" TEXT;
ALTER TABLE "users" ALTER COLUMN "passwordHash" DROP NOT NULL;

-- CreateIndex: unique constraint on oauth_provider + oauth_id
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_oauth_provider_id_key'
  ) THEN
    ALTER TABLE "users" ADD CONSTRAINT "users_oauth_provider_id_key" UNIQUE ("oauth_provider", "oauth_id");
  END IF;
END $$;
