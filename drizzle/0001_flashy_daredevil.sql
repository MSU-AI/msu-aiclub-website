CREATE TABLE IF NOT EXISTS "msu-aiclub-website_pointRedemptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"points" integer NOT NULL,
	"discount_code" text NOT NULL,
	"discount_value" integer NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"used_at" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "msu-aiclub-website_pointRedemptions" ADD CONSTRAINT "msu-aiclub-website_pointRedemptions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
