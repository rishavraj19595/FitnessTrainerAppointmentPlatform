import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { redirect } from "next/navigation";
import {
  Users,
  ShieldCheck,
  Calendar,
  DollarSign,
  TrendingUp,
  Receipt,
  UserCheck,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { formatPrice, formatDate } from "@/lib/utils";

export const revalidate = 0;

export default async function AdminDashboardOverview() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login?redirect=/admin/dashboard");
  }

  const stats = await dbService.getAdminStats();

  return (
    <div className="space-y-8">
      {/* Admin Top Banner */}
      <div className="rounded-3xl bg-slate-900 p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Badge variant="destructive" className="uppercase font-bold tracking-wider text-[10px]">
            Platform Super-Admin Console
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            FitPulse Platform Executive Hub
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Monitor real-time network volume, approve incoming coach verification applications, and review platform take-rate commission.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/admin/trainers">
            <Button className="bg-emerald-600 hover:bg-emerald-700 font-bold shadow-md">
              <ShieldCheck className="mr-1.5 h-4 w-4" /> Verify Trainers
            </Button>
          </Link>
          <Link href="/admin/users">
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold">
              Manage Users
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Gross Revenue"
          value={formatPrice(stats.totalRevenue)}
          description="Processed through Razorpay"
          icon={DollarSign}
          colorScheme="emerald"
        />
        <StatCard
          title="Platform Commission (15%)"
          value={formatPrice(stats.platformCommission)}
          description="Net platform revenue"
          icon={TrendingUp}
          colorScheme="purple"
        />
        <StatCard
          title="Registered Athletes"
          value={stats.totalUsers}
          description="Active client members"
          icon={Users}
          colorScheme="blue"
        />
        <StatCard
          title="Total Coaches"
          value={`${stats.verifiedTrainers} / ${stats.totalTrainers}`}
          description="Verified vs registered"
          icon={ShieldCheck}
          colorScheme="amber"
        />
      </div>

      {/* Two Column Grid: Recent Platform Bookings & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="p-6 sm:p-8 rounded-3xl border bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-600" />
              Recent Appointments
            </h3>
            <Link
              href="/admin/bookings"
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              All bookings →
            </Link>
          </div>

          <div className="space-y-3">
            {stats.recentBookings.map((b: any) => (
              <div
                key={b.id}
                className="p-3.5 rounded-2xl border bg-slate-50/60 dark:bg-slate-900/40 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {b.clientName} → Coach {b.trainerName}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {formatDate(b.date)} at {b.startTime} • {b.sessionType}
                  </p>
                </div>
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
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="p-6 sm:p-8 rounded-3xl border bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Receipt className="h-5 w-5 text-emerald-600" />
              Latest Razorpay Payments
            </h3>
            <Link
              href="/admin/payments"
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              All transactions →
            </Link>
          </div>

          <div className="space-y-3">
            {stats.recentPayments.map((p: any) => (
              <div
                key={p.id}
                className="p-3.5 rounded-2xl border bg-slate-50/60 dark:bg-slate-900/40 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {p.userName}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                    {p.razorpayPaymentId || p.razorpayOrderId}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-black text-emerald-600 text-sm block">
                    {formatPrice(p.amount)}
                  </span>
                  <Badge variant="success" className="text-[9px] py-0 px-1">
                    {p.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
