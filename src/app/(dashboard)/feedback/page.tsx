import { FeedbackContent } from "@/components/feedback/feedback-content";
import { getCFUser } from "@/lib/auth";
import { getReceivedFeedback, getSentFeedback } from "@/lib/data/feedback";
import { getUsers } from "@/lib/data/kpis";

export default async function FeedbackPage() {
  const user = await getCFUser();
  const userId = user?.id ?? "dev-user-001";

  const [received, sent, users] = await Promise.all([
    getReceivedFeedback(userId),
    getSentFeedback(userId),
    getUsers(),
  ]);

  return (
    <FeedbackContent
      userId={userId}
      receivedFeedback={received.map((f) => ({
        ...f,
        createdAt: f.createdAt.toISOString(),
      }))}
      sentFeedback={sent.map((f) => ({
        ...f,
        createdAt: f.createdAt.toISOString(),
      }))}
      users={users}
    />
  );
}
