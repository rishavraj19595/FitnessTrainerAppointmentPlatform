"use client";

import * as React from "react";
import Link from "next/link";
import { Package, Calendar, Clock, CheckCircle2, AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookingModal } from "@/components/booking/booking-modal";
import { formatDate, formatPrice } from "@/lib/utils";

interface ClientPackagesViewProps {
  purchases: any[];
}

export function ClientPackagesView({ purchases }: ClientPackagesViewProps) {
  const [activeBookingPackage, setActiveBookingPackage] = React.useState<any | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            My Workout Packages
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track remaining session balances, expiry dates, and schedule workouts.
          </p>
        </div>
        <Link href="/packages">
          <Button className="font-bold shadow-md shadow-emerald-600/20">
            <Plus className="mr-1.5 h-4 w-4" /> Browse New Packages
          </Button>
        </Link>
      </div>

      {purchases.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border bg-card p-8 space-y-4">
          <Package className="h-12 w-12 text-muted-foreground mx-auto opacity-40" />
          <h3 className="text-lg font-bold">No active packages</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            You haven't purchased any multi-session workout packages yet.
          </p>
          <Link href="/packages" className="inline-block">
            <Button>Explore Packages</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {purchases.map((pur) => {
            const completedCount = pur.totalSessions - pur.remainingSessions;
            const completionPercent = Math.round(
              (completedCount / pur.totalSessions) * 100
            );

            return (
              <div
                key={pur.id}
                className="p-6 rounded-2xl border bg-card shadow-sm space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Badge
                        variant={pur.status === "ACTIVE" ? "success" : "secondary"}
                        className="text-[10px] uppercase font-bold mb-2"
                      >
                        {pur.status}
                      </Badge>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {pur.package.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Coach {pur.package.trainer?.name}
                      </p>
                    </div>

                    <Avatar className="h-10 w-10 ring-1 ring-emerald-500 shrink-0">
                      <AvatarImage src={pur.package.trainer?.image || ""} />
                      <AvatarFallback>
                        {pur.package.trainer?.name?.charAt(0) || "T"}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Session counter box */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-muted-foreground">
                        Sessions Completed:
                      </span>
                      <span className="font-extrabold text-foreground">
                        {completedCount} of {pur.totalSessions} Sessions ({completionPercent}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${completionPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                      <span>Remaining Balance:</span>
                      <strong className="text-emerald-600 font-black text-xs">
                        {pur.remainingSessions} Sessions Left
                      </strong>
                    </div>
                  </div>

                  <div className="text-xs space-y-1.5 text-muted-foreground border-t pt-3">
                    <div className="flex justify-between">
                      <span>Purchase Price:</span>
                      <span className="font-semibold text-foreground">
                        {formatPrice(pur.purchasePrice)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Purchased On:</span>
                      <span className="font-semibold text-foreground">
                        {formatDate(pur.createdAt)}
                      </span>
                    </div>
                    {pur.expiresAt && (
                      <div className="flex justify-between">
                        <span>Expires On:</span>
                        <span className="font-semibold text-foreground">
                          {formatDate(pur.expiresAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {pur.status === "ACTIVE" && pur.remainingSessions > 0 ? (
                  <Button
                    onClick={() => setActiveBookingPackage(pur)}
                    className="w-full font-bold shadow-md shadow-emerald-600/20"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Next Session
                  </Button>
                ) : (
                  <Button disabled variant="outline" className="w-full">
                    Package Completed
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Modal with pre-selected package */}
      {activeBookingPackage && (
        <BookingModal
          isOpen={Boolean(activeBookingPackage)}
          onClose={() => setActiveBookingPackage(null)}
          trainer={{
            id: activeBookingPackage.package.trainerProfileId || "profile",
            userId: activeBookingPackage.package.trainer?.id || "user-trainer-1",
            name: activeBookingPackage.package.trainer?.name || "Trainer",
            consultationPrice: 0,
          }}
          packagePurchase={{
            id: activeBookingPackage.id,
            title: activeBookingPackage.package.title,
            remainingSessions: activeBookingPackage.remainingSessions,
          }}
        />
      )}
    </div>
  );
}
