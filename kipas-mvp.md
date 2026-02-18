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
- [x] Phase 9: Goals & Check-ins (goal tracking, weekly check-ins, feedback)
- [x] Phase 10: Alerts & Data Sources (anomaly detection, notification config, data connectors)
- [x] Phase 11: Settings (theme, language, organization config)
- [x] Phase 12: Verification — `npm run build` passes, all 9 routes ✅

## Done When

- [x] Dashboard shows KPI overview with charts
- [x] KPI CRUD + CSV import works
- [x] Goals & check-ins functional
- [x] Feedback system with praise/suggestion/concern types
- [x] Alerts configuration with severity levels
- [x] Data sources management (CSV, API, Manual)
- [x] Settings with theme/language toggle
- [x] i18n toggles between ID/EN
- [x] `npm run build` succeeds (10/10 routes compiled)
