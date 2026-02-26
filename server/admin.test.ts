import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ─── Mock DB helpers ──────────────────────────────────────────────────────────

vi.mock("./db", () => ({
  getImageRequestStats: vi.fn().mockResolvedValue({ total: 42, completed: 38, failed: 3, pending: 1 }),
  getRecentImageRequests: vi.fn().mockResolvedValue([
    {
      id: 1,
      psid: "123456789",
      style: "caricature",
      styleLabel: "Caricature",
      sourceImageUrl: null,
      resultImageUrl: null,
      status: "completed",
      errorMessage: null,
      createdAt: new Date("2026-01-01T10:00:00Z"),
      completedAt: new Date("2026-01-01T10:00:05Z"),
    },
  ]),
  getStyleBreakdown: vi.fn().mockResolvedValue([
    { style: "caricature", styleLabel: "Caricature", cnt: 15 },
    { style: "gold", styleLabel: "Gold", cnt: 12 },
  ]),
  getActiveUsersToday: vi.fn().mockResolvedValue(7),
  getQuotaUsageToday: vi.fn().mockResolvedValue({ usersAtLimit: 3, totalGenerated: 10 }),
  getUsageStatsLast7Days: vi.fn().mockResolvedValue([]),
  getRecentNotifications: vi.fn().mockResolvedValue([]),
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
  getTodayUTC: vi.fn().mockReturnValue("2026-01-01"),
}));

// ─── Context helpers ──────────────────────────────────────────────────────────

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function makeCtx(role: "admin" | "user"): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-open-id",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function makeUnauthCtx(): TrpcContext {
  return {
    user: undefined,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("admin.imageStats", () => {
  it("returns stats for admin users", async () => {
    const caller = appRouter.createCaller(makeCtx("admin"));
    const result = await caller.admin.imageStats();
    expect(result).toEqual({ total: 42, completed: 38, failed: 3, pending: 1 });
  });

  it("throws FORBIDDEN for regular users", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    await expect(caller.admin.imageStats()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("throws UNAUTHORIZED for unauthenticated requests", async () => {
    const caller = appRouter.createCaller(makeUnauthCtx());
    await expect(caller.admin.imageStats()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});

describe("admin.recentRequests", () => {
  it("returns recent image requests for admin", async () => {
    const caller = appRouter.createCaller(makeCtx("admin"));
    const result = await caller.admin.recentRequests();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toMatchObject({ id: 1, style: "caricature", status: "completed" });
  });

  it("throws FORBIDDEN for non-admin users", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    await expect(caller.admin.recentRequests()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});

describe("admin.styleBreakdown", () => {
  it("returns style breakdown for admin", async () => {
    const caller = appRouter.createCaller(makeCtx("admin"));
    const result = await caller.admin.styleBreakdown();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toMatchObject({ style: "caricature", styleLabel: "Caricature" });
  });
});

describe("admin.activeUsersToday", () => {
  it("returns active user count for admin", async () => {
    const caller = appRouter.createCaller(makeCtx("admin"));
    const result = await caller.admin.activeUsersToday();
    expect(result).toBe(7);
  });
});

describe("admin.quotaToday", () => {
  it("returns quota usage for admin", async () => {
    const caller = appRouter.createCaller(makeCtx("admin"));
    const result = await caller.admin.quotaToday();
    expect(result).toEqual({ usersAtLimit: 3, totalGenerated: 10 });
  });
});

describe("auth.logout", () => {
  it("clears session cookie and returns success", async () => {
    const ctx = makeCtx("user");
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
  });
});
