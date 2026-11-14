import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { dbService } from "@/lib/db";
import { StatCard, Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatINR, formatDateIST } from "@/lib/utils";
import { CreditCard, DollarSign, TrendingUp, Receipt, CheckCircle2 } from "lucide-react";

export const revalidate = 0;

export default async function AdminPaymentsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    redirect("/login?redirect=/admin/payments");
  }

  const payments = await dbService.getPayments();
  const successfulPayments = payments.filter((p) => p.status === "SUCCESS");
  const totalVolume = successfulPayments.reduce((sum, p) => sum + p.amount, 0);
  const platformRevenue = Math.round(totalVolume * 0.15);
  const trainerPayouts = totalVolume - platformRevenue;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
          Platform Transactions & Razorpay Ledger
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Complete accounting ledger of trainee payments, 15% platform commissions, and 85% trainer payouts.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Gross Payments Volume"
          value={formatINR(totalVolume)}
          subtitle="All settled customer transactions"
          icon={TrendingUp}
        />
        <StatCard
          title="Platform Take-Rate (15%)"
          value={formatINR(platformRevenue)}
          subtitle="Net retained platform revenue"
          icon={DollarSign}
        />
        <StatCard
          title="Trainer Payouts (85%)"
          value={formatINR(trainerPayouts)}
          subtitle="Disbursed to coach accounts"
          icon={Receipt}
        />
      </div>

      {/* Table */}
      <Card className="p-6 space-y-4">
        <h2 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-2">
          <Receipt className="h-4 w-4 text-black" />
          Master Transaction Ledger ({payments.length})
        </h2>

        {payments.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-8">No payments recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-zinc-50 text-zinc-500 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">Date (IST)</th>
                  <th className="py-3 px-4">Trainee</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Coach</th>
                  <th className="py-3 px-4">Razorpay Reference</th>
                  <th className="py-3 px-4">Gross Amount</th>
                  <th className="py-3 px-4">Platform 15%</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y text-zinc-700">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50/50">
                    <td className="py-3.5 px-4 font-semibold text-zinc-900">
                      {formatDateIST(p.createdAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-black">{p.userName}</p>
                      <p className="text-[10px] text-zinc-400">{p.userEmail}</p>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-zinc-800">
                      {p.itemTitle}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-600">
                      {p.trainerName}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-500">
                      {p.razorpayPaymentId || p.razorpayOrderId}
                    </td>
                    <td className="py-3.5 px-4 font-black text-black">
                      {formatINR(p.amount)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700">
                      +{formatINR(Math.round(p.amount * 0.15))}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="success" className="gap-1 text-[10px]">
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
