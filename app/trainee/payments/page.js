import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { dbService } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatINR, formatDateIST } from "@/lib/utils";
import { CreditCard, CheckCircle2, ShieldCheck, Receipt } from "lucide-react";

export const revalidate = 0;

export default async function TraineePaymentsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login?redirect=/trainee/payments");
  }

  const payments = await dbService.getPayments({ userId: session.user.id });
  const totalSpent = payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Billing & Razorpay Payments
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Official Indian GST-compliant receipts and Razorpay payment history.
          </p>
        </div>
        <div className="p-3 bg-white border border-zinc-200 rounded-xl text-xs">
          <span className="text-zinc-500">Total Invested in Fitness: </span>
          <span className="font-black text-black text-sm ml-1">
            {formatINR(totalSpent)}
          </span>
        </div>
      </div>

      <Card className="space-y-4 p-6">
        <h2 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-2">
          <Receipt className="h-4 w-4 text-black" />
          Transactions Ledger ({payments.length})
        </h2>

        {payments.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-10">
            No payments recorded yet. Receipts will appear here once you book coaching sessions.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-zinc-50 text-zinc-500 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">Date (IST)</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Coach</th>
                  <th className="py-3 px-4">Razorpay Reference</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y text-zinc-700">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50/50">
                    <td className="py-3.5 px-4 font-semibold text-zinc-900">
                      {formatDateIST(p.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-black">
                      {p.itemTitle}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-600">
                      {p.trainerName}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-500">
                      {p.razorpayPaymentId || p.razorpayOrderId}
                    </td>
                    <td className="py-3.5 px-4 font-black text-black text-sm">
                      {formatINR(p.amount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="success" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Paid
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
