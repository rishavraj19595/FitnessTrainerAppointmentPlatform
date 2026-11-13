import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { redirect } from "next/navigation";
import { CreditCard, CheckCircle2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatPrice } from "@/lib/utils";

export const revalidate = 0;

export default async function AdminPaymentsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login?redirect=/admin/payments");
  }

  const stats = await dbService.getAdminStats();
  const payments = stats.recentPayments;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Payment Transactions & Ledger
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Complete ledger of Razorpay purchases, gateway order IDs, and platform take-rate splits.
        </p>
      </div>

      <div className="p-8 rounded-3xl border bg-card shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50/60 dark:bg-slate-900/40 text-xs font-bold uppercase text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Purchased By</th>
                <th className="py-3 px-4">Razorpay Reference</th>
                <th className="py-3 px-4">Gross Amount</th>
                <th className="py-3 px-4">Platform Fee (15%)</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y text-xs">
              {payments.map((p: any) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                  <td className="py-3.5 px-4 font-semibold">{formatDate(p.createdAt)}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {p.userName}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-muted-foreground">
                    {p.razorpayPaymentId || p.razorpayOrderId}
                  </td>
                  <td className="py-3.5 px-4 font-black text-slate-900 dark:text-white">
                    {formatPrice(p.amount)}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600">
                    +{formatPrice(Math.round(p.amount * 0.15))}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant="success" className="text-[10px] gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Captured
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
