import { eq, sql, count, and, desc, gte, inArray } from "drizzle-orm";
import { getDatabase } from "@/lib/get-db";
import {
	kpis,
	kpiValues,
	goals,
	checkins,
	feedback,
	alerts,
	dataSources,
	users,
} from "@/db/schema";

export interface DashboardStats {
	totalKpis: number;
	onTrack: number;
	atRisk: number;
	completed: number;
	totalKpisChange: string;
	onTrackChange: string;
	atRiskChange: string;
	completedChange: string;
}

export interface TrendDataPoint {
	month: string;
	kpi: number;
	target: number;
}

export interface TeamPerformance {
	name: string;
	value: number;
}

export interface CategoryBreakdown {
	name: string;
	value: number;
	color: string;
}

export interface RecentActivity {
	type: "kpi_update" | "goal_complete" | "checkin" | "alert" | "feedback";
	user: string;
	action: string;
	time: string;
	createdAt: Date;
}

export interface DashboardFilters {
	startDate?: Date;
	endDate?: Date;
	category?: string;
}

export async function getDashboardStats(filters?: DashboardFilters): Promise<DashboardStats> {
	const db = await getDatabase();

	const allKpis = await db.select().from(kpis);
	let activeKpis = allKpis.filter((k) => k.status === "active");

	if (filters?.category && filters.category !== "all") {
		activeKpis = activeKpis.filter(
			(k) => k.category?.toLowerCase() === filters.category?.toLowerCase(),
		);
	}

	// Calculate KPI performance from latest values
	const kpiPerformance = await Promise.all(
		activeKpis.map(async (kpi) => {
			const [latestValue] = await db
				.select()
				.from(kpiValues)
				.where(eq(kpiValues.kpiId, kpi.id))
				.orderBy(desc(kpiValues.date))
				.limit(1);

			if (!latestValue || !kpi.targetValue) return { kpiId: kpi.id, progress: 0 };

			const progress = (latestValue.value / kpi.targetValue) * 100;
			return { kpiId: kpi.id, progress };
		}),
	);

	const onTrack = kpiPerformance.filter((p) => p.progress >= 80).length;
	const atRisk = kpiPerformance.filter((p) => p.progress >= 50 && p.progress < 80).length;

	// Count completed goals (filtering by date/category if possible, but goals linkage to category is via KPIs)
	// For simplicity, we just count all completed goals for now, or filter by owner if we had owner-category mapping
	const completedGoals = await db
		.select({ count: count() })
		.from(goals)
		.where(eq(goals.status, "completed"));

	return {
		totalKpis: activeKpis.length,
		onTrack,
		atRisk,
		completed: completedGoals[0]?.count ?? 0,
		totalKpisChange: `+${Math.max(0, activeKpis.length - 20)}`,
		onTrackChange: `+${Math.max(0, onTrack - 15)}`,
		atRiskChange: atRisk > 5 ? `+${atRisk - 5}` : `-${5 - atRisk}`,
		completedChange: `+${completedGoals[0]?.count ?? 0}`,
	};
}

export async function getTrendData(filters?: DashboardFilters): Promise<TrendDataPoint[]> {
	const db = await getDatabase();

	const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
	const currentYear = new Date().getFullYear();
	const result: TrendDataPoint[] = [];

	// If a category filter is applied, we need to filter values by KPIs in that category
	const categoryFilter = filters?.category && filters.category !== "all" ? filters.category : undefined;

	let categoryKpiIds: string[] | undefined;
	if (categoryFilter) {
		const catKpis = await db
			.select({ id: kpis.id })
			.from(kpis)
			.where(eq(kpis.category, categoryFilter));
		categoryKpiIds = catKpis.map((k) => k.id);
	}

	for (let m = 0; m < 8; m++) {
		const monthStr = String(m + 1).padStart(2, "0");
		const startDate = `${currentYear}-${monthStr}-01`;
		const endMonth = m + 2 > 12 ? 1 : m + 2;
		const endYear = m + 2 > 12 ? currentYear + 1 : currentYear;
		const endDate = `${endYear}-${String(endMonth).padStart(2, "0")}-01`;

		let avgValue = 0;
		if (categoryKpiIds && categoryKpiIds.length > 0) {
			const values = await db
				.select({ avg: sql<number>`AVG(${kpiValues.value})` })
				.from(kpiValues)
				.where(
					and(
						gte(kpiValues.date, startDate),
						sql`${kpiValues.date} < ${endDate}`,
						inArray(kpiValues.kpiId, categoryKpiIds),
					),
				);
			avgValue = values[0]?.avg ?? 0;
		} else if (!categoryFilter) {
			const values = await db
				.select({ avg: sql<number>`AVG(${kpiValues.value})` })
				.from(kpiValues)
				.where(
					and(gte(kpiValues.date, startDate), sql`${kpiValues.date} < ${endDate}`),
				);
			avgValue = values[0]?.avg ?? 0;
		}

		let avgTarget = 0;
		if (categoryFilter) {
			const targets = await db
				.select({ avg: sql<number>`AVG(${kpis.targetValue})` })
				.from(kpis)
				.where(and(eq(kpis.status, "active"), eq(kpis.category, categoryFilter)));
			avgTarget = targets[0]?.avg ?? 0;
		} else {
			const targets = await db
				.select({ avg: sql<number>`AVG(${kpis.targetValue})` })
				.from(kpis)
				.where(eq(kpis.status, "active"));
			avgTarget = targets[0]?.avg ?? 0;
		}

		result.push({
			month: months[m],
			kpi: Math.round(avgValue),
			target: Math.round(avgTarget),
		});
	}

	return result;
}

export async function getTeamPerformance(filters?: DashboardFilters): Promise<TeamPerformance[]> {
	const db = await getDatabase();

	// If category filter is present, we only show that category
	let validCategories: string[] = [];
	
	if (filters?.category && filters.category !== "all") {
		validCategories = [filters.category];
	} else {
		const categories = await db
			.select({ category: kpis.category })
			.from(kpis)
			.where(eq(kpis.status, "active"))
			.groupBy(kpis.category);
		validCategories = categories.map(c => c.category).filter((c): c is string => !!c);
	}

	const result: TeamPerformance[] = [];

	for (const cat of validCategories) {
		const categoryKpis = await db
			.select()
			.from(kpis)
			.where(and(eq(kpis.status, "active"), eq(kpis.category, cat)));

		let totalProgress = 0;
		let counted = 0;

		for (const kpi of categoryKpis) {
			const [latestValue] = await db
				.select()
				.from(kpiValues)
				.where(eq(kpiValues.kpiId, kpi.id))
				.orderBy(desc(kpiValues.date))
				.limit(1);

			if (latestValue && kpi.targetValue) {
				totalProgress += Math.min(100, (latestValue.value / kpi.targetValue) * 100);
				counted++;
			}
		}

		result.push({
			name: cat,
			value: counted > 0 ? Math.round(totalProgress / counted) : 0,
		});
	}

	return result.sort((a, b) => b.value - a.value);
}

export async function getCategoryBreakdown(filters?: DashboardFilters): Promise<CategoryBreakdown[]> {
	const db = await getDatabase();
	
	let allKpis = await db.select().from(kpis);
	
	if (filters?.category && filters.category !== "all") {
		allKpis = allKpis.filter(k => k.category === filters.category);
	}

	const performance = await Promise.all(
		allKpis.map(async (kpi) => {
			const [latestValue] = await db
				.select()
				.from(kpiValues)
				.where(eq(kpiValues.kpiId, kpi.id))
				.orderBy(desc(kpiValues.date))
				.limit(1);

			const progress =
				latestValue && kpi.targetValue
					? (latestValue.value / kpi.targetValue) * 100
					: 0;

			return { status: kpi.status, progress };
		}),
	);

	const achieved = performance.filter((p) => p.progress >= 100).length;
	const onTarget = performance.filter((p) => p.progress >= 80 && p.progress < 100).length;
	const atRisk = performance.filter((p) => p.progress >= 50 && p.progress < 80).length;
	const behind = performance.filter(
		(p) => p.progress < 50 && p.status === "active",
	).length;

	return [
		{ name: "Tercapai", value: achieved, color: "#14b8a6" }, // Teal-500
		{ name: "Sesuai Target", value: onTarget, color: "#06b6d4" }, // Cyan-500
		{ name: "Berisiko", value: atRisk, color: "#f59e0b" }, // Amber-500
		{ name: "Terlambat", value: behind, color: "#ef4444" }, // Red-500
	];
}

export async function getRecentActivities(): Promise<RecentActivity[]> {
	const db = await getDatabase();
	const activities: RecentActivity[] = [];

	// Recent KPI value updates
	const recentKpiValues = await db
		.select({
			kpiName: kpis.name,
			date: kpiValues.date,
			createdAt: kpiValues.createdAt,
			userName: users.name,
		})
		.from(kpiValues)
		.leftJoin(kpis, eq(kpiValues.kpiId, kpis.id))
		.leftJoin(users, eq(kpiValues.createdBy, users.id))
		.orderBy(desc(kpiValues.createdAt))
		.limit(3);

	for (const v of recentKpiValues) {
		activities.push({
			type: "kpi_update",
			user: v.userName ?? "Sistem",
			action: `memperbarui KPI ${v.kpiName}`,
			time: formatRelativeTime(v.createdAt),
			createdAt: v.createdAt,
		});
	}

	// Recent goals
	const recentGoals = await db
		.select({
			title: goals.title,
			updatedAt: goals.updatedAt,
			status: goals.status,
			userName: users.name,
		})
		.from(goals)
		.leftJoin(users, eq(goals.ownerId, users.id))
		.orderBy(desc(goals.updatedAt))
		.limit(2);

	for (const g of recentGoals) {
		activities.push({
			type: "goal_complete",
			user: g.userName ?? "Tim",
			action: `${g.status === "completed" ? "menyelesaikan" : "memperbarui"} tujuan ${g.title}`,
			time: formatRelativeTime(g.updatedAt),
			createdAt: g.updatedAt,
		});
	}

	// Recent checkins
	const recentCheckins = await db
		.select({
			weekStart: checkins.weekStart,
			createdAt: checkins.createdAt,
			userName: users.name,
		})
		.from(checkins)
		.leftJoin(users, eq(checkins.userId, users.id))
		.orderBy(desc(checkins.createdAt))
		.limit(2);

	for (const c of recentCheckins) {
		activities.push({
			type: "checkin",
			user: c.userName ?? "Tim",
			action: "mengirim check-in mingguan",
			time: formatRelativeTime(c.createdAt),
			createdAt: c.createdAt,
		});
	}

	// Recent alerts
	const recentAlerts = await db
		.select({
			message: alerts.message,
			lastTriggeredAt: alerts.lastTriggeredAt,
			createdAt: alerts.createdAt,
		})
		.from(alerts)
		.where(eq(alerts.isActive, true))
		.orderBy(desc(alerts.createdAt))
		.limit(2);

	for (const a of recentAlerts) {
		activities.push({
			type: "alert",
			user: "Sistem",
			action: a.message ?? "Alert triggered",
			time: formatRelativeTime(a.lastTriggeredAt ?? a.createdAt),
			createdAt: a.lastTriggeredAt ?? a.createdAt,
		});
	}

	return activities
		.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
		.slice(0, 5);
}

function formatRelativeTime(date: Date): string {
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMins < 1) return "baru saja";
	if (diffMins < 60) return `${diffMins} menit lalu`;
	if (diffHours < 24) return `${diffHours} jam lalu`;
	if (diffDays < 7) return `${diffDays} hari lalu`;
	return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}
