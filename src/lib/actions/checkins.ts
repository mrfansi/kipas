"use server";

import { getDatabase } from "@/lib/get-db";
import { checkins } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function submitCheckin(formData: FormData) {
	const db = await getDatabase();

	const userId = formData.get("userId") as string;
	const weekStart = formData.get("weekStart") as string;
	const mood = formData.get("mood") as "great" | "good" | "okay" | "struggling" | "bad";

	// Check if checkin already exists for this week
	const [existing] = await db
		.select()
		.from(checkins)
		.where(and(eq(checkins.userId, userId), eq(checkins.weekStart, weekStart)))
		.limit(1);

	if (existing) {
		await db.update(checkins).set({
			mood,
			accomplishments: (formData.get("accomplishments") as string) || null,
			blockers: (formData.get("blockers") as string) || null,
			plans: (formData.get("plans") as string) || null,
			privateNotes: (formData.get("privateNotes") as string) || null,
			submittedAt: new Date(),
			updatedAt: new Date(),
		}).where(eq(checkins.id, existing.id));
	} else {
		const id = crypto.randomUUID();
		await db.insert(checkins).values({
			id,
			organizationId: "org-001",
			userId,
			weekStart,
			mood,
			accomplishments: (formData.get("accomplishments") as string) || null,
			blockers: (formData.get("blockers") as string) || null,
			plans: (formData.get("plans") as string) || null,
			privateNotes: (formData.get("privateNotes") as string) || null,
			submittedAt: new Date(),
		});
	}

	revalidatePath("/checkins");
	revalidatePath("/");
	return { success: true };
}
