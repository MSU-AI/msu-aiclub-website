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

export const profiles = createTable(
  "profile",
  {
    id: uuid("id").primaryKey().defaultRandom(), 
    supaId: varchar("supaId").notNull(),
    teamId: uuid("teamId").references(() => teams.id),
    userType: varchar("userType").notNull(),
  }
);

export const profileRelations = relations(profiles, ({one, many}) => ({
  team: one(teams, {
    fields: [profiles.teamId],
    references: [teams.id],
  }),

  posts: many(posts)
}))

export const teams = createTable(
  "team",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    name: varchar("name", { length: 256 }).notNull(),
  }
)

export const teamRelations = relations(teams, ({ many }) => ({
  users: many(profiles),
  project: many(projects),
}))

export const projects = createTable(
  "project",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    teamId: uuid("teamId").notNull().references(() => teams.id),

    name: varchar("name", { length: 256 }).notNull(),
    description: varchar("description", { length: 256 }).notNull(),
  }
);

export const projectRelations = relations(projects, ({ one }) => ({
  team: one(teams, {
    fields: [projects.teamId],
    references: [teams.id],
  }),
}))

export const posts = createTable(
  "post",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    profileId: uuid("profileId").notNull().references(() => profiles.id),

    name: varchar("name", { length: 256 }).notNull(),
    content: varchar("content", { length: 8192 }).notNull(),
  }
);

export const postRelations = relations(posts, ({ one }) => ({
  profile: one(profiles, {
    fields: [posts.profileId],
    references: [profiles.id],
  }),
}))
