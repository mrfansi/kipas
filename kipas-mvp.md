# KIPAS MVP — KPI Insight & Performance Analysis System

## Goal

Build a Notion-style CMS dashboard for KPI tracking & performance analysis with Drizzle+D1, Cloudflare Zero Trust auth, and i18n (ID/EN).

## Tech Stack

- Next.js 16 + TailwindCSS 4 + shadcn/ui
- DrizzleORM + Cloudflare D1 (SQLite)
- Cloudflare Zero Trust (header-based auth)
- next-intl (Bahasa Indonesia + English)

## Tasks

- [x] Phase 1: Install deps (shadcn, drizzle, next-intl, lucide-react, recharts)
- [x] Phase 2: Notion-style design system (globals.css, color tokens, typography)
- [x] Phase 3: Drizzle schema + D1 config (users, orgs, kpis, goals, checkins, feedback, alerts)
- [x] Phase 4: Cloudflare Zero Trust middleware (read CF headers, sync user to D1)
- [x] Phase 5: i18n setup (next-intl, id/en messages, locale routing)
- [x] Phase 6: App shell (sidebar, topbar, mobile nav, Notion-style layout)
- [x] Phase 7: Dashboard page (KPI overview, charts, quick stats)
- [x] Phase 8: KPI management (CRUD, CSV import, tracking)
- [ ] Phase 9: Goals & Check-ins (goal tracking, weekly check-ins, feedback)
- [ ] Phase 10: Alerts (anomaly detection, notification config)
- [ ] Phase 11: Verification — `npm run build` passes, responsive on mobile

## Done When

- [x] Dashboard shows KPI overview with charts
- [x] KPI CRUD + CSV import works
- [ ] Goals & check-ins functional
- [ ] i18n toggles between ID/EN
- [ ] `npm run build` succeeds
