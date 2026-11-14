import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { dbService } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { RevenueBarChart } from "@/components/charts/ProgressCharts";
import { formatINR } from "@/lib/utils";
import { BarChart2, TrendingUp, Users, CalendarCheck } from "lucide-react";

export const revalidate = 0;

export default async function AdminAnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    redirect("/login?redirect=/admin/analytics");
  }

  const stats = await dbService.getAdminStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
          Platform Analytics & Reports
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Deep-dive business intelligence into revenue, attendance completion, and trainer workload.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-black" />
            Monthly Revenue Trajectory (₹ INR)
          </h2>
          <span className="text-xs text-zinc-500">FY 2026 Platform Growth</span>
        </div>
        <RevenueBarChart />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 space-y-2">
          <p className="text-xs font-bold text-zinc-500 uppercase">Total Bookings Executed</p>
          <p className="text-2xl font-black text-black">{stats.totalBookings}</p>
          <p className="text-[11px] text-zinc-500">Across all Indian certified coaches</p>
        </Card>

        <Card className="p-5 space-y-2">
          <p className="text-xs font-bold text-zinc-500 uppercase">Completed Gym Sessions</p>
          <p className="text-2xl font-black text-emerald-600">{stats.completedSessions}</p>
          <p className="text-[11px] text-zinc-500">Verified by coach attendance</p>
        </Card>

        <Card className="p-5 space-y-2">
          <p className="text-xs font-bold text-zinc-500 uppercase">Platform Take-Rate</p>
          <p className="text-2xl font-black text-black">15.0%</p>
          <p className="text-[11px] text-zinc-500">Net retained commission split</p>
        </Card>
      </div>
    </div>
  );
}
