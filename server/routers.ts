import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  getRecentImageRequests,
  getImageRequestStats,
  getStyleBreakdown,
  getActiveUsersToday,
  getQuotaUsageToday,
  getUsageStatsLast7Days,
  getRecentNotifications,
} from "./db";

// ─── Admin middleware ─────────────────────────────────────────────────────────

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

// ─── Admin router ─────────────────────────────────────────────────────────────

const adminRouter = router({
  /** Overview stats: total images, completed, failed, pending */
  imageStats: adminProcedure.query(async () => {
    return getImageRequestStats();
  }),

  /** Recent image generation requests (latest 50) */
  recentRequests: adminProcedure.query(async () => {
    return getRecentImageRequests(50);
  }),

  /** Style breakdown: how many completions per style */
  styleBreakdown: adminProcedure.query(async () => {
    return getStyleBreakdown();
  }),

  /** Active users today (distinct PSIDs with quota entry) */
  activeUsersToday: adminProcedure.query(async () => {
    return getActiveUsersToday();
  }),

  /** Quota usage today */
  quotaToday: adminProcedure.query(async () => {
    return getQuotaUsageToday();
  }),

  /** Last 7 days of aggregated usage stats */
  usageStats7Days: adminProcedure.query(async () => {
    return getUsageStatsLast7Days();
  }),

  /** Recent system notifications */
  notifications: adminProcedure.query(async () => {
    return getRecentNotifications(20);
  }),
});

// ─── App router ───────────────────────────────────────────────────────────────

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
