import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// === Organizations ===
export const organizations = sqliteTable("organizations", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
	logoUrl: text("logo_url"),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// === Users (synced from Cloudflare Zero Trust) ===
export const users = sqliteTable("users", {
	id: text("id").primaryKey(),
	email: text("email").notNull().unique(),
	name: text("name").notNull(),
	avatarUrl: text("avatar_url"),
	role: text("role", { enum: ["admin", "manager", "member"] }).notNull().default("member"),
	organizationId: text("organization_id").references(() => organizations.id),
	locale: text("locale").notNull().default("id"),
	isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
	lastLoginAt: integer("last_login_at", { mode: "timestamp" }),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// === KPI Definitions ===
export const kpis = sqliteTable("kpis", {
	id: text("id").primaryKey(),
	organizationId: text("organization_id").notNull().references(() => organizations.id),
	name: text("name").notNull(),
	description: text("description"),
	unit: text("unit").notNull().default("number"), // number, percentage, currency, custom
	category: text("category"), // sales, marketing, engineering, etc.
	targetValue: real("target_value"),
	minValue: real("min_value"),
	maxValue: real("max_value"),
	weight: real("weight").default(1),
	frequency: text("frequency", { enum: ["daily", "weekly", "monthly", "quarterly"] }).notNull().default("monthly"),
	ownerId: text("owner_id").references(() => users.id),
	parentKpiId: text("parent_kpi_id"),
	status: text("status", { enum: ["active", "paused", "archived"] }).notNull().default("active"),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// === KPI Values (time series data) ===
export const kpiValues = sqliteTable("kpi_values", {
	id: text("id").primaryKey(),
	kpiId: text("kpi_id").notNull().references(() => kpis.id),
	value: real("value").notNull(),
	date: text("date").notNull(), // YYYY-MM-DD
	notes: text("notes"),
	source: text("source").default("manual"), // manual, csv, api
	createdBy: text("created_by").references(() => users.id),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// === Goals ===
export const goals = sqliteTable("goals", {
	id: text("id").primaryKey(),
	organizationId: text("organization_id").notNull().references(() => organizations.id),
	title: text("title").notNull(),
	description: text("description"),
	ownerId: text("owner_id").references(() => users.id),
	parentGoalId: text("parent_goal_id"),
	status: text("status", { enum: ["not_started", "in_progress", "at_risk", "completed", "cancelled"] }).notNull().default("not_started"),
	progress: integer("progress").notNull().default(0), // 0-100
	startDate: text("start_date"),
	dueDate: text("due_date"),
	completedAt: integer("completed_at", { mode: "timestamp" }),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// === Goal-KPI Links ===
export const goalKpis = sqliteTable("goal_kpis", {
	id: text("id").primaryKey(),
	goalId: text("goal_id").notNull().references(() => goals.id),
	kpiId: text("kpi_id").notNull().references(() => kpis.id),
	weight: real("weight").default(1),
});

// === Check-ins (weekly) ===
export const checkins = sqliteTable("checkins", {
	id: text("id").primaryKey(),
	organizationId: text("organization_id").notNull().references(() => organizations.id),
	userId: text("user_id").notNull().references(() => users.id),
	weekStart: text("week_start").notNull(), // YYYY-MM-DD (Monday)
	mood: text("mood", { enum: ["great", "good", "okay", "struggling", "bad"] }),
	accomplishments: text("accomplishments"),
	blockers: text("blockers"),
	plans: text("plans"),
	privateNotes: text("private_notes"),
	submittedAt: integer("submitted_at", { mode: "timestamp" }),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// === Feedback ===
export const feedback = sqliteTable("feedback", {
	id: text("id").primaryKey(),
	organizationId: text("organization_id").notNull().references(() => organizations.id),
	fromUserId: text("from_user_id").notNull().references(() => users.id),
	toUserId: text("to_user_id").notNull().references(() => users.id),
	type: text("type", { enum: ["praise", "suggestion", "concern"] }).notNull(),
	content: text("content").notNull(),
	isAnonymous: integer("is_anonymous", { mode: "boolean" }).notNull().default(false),
	isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// === Anomaly Alerts ===
export const alerts = sqliteTable("alerts", {
	id: text("id").primaryKey(),
	organizationId: text("organization_id").notNull().references(() => organizations.id),
	kpiId: text("kpi_id").notNull().references(() => kpis.id),
	type: text("type", { enum: ["threshold_above", "threshold_below", "trend_change", "no_data"] }).notNull(),
	thresholdValue: real("threshold_value"),
	message: text("message"),
	severity: text("severity", { enum: ["low", "medium", "high", "critical"] }).notNull().default("medium"),
	isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
	lastTriggeredAt: integer("last_triggered_at", { mode: "timestamp" }),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// === Data Sources (CSV/API connectors) ===
export const dataSources = sqliteTable("data_sources", {
	id: text("id").primaryKey(),
	organizationId: text("organization_id").notNull().references(() => organizations.id),
	name: text("name").notNull(),
	type: text("type", { enum: ["csv", "api", "manual"] }).notNull(),
	config: text("config"), // JSON stringified config
	lastSyncAt: integer("last_sync_at", { mode: "timestamp" }),
	status: text("status", { enum: ["active", "error", "disabled"] }).notNull().default("active"),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// Type exports
export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Kpi = typeof kpis.$inferSelect;
export type NewKpi = typeof kpis.$inferInsert;
export type KpiValue = typeof kpiValues.$inferSelect;
export type NewKpiValue = typeof kpiValues.$inferInsert;
export type Goal = typeof goals.$inferSelect;
export type NewGoal = typeof goals.$inferInsert;
export type Checkin = typeof checkins.$inferSelect;
export type NewCheckin = typeof checkins.$inferInsert;
export type Feedback = typeof feedback.$inferSelect;
export type NewFeedback = typeof feedback.$inferInsert;
export type Alert = typeof alerts.$inferSelect;
export type NewAlert = typeof alerts.$inferInsert;
export type DataSource = typeof dataSources.$inferSelect;
export type NewDataSource = typeof dataSources.$inferInsert;
