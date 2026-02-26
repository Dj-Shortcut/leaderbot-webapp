# Leaderbot AI Webapp — TODO

## Database & Backend
- [x] Extend drizzle schema: imageRequests, dailyQuota, usageStats, notificationLog tables
- [x] Push DB migrations
- [x] Add server query helpers (db.ts)
- [x] Add tRPC admin router: stats, image requests, quota overview
- [x] Add tRPC public router: style list
- [x] Role-based adminProcedure middleware

## Landing Page (Public)
- [x] Hero section with headline, subheadline, and CTA
- [x] How-it-works 3-step section
- [x] Style showcase gallery (6 styles with demo images)
- [x] Facebook Messenger CTA section with instructions
- [x] Footer

## Admin Dashboard
- [x] DashboardLayout with sidebar nav
- [x] Overview stats cards (total images, active users, quota usage, failed requests)
- [x] Recent image requests table (status, style, timestamp)
- [x] Daily quota usage panel
- [x] Protected routes (admin role only)

## Design & Polish
- [x] Global theme (dark elegant palette, OKLCH colors)
- [x] Google Fonts (Inter + display font)
- [x] Responsive mobile-first layout
- [x] Loading skeletons and empty states
- [x] Micro-interactions and transitions

## Testing & Deployment
- [x] Write vitest tests for admin procedures
- [x] Save checkpoint
- [x] Push to GitHub leaderbot-webapp repo

## Branding Update (from Facebook page)
- [x] Update Messenger URL to correct Facebook page ID (61587343141159)
- [x] Update Facebook page link to correct profile URL
- [x] Update tagline to match Facebook page: "AI image transformations inside Messenger. Simple. Instant. Fun."
- [x] Update footer and CTA copy to match real page branding
