"use server";

import { getDatabase } from "@/lib/get-db";
import { feedback } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function sendFeedback(formData: FormData) {
	const db = await getDatabase();

	const id = crypto.randomUUID();
	await db.insert(feedback).values({
		id,
		organizationId: "org-001",
		fromUserId: formData.get("fromUserId") as string,
		toUserId: formData.get("toUserId") as string,
		type: formData.get("type") as "praise" | "suggestion" | "concern",
		content: formData.get("content") as string,
		isAnonymous: formData.get("isAnonymous") === "true",
	});

	revalidatePath("/feedback");
	revalidatePath("/");
	return { success: true };
}
