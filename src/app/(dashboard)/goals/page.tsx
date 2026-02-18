import { GoalsContent } from "@/components/goals/goals-content";
import { getGoalsWithDetails } from "@/lib/data/goals";
import { getUsers } from "@/lib/data/kpis";

export default async function GoalsPage() {
  const [goals, users] = await Promise.all([getGoalsWithDetails(), getUsers()]);

  return <GoalsContent goals={goals} users={users} />;
}
