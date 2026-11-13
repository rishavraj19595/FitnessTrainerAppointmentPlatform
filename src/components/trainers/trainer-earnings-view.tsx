"use client";

import * as React from "react";
import {
  DollarSign,
  TrendingUp,
  Package,
  Calendar,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { formatPrice, formatDate } from "@/lib/utils";

interface TrainerEarningsViewProps {
  earnings: {
    grossRevenue: number;
    netEarnings: number;
    platformCut: number;
    completedSessionsCount: number;
    packagesSold: number;
    recentTransactions: any[];
  };
}

export function TrainerEarningsView({ earnings }: TrainerEarningsViewProps) {
  // Monthly distribution mock for visual chart
  const revenueChartData = [
    { month: "Nov", revenue: Math.round(earnings.netEarnings * 0.2) },
    { month: "Dec", revenue: Math.round(earnings.netEarnings * 0.25) },
    { month: "Jan", revenue: Math.round(earnings.netEarnings * 0.28) },
    { month: "Feb (Current)", revenue: Math.round(earnings.netEarnings * 0.35) },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Trainer Earnings & Revenue
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Track sales across workout packages, consultations, platform commissions, and payouts.
        </p>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Net Earnings"
          value={formatPrice(earnings.netEarnings)}
          description="Deposited to your account"
          icon={DollarSign}
          colorScheme="emerald"
        />
        <StatCard
          title="Gross Bookings Volume"
          value={formatPrice(earnings.grossRevenue)}
          description="Before platform split"
          icon={TrendingUp}
          colorScheme="blue"
        />
        <StatCard
          title="Platform Commission (15%)"
          value={formatPrice(earnings.platformCut)}
          description="Maintenance & payment fees"
          icon={ShieldCheck}
          colorScheme="amber"
        />
        <StatCard
          title="Packages Sold"
          value={earnings.packagesSold}
          description="Multi-week programs"
          icon={Package}
          colorScheme="purple"
        />
      </div>

      {/* Revenue Breakdown Chart */}
      <div className="p-8 rounded-3xl border bg-card shadow-sm space-y-4">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
          Monthly Revenue Trend
        </h3>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(val: any) => formatPrice(val)}
                contentStyle={{
                  backgroundColor: "#1e293b",
                  borderRadius: "12px",
                  border: "none",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="revenue" fill="#059669" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="p-8 rounded-3xl border bg-card shadow-sm space-y-4">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">
          Recent Payment Transactions
        </h3>

        {earnings.recentTransactions.length === 0 ? (
          <p className="text-sm text-center py-6 text-muted-foreground">
            No transactions found yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-slate-50/60 dark:bg-slate-900/40 text-xs font-bold uppercase text-muted-foreground">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Razorpay Ref ID</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Net Trainer Share (85%)</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs">
                {earnings.recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                    <td className="py-3.5 px-4 font-semibold">{formatDate(tx.createdAt)}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-muted-foreground">
                      {tx.razorpayPaymentId || tx.razorpayOrderId}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {formatPrice(tx.amount)}
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-600 text-sm">
                      {formatPrice(Math.round(tx.amount * 0.85))}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="success" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Settled
                      </Badge>
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
