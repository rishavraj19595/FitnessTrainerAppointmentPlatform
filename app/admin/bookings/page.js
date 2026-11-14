import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { dbService } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatINR, formatDateIST } from "@/lib/utils";
import { CalendarCheck, Clock, CheckCircle2 } from "lucide-react";

export const revalidate = 0;

export default async function AdminBookingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    redirect("/login?redirect=/admin/bookings");
  }

  const bookings = await dbService.getBookings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
          Platform Appointments & Bookings
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Master registry of all scheduled 1-on-1 sessions, packages, and completed workout attendances.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <h2 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-2">
          <CalendarCheck className="h-4 w-4 text-black" />
          All Bookings Ledger ({bookings.length})
        </h2>

        {bookings.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-8">No appointments scheduled.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-zinc-50 text-zinc-500 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">Date & Time (IST)</th>
                  <th className="py-3 px-4">Trainee</th>
                  <th className="py-3 px-4">Coach</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y text-zinc-700">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-zinc-50/50">
                    <td className="py-3 px-4 font-semibold text-black">
                      {formatDateIST(b.date)} • {b.startTime}
                    </td>
                    <td className="py-3 px-4 font-bold text-zinc-900">
                      {b.traineeName}
                    </td>
                    <td className="py-3 px-4 font-semibold text-zinc-800">
                      {b.trainerName}
                    </td>
                    <td className="py-3 px-4 text-zinc-600">
                      {b.planTitle}
                    </td>
                    <td className="py-3 px-4 font-black text-black">
                      {formatINR(b.amount)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          b.status === "COMPLETED"
                            ? "success"
                            : b.status === "CONFIRMED"
                            ? "default"
                            : "warning"
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
        )}
      </Card>
    </div>
  );
}
