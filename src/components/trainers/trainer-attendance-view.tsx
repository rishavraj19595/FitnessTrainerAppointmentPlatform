"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  User,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatCard } from "@/components/ui/stat-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatDate, formatTime } from "@/lib/utils";

interface TrainerAttendanceViewProps {
  initialBookings: any[];
  initialAttendance: any[];
}

export function TrainerAttendanceView({
  initialBookings,
  initialAttendance,
}: TrainerAttendanceViewProps) {
  const router = useRouter();
  const [selectedBooking, setSelectedBooking] = React.useState<any | null>(null);
  const [status, setStatus] = React.useState<"PRESENT" | "ABSENT" | "NO_SHOW">("PRESENT");
  const [notes, setNotes] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const presentCount = initialAttendance.filter((a) => a.status === "PRESENT").length;
  const absentCount = initialAttendance.filter((a) => a.status === "ABSENT").length;
  const noShowCount = initialAttendance.filter((a) => a.status === "NO_SHOW").length;
  const totalMarked = presentCount + absentCount + noShowCount;
  const attendanceRate = totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 100;

  const handleRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          clientId: selectedBooking.clientId || selectedBooking.client.id,
          status,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to log attendance");
      }

      toast.success(`Session marked as ${status}. Client notified.`);
      setSelectedBooking(null);
      setNotes("");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to record attendance");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Session Attendance Management
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Verify attendance for client sessions, mark present/absent/no-show, and leave performance coaching notes.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          description="Client turnout percentage"
          icon={ClipboardCheck}
          colorScheme="emerald"
        />
        <StatCard
          title="Completed Sessions"
          value={presentCount}
          description="Present and trained"
          icon={CheckCircle2}
          colorScheme="blue"
        />
        <StatCard
          title="Total Bookings"
          value={initialBookings.length}
          description="On trainer calendar"
          icon={Clock}
          colorScheme="purple"
        />
        <StatCard
          title="No-Shows / Absences"
          value={absentCount + noShowCount}
          description="Missed sessions"
          icon={XCircle}
          colorScheme="amber"
        />
      </div>

      {/* Pending Sessions to Mark */}
      <div className="p-8 rounded-3xl border bg-card shadow-sm space-y-4">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">
          Active Appointments Requiring Verification
        </h3>

        {initialBookings.length === 0 ? (
          <p className="text-sm text-center py-6 text-muted-foreground">
            No appointments to mark at this time.
          </p>
        ) : (
          <div className="space-y-3">
            {initialBookings.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl border bg-slate-50/50 dark:bg-slate-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-3.5">
                  <Avatar className="h-11 w-11 ring-1 ring-emerald-500">
                    <AvatarImage src={b.client?.image || ""} />
                    <AvatarFallback>{b.client?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {b.client?.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(b.date)} at {formatTime(b.startTime)} •{" "}
                      {b.package?.title || "Consultation"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge
                    variant={
                      b.attendance
                        ? b.attendance.status === "PRESENT"
                          ? "success"
                          : "destructive"
                        : b.status === "CONFIRMED"
                        ? "outline"
                        : "secondary"
                    }
                  >
                    {b.attendance ? `Marked: ${b.attendance.status}` : b.status}
                  </Badge>

                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedBooking(b);
                      setStatus(b.attendance?.status || "PRESENT");
                      setNotes(b.attendance?.notes || "");
                    }}
                    className="font-bold shadow-xs"
                  >
                    <ClipboardCheck className="mr-1.5 h-3.5 w-3.5" />
                    {b.attendance ? "Update Log" : "Mark Attendance"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verified Attendance History Table */}
      <div className="p-8 rounded-3xl border bg-card shadow-sm space-y-4">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">
          Verified Attendance Ledger
        </h3>

        {initialAttendance.length === 0 ? (
          <p className="text-sm text-center py-6 text-muted-foreground">
            No attendance records logged yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-slate-50/60 dark:bg-slate-900/40 text-xs font-bold uppercase text-muted-foreground">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Athlete / Client</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Coaching Feedback & Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs">
                {initialAttendance.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                    <td className="py-3.5 px-4 font-semibold">{formatDate(a.date)}</td>
                    <td className="py-3.5 px-4 font-bold">{a.client.name}</td>
                    <td className="py-3.5 px-4">
                      {a.status === "PRESENT" ? (
                        <Badge variant="success">Present</Badge>
                      ) : a.status === "ABSENT" ? (
                        <Badge variant="destructive">Absent</Badge>
                      ) : (
                        <Badge variant="warning">No-Show</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 max-w-sm text-slate-600 dark:text-slate-300">
                      {a.notes || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Attendance Dialog */}
      <Dialog
        open={Boolean(selectedBooking)}
        onOpenChange={() => setSelectedBooking(null)}
      >
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-emerald-600" />
              Record Attendance
            </DialogTitle>
            <DialogDescription>
              Session with{" "}
              <strong className="text-foreground">
                {selectedBooking?.client?.name}
              </strong>{" "}
              on {selectedBooking ? formatDate(selectedBooking.date) : ""}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRecord} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Attendance Status *
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus("PRESENT")}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    status === "PRESENT"
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "bg-background text-foreground"
                  }`}
                >
                  Present
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("ABSENT")}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    status === "ABSENT"
                      ? "border-rose-600 bg-rose-600 text-white"
                      : "bg-background text-foreground"
                  }`}
                >
                  Absent
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("NO_SHOW")}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    status === "NO_SHOW"
                      ? "border-amber-600 bg-amber-600 text-white"
                      : "bg-background text-foreground"
                  }`}
                >
                  No-Show
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Performance Evaluation & Feedback
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Excellent form on squats. Completed all prescribed working volume..."
                className="w-full p-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-11 font-bold shadow-md shadow-emerald-600/20"
            >
              {submitting ? "Saving..." : "Confirm & Save Log"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
