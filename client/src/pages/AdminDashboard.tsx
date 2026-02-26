import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sparkles,
  LayoutDashboard,
  ImageIcon,
  Users,
  BarChart3,
  Bell,
  LogOut,
  Home,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { Link } from "wouter";

// ─── Sidebar ──────────────────────────────────────────────────────────────────

type NavItem = { id: string; label: string; icon: React.ReactNode };

const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: "requests", label: "Image Requests", icon: <ImageIcon className="w-4 h-4" /> },
  { id: "styles", label: "Style Analytics", icon: <BarChart3 className="w-4 h-4" /> },
  { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
];

function Sidebar({ active, onNavigate }: { active: string; onNavigate: (id: string) => void }) {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-screen sticky top-0"
      style={{ background: "oklch(12% 0.015 260)", borderRight: "1px solid oklch(20% 0.02 260)" }}>
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: "oklch(20% 0.02 260)" }}>
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, oklch(78% 0.14 80), oklch(65% 0.18 60))" }}>
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Leaderbot AI</div>
              <div className="text-xs text-muted-foreground">Admin Panel</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              active === item.id
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
            style={active === item.id ? {
              background: "linear-gradient(135deg, oklch(78% 0.14 80 / 0.15), oklch(65% 0.18 60 / 0.1))",
              color: "oklch(78% 0.14 80)",
              border: "1px solid oklch(78% 0.14 80 / 0.2)",
            } : {}}
          >
            {item.icon}
            {item.label}
          </button>
        ))}

        <div className="pt-4 border-t" style={{ borderColor: "oklch(20% 0.02 260)" }}>
          <Link href="/">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
              <Home className="w-4 h-4" />
              Back to Site
            </button>
          </Link>
        </div>
      </nav>

      {/* User */}
      <div className="p-4 border-t" style={{ borderColor: "oklch(20% 0.02 260)" }}>
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg"
          style={{ background: "oklch(16% 0.015 260)" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black"
            style={{ background: "linear-gradient(135deg, oklch(78% 0.14 80), oklch(65% 0.18 60))" }}>
            {user?.name?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground truncate">{user?.name ?? "Admin"}</div>
            <div className="text-xs text-muted-foreground">Administrator</div>
          </div>
          <button onClick={logout} className="text-muted-foreground hover:text-destructive transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  title,
  value,
  subtitle,
  icon,
  loading,
  accent,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  loading?: boolean;
  accent?: string;
}) {
  return (
    <Card className="border-border/50" style={{ background: "oklch(14% 0.015 260)" }}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: accent ? `${accent}15` : "oklch(78% 0.14 80 / 0.1)" }}>
            <div style={{ color: accent ?? "oklch(78% 0.14 80)" }}>{icon}</div>
          </div>
        </div>
        {loading ? (
          <>
            <Skeleton className="h-8 w-20 mb-1" />
            <Skeleton className="h-4 w-32" />
          </>
        ) : (
          <>
            <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
            <div className="text-sm text-muted-foreground">{title}</div>
            {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: "pending" | "completed" | "failed" }) {
  const config = {
    completed: { icon: <CheckCircle2 className="w-3 h-3" />, label: "Completed", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    failed: { icon: <XCircle className="w-3 h-3" />, label: "Failed", className: "bg-red-500/10 text-red-400 border-red-500/20" },
    pending: { icon: <Clock className="w-3 h-3" />, label: "Pending", className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  }[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}>
      {config.icon}
      {config.label}
    </span>
  );
}

// ─── Overview tab ─────────────────────────────────────────────────────────────

function OverviewTab() {
  const { data: stats, isLoading: statsLoading } = trpc.admin.imageStats.useQuery();
  const { data: activeUsers, isLoading: usersLoading } = trpc.admin.activeUsersToday.useQuery();
  const { data: quota, isLoading: quotaLoading } = trpc.admin.quotaToday.useQuery();
  const { data: usageStats } = trpc.admin.usageStats7Days.useQuery();

  const successRate = stats && stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Overview</h2>
        <p className="text-muted-foreground text-sm">Real-time statistics for Leaderbot AI</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Images Generated"
          value={stats?.total ?? 0}
          subtitle={`${stats?.completed ?? 0} completed`}
          icon={<ImageIcon className="w-5 h-5" />}
          loading={statsLoading}
        />
        <StatCard
          title="Active Users Today"
          value={activeUsers ?? 0}
          subtitle="Unique PSIDs with activity"
          icon={<Users className="w-5 h-5" />}
          loading={usersLoading}
          accent="oklch(65% 0.18 160)"
        />
        <StatCard
          title="Success Rate"
          value={`${successRate}%`}
          subtitle={`${stats?.failed ?? 0} failed requests`}
          icon={<TrendingUp className="w-5 h-5" />}
          loading={statsLoading}
          accent="oklch(70% 0.16 300)"
        />
        <StatCard
          title="Quota Used Today"
          value={quota?.totalGenerated ?? 0}
          subtitle={`${quota?.usersAtLimit ?? 0} users at daily limit`}
          icon={<BarChart3 className="w-5 h-5" />}
          loading={quotaLoading}
          accent="oklch(72% 0.18 40)"
        />
      </div>

      {/* 7-day chart placeholder */}
      <Card className="border-border/50" style={{ background: "oklch(14% 0.015 260)" }}>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">Last 7 Days Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {usageStats && usageStats.length > 0 ? (
            <div className="space-y-3">
              {[...usageStats].reverse().map((day) => {
                const maxVal = Math.max(...usageStats.map(d => d.totalImagesGenerated), 1);
                const pct = Math.round((day.totalImagesGenerated / maxVal) * 100);
                return (
                  <div key={day.date} className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground w-24 flex-shrink-0">{day.date}</span>
                    <div className="flex-1 h-2 rounded-full" style={{ background: "oklch(20% 0.02 260)" }}>
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: "linear-gradient(90deg, oklch(78% 0.14 80), oklch(65% 0.18 60))" }} />
                    </div>
                    <span className="text-xs text-muted-foreground w-8 text-right">{day.totalImagesGenerated}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BarChart3 className="w-10 h-10 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">No usage data yet</p>
              <p className="text-muted-foreground/60 text-xs mt-1">Data will appear as users interact with the bot</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Requests tab ─────────────────────────────────────────────────────────────

function RequestsTab() {
  const { data: requests, isLoading } = trpc.admin.recentRequests.useQuery();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Image Requests</h2>
        <p className="text-muted-foreground text-sm">Recent image generation requests from Messenger users</p>
      </div>

      <Card className="border-border/50" style={{ background: "oklch(14% 0.015 260)" }}>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : requests && requests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: "oklch(20% 0.02 260)" }}>
                    <th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">PSID</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Style</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "oklch(18% 0.015 260)" }}>
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-accent/30 transition-colors">
                      <td className="px-6 py-4 text-muted-foreground font-mono text-xs">#{req.id}</td>
                      <td className="px-6 py-4 text-foreground font-mono text-xs">
                        {req.psid.slice(0, 8)}…
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-foreground font-medium">{req.styleLabel ?? req.style}</span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">
                        {new Date(req.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ImageIcon className="w-10 h-10 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">No image requests yet</p>
              <p className="text-muted-foreground/60 text-xs mt-1">Requests will appear when users interact with the Messenger bot</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Style analytics tab ──────────────────────────────────────────────────────

const STYLE_COLORS: Record<string, string> = {
  caricature: "oklch(72% 0.18 40)",
  petals: "oklch(70% 0.16 340)",
  gold: "oklch(78% 0.14 80)",
  cinematic: "oklch(60% 0.2 220)",
  disco: "oklch(70% 0.16 300)",
  clouds: "oklch(65% 0.18 200)",
};

function StyleAnalyticsTab() {
  const { data: breakdown, isLoading } = trpc.admin.styleBreakdown.useQuery();

  const total = breakdown?.reduce((sum, s) => sum + Number(s.cnt), 0) ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Style Analytics</h2>
        <p className="text-muted-foreground text-sm">Popularity breakdown of AI transformation styles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50" style={{ background: "oklch(14% 0.015 260)" }}>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">Completions by Style</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : breakdown && breakdown.length > 0 ? (
              <div className="space-y-4">
                {breakdown.map((item) => {
                  const pct = total > 0 ? Math.round((Number(item.cnt) / total) * 100) : 0;
                  const color = STYLE_COLORS[item.style] ?? "oklch(78% 0.14 80)";
                  return (
                    <div key={item.style}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-foreground">{item.styleLabel ?? item.style}</span>
                        <span className="text-xs text-muted-foreground">{item.cnt} ({pct}%)</span>
                      </div>
                      <div className="h-2 rounded-full" style={{ background: "oklch(20% 0.02 260)" }}>
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Palette className="w-10 h-10 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground text-sm">No style data yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50" style={{ background: "oklch(14% 0.015 260)" }}>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">Style Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Caricature", emoji: "🎨", color: STYLE_COLORS.caricature },
                { name: "Petals", emoji: "🌸", color: STYLE_COLORS.petals },
                { name: "Gold", emoji: "✨", color: STYLE_COLORS.gold },
                { name: "Cinematic", emoji: "🎬", color: STYLE_COLORS.cinematic },
                { name: "Disco Glow", emoji: "🪩", color: STYLE_COLORS.disco },
                { name: "Clouds", emoji: "☁️", color: STYLE_COLORS.clouds },
              ].map((style) => (
                <div key={style.name} className="flex items-center gap-2 p-3 rounded-xl"
                  style={{ background: "oklch(18% 0.015 260)", border: `1px solid ${style.color}30` }}>
                  <span className="text-lg">{style.emoji}</span>
                  <span className="text-sm font-medium text-foreground">{style.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Notifications tab ────────────────────────────────────────────────────────

function NotificationsTab() {
  const { data: notifications, isLoading } = trpc.admin.notifications.useQuery();

  const typeConfig = {
    milestone: { icon: <TrendingUp className="w-4 h-4" />, color: "oklch(65% 0.18 160)", bg: "oklch(65% 0.18 160 / 0.1)" },
    error: { icon: <XCircle className="w-4 h-4" />, color: "oklch(55% 0.2 25)", bg: "oklch(55% 0.2 25 / 0.1)" },
    quota_warning: { icon: <AlertCircle className="w-4 h-4" />, color: "oklch(72% 0.18 80)", bg: "oklch(72% 0.18 80 / 0.1)" },
    system_alert: { icon: <Bell className="w-4 h-4" />, color: "oklch(60% 0.2 220)", bg: "oklch(60% 0.2 220 / 0.1)" },
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Notifications</h2>
        <p className="text-muted-foreground text-sm">System alerts, milestones, and operational events</p>
      </div>

      <Card className="border-border/50" style={{ background: "oklch(14% 0.015 260)" }}>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : notifications && notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notif) => {
                const cfg = typeConfig[notif.type];
                return (
                  <div key={notif.id} className="flex items-start gap-4 p-4 rounded-xl"
                    style={{ background: cfg.bg, border: `1px solid ${cfg.color}30` }}>
                    <div className="flex-shrink-0 mt-0.5" style={{ color: cfg.color }}>{cfg.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-sm font-semibold text-foreground">{notif.title}</span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {new Date(notif.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{notif.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Bell className="w-10 h-10 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">No notifications yet</p>
              <p className="text-muted-foreground/60 text-xs mt-1">System events will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Palette icon (used in StyleAnalyticsTab) ─────────────────────────────────

function Palette({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}

// ─── Access denied screen ─────────────────────────────────────────────────────

function AccessDenied() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          style={{ background: "oklch(55% 0.2 25 / 0.1)", border: "1px solid oklch(55% 0.2 25 / 0.3)" }}>
          <AlertCircle className="w-8 h-8" style={{ color: "oklch(55% 0.2 25)" }} />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You need administrator privileges to access this dashboard.
        </p>
        <Link href="/">
          <Button variant="outline" className="gap-2 border-white/10 hover:border-primary/40">
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

function LoginRequired() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          style={{ background: "oklch(78% 0.14 80 / 0.1)", border: "1px solid oklch(78% 0.14 80 / 0.3)" }}>
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Sign In Required</h1>
        <p className="text-muted-foreground mb-6">
          Please sign in with your admin account to access the dashboard.
        </p>
        <a href={getLoginUrl()}>
          <Button className="gap-2"
            style={{ background: "linear-gradient(135deg, oklch(78% 0.14 80), oklch(65% 0.18 60))", color: "oklch(12% 0.02 80)" }}>
            Sign In
            <ChevronRight className="w-4 h-4" />
          </Button>
        </a>
      </div>
    </div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Loading…
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <LoginRequired />;
  if (user?.role !== "admin") return <AccessDenied />;

  const renderTab = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab />;
      case "requests": return <RequestsTab />;
      case "styles": return <StyleAnalyticsTab />;
      case "notifications": return <NotificationsTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar active={activeTab} onNavigate={setActiveTab} />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 p-4 border-b sticky top-0 z-10"
          style={{ background: "oklch(12% 0.015 260)", borderColor: "oklch(20% 0.02 260)" }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, oklch(78% 0.14 80), oklch(65% 0.18 60))" }}>
            <Sparkles className="w-3.5 h-3.5 text-black" />
          </div>
          <span className="font-semibold text-foreground text-sm">Leaderbot AI Admin</span>
        </div>

        {/* Mobile nav */}
        <div className="lg:hidden flex gap-1 p-3 border-b overflow-x-auto"
          style={{ borderColor: "oklch(20% 0.02 260)", background: "oklch(12% 0.015 260)" }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === item.id ? "text-black" : "text-muted-foreground hover:text-foreground"
              }`}
              style={activeTab === item.id ? {
                background: "linear-gradient(135deg, oklch(78% 0.14 80), oklch(65% 0.18 60))",
              } : {}}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-6 lg:p-8 max-w-6xl">
          {renderTab()}
        </div>
      </main>
    </div>
  );
}
