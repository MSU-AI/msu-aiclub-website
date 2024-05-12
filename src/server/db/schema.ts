// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { desc, relations, sql } from "drizzle-orm";
import {
  index,
  pgEnum,
  pgTableCreator,
  serial,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `msu-aiclub-website_${name}`);

/// Requires user type be added as an enum in supabase website
// export const userTypeEnum = pgEnum("userType", ["guest", "member", "admin"]);

// SupaId has a foreign key restraint on auth.user.id in supabase website
// The supabase library does not support accessing the auth.user table directly

export const profiles = createTable(
  "profile",
  {
    supaId: uuid("supaId").notNull().primaryKey(),
    projectId: uuid("projectId").references(() => projects.id, {onDelete: 'set null'}),
    userType: varchar("userType").notNull(),
  }
);

export const profileRelations = relations(profiles, ({one, many}) => ({
  project: one(projects, {
    fields: [profiles.projectId],
    references: [projects.id],
  }),

  posts: many(posts)
}))

export const projects = createTable(
  "project",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    name: varchar("name", { length: 256 }).notNull(),
    description: varchar("description", { length: 256 }).notNull(),
  }
);

export const projectRelations = relations(projects, ({ one, many }) => ({
  profiles: many(profiles)
}))

export const posts = createTable(
  "post",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    profileId: uuid("profileId").notNull().references(() => profiles.supaId),

    name: varchar("name", { length: 256 }).notNull(),
    content: varchar("content", { length: 8192 }).notNull(),
  }
);

export const postRelations = relations(posts, ({ one }) => ({
  profile: one(profiles, {
    fields: [posts.profileId],
    references: [profiles.supaId],
  }),
}))
