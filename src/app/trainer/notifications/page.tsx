import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { redirect } from "next/navigation";
import { NotificationsView } from "@/components/dashboard/notifications-view";

export const revalidate = 0;

export default async function TrainerNotificationsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "TRAINER" && session.user.role !== "ADMIN")) {
    redirect("/login?redirect=/trainer/notifications");
  }

  const notifications = await dbService.getNotifications(session.user.id);

  return <NotificationsView initialNotifications={notifications} />;
}
