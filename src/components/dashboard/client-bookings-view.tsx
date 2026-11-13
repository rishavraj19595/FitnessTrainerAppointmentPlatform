"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  User,
  AlertCircle,
  XCircle,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatDate, formatTime } from "@/lib/utils";

interface ClientBookingsViewProps {
  initialBookings: any[];
}

export function ClientBookingsView({ initialBookings }: ClientBookingsViewProps) {
  const router = useRouter();
  const [bookings, setBookings] = React.useState(initialBookings);
  const [cancellingBookingId, setCancellingBookingId] = React.useState<string | null>(null);
  const [cancelReason, setCancelReason] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const handleCancelBooking = async () => {
    if (!cancellingBookingId) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/bookings/${cancellingBookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "CANCELLED",
          reason: cancelReason || "Cancelled by client",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to cancel appointment");
      }

      toast.success("Appointment cancelled. Any package credit has been refunded.");
      setCancellingBookingId(null);
      setCancelReason("");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel appointment");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge variant="success">Confirmed</Badge>;
      case "COMPLETED":
        return <Badge variant="default">Completed</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "NO_SHOW":
        return <Badge variant="warning">No Show</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            My Appointments
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Review upcoming workout sessions, past training history, and cancel if needed.
          </p>
        </div>
        <Link href="/trainers">
          <Button className="font-bold shadow-md shadow-emerald-600/20">
            <Plus className="mr-1.5 h-4 w-4" /> Book New Session
          </Button>
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border bg-card p-8 space-y-4">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto opacity-40" />
          <h3 className="text-lg font-bold">No appointments found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            You haven't scheduled any appointments yet. Discover top coaches to begin.
          </p>
          <Link href="/trainers" className="inline-block">
            <Button>Find a Coach</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="p-6 rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12 border-2 border-emerald-500">
                    <AvatarImage src={booking.trainer.image || ""} />
                    <AvatarFallback>{booking.trainer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Coach {booking.trainer.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {booking.package?.title || "1-on-1 Consultation Session"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {getStatusBadge(booking.status)}
                  {booking.status === "CONFIRMED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCancellingBookingId(booking.id)}
                      className="text-rose-600 border-rose-200 hover:bg-rose-50"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t pt-4 text-xs">
                <div>
                  <span className="text-muted-foreground block font-medium">Date</span>
                  <span className="font-bold text-foreground">
                    {formatDate(booking.date)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">Time Slot</span>
                  <span className="font-bold text-emerald-600">
                    {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">Type</span>
                  <span className="font-bold text-foreground">
                    {booking.sessionType.replace("_", " ")}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">Attendance</span>
                  <span className="font-bold text-foreground">
                    {booking.attendance ? booking.attendance.status : "Pending Session"}
                  </span>
                </div>
              </div>

              {booking.clientNotes && (
                <div className="text-xs bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border text-muted-foreground">
                  <strong className="text-foreground">Your Notes:</strong> {booking.clientNotes}
                </div>
              )}

              {booking.attendance?.notes && (
                <div className="text-xs bg-emerald-50/60 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/20 text-emerald-900 dark:text-emerald-300">
                  <strong>Trainer Feedback:</strong> {booking.attendance.notes}
                </div>
              )}

              {booking.cancellationReason && (
                <div className="text-xs bg-rose-50 dark:bg-rose-950/20 p-2.5 rounded-xl border border-rose-200 text-rose-800 dark:text-rose-300">
                  <strong>Cancellation Reason:</strong> {booking.cancellationReason}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Cancel Dialog */}
      <Dialog
        open={Boolean(cancellingBookingId)}
        onOpenChange={() => setCancellingBookingId(null)}
      >
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-rose-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Cancel Appointment
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this training session? If this was booked
              using a package credit, your credit will be restored to your balance.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Reason for Cancellation (Optional)
              </label>
              <textarea
                rows={2}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Schedule conflict, feeling unwell..."
                className="w-full p-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCancellingBookingId(null)}
                className="flex-1"
              >
                Keep Appointment
              </Button>
              <Button
                variant="destructive"
                disabled={submitting}
                onClick={handleCancelBooking}
                className="flex-1 font-bold"
              >
                {submitting ? "Cancelling..." : "Confirm Cancellation"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
