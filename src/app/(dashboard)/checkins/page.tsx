import { CheckinsContent } from "@/components/checkins/checkins-content";
import { getCFUser } from "@/lib/auth";
import { getCheckins } from "@/lib/data/checkins";

export default async function CheckinsPage() {
  const user = await getCFUser();
  const userId = user?.id ?? "dev-user-001";
  const pastCheckins = await getCheckins(userId);

  return (
    <CheckinsContent
      userId={userId}
      pastCheckins={pastCheckins.map((c) => ({
        ...c,
        submittedAt: c.submittedAt?.toISOString() ?? null,
        createdAt: c.createdAt.toISOString(),
      }))}
    />
  );
}
