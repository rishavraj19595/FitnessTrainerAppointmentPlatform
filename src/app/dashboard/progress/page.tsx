import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { redirect } from "next/navigation";
import { ProgressTrackerView } from "@/components/progress/progress-tracker-view";

export const revalidate = 0;

export default async function ClientProgressPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login?redirect=/dashboard/progress");
  }

  const entries = await dbService.getProgressByClient(session.user.id);

  return <ProgressTrackerView initialEntries={entries} />;
}
