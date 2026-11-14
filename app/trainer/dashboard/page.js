import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { dbService } from "@/lib/db";
import { StatCard, Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatINR, formatDateIST } from "@/lib/utils";
import {
  Users,
  CalendarCheck,
  CheckSquare,
  DollarSign,
  Dumbbell,
  Utensils,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export const revalidate = 0;

export default async function TrainerDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "trainer" && session.user.role !== "admin")) {
    redirect("/login?redirect=/trainer/dashboard");
  }

  const trainerProfile = await dbService.getTrainerByUserId(session.user.id);
  const trainees = await dbService.getTrainees(session.user.id);
  const bookings = await dbService.getBookings({ trainerId: session.user.id });
  const attendance = await dbService.getAttendance({ trainerId: session.user.id });
  const earnings = await dbService.getTrainerEarnings(session.user.id);

  const upcomingBookings = bookings.filter((b) => b.status === "CONFIRMED");
  const completedSessions = attendance.filter((a) => a.status === "PRESENT").length;

  const hour = new Date().getHours();
  let salutation = "Good evening";
  if (hour >= 4 && hour < 12) {
    salutation = "Good morning";
  } else if (hour >= 12 && hour < 17) {
    salutation = "Good afternoon";
  } else {
    salutation = "Good evening";
  }
  const greeting = `${salutation}, Coach ${session.user.name}`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Trainer Command Center • Indian Gym Coaching
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight mt-0.5">
            {greeting}
          </h1>
          <p className="text-xs text-zinc-600 mt-1">
            Status: <span className="font-bold text-emerald-600">Verified & Active</span> • Consultation Rate: <span className="font-bold text-black">{formatINR(trainerProfile?.hourlyRate || 2500)} / hr</span>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link href="/trainer/attendance">
            <Button size="sm" className="bg-black text-white hover:bg-zinc-800 text-xs font-bold h-9 gap-1.5 shadow-sm">
              <CheckSquare className="h-4 w-4" /> Attendance
            </Button>
          </Link>
          <Link href="/trainer/workouts">
            <Button variant="outline" size="sm" className="text-xs font-bold h-9 gap-1.5">
              <Dumbbell className="h-4 w-4" /> New Routine
            </Button>
          </Link>
          <Link href="/trainer/diet">
            <Button variant="outline" size="sm" className="text-xs font-bold h-9 gap-1.5">
              <Utensils className="h-4 w-4" /> Diet Plan
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Trainees"
          value={trainees.length}
          subtitle="Active gym members"
          icon={Users}
        />
        <StatCard
          title="Upcoming Sessions"
          value={upcomingBookings.length}
          subtitle="Confirmed on IST schedule"
          icon={CalendarCheck}
        />
        <StatCard
          title="Completed Sessions"
          value={completedSessions}
          subtitle="Attendance verified"
          icon={CheckSquare}
        />
        <StatCard
          title="Net Earnings (85%)"
          value={formatINR(earnings.netEarnings)}
          subtitle="Direct trainer payout"
          icon={DollarSign}
        />
      </div>

      {/* 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Upcoming Appointments */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <CalendarCheck className="h-4 w-4 text-black" />
                Upcoming Training Appointments
              </h2>
              <Link href="/trainer/attendance" className="text-xs font-bold text-black hover:underline">
                Mark Today's Attendance →
              </Link>
            </div>

            {upcomingBookings.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-8">
                No upcoming sessions on your schedule for today.
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-black">{b.traineeName}</span>
                        <Badge variant="default" className="text-[9px]">
                          {b.sessionType}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-600 font-medium">
                        Service: {b.planTitle}
                      </p>
                      <p className="text-[11px] text-zinc-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDateIST(b.date)} at {b.startTime} IST
                      </p>
                    </div>

                    <div className="text-right space-y-1.5">
                      <p className="font-black text-sm text-black">{formatINR(b.amount)}</p>
                      <Link href="/trainer/attendance">
                        <Button size="sm" variant="outline" className="text-[10px] h-7 font-bold">
                          Mark Attendance
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Assigned Trainees Roster */}
        <div className="space-y-6">
          <Card className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="h-4 w-4 text-black" />
                My Trainee Roster
              </h2>
              <Link href="/trainer/trainees" className="text-xs font-bold text-black hover:underline">
                All →
              </Link>
            </div>

            {trainees.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-6">
                No trainees assigned to you yet. Admin will assign new trainees.
              </p>
            ) : (
              <div className="space-y-3">
                {trainees.map((tr) => (
                  <div
                    key={tr.id}
                    className="p-3 rounded-lg border border-zinc-200 bg-white flex items-center space-x-3 shadow-xs"
                  >
                    <img
                      src={tr.avatar}
                      alt={tr.name}
                      className="h-9 w-9 rounded-full object-cover border border-zinc-200"
                    />
                    <div className="overflow-hidden flex-1">
                      <p className="font-bold text-xs text-black truncate">{tr.name}</p>
                      <p className="text-[11px] text-zinc-500 truncate">{tr.fitnessGoal}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {tr.attendanceRate}% Att.
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Schedule Notice */}
          <Card className="p-4 bg-zinc-950 text-white space-y-2">
            <h3 className="font-bold text-xs text-zinc-300 uppercase tracking-wider">
              Weekly Slot Manager
            </h3>
            <p className="text-xs text-zinc-400">
              Ensure your availability slots are updated to prevent trainee booking conflicts.
            </p>
            <Link href="/trainer/schedule" className="block pt-1">
              <Button size="sm" className="w-full bg-white text-black hover:bg-zinc-200 text-xs font-bold h-8">
                Manage Schedule
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
