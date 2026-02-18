import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { getCFUser } from "@/lib/auth";
import {
  getDashboardStats,
  getTrendData,
  getTeamPerformance,
  getCategoryBreakdown,
  getRecentActivities,
} from "@/lib/data/dashboard";

export default async function DashboardPage() {
  const user = await getCFUser();

  const [
    stats,
    trendData,
    teamPerformance,
    categoryBreakdown,
    recentActivities,
  ] = await Promise.all([
    getDashboardStats(),
    getTrendData(),
    getTeamPerformance(),
    getCategoryBreakdown(),
    getRecentActivities(),
  ]);

  return (
    <DashboardContent
      userName={user?.name}
      stats={stats}
      trendData={trendData}
      teamPerformance={teamPerformance}
      categoryBreakdown={categoryBreakdown}
      recentActivities={recentActivities.map((a) => ({
        ...a,
        createdAt: a.createdAt.toISOString(),
      }))}
    />
  );
}
