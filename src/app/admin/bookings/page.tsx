import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { redirect } from "next/navigation";
import { Calendar, Clock, CheckCircle2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime, formatPrice } from "@/lib/utils";

export const revalidate = 0;

export default async function AdminBookingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login?redirect=/admin/bookings");
  }

  const stats = await dbService.getAdminStats();
  const bookings = stats.recentBookings;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          All Platform Bookings
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time appointment schedule audit across all trainers and clients.
        </p>
      </div>

      <div className="p-8 rounded-3xl border bg-card shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50/60 dark:bg-slate-900/40 text-xs font-bold uppercase text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Athlete / Client</th>
                <th className="py-3 px-4">Coach</th>
                <th className="py-3 px-4">Session Date & Time</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y text-xs">
              {bookings.map((b: any) => (
                <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {b.clientName}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600">
                    Coach {b.trainerName}
                  </td>
                  <td className="py-3.5 px-4 font-medium">
                    {formatDate(b.date)} at {formatTime(b.startTime)}
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">
                    {b.sessionType}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        b.status === "CONFIRMED"
                          ? "success"
                          : b.status === "COMPLETED"
                          ? "default"
                          : "destructive"
                      }
                      className="text-[10px]"
                    >
                      {b.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
