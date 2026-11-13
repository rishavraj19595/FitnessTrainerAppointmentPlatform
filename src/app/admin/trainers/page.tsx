import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { redirect } from "next/navigation";
import { AdminTrainersView } from "@/components/admin/admin-trainers-view";

export const revalidate = 0;

export default async function AdminTrainersPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login?redirect=/admin/trainers");
  }

  const trainers = await dbService.getAllTrainers();

  return <AdminTrainersView initialTrainers={trainers} />;
}
