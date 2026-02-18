import { eq, desc, and, like, sql } from "drizzle-orm";
import { getDatabase } from "@/lib/get-db";
import { kpis, kpiValues, users } from "@/db/schema";

export interface KpiWithDetails {
	id: string;
	name: string;
	category: string;
	unit: string;
	target: number;
	current: number;
	progress: number;
	status: "active" | "paused" | "archived";
	frequency: "daily" | "weekly" | "monthly" | "quarterly";
	owner: string;
	ownerId: string | null;
	trend: "up" | "down" | "flat";
	weight: number;
	description: string | null;
}

export interface UserOption {
	id: string;
	name: string;
}

export async function getKpisWithDetails(): Promise<KpiWithDetails[]> {
	const db = await getDatabase();

	const allKpis = await db
		.select({
			id: kpis.id,
			name: kpis.name,
			category: kpis.category,
			unit: kpis.unit,
			targetValue: kpis.targetValue,
			status: kpis.status,
			frequency: kpis.frequency,
			ownerId: kpis.ownerId,
			weight: kpis.weight,
			description: kpis.description,
			ownerName: users.name,
		})
		.from(kpis)
		.leftJoin(users, eq(kpis.ownerId, users.id))
		.orderBy(desc(kpis.createdAt));

	const result: KpiWithDetails[] = [];

	for (const kpi of allKpis) {
		const recentValues = await db
			.select()
			.from(kpiValues)
			.where(eq(kpiValues.kpiId, kpi.id))
			.orderBy(desc(kpiValues.date))
			.limit(2);

		const current = recentValues[0]?.value ?? 0;
		const previous = recentValues[1]?.value ?? current;
		const target = kpi.targetValue ?? 0;
		const progress = target > 0 ? Math.round((current / target) * 100) : 0;

		let trend: "up" | "down" | "flat" = "flat";
		if (current > previous) trend = "up";
		else if (current < previous) trend = "down";

		result.push({
			id: kpi.id,
			name: kpi.name,
			category: kpi.category ?? "Umum",
			unit: kpi.unit,
			target,
			current,
			progress: Math.min(progress, 100),
			status: kpi.status,
			frequency: kpi.frequency,
			owner: kpi.ownerName ?? "Belum ditentukan",
			ownerId: kpi.ownerId,
			trend,
			weight: kpi.weight ?? 1,
			description: kpi.description,
		});
	}

	return result;
}

export async function getUsers(): Promise<UserOption[]> {
	const db = await getDatabase();
	const allUsers = await db
		.select({ id: users.id, name: users.name })
		.from(users)
		.where(eq(users.isActive, true));
	return allUsers;
}
