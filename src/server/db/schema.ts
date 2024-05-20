// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations } from "drizzle-orm";
import {
  pgTableCreator,
  timestamp,
  uuid,
  text,
  pgSchema,
  integer
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `msu-aiclub-website_${name}`);

const authSchema = pgSchema("auth");

export const users = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const userRelations = relations(users, ({ many }) => ({
  posts: many(posts),

  projects: many(userProjects),

  comments: many(comments),

  roles: many(userRoles),
}));

export const projects = createTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  videoUrl: text("video_url"),
  githubUrl: text("github_url"),
  liveSiteUrl: text("live_site"),
});

export const projectRelations = relations(projects, ({ many }) => ({
  users: many(userProjects),

  skills: many(projectSkills),
}));

export const userProjects = createTable("userProjects", {
  userId: uuid("id").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: uuid("id").notNull().references(() => projects.id, { onDelete: "cascade" }),
});

export const userProjectRelations = relations(userProjects, ({ one }) => ({
  user: one(users, {
    fields: [userProjects.userId],
    references: [users.id],
  }),

  project: one(projects, {
    fields: [userProjects.projectId],
    references: [projects.id],
  }),
}));

export const skills = createTable("skills", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
});

export const skillRelations = relations(skills, ({ many }) => ({
  projects: many(projectSkills),
}));

export const projectSkills = createTable("projectSkills", {
  projectId: uuid("id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  skillId: uuid("id").notNull().references(() => skills.id, { onDelete: "cascade" }),
})

export const projectSkillRelations = relations(projectSkills, ({ one }) => ({
  project: one(projects, {
    fields: [projectSkills.projectId],
    references: [projects.id],
  }),

  skill: one(skills, {
    fields: [projectSkills.skillId],
    references: [skills.id],
  }),
}));

export const posts = createTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  likes: integer("likes").notNull().default(0),
  thumbnailUrl: text("thumbnailUrl"),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  userId: uuid("userId").notNull().references(() => users.id),
});

export const postRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),

  comments: many(comments),
}));

export const comments = createTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
  userId: uuid("profileId").notNull().references(() => users.id, { onDelete: "cascade" }),
  postId: uuid("postId").notNull().references(() => posts.id, { onDelete: "cascade" }),
});

export const commentRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id]
  }),

  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
}));

export const roles = createTable("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
});

export const roleRelations = relations(roles, ({ many }) => ({
  users: many(userRoles),
}));

export const userRoles = createTable("userRoles", {
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  roleId: uuid("roleId").notNull().references(() => roles.id, { onDelete: "cascade" }),
});

export const userRoleRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),

  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));
