import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { dbService } from "@/lib/db";
import { StatCard, Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatINR, formatDateIST } from "@/lib/utils";
import { RevenueBarChart } from "@/components/charts/ProgressCharts";
import {
  Users,
  ShieldCheck,
  CalendarCheck,
  CreditCard,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    redirect("/login?redirect=/admin/dashboard");
  }

  const stats = await dbService.getAdminStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Super Administrator Control Panel
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight mt-0.5">
            Platform Master Analytics
          </h1>
          <p className="text-xs text-zinc-600 mt-1">
            Complete platform oversight across Indian gym trainees, coaches, Razorpay payments, and verifications.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link href="/admin/trainers">
            <Button size="sm" className="bg-black text-white hover:bg-zinc-800 text-xs font-bold h-9 gap-1.5 shadow-sm">
              <ShieldAlert className="h-4 w-4" /> Verify Coaches ({stats.pendingTrainers})
            </Button>
          </Link>
          <Link href="/admin/trainees">
            <Button variant="outline" size="sm" className="text-xs font-bold h-9 gap-1.5">
              <Users className="h-4 w-4" /> Manage Trainees
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Gross Payments Volume"
          value={formatINR(stats.totalRevenue)}
          subtitle="Razorpay settled volume"
          icon={TrendingUp}
        />
        <StatCard
          title="Platform 15% Take-Rate"
          value={formatINR(stats.platformCommission)}
          subtitle="Retained SaaS revenue"
          icon={DollarSign}
        />
        <StatCard
          title="Verified Coaches"
          value={`${stats.verifiedTrainers} / ${stats.totalTrainers}`}
          subtitle={`${stats.pendingTrainers} pending review`}
          icon={ShieldCheck}
        />
        <StatCard
          title="Total Trainees"
          value={stats.totalTrainees}
          subtitle="Active gym members"
          icon={Users}
        />
      </div>

      {/* Revenue Trend Chart */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-black uppercase tracking-wider">
            Platform Revenue Velocity (₹ INR)
          </h2>
          <span className="text-xs text-zinc-500">Gross Monthly GMV</span>
        </div>
        <RevenueBarChart />
      </Card>

      {/* 2-Column: Recent Bookings & Registered Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card className="space-y-4 p-6">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <CalendarCheck className="h-4 w-4 text-black" />
              Recent Appointments
            </h2>
            <Link href="/admin/bookings" className="text-xs font-bold text-black hover:underline">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {stats.recentBookings.map((b) => (
              <div
                key={b.id}
                className="p-3 rounded-lg border border-zinc-200 bg-zinc-50 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-black">{b.traineeName}</p>
                  <p className="text-zinc-500 text-[11px]">
                    Coach: <strong className="text-black">{b.trainerName}</strong> • {b.startTime} IST
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-black text-black">{formatINR(b.amount)}</p>
                  <Badge variant="default" className="text-[9px]">
                    {b.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent User Registrations */}
        <Card className="space-y-4 p-6">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="h-4 w-4 text-black" />
              Latest Registered Users
            </h2>
            <Link href="/admin/trainees" className="text-xs font-bold text-black hover:underline">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {stats.recentUsers.map((u) => (
              <div
                key={u.id}
                className="p-3 rounded-lg border border-zinc-200 bg-white flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="h-8 w-8 rounded-full object-cover border border-zinc-200"
                  />
                  <div>
                    <p className="font-bold text-black">{u.name}</p>
                    <p className="text-zinc-500 text-[11px]">{u.email}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="capitalize text-[10px]">
                  {u.role}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
