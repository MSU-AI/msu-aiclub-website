CREATE TABLE IF NOT EXISTS "msu-aiclub-website_commentVotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"commentId" uuid NOT NULL,
	"voteType" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "msu-aiclub-website_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"userId" uuid NOT NULL,
	"postId" uuid NOT NULL,
	"parentId" uuid,
	"upvotes" integer DEFAULT 0 NOT NULL,
	"downvotes" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "msu-aiclub-website_eventAnswers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"eventId" uuid NOT NULL,
	"questionId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"answer" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "msu-aiclub-website_eventQuestions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"eventId" uuid NOT NULL,
	"question" text NOT NULL,
	"required" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "msu-aiclub-website_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"time" timestamp NOT NULL,
	"place" text NOT NULL,
	"points" integer NOT NULL,
	"code" text NOT NULL,
	"photo" text,
	"hidden" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "msu-aiclub-website_likes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"postId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "msu-aiclub-website_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"content" text NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"thumbnailUrl" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "msu-aiclub-website_projectSkills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"skill_name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "msu-aiclub-website_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"thumbnail_url" text,
	"video_url" text,
	"github_url" text,
	"live_site_url" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "msu-aiclub-website_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "msu-aiclub-website_userEvents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"eventId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "msu-aiclub-website_userProjects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"role" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "msu-aiclub-website_userRoles" (
	"userId" uuid NOT NULL,
	"roleId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth"."users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"raw_user_meta_data" jsonb NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "msu-aiclub-website_commentVotes" ADD CONSTRAINT "msu-aiclub-website_commentVotes_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "msu-aiclub-website_commentVotes" ADD CONSTRAINT "msu-aiclub-website_commentVotes_commentId_msu-aiclub-website_comments_id_fk" FOREIGN KEY ("commentId") REFERENCES "public"."msu-aiclub-website_comments"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "msu-aiclub-website_comments" ADD CONSTRAINT "msu-aiclub-website_comments_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "msu-aiclub-website_comments" ADD CONSTRAINT "msu-aiclub-website_comments_postId_msu-aiclub-website_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."msu-aiclub-website_posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "msu-aiclub-website_comments" ADD CONSTRAINT "msu-aiclub-website_comments_parentId_msu-aiclub-website_comments_id_fk" FOREIGN KEY ("parentId") REFERENCES "public"."msu-aiclub-website_comments"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "msu-aiclub-website_eventAnswers" ADD CONSTRAINT "msu-aiclub-website_eventAnswers_eventId_msu-aiclub-website_events_id_fk" FOREIGN KEY ("eventId") REFERENCES "public"."msu-aiclub-website_events"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "msu-aiclub-website_eventAnswers" ADD CONSTRAINT "msu-aiclub-website_eventAnswers_questionId_msu-aiclub-website_eventQuestions_id_fk" FOREIGN KEY ("questionId") REFERENCES "public"."msu-aiclub-website_eventQuestions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "msu-aiclub-website_eventAnswers" ADD CONSTRAINT "msu-aiclub-website_eventAnswers_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "msu-aiclub-website_eventQuestions" ADD CONSTRAINT "msu-aiclub-website_eventQuestions_eventId_msu-aiclub-website_events_id_fk" FOREIGN KEY ("eventId") REFERENCES "public"."msu-aiclub-website_events"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "msu-aiclub-website_likes" ADD CONSTRAINT "msu-aiclub-website_likes_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "msu-aiclub-website_likes" ADD CONSTRAINT "msu-aiclub-website_likes_postId_msu-aiclub-website_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."msu-aiclub-website_posts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "msu-aiclub-website_posts" ADD CONSTRAINT "msu-aiclub-website_posts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "msu-aiclub-website_projectSkills" ADD CONSTRAINT "msu-aiclub-website_projectSkills_project_id_msu-aiclub-website_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."msu-aiclub-website_projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "msu-aiclub-website_userEvents" ADD CONSTRAINT "msu-aiclub-website_userEvents_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "msu-aiclub-website_userEvents" ADD CONSTRAINT "msu-aiclub-website_userEvents_eventId_msu-aiclub-website_events_id_fk" FOREIGN KEY ("eventId") REFERENCES "public"."msu-aiclub-website_events"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "msu-aiclub-website_userProjects" ADD CONSTRAINT "msu-aiclub-website_userProjects_project_id_msu-aiclub-website_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."msu-aiclub-website_projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "msu-aiclub-website_userRoles" ADD CONSTRAINT "msu-aiclub-website_userRoles_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "msu-aiclub-website_userRoles" ADD CONSTRAINT "msu-aiclub-website_userRoles_roleId_msu-aiclub-website_roles_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."msu-aiclub-website_roles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
