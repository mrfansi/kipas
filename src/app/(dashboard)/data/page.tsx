import { DataContent } from "@/components/data/data-content";
import { getDataSources } from "@/lib/data/data-sources";

export default async function DataPage() {
  const sources = await getDataSources();

  return <DataContent sources={sources} />;
}
