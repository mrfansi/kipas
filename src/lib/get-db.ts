import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb } from "./db";

export async function getDatabase() {
	const { env } = await getCloudflareContext({ async: true });
	return getDb(env.DB);
}
