import { eq, desc } from "drizzle-orm";
import { getDatabase } from "@/lib/get-db";
import { feedback, users } from "@/db/schema";

export interface FeedbackWithUser {
	id: string;
	from: string;
	fromUserId: string;
	toUserId: string;
	type: "praise" | "suggestion" | "concern";
	content: string;
	isAnonymous: boolean;
	isRead: boolean;
	createdAt: Date;
}

export async function getReceivedFeedback(
	userId: string,
): Promise<FeedbackWithUser[]> {
	const db = await getDatabase();

	const results = await db
		.select({
			id: feedback.id,
			fromUserId: feedback.fromUserId,
			toUserId: feedback.toUserId,
			type: feedback.type,
			content: feedback.content,
			isAnonymous: feedback.isAnonymous,
			isRead: feedback.isRead,
			createdAt: feedback.createdAt,
			fromName: users.name,
		})
		.from(feedback)
		.leftJoin(users, eq(feedback.fromUserId, users.id))
		.where(eq(feedback.toUserId, userId))
		.orderBy(desc(feedback.createdAt));

	return results.map((r) => ({
		id: r.id,
		from: r.isAnonymous ? "Anonim" : (r.fromName ?? "Unknown"),
		fromUserId: r.fromUserId,
		toUserId: r.toUserId,
		type: r.type,
		content: r.content,
		isAnonymous: r.isAnonymous,
		isRead: r.isRead,
		createdAt: r.createdAt,
	}));
}

export async function getSentFeedback(
	userId: string,
): Promise<FeedbackWithUser[]> {
	const db = await getDatabase();

	const results = await db
		.select({
			id: feedback.id,
			fromUserId: feedback.fromUserId,
			toUserId: feedback.toUserId,
			type: feedback.type,
			content: feedback.content,
			isAnonymous: feedback.isAnonymous,
			isRead: feedback.isRead,
			createdAt: feedback.createdAt,
			toName: users.name,
		})
		.from(feedback)
		.leftJoin(users, eq(feedback.toUserId, users.id))
		.where(eq(feedback.fromUserId, userId))
		.orderBy(desc(feedback.createdAt));

	return results.map((r) => ({
		id: r.id,
		from: r.toName ?? "Unknown",
		fromUserId: r.fromUserId,
		toUserId: r.toUserId,
		type: r.type,
		content: r.content,
		isAnonymous: r.isAnonymous,
		isRead: r.isRead,
		createdAt: r.createdAt,
	}));
}
