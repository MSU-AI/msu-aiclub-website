// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations } from "drizzle-orm";
import {
  pgTableCreator,
  timestamp,
  uuid,
  text,
  pgSchema,
  integer,
  varchar,
  jsonb,
  boolean
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
  email: varchar("email").notNull(),
  raw_user_meta_data: jsonb("raw_user_meta_data").notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  likes: many(likes),
  events: many(userEvents),
  roles: many(userRoles),
  projects: many(userProjects),
  redemptions: many(pointRedemptions) 
}));


export const projects = createTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  videoUrl: text("video_url"),
  githubUrl: text("github_url"),
  liveSiteUrl: text("live_site_url"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userProjects = createTable("userProjects", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
});

export const projectSkills = createTable("projectSkills", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  skillName: text("skill_name").notNull(),
});

export const projectsRelations = relations(projects, ({ many }) => ({
  userProjects: many(userProjects),
  projectSkills: many(projectSkills),
}));

export const userProjectsRelations = relations(userProjects, ({ one }) => ({
  project: one(projects, {
    fields: [userProjects.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [userProjects.userId],
    references: [users.id],
  }),
}));

export const projectSkillsRelations = relations(projectSkills, ({ one }) => ({
  project: one(projects, {
    fields: [projectSkills.projectId],
    references: [projects.id],
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
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
});

export const postRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  comments: many(comments),
  likes: many(likes),
}));

export const likes = createTable("likes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  postId: uuid("postId").notNull().references(() => posts.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
});

export const likeRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
}));

export const comments = createTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  postId: uuid("postId").notNull().references(() => posts.id, { onDelete: "cascade" }),
  parentId: uuid("parentId").references(() => comments.id, { onDelete: "cascade" }), 
  upvotes: integer("upvotes").notNull().default(0),
  downvotes: integer("downvotes").notNull().default(0),
});

export const commentRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id]
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: 'parentChild',
  }),
  replies: many(comments, {
    relationName: 'parentChild',
  }),
  votes: many(commentVotes),
}));

export const commentVotes = createTable("commentVotes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  commentId: uuid("commentId").notNull().references(() => comments.id, { onDelete: "cascade" }),
  voteType: integer("voteType").notNull(), // 1 for upvote, -1 for downvote, 0 for no vote
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
});

export const commentVoteRelations = relations(commentVotes, ({ one }) => ({
  user: one(users, {
    fields: [commentVotes.userId],
    references: [users.id],
  }),
  comment: one(comments, {
    fields: [commentVotes.commentId],
    references: [comments.id],
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

export const events = createTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  time: timestamp("time").notNull(),
  place: text("place").notNull(),
  points: integer("points").notNull(),
  code: text("code").notNull(),
  photo: text("photo"),
  hidden: boolean("hidden").default(false), // Add hidden field
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const eventRelations = relations(events, ({ many }) => ({
  users: many(userEvents),
}));

export const userEvents = createTable("userEvents", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  eventId: uuid("eventId").notNull().references(() => events.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const userEventRelations = relations(userEvents, ({ one }) => ({
  user: one(users, {
    fields: [userEvents.userId],
    references: [users.id],
  }),
  event: one(events, {
    fields: [userEvents.eventId],
    references: [events.id],
  }),
}));

export const eventQuestions = createTable("eventQuestions", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("eventId").notNull().references(() => events.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  required: boolean("required").default(false),
});

export const eventQuestionRelations = relations(eventQuestions, ({ one }) => ({
  event: one(events, {
    fields: [eventQuestions.eventId],
    references: [events.id],
  }),
}));

export const eventAnswers = createTable("eventAnswers", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("eventId").notNull().references(() => events.id, { onDelete: "cascade" }),
  questionId: uuid("questionId").notNull().references(() => eventQuestions.id, { onDelete: "cascade" }),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  answer: text("answer").notNull(),
});

export const eventAnswerRelations = relations(eventAnswers, ({ one }) => ({
  event: one(events, {
    fields: [eventAnswers.eventId],
    references: [events.id],
  }),
  question: one(eventQuestions, {
    fields: [eventAnswers.questionId],
    references: [eventQuestions.id],
  }),
  user: one(users, {
    fields: [eventAnswers.userId],
    references: [users.id],
  }),
}));

export const pointRedemptions = createTable("pointRedemptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  points: integer("points").notNull(),
  discountCode: text("discount_code").notNull(),
  discountValue: integer("discount_value").notNull(), // In percentage
  status: text("status").notNull().default("active"), // 'active', 'used', 'expired'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
  usedAt: timestamp("used_at"),
});

export const pointRedemptionRelations = relations(pointRedemptions, ({ one }) => ({
  user: one(users, {
    fields: [pointRedemptions.userId],
    references: [users.id],
  }),
}));
