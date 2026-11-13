import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { redirect } from "next/navigation";
import { TrainerProfileEditor } from "@/components/trainers/trainer-profile-editor";

export const revalidate = 0;

export default async function TrainerProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "TRAINER" && session.user.role !== "ADMIN")) {
    redirect("/login?redirect=/trainer/profile");
  }

  const profile = await dbService.getTrainerById(session.user.id);

  return <TrainerProfileEditor profile={profile} />;
}
