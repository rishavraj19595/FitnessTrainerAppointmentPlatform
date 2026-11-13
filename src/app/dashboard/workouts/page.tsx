import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { redirect } from "next/navigation";
import { ClientWorkoutsView } from "@/components/dashboard/client-workouts-view";

export const revalidate = 0;

export default async function ClientWorkoutsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login?redirect=/dashboard/workouts");
  }

  const workoutPlans = await dbService.getWorkoutPlansByClient(session.user.id);

  return <ClientWorkoutsView workoutPlans={workoutPlans} />;
}
