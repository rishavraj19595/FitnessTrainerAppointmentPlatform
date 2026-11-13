import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { redirect } from "next/navigation";
import { TrainerPackagesView } from "@/components/trainers/trainer-packages-view";

export const revalidate = 0;

export default async function TrainerPackagesPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "TRAINER" && session.user.role !== "ADMIN")) {
    redirect("/login?redirect=/trainer/packages");
  }

  const profile = await dbService.getTrainerById(session.user.id);
  const packages = profile?.packages || [];

  return <TrainerPackagesView initialPackages={packages} />;
}
