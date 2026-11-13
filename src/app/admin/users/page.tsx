import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { redirect } from "next/navigation";
import { AdminUsersView } from "@/components/admin/admin-users-view";

export const revalidate = 0;

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login?redirect=/admin/users");
  }

  const users = await dbService.getAllUsers();

  return <AdminUsersView initialUsers={users} />;
}
