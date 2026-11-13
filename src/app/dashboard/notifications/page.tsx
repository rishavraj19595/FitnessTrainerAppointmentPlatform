import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { redirect } from "next/navigation";
import { NotificationsView } from "@/components/dashboard/notifications-view";

export const revalidate = 0;

export default async function ClientNotificationsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login?redirect=/dashboard/notifications");
  }

  const notifications = await dbService.getNotifications(session.user.id);

  return <NotificationsView initialNotifications={notifications} />;
}
