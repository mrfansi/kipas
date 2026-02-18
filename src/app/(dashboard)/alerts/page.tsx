import { AlertsContent } from "@/components/alerts/alerts-content";
import { getAlerts } from "@/lib/data/alerts";
import { getKpisWithDetails } from "@/lib/data/kpis";

export default async function AlertsPage() {
  const [alertsList, kpis] = await Promise.all([
    getAlerts(),
    getKpisWithDetails(),
  ]);

  return (
    <AlertsContent
      alerts={alertsList}
      kpis={kpis.map((k) => ({ id: k.id, name: k.name }))}
    />
  );
}
