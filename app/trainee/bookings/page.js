import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { dbService } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatINR, formatDateIST } from "@/lib/utils";
import { CalendarCheck, Clock, ShieldCheck, AlertCircle } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function TraineeBookingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login?redirect=/trainee/bookings");
  }

  const bookings = await dbService.getBookings({ traineeId: session.user.id });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            My Training Appointments
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Track confirmed personal training sessions, schedule details, and booking statuses.
          </p>
        </div>
        <Link href="/trainee/trainers">
          <Button size="sm" className="bg-black text-white hover:bg-zinc-800 font-bold text-xs h-9">
            + Book New Session
          </Button>
        </Link>
      </div>

      {bookings.length === 0 ? (
        <Card className="text-center py-16 space-y-3">
          <CalendarCheck className="h-10 w-10 text-zinc-400 mx-auto" />
          <p className="text-sm font-semibold text-zinc-700">No appointments found</p>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            You haven't scheduled any gym sessions yet. Browse our certified coaches to book your first workout.
          </p>
          <Link href="/trainee/trainers" className="inline-block pt-2">
            <Button size="sm" className="bg-black text-white hover:bg-zinc-800 text-xs font-bold">
              Discover Coaches
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card
              key={booking.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:border-black transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-black">
                    {booking.planTitle}
                  </span>
                  <Badge
                    variant={
                      booking.status === "COMPLETED"
                        ? "success"
                        : booking.status === "CONFIRMED"
                        ? "default"
                        : "warning"
                    }
                    className="text-[10px]"
                  >
                    {booking.status}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-600">
                  <span className="font-medium">
                    Coach: <span className="font-bold text-black">{booking.trainerName}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-zinc-500" />
                    {formatDateIST(booking.date)} at {booking.startTime} IST
                  </span>
                </div>

                {booking.clientNotes && (
                  <p className="text-[11px] text-zinc-500 bg-zinc-50 border border-zinc-200 rounded px-2.5 py-1">
                    <span className="font-semibold text-zinc-700">Your Note: </span>
                    {booking.clientNotes}
                  </p>
                )}
              </div>

              <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-100 flex sm:flex-col items-center sm:items-end justify-between">
                <div>
                  <p className="text-[10px] text-zinc-400 font-semibold uppercase">Amount Paid</p>
                  <p className="text-base font-black text-black">{formatINR(booking.amount)}</p>
                </div>
                <Badge variant="secondary" className="mt-1 text-[9px] bg-zinc-100">
                  Razorpay Verified
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
