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
  CalendarCheck,
  Dumbbell,
  Utensils,
  TrendingUp,
  CreditCard,
  UserCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export const revalidate = 0;

export default async function TraineeDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login?redirect=/trainee/dashboard");
  }

  const traineeUser = await dbService.getTraineeByUserId(session.user.id);
  const bookings = await dbService.getBookings({ traineeId: session.user.id });
  const tasks = await dbService.getWorkoutTasks({ traineeId: session.user.id });
  const dietCharts = await dbService.getDietCharts({ traineeId: session.user.id });
  const attendance = await dbService.getAttendance({ traineeId: session.user.id });
  const payments = await dbService.getPayments({ userId: session.user.id });

  const presentCount = attendance.filter((a) => a.status === "PRESENT").length;
  const attendancePercent = attendance.length
    ? Math.round((presentCount / attendance.length) * 100)
    : 100;

  const totalSpent = payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + p.amount, 0);

  const upcomingBookings = bookings.filter((b) => b.status === "CONFIRMED");
  const activeDiet = dietCharts[0] || null;

  const hour = new Date().getHours();
  let salutation = "Good evening";
  if (hour >= 4 && hour < 12) {
    salutation = "Good morning";
  } else if (hour >= 12 && hour < 17) {
    salutation = "Good afternoon";
  } else {
    salutation = "Good evening";
  }
  const greeting = `${salutation}, ${session.user.name}`;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Trainee Dashboard • Indian Gym & Fitness
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight mt-0.5">
            {greeting}
          </h1>
          <p className="text-xs text-zinc-600 mt-1">
            Goal: <span className="font-semibold text-black">{traineeUser?.fitnessGoal || "Fat Loss & Muscle Building"}</span> • Diet: <span className="font-semibold text-black">{traineeUser?.dietaryPreference || "Vegetarian"}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/trainee/trainers">
            <Button size="sm" className="bg-black text-white hover:bg-zinc-800 text-xs font-bold h-9 gap-1.5 shadow-sm">
              <CalendarCheck className="h-4 w-4" /> Book Session
            </Button>
          </Link>
          <Link href="/trainee/workouts">
            <Button variant="outline" size="sm" className="text-xs font-bold h-9 gap-1.5">
              <Dumbbell className="h-4 w-4" /> Workouts
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Attendance Rate"
          value={`${attendancePercent}%`}
          subtitle={`${presentCount} of ${attendance.length} gym sessions attended`}
          icon={CheckCircle2}
        />
        <StatCard
          title="Upcoming Sessions"
          value={upcomingBookings.length}
          subtitle="Confirmed on schedule"
          icon={CalendarCheck}
        />
        <StatCard
          title="Pending Tasks"
          value={tasks.filter((t) => t.status === "PENDING").length}
          subtitle="Assigned by coach"
          icon={Dumbbell}
        />
        <StatCard
          title="Total Invested"
          value={formatINR(totalSpent)}
          subtitle="Razorpay settled"
          icon={CreditCard}
        />
      </div>

      {/* 2-Column Grid: Assigned Trainer & Upcoming Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assigned Trainer Card */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                Assigned Fitness Coach
              </h3>
              <Badge variant="success" className="text-[10px]">
                Active
              </Badge>
            </div>

            {traineeUser?.assignedTrainer ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={traineeUser.assignedTrainer.avatar}
                    alt={traineeUser.assignedTrainer.name}
                    className="h-14 w-14 rounded-full object-cover border border-zinc-200"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-black flex items-center gap-1">
                      {traineeUser.assignedTrainer.name}
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    </h4>
                    <p className="text-xs text-zinc-500 font-medium">
                      Rate: {formatINR(traineeUser.assignedTrainer.hourlyRate)} / hour
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {traineeUser.assignedTrainer.specializations?.map((spec, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-zinc-100 text-[10px] font-semibold text-zinc-700"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="pt-2">
                  <Link href="/trainee/trainers">
                    <Button variant="outline" size="sm" className="w-full text-xs font-semibold h-8">
                      Book Next Session
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-3">
                <UserCheck className="h-8 w-8 text-zinc-400 mx-auto" />
                <p className="text-xs text-zinc-500">
                  You haven't selected a personal trainer yet.
                </p>
                <Link href="/trainee/trainers">
                  <Button size="sm" className="bg-black text-white hover:bg-zinc-800 text-xs h-8">
                    Discover Coaches
                  </Button>
                </Link>
              </div>
            )}
          </Card>

          {/* Active Nutrition Overview */}
          <Card className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <Utensils className="h-3.5 w-3.5 text-black" />
                Active Indian Diet
              </h3>
              <Link href="/trainee/diet" className="text-[11px] font-bold text-black hover:underline">
                View All →
              </Link>
            </div>

            {activeDiet ? (
              <div className="space-y-2 text-xs">
                <p className="font-bold text-zinc-900">{activeDiet.title}</p>
                <div className="grid grid-cols-2 gap-2 text-center p-2.5 bg-zinc-50 rounded-lg border border-zinc-200">
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-semibold">Calories</p>
                    <p className="font-black text-sm text-black">{activeDiet.dailyCalories} kcal</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-semibold">Target Protein</p>
                    <p className="font-black text-sm text-black">{activeDiet.targetProtein} g</p>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-500 line-clamp-2">
                  {activeDiet.instructions}
                </p>
              </div>
            ) : (
              <p className="text-xs text-zinc-500 py-3 text-center">
                Your coach has not assigned a diet chart yet.
              </p>
            )}
          </Card>
        </div>

        {/* Upcoming Sessions & Workout Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Sessions Card */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <CalendarCheck className="h-4 w-4 text-black" />
                Upcoming Training Sessions
              </h3>
              <Link href="/trainee/bookings" className="text-xs font-bold text-black hover:underline">
                All Bookings →
              </Link>
            </div>

            {upcomingBookings.length === 0 ? (
              <div className="text-center py-8 text-xs text-zinc-500 space-y-3">
                <Clock className="h-8 w-8 text-zinc-400 mx-auto" />
                <p>No upcoming workout sessions scheduled.</p>
                <Link href="/trainee/trainers">
                  <Button size="sm" className="bg-black text-white hover:bg-zinc-800 text-xs font-semibold h-8">
                    Book Training Slot
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.slice(0, 3).map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-black">{b.planTitle}</span>
                        <Badge variant="success" className="text-[9px]">
                          Confirmed
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-600 font-medium">
                        Coach: <span className="font-bold text-black">{b.trainerName}</span>
                      </p>
                      <p className="text-[11px] text-zinc-500 flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        {formatDateIST(b.date)} at {b.startTime} IST
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-sm text-black">
                        {formatINR(b.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Assigned Workout Tasks Preview */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <Dumbbell className="h-4 w-4 text-black" />
                Assigned Workout Routines
              </h3>
              <Link href="/trainee/workouts" className="text-xs font-bold text-black hover:underline">
                View Tracker →
              </Link>
            </div>

            {tasks.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-6">
                No active workout tasks assigned.
              </p>
            ) : (
              <div className="space-y-3">
                {tasks.slice(0, 2).map((t) => (
                  <div
                    key={t.id}
                    className="p-3.5 rounded-xl border border-zinc-200 bg-white space-y-2 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-black">{t.title}</span>
                      <Badge
                        variant={t.status === "COMPLETED" ? "success" : "secondary"}
                        className="text-[10px]"
                      >
                        {t.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-zinc-600">
                      {t.exercises?.slice(0, 4).map((ex, idx) => (
                        <div key={idx} className="p-2 bg-zinc-50 rounded border border-zinc-200">
                          <p className="font-bold text-black truncate">{ex.name}</p>
                          <p className="text-[10px] text-zinc-500">{ex.sets} sets • {ex.reps} reps</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
