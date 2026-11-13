import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { redirect } from "next/navigation";
import { TrainerAttendanceView } from "@/components/trainers/trainer-attendance-view";

export const revalidate = 0;

export default async function TrainerAttendancePage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "TRAINER" && session.user.role !== "ADMIN")) {
    redirect("/login?redirect=/trainer/attendance");
  }

  const trainerId = session.user.id;
  const bookings = await dbService.getBookingsByTrainer(trainerId);
  const attendance = await dbService.getAttendanceByTrainer(trainerId);

  return (
    <TrainerAttendanceView
      initialBookings={bookings}
      initialAttendance={attendance}
    />
  );
}
