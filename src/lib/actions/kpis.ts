"use server";

import { getDatabase } from "@/lib/get-db";
import { kpis, kpiValues } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createKpi(formData: FormData) {
	const db = await getDatabase();

	const id = crypto.randomUUID();
	await db.insert(kpis).values({
		id,
		organizationId: "org-001",
		name: formData.get("name") as string,
		description: (formData.get("description") as string) || null,
		unit: (formData.get("unit") as string) || "number",
		category: (formData.get("category") as string) || null,
		targetValue: formData.get("target") ? Number(formData.get("target")) : null,
		frequency: (formData.get("frequency") as "daily" | "weekly" | "monthly" | "quarterly") || "monthly",
		weight: formData.get("weight") ? Number(formData.get("weight")) : 1,
		ownerId: (formData.get("ownerId") as string) || null,
		status: "active",
	});

	revalidatePath("/kpi");
	revalidatePath("/");
	return { success: true, id };
}

export async function updateKpi(id: string, formData: FormData) {
	const db = await getDatabase();

	await db
		.update(kpis)
		.set({
			name: formData.get("name") as string,
			description: (formData.get("description") as string) || null,
			unit: (formData.get("unit") as string) || "number",
			category: (formData.get("category") as string) || null,
			targetValue: formData.get("target") ? Number(formData.get("target")) : null,
			frequency: (formData.get("frequency") as "daily" | "weekly" | "monthly" | "quarterly") || "monthly",
			weight: formData.get("weight") ? Number(formData.get("weight")) : 1,
			ownerId: (formData.get("ownerId") as string) || null,
			updatedAt: new Date(),
		})
		.where(eq(kpis.id, id));

	revalidatePath("/kpi");
	revalidatePath("/");
	return { success: true };
}

export async function deleteKpi(id: string) {
	const db = await getDatabase();

	await db.delete(kpiValues).where(eq(kpiValues.kpiId, id));
	await db.delete(kpis).where(eq(kpis.id, id));

	revalidatePath("/kpi");
	revalidatePath("/");
	return { success: true };
}

export async function addKpiValue(kpiId: string, value: number, date: string, notes?: string, userId?: string) {
	const db = await getDatabase();

	const id = crypto.randomUUID();
	await db.insert(kpiValues).values({
		id,
		kpiId,
		value,
		date,
		notes: notes || null,
		source: "manual",
		createdBy: userId || null,
	});

	revalidatePath("/kpi");
	revalidatePath("/");
	return { success: true, id };
}
