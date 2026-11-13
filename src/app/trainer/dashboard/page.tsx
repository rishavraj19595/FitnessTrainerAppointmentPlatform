import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { redirect } from "next/navigation";
import {
  Calendar,
  Users,
  Package,
  DollarSign,
  ClipboardCheck,
  Clock,
  Plus,
  ArrowRight,
  ShieldCheck,
  Dumbbell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatCard } from "@/components/ui/stat-card";
import { formatDate, formatTime, formatPrice } from "@/lib/utils";

export const revalidate = 0;

export default async function TrainerDashboardOverview() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "TRAINER" && session.user.role !== "ADMIN")) {
    redirect("/login?redirect=/trainer/dashboard");
  }

  const trainerId = session.user.id;
  const trainerProfile = await dbService.getTrainerById(trainerId);
  const bookings = await dbService.getBookingsByTrainer(trainerId);
  const earnings = await dbService.getTrainerEarnings(trainerId);
  const attendances = await dbService.getAttendanceByTrainer(trainerId);

  // Group unique clients
  const uniqueClientsMap = new Map();
  bookings.forEach((b) => {
    if (b.client?.id) uniqueClientsMap.set(b.client.id, b.client);
  });
  const totalClientsCount = uniqueClientsMap.size;

  const todayStr = new Date().toISOString().split("T")[0];
  const todayBookings = bookings.filter((b) => {
    const bDate = new Date(b.date).toISOString().split("T")[0];
    return bDate === todayStr && b.status === "CONFIRMED";
  });

  const activePackages = trainerProfile?.packages?.filter((p: any) => p.isActive) || [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-charcoal-900 to-slate-800 p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Badge variant="success" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
              Coach Workspace
            </Badge>
            {trainerProfile?.isVerified && (
              <Badge variant="outline" className="border-white/30 text-white gap-1 text-[10px]">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                Verified
              </Badge>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Welcome back, Coach {session.user.name}
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            You have{" "}
            <span className="font-bold text-white">
              {todayBookings.length} session{todayBookings.length === 1 ? "" : "s"} scheduled today
            </span>
            . Ensure you mark attendance after each session to credit client logs.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/trainer/packages">
            <Button className="bg-emerald-600 hover:bg-emerald-700 font-bold shadow-md">
              <Plus className="mr-1.5 h-4 w-4" /> Create Package
            </Button>
          </Link>
          <Link href="/trainer/attendance">
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold">
              Mark Attendance
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Sessions"
          value={todayBookings.length}
          description="Confirmed appointments"
          icon={Calendar}
          colorScheme="emerald"
        />
        <StatCard
          title="Active Clients"
          value={totalClientsCount}
          description="Athletes trained"
          icon={Users}
          colorScheme="blue"
        />
        <StatCard
          title="Net Earnings"
          value={formatPrice(earnings.netEarnings)}
          description={`After 15% platform cut`}
          icon={DollarSign}
          colorScheme="purple"
        />
        <StatCard
          title="Active Packages"
          value={activePackages.length}
          description="Public offerings"
          icon={Package}
          colorScheme="amber"
        />
      </div>

      {/* Main Grid: Today's Appointments & Recent Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Appointments */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Today's Scheduled Appointments
                </h3>
              </div>
              <Link
                href="/trainer/bookings"
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                All bookings →
              </Link>
            </div>

            {todayBookings.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No sessions booked for today. Check upcoming appointments in the bookings tab.
              </div>
            ) : (
              <div className="space-y-3">
                {todayBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-xl border bg-slate-50/60 dark:bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 ring-1 ring-emerald-500">
                        <AvatarImage src={b.client.image || ""} />
                        <AvatarFallback>{b.client.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {b.client.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {b.package?.title || "Consultation"} • {formatTime(b.startTime)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href="/trainer/attendance">
                        <Button size="sm" variant="outline" className="text-xs font-bold">
                          Mark Attendance
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Client Overview */}
          <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-600" />
                Assigned Clients
              </h3>
              <Link
                href="/trainer/clients"
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                View all clients →
              </Link>
            </div>

            {Array.from(uniqueClientsMap.values()).length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No clients have booked sessions yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Array.from(uniqueClientsMap.values()).map((client: any) => (
                  <div
                    key={client.id}
                    className="p-3.5 rounded-xl border bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={client.image || ""} />
                        <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {client.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {client.email}
                        </p>
                      </div>
                    </div>
                    <Link href={`/trainer/clients/${client.id}`}>
                      <Button size="sm" variant="ghost" className="text-xs font-semibold">
                        Progress <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Earnings Summary & Profile Overview */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              Earnings Breakdown
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900">
                <span className="text-muted-foreground">Gross Sales:</span>
                <span className="font-bold text-foreground">
                  {formatPrice(earnings.grossRevenue)}
                </span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900">
                <span className="text-muted-foreground">Platform Fee (15%):</span>
                <span className="font-bold text-rose-600">
                  -{formatPrice(earnings.platformCut)}
                </span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-500/20">
                <span className="font-bold text-emerald-800 dark:text-emerald-300">
                  Net Payout:
                </span>
                <span className="font-black text-emerald-600 text-sm">
                  {formatPrice(earnings.netEarnings)}
                </span>
              </div>
            </div>

            <Link href="/trainer/earnings" className="block pt-1">
              <Button size="sm" variant="outline" className="w-full font-bold">
                View Full Financial Report
              </Button>
            </Link>
          </div>

          {/* Profile Quick Link */}
          <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Public Profile Status
            </h4>
            <p className="text-xs text-muted-foreground">
              Current consultation rate:{" "}
              <strong className="text-foreground">
                {formatPrice(trainerProfile?.consultationPrice || 3000)}/hr
              </strong>
            </p>
            <Link href="/trainer/profile" className="block">
              <Button size="sm" variant="outline" className="w-full">
                Edit Headline & Bio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
