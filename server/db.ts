import { eq, desc, sql, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { users, imageRequests, dailyQuota, usageStats, notificationLog } from "../drizzle/schema";
import type { InsertUser, InsertImageRequest, InsertDailyQuota, InsertUsageStats, InsertNotificationLog } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── User helpers ────────────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};

  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    const value = user[field];
    if (value === undefined) continue;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  }

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }

  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Image request helpers ────────────────────────────────────────────────────

export async function getRecentImageRequests(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(imageRequests).orderBy(desc(imageRequests.createdAt)).limit(limit);
}

export async function getImageRequestStats() {
  const db = await getDb();
  if (!db) return { total: 0, completed: 0, failed: 0, pending: 0 };

  const rows = await db
    .select({ status: imageRequests.status, cnt: count() })
    .from(imageRequests)
    .groupBy(imageRequests.status);

  const stats = { total: 0, completed: 0, failed: 0, pending: 0 };
  for (const row of rows) {
    stats.total += Number(row.cnt);
    if (row.status === "completed") stats.completed = Number(row.cnt);
    else if (row.status === "failed") stats.failed = Number(row.cnt);
    else if (row.status === "pending") stats.pending = Number(row.cnt);
  }
  return stats;
}

export async function getStyleBreakdown() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({ style: imageRequests.style, styleLabel: imageRequests.styleLabel, cnt: count() })
    .from(imageRequests)
    .where(eq(imageRequests.status, "completed"))
    .groupBy(imageRequests.style, imageRequests.styleLabel)
    .orderBy(desc(count()));
}

// ─── Daily quota helpers ──────────────────────────────────────────────────────

export async function getActiveUsersToday() {
  const db = await getDb();
  if (!db) return 0;
  const today = getTodayUTC();
  const rows = await db
    .select({ cnt: count() })
    .from(dailyQuota)
    .where(eq(dailyQuota.date, today));
  return Number(rows[0]?.cnt ?? 0);
}

export async function getQuotaUsageToday() {
  const db = await getDb();
  if (!db) return { usersAtLimit: 0, totalGenerated: 0 };
  const today = getTodayUTC();
  const rows = await db.select().from(dailyQuota).where(eq(dailyQuota.date, today));
  const usersAtLimit = rows.filter(r => r.imagesGenerated >= 1).length;
  const totalGenerated = rows.reduce((sum, r) => sum + r.imagesGenerated, 0);
  return { usersAtLimit, totalGenerated };
}

// ─── Usage stats helpers ──────────────────────────────────────────────────────

export async function getUsageStatsLast7Days() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(usageStats)
    .orderBy(desc(usageStats.date))
    .limit(7);
}

export async function getTodayStats() {
  const db = await getDb();
  if (!db) return null;
  const today = getTodayUTC();
  const rows = await db.select().from(usageStats).where(eq(usageStats.date, today)).limit(1);
  return rows.length > 0 ? rows[0] : null;
}

// ─── Notification helpers ─────────────────────────────────────────────────────

export async function getRecentNotifications(limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notificationLog).orderBy(desc(notificationLog.createdAt)).limit(limit);
}

// ─── Utilities ────────────────────────────────────────────────────────────────

export function getTodayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}
