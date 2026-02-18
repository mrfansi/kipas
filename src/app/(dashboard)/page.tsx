import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { getCFUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getCFUser();

  return <DashboardContent userName={user?.name} />;
}
