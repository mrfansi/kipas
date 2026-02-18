import { eq, desc } from "drizzle-orm";
import { getDatabase } from "@/lib/get-db";
import { goals, goalKpis, users, kpis } from "@/db/schema";

export interface GoalWithDetails {
	id: string;
	title: string;
	description: string | null;
	status: "not_started" | "in_progress" | "at_risk" | "completed" | "cancelled";
	progress: number;
	owner: string;
	ownerId: string | null;
	dueDate: string | null;
	startDate: string | null;
	linkedKpis: number;
}

export async function getGoalsWithDetails(): Promise<GoalWithDetails[]> {
	const db = await getDatabase();

	const allGoals = await db
		.select({
			id: goals.id,
			title: goals.title,
			description: goals.description,
			status: goals.status,
			progress: goals.progress,
			ownerId: goals.ownerId,
			dueDate: goals.dueDate,
			startDate: goals.startDate,
			ownerName: users.name,
		})
		.from(goals)
		.leftJoin(users, eq(goals.ownerId, users.id))
		.orderBy(desc(goals.createdAt));

	const result: GoalWithDetails[] = [];

	for (const goal of allGoals) {
		const links = await db
			.select()
			.from(goalKpis)
			.where(eq(goalKpis.goalId, goal.id));

		result.push({
			id: goal.id,
			title: goal.title,
			description: goal.description,
			status: goal.status,
			progress: goal.progress,
			owner: goal.ownerName ?? "Belum ditentukan",
			ownerId: goal.ownerId,
			dueDate: goal.dueDate,
			startDate: goal.startDate,
			linkedKpis: links.length,
		});
	}

	return result;
}
