import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { redirect } from "next/navigation";
import { TrainerEarningsView } from "@/components/trainers/trainer-earnings-view";

export const revalidate = 0;

export default async function TrainerEarningsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "TRAINER" && session.user.role !== "ADMIN")) {
    redirect("/login?redirect=/trainer/earnings");
  }

  const earnings = await dbService.getTrainerEarnings(session.user.id);

  return <TrainerEarningsView earnings={earnings} />;
}
