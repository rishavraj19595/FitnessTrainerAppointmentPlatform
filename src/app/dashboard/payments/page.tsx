import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { redirect } from "next/navigation";
import { CreditCard, CheckCircle2, ShieldCheck, Download, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatPrice } from "@/lib/utils";

export const revalidate = 0;

export default async function ClientPaymentsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login?redirect=/dashboard/payments");
  }

  const payments = await dbService.getPaymentsByUser(session.user.id);
  const totalSpent = payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Billing & Payment History
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Official Razorpay transaction receipts and invoices for your workout packages.
          </p>
        </div>
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-xs">
          <span className="text-muted-foreground">Total Invested in Fitness: </span>
          <span className="font-extrabold text-emerald-600 text-sm ml-1">
            {formatPrice(totalSpent)}
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl border bg-card shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Receipt className="h-5 w-5 text-emerald-600" />
          Transactions Ledger
        </h3>

        {payments.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">
            No payment history found. Once you purchase packages or book consultations, receipts will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-slate-50/60 dark:bg-slate-900/40 text-xs font-bold uppercase text-muted-foreground">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Item Description</th>
                  <th className="py-3 px-4">Razorpay Reference</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs">
                {payments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                    <td className="py-3.5 px-4 font-semibold">
                      {formatDate(pay.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {pay.itemTitle}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-muted-foreground">
                      {pay.razorpayPaymentId || pay.razorpayOrderId || "—"}
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-600 text-sm">
                      {formatPrice(pay.amount, pay.currency)}
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
      </div>
    </div>
  );
}
