import { desc } from "drizzle-orm";
import { getDatabase } from "@/lib/get-db";
import { dataSources } from "@/db/schema";

export interface DataSourceItem {
	id: string;
	name: string;
	type: "csv" | "api" | "manual";
	status: "active" | "error" | "disabled";
	lastSyncAt: string | null;
	kpisLinked: number;
}

export async function getDataSources(): Promise<DataSourceItem[]> {
	const db = await getDatabase();

	const results = await db
		.select()
		.from(dataSources)
		.orderBy(desc(dataSources.createdAt));

	return results.map((r) => ({
		id: r.id,
		name: r.name,
		type: r.type,
		status: r.status,
		lastSyncAt: r.lastSyncAt?.toISOString() ?? null,
		kpisLinked: 0, // TODO: implement kpi-datasource linking
	}));
}
