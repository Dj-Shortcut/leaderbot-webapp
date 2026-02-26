import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, uniqueIndex } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Image generation requests table.
 * Tracks each image generation request with metadata and status.
 */
export const imageRequests = mysqlTable("imageRequests", {
  id: int("id").autoincrement().primaryKey(),
  psid: varchar("psid", { length: 128 }).notNull(), // Facebook Page-Scoped User ID
  style: varchar("style", { length: 64 }).notNull(), // e.g. "caricature", "petals", "gold"
  styleLabel: varchar("styleLabel", { length: 128 }), // e.g. "Caricature", "Petals"
  sourceImageUrl: varchar("sourceImageUrl", { length: 2048 }),
  resultImageUrl: varchar("resultImageUrl", { length: 2048 }),
  status: mysqlEnum("status", ["pending", "completed", "failed"]).default("pending").notNull(),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type ImageRequest = typeof imageRequests.$inferSelect;
export type InsertImageRequest = typeof imageRequests.$inferInsert;

/**
 * Daily usage quota tracking table.
 * Tracks the count of images generated per PSID per day.
 */
export const dailyQuota = mysqlTable(
  "dailyQuota",
  {
    id: int("id").autoincrement().primaryKey(),
    psid: varchar("psid", { length: 128 }).notNull(),
    date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD UTC
    imagesGenerated: int("imagesGenerated").default(0).notNull(),
    lastGeneratedAt: timestamp("lastGeneratedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    psidDateUnique: uniqueIndex("dailyQuota_psid_date_unique").on(table.psid, table.date),
  })
);

export type DailyQuota = typeof dailyQuota.$inferSelect;
export type InsertDailyQuota = typeof dailyQuota.$inferInsert;

/**
 * Aggregated daily usage statistics for the admin dashboard.
 */
export const usageStats = mysqlTable("usageStats", {
  id: int("id").autoincrement().primaryKey(),
  date: varchar("date", { length: 10 }).notNull().unique(), // YYYY-MM-DD UTC
  totalImagesGenerated: int("totalImagesGenerated").default(0).notNull(),
  totalUsersActive: int("totalUsersActive").default(0).notNull(),
  totalFailedRequests: int("totalFailedRequests").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UsageStats = typeof usageStats.$inferSelect;
export type InsertUsageStats = typeof usageStats.$inferInsert;

/**
 * System notifications log for owner alerts and milestones.
 */
export const notificationLog = mysqlTable("notificationLog", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["milestone", "error", "quota_warning", "system_alert"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  metadata: json("metadata"),
  sent: int("sent").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type NotificationLog = typeof notificationLog.$inferSelect;
export type InsertNotificationLog = typeof notificationLog.$inferInsert;
