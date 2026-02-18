"use server";

import { getDatabase } from "@/lib/get-db";
import { goals } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createGoal(formData: FormData) {
	const db = await getDatabase();

	const id = crypto.randomUUID();
	await db.insert(goals).values({
		id,
		organizationId: "org-001",
		title: formData.get("title") as string,
		description: (formData.get("description") as string) || null,
		ownerId: (formData.get("ownerId") as string) || null,
		startDate: (formData.get("startDate") as string) || null,
		dueDate: (formData.get("dueDate") as string) || null,
		status: "not_started",
		progress: 0,
	});

	revalidatePath("/goals");
	revalidatePath("/");
	return { success: true, id };
}

export async function updateGoal(id: string, data: {
	title?: string;
	description?: string;
	status?: "not_started" | "in_progress" | "at_risk" | "completed" | "cancelled";
	progress?: number;
	ownerId?: string;
	dueDate?: string;
}) {
	const db = await getDatabase();

	await db.update(goals).set({
		...data,
		updatedAt: new Date(),
		...(data.status === "completed" ? { completedAt: new Date() } : {}),
	}).where(eq(goals.id, id));

	revalidatePath("/goals");
	revalidatePath("/");
	return { success: true };
}

export async function deleteGoal(id: string) {
	const db = await getDatabase();

	await db.delete(goals).where(eq(goals.id, id));

	revalidatePath("/goals");
	revalidatePath("/");
	return { success: true };
}
