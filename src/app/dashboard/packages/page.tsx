import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { redirect } from "next/navigation";
import { ClientPackagesView } from "@/components/dashboard/client-packages-view";

export const revalidate = 0;

export default async function ClientPackagesPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login?redirect=/dashboard/packages");
  }

  const purchases = await dbService.getUserPurchases(session.user.id);

  return <ClientPackagesView purchases={purchases} />;
}
