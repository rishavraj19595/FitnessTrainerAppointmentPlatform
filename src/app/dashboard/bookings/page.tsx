import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { redirect } from "next/navigation";
import { ClientBookingsView } from "@/components/dashboard/client-bookings-view";

export const revalidate = 0;

export default async function ClientBookingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login?redirect=/dashboard/bookings");
  }

  const bookings = await dbService.getBookingsByClient(session.user.id);

  return <ClientBookingsView initialBookings={bookings} />;
}
