import { eq, desc, and } from "drizzle-orm";
import { getDatabase } from "@/lib/get-db";
import { checkins, users } from "@/db/schema";

export interface CheckinWithUser {
	id: string;
	weekStart: string;
	mood: "great" | "good" | "okay" | "struggling" | "bad" | null;
	accomplishments: string | null;
	blockers: string | null;
	plans: string | null;
	privateNotes: string | null;
	submittedAt: Date | null;
	createdAt: Date;
	userName: string;
	userId: string;
}

export async function getCheckins(userId?: string): Promise<CheckinWithUser[]> {
	const db = await getDatabase();

	const query = db
		.select({
			id: checkins.id,
			weekStart: checkins.weekStart,
			mood: checkins.mood,
			accomplishments: checkins.accomplishments,
			blockers: checkins.blockers,
			plans: checkins.plans,
			privateNotes: checkins.privateNotes,
			submittedAt: checkins.submittedAt,
			createdAt: checkins.createdAt,
			userName: users.name,
			userId: checkins.userId,
		})
		.from(checkins)
		.leftJoin(users, eq(checkins.userId, users.id))
		.orderBy(desc(checkins.weekStart));

	const results = userId
		? await query.where(eq(checkins.userId, userId))
		: await query;

	return results.map((r) => ({
		...r,
		userName: r.userName ?? "Unknown",
	}));
}

export async function getCurrentWeekCheckin(
	userId: string,
): Promise<CheckinWithUser | null> {
	const db = await getDatabase();

	const now = new Date();
	const dayOfWeek = now.getDay();
	const monday = new Date(now);
	monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
	const weekStart = monday.toISOString().split("T")[0];

	const [result] = await db
		.select({
			id: checkins.id,
			weekStart: checkins.weekStart,
			mood: checkins.mood,
			accomplishments: checkins.accomplishments,
			blockers: checkins.blockers,
			plans: checkins.plans,
			privateNotes: checkins.privateNotes,
			submittedAt: checkins.submittedAt,
			createdAt: checkins.createdAt,
			userName: users.name,
			userId: checkins.userId,
		})
		.from(checkins)
		.leftJoin(users, eq(checkins.userId, users.id))
		.where(and(eq(checkins.userId, userId), eq(checkins.weekStart, weekStart)))
		.limit(1);

	return result ? { ...result, userName: result.userName ?? "Unknown" } : null;
}
