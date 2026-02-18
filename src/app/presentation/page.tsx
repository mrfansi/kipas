import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { getCFUser } from "@/lib/auth";
import {
  getDashboardStats,
  getTrendData,
  getTeamPerformance,
  getCategoryBreakdown,
  getRecentActivities,
} from "@/lib/data/dashboard";

export default async function PresentationPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const user = await getCFUser();

  const filters = {
    category:
      typeof searchParams.category === "string"
        ? searchParams.category
        : undefined,
  };

  const [
    stats,
    trendData,
    teamPerformance,
    categoryBreakdown,
    recentActivities,
  ] = await Promise.all([
    getDashboardStats(filters),
    getTrendData(filters),
    getTeamPerformance(filters),
    getCategoryBreakdown(filters),
    getRecentActivities(),
  ]);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
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
        mode="presentation"
      />
    </div>
  );
}
