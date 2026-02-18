"use server";

import { getDatabase } from "@/lib/get-db";
import { alerts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createAlert(formData: FormData) {
	const db = await getDatabase();

	const id = crypto.randomUUID();
	await db.insert(alerts).values({
		id,
		organizationId: "org-001",
		kpiId: formData.get("kpiId") as string,
		type: formData.get("type") as "threshold_above" | "threshold_below" | "trend_change" | "no_data",
		severity: (formData.get("severity") as "low" | "medium" | "high" | "critical") || "medium",
		thresholdValue: formData.get("thresholdValue") ? Number(formData.get("thresholdValue")) : null,
		message: (formData.get("message") as string) || null,
		isActive: true,
	});

	revalidatePath("/alerts");
	revalidatePath("/");
	return { success: true, id };
}

export async function toggleAlert(id: string, isActive: boolean) {
	const db = await getDatabase();

	await db.update(alerts).set({ isActive }).where(eq(alerts.id, id));

	revalidatePath("/alerts");
	return { success: true };
}

export async function deleteAlert(id: string) {
	const db = await getDatabase();

	await db.delete(alerts).where(eq(alerts.id, id));

	revalidatePath("/alerts");
	return { success: true };
}
