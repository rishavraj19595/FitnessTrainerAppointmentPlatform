import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { redirect } from "next/navigation";
import {
  ClipboardCheck,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatCard } from "@/components/ui/stat-card";
import { formatDate, formatTime } from "@/lib/utils";

export const revalidate = 0;

export default async function ClientAttendancePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login?redirect=/dashboard/attendance");
  }

  const attendanceRecords = await dbService.getAttendanceByClient(session.user.id);
  const bookings = await dbService.getBookingsByClient(session.user.id);

  const presentCount = attendanceRecords.filter((a) => (a.status as string) === "PRESENT").length;
  const absentCount = attendanceRecords.filter((a) => (a.status as string) === "ABSENT").length;
  const noShowCount = attendanceRecords.filter((a) => (a.status as string) === "NO_SHOW").length;
  const totalCompleted = presentCount + absentCount + noShowCount;

  const attendanceRate =
    totalCompleted > 0 ? Math.round((presentCount / totalCompleted) * 100) : 100;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Attendance & Session Logs
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Review verified session check-ins and performance feedback from your coaches.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          description="Consistent commitment"
          icon={ClipboardCheck}
          colorScheme="emerald"
        />
        <StatCard
          title="Sessions Attended"
          value={presentCount}
          description="Present and trained"
          icon={CheckCircle2}
          colorScheme="blue"
        />
        <StatCard
          title="Total Bookings"
          value={bookings.length}
          description="All time scheduled"
          icon={Clock}
          colorScheme="purple"
        />
        <StatCard
          title="Missed / No-Show"
          value={absentCount + noShowCount}
          description="Unattended slots"
          icon={XCircle}
          colorScheme="amber"
        />
      </div>

      {/* Attendance History Table */}
      <div className="p-6 sm:p-8 rounded-3xl border bg-card shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Session Attendance Ledger
        </h3>

        {attendanceRecords.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">
            No attendance records logged yet. Your trainer will verify your check-in after each workout session!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-slate-50/60 dark:bg-slate-900/40 text-xs font-bold uppercase text-muted-foreground">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Coach</th>
                  <th className="py-3 px-4">Session Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Trainer Evaluation & Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs">
                {attendanceRecords.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                    <td className="py-3.5 px-4 font-semibold">
                      {formatDate(att.date)}
                      <span className="block text-[11px] text-muted-foreground font-normal">
                        {att.booking.startTime} - {att.booking.endTime}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      Coach {att.trainer.name}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {att.booking.sessionType.replace("_", " ")}
                    </td>
                    <td className="py-3.5 px-4">
                      {att.status === "PRESENT" ? (
                        <Badge variant="success" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Present
                        </Badge>
                      ) : att.status === "ABSENT" ? (
                        <Badge variant="destructive" className="gap-1">
                          <XCircle className="h-3 w-3" /> Absent
                        </Badge>
                      ) : (
                        <Badge variant="warning" className="gap-1">
                          <AlertTriangle className="h-3 w-3" /> No-Show
                        </Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 max-w-sm text-slate-700 dark:text-slate-300">
                      {att.notes || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
