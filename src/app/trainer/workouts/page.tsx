import * as React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { redirect } from "next/navigation";
import { TrainerWorkoutsView } from "@/components/trainers/trainer-workouts-view";

export const revalidate = 0;

export default async function TrainerWorkoutsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "TRAINER" && session.user.role !== "ADMIN")) {
    redirect("/login?redirect=/trainer/workouts");
  }

  const trainerId = session.user.id;
  const workoutPlans = await dbService.getWorkoutPlansByTrainer(trainerId);
  const bookings = await dbService.getBookingsByTrainer(trainerId);

  // Collect unique clients
  const clientsMap = new Map();
  bookings.forEach((b) => {
    if (b.client?.id) clientsMap.set(b.client.id, b.client);
  });
  const clients = Array.from(clientsMap.values());

  return (
    <React.Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading workout builder...</div>}>
      <TrainerWorkoutsView
        workoutPlans={workoutPlans}
        clients={clients}
      />
    </React.Suspense>
  );
}
