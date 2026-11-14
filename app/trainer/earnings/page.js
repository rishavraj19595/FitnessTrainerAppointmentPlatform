import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { dbService } from "@/lib/db";
import { StatCard, Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatINR, formatDateIST } from "@/lib/utils";
import { RevenueBarChart } from "@/components/charts/ProgressCharts";
import { DollarSign, TrendingUp, ShieldCheck, CheckCircle2 } from "lucide-react";

export const revalidate = 0;

export default async function TrainerEarningsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "trainer" && session.user.role !== "admin")) {
    redirect("/login?redirect=/trainer/earnings");
  }

  const earnings = await dbService.getTrainerEarnings(session.user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
          Earnings & Payout Ledger
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Review your 85% trainer share, completed consultation volume, and Razorpay settlements.
        </p>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Net Earnings (85%)"
          value={formatINR(earnings.netEarnings)}
          subtitle="Direct payout to your bank"
          icon={DollarSign}
        />
        <StatCard
          title="Gross Bookings Volume"
          value={formatINR(earnings.grossRevenue)}
          subtitle="Total trainee billing"
          icon={TrendingUp}
        />
        <StatCard
          title="Platform Take-Rate (15%)"
          value={formatINR(earnings.platformCut)}
          subtitle="Software & Razorpay processing fee"
          icon={ShieldCheck}
        />
      </div>

      {/* Revenue Trend Chart */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-black uppercase tracking-wider">
            Monthly Earnings Trend (₹ INR)
          </h2>
          <span className="text-xs text-zinc-500">Last 4 Months Performance</span>
        </div>
        <RevenueBarChart />
      </Card>

      {/* Recent Payout Transactions Table */}
      <Card className="p-6 space-y-4">
        <h2 className="text-sm font-bold text-black uppercase tracking-wider">
          Individual Transaction Settlements ({earnings.recentTransactions.length})
        </h2>

        {earnings.recentTransactions.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-8">
            No transactions recorded yet. Once trainees book sessions, settlements will appear here.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-zinc-50 text-zinc-500 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">Date (IST)</th>
                  <th className="py-3 px-4">Trainee</th>
                  <th className="py-3 px-4">Razorpay Ref ID</th>
                  <th className="py-3 px-4">Gross Amount</th>
                  <th className="py-3 px-4">Your 85% Share</th>
                  <th className="py-3 px-4">Payout Status</th>
                </tr>
              </thead>
              <tbody className="divide-y text-zinc-700">
                {earnings.recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-zinc-50/50">
                    <td className="py-3.5 px-4 font-semibold text-zinc-900">
                      {formatDateIST(tx.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-black">
                      {tx.traineeName}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-500">
                      {tx.razorpayPaymentId || tx.razorpayOrderId}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-black">
                      {formatINR(tx.amount)}
                    </td>
                    <td className="py-3.5 px-4 font-black text-black text-sm">
                      {formatINR(tx.netShare)}
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
      </Card>
    </div>
  );
}
