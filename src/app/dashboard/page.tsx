import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { redirect } from "next/navigation";
import {
  Calendar,
  Package,
  TrendingUp,
  ClipboardCheck,
  Dumbbell,
  Clock,
  ArrowRight,
  Flame,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatCard } from "@/components/ui/stat-card";
import { formatDate, formatTime, formatPrice } from "@/lib/utils";

export const revalidate = 0;

export default async function ClientDashboardOverview() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login?redirect=/dashboard");
  }

  const clientId = session.user.id;
  const bookings = await dbService.getBookingsByClient(clientId);
  const purchases = await dbService.getUserPurchases(clientId);
  const workoutPlans = await dbService.getWorkoutPlansByClient(clientId);
  const progressEntries = await dbService.getProgressByClient(clientId);
  const attendances = await dbService.getAttendanceByClient(clientId);

  const upcomingBookings = bookings.filter(
    (b) => b.status === "CONFIRMED" && new Date(b.date) >= new Date(Date.now() - 24 * 60 * 60 * 1000)
  );
  const nextBooking = upcomingBookings[0] || null;

  const activePurchases = purchases.filter((p) => p.status === "ACTIVE");
  const totalSessionsRemaining = activePurchases.reduce(
    (sum, p) => sum + p.remainingSessions,
    0
  );

  const latestProgress = progressEntries[progressEntries.length - 1] || null;
  const previousProgress = progressEntries[0] || null;
  const totalWeightChange =
    latestProgress && previousProgress
      ? Math.round((latestProgress.weightKg - previousProgress.weightKg) * 10) / 10
      : 0;

  const activePlan = workoutPlans.find((p) => p.status === "ACTIVE") || null;

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10">
          <Dumbbell className="h-96 w-96" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
            <Flame className="h-3.5 w-3.5 text-lime-400" />
            <span>Welcome back, {session.user.name}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Ready to crush today's fitness goals?
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            You have{" "}
            <span className="font-bold underline text-white">
              {totalSessionsRemaining} session credits
            </span>{" "}
            remaining across your active coaching programs.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link href="/trainers">
              <Button className="bg-white text-emerald-800 hover:bg-slate-100 font-bold shadow-md">
                <Plus className="mr-1.5 h-4 w-4" /> Book New Session
              </Button>
            </Link>
            <Link href="/dashboard/progress">
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 font-semibold">
                Log Today's Weight
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Upcoming Sessions"
          value={upcomingBookings.length}
          description="Confirmed with trainers"
          icon={Calendar}
          colorScheme="emerald"
        />
        <StatCard
          title="Session Credits"
          value={totalSessionsRemaining}
          description="Available in active packages"
          icon={Package}
          colorScheme="blue"
        />
        <StatCard
          title="Weight Trajectory"
          value={latestProgress ? `${latestProgress.weightKg} kg` : "No data"}
          description={
            totalWeightChange !== 0
              ? `${totalWeightChange > 0 ? "+" : ""}${totalWeightChange} kg total change`
              : "Baseline logged"
          }
          icon={TrendingUp}
          colorScheme="purple"
        />
        <StatCard
          title="Sessions Attended"
          value={attendances.length}
          description="100% verified by coaches"
          icon={ClipboardCheck}
          colorScheme="amber"
        />
      </div>

      {/* Two Column Grid: Next Appointment & Active Program */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Next Scheduled Appointment */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl border bg-card space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Next Scheduled Appointment
                </h3>
              </div>
              <Link
                href="/dashboard/bookings"
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                View all bookings →
              </Link>
            </div>

            {nextBooking ? (
              <div className="p-5 rounded-2xl border bg-slate-50/70 dark:bg-slate-900/40 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 border-2 border-emerald-500">
                      <AvatarImage src={nextBooking.trainer.image || ""} />
                      <AvatarFallback>
                        {nextBooking.trainer.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-base font-bold text-slate-900 dark:text-white">
                        {nextBooking.trainer.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {nextBooking.package?.title || "1-on-1 Consultation"}
                      </p>
                    </div>
                  </div>

                  <Badge variant="success" className="w-fit font-bold">
                    {nextBooking.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-t pt-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Date</span>
                    <span className="font-bold text-foreground">
                      {formatDate(nextBooking.date)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Time Slot</span>
                    <span className="font-bold text-emerald-600">
                      {formatTime(nextBooking.startTime)} - {formatTime(nextBooking.endTime)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Session Type</span>
                    <span className="font-bold text-foreground">
                      {nextBooking.sessionType.replace("_", " ")}
                    </span>
                  </div>
                </div>

                {nextBooking.clientNotes && (
                  <p className="text-xs text-slate-500 italic bg-background p-2 rounded-lg border">
                    Note: "{nextBooking.clientNotes}"
                  </p>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground space-y-3">
                <p>You have no upcoming booked sessions.</p>
                <Link href="/trainers">
                  <Button size="sm" className="font-bold">
                    Schedule with a Trainer
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Active Workout Routine */}
          <div className="p-6 rounded-2xl border bg-card space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                  <Dumbbell className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Active Workout Plan
                </h3>
              </div>
              <Link
                href="/dashboard/workouts"
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                View Routine →
              </Link>
            </div>

            {activePlan ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">
                      {activePlan.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Goal: {activePlan.targetGoal} • Assigned by Coach {activePlan.trainer?.name}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500">
                    Week 1 - 12
                  </Badge>
                </div>

                <div className="space-y-2 pt-2">
                  {activePlan.exercises?.slice(0, 3).map((ex: any) => (
                    <div
                      key={ex.id}
                      className="p-3 rounded-xl border bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span className="font-semibold">{ex.exerciseName}</span>
                      </div>
                      <span className="font-bold text-muted-foreground">
                        {ex.sets} sets × {ex.reps} reps {ex.weightKg ? `@ ${ex.weightKg}kg` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Your assigned coach hasn't uploaded a workout plan yet.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Active Packages & Quick Stats */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border bg-card space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <Package className="h-4 w-4 text-emerald-600" />
                <span>My Active Packages</span>
              </h3>
              <Link
                href="/dashboard/packages"
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                Details
              </Link>
            </div>

            {activePurchases.length > 0 ? (
              <div className="space-y-3">
                {activePurchases.map((pur) => (
                  <div
                    key={pur.id}
                    className="p-4 rounded-xl border bg-slate-50/60 dark:bg-slate-900/40 space-y-2.5"
                  >
                    <p className="text-xs font-bold truncate text-slate-900 dark:text-white">
                      {(pur.package as any)?.title || "Workout Package"}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Remaining Credits:</span>
                      <Badge variant="success" className="font-bold text-xs">
                        {pur.remainingSessions} / {pur.totalSessions} Sessions
                      </Badge>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{
                          width: `${(pur.remainingSessions / pur.totalSessions) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-muted-foreground space-y-2">
                <p>No active workout package.</p>
                <Link href="/packages">
                  <Button size="sm" variant="outline" className="w-full font-bold">
                    Browse Packages
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Quick Support / Concierge Card */}
          <div className="p-6 rounded-2xl border bg-emerald-950 text-white space-y-3">
            <h4 className="font-bold text-base flex items-center gap-2">
              <Flame className="h-5 w-5 text-lime-400" />
              FitPulse Concierge
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Need assistance rescheduling a session or finding a specialized coach?
              Our support team responds within minutes.
            </p>
            <Link href="/contact" className="block pt-1">
              <Button size="sm" className="w-full bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
