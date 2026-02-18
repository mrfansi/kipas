import { KpiContent } from "@/components/kpi/kpi-content";
import { getKpisWithDetails, getUsers } from "@/lib/data/kpis";

export default async function KpiPage() {
  const [kpis, users] = await Promise.all([getKpisWithDetails(), getUsers()]);

  return <KpiContent kpis={kpis} users={users} />;
}
