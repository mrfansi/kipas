import { eq, desc } from "drizzle-orm";
import { getDatabase } from "@/lib/get-db";
import { alerts, kpis } from "@/db/schema";

export interface AlertWithKpi {
	id: string;
	kpiName: string;
	kpiId: string;
	type: "threshold_above" | "threshold_below" | "trend_change" | "no_data";
	severity: "low" | "medium" | "high" | "critical";
	thresholdValue: number | null;
	message: string | null;
	isActive: boolean;
	lastTriggered: string | null;
}

export async function getAlerts(): Promise<AlertWithKpi[]> {
	const db = await getDatabase();

	const results = await db
		.select({
			id: alerts.id,
			kpiId: alerts.kpiId,
			kpiName: kpis.name,
			type: alerts.type,
			severity: alerts.severity,
			thresholdValue: alerts.thresholdValue,
			message: alerts.message,
			isActive: alerts.isActive,
			lastTriggeredAt: alerts.lastTriggeredAt,
		})
		.from(alerts)
		.leftJoin(kpis, eq(alerts.kpiId, kpis.id))
		.orderBy(desc(alerts.createdAt));

	return results.map((r) => ({
		id: r.id,
		kpiName: r.kpiName ?? "Unknown KPI",
		kpiId: r.kpiId,
		type: r.type,
		severity: r.severity,
		thresholdValue: r.thresholdValue,
		message: r.message,
		isActive: r.isActive,
		lastTriggered: r.lastTriggeredAt?.toISOString() ?? null,
	}));
}
