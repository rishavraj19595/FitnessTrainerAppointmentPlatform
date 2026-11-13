import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { redirect } from "next/navigation";
import { TrainerBookingsView } from "@/components/trainers/trainer-bookings-view";

export const revalidate = 0;

export default async function TrainerBookingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "TRAINER" && session.user.role !== "ADMIN")) {
    redirect("/login?redirect=/trainer/bookings");
  }

  const bookings = await dbService.getBookingsByTrainer(session.user.id);

  return <TrainerBookingsView initialBookings={bookings} />;
}
