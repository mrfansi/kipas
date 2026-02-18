"use server";

import { getDatabase } from "@/lib/get-db";
import { dataSources } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createDataSource(formData: FormData) {
	const db = await getDatabase();

	const id = crypto.randomUUID();
	await db.insert(dataSources).values({
		id,
		organizationId: "org-001",
		name: formData.get("name") as string,
		type: formData.get("type") as "csv" | "api" | "manual",
		config: (formData.get("config") as string) || null,
		status: "active",
	});

	revalidatePath("/data");
	return { success: true, id };
}

export async function deleteDataSource(id: string) {
	const db = await getDatabase();

	await db.delete(dataSources).where(eq(dataSources.id, id));

	revalidatePath("/data");
	return { success: true };
}
