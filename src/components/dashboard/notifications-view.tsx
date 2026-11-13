"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Bell,
  Calendar,
  CreditCard,
  Dumbbell,
  ClipboardCheck,
  Check,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface NotificationsViewProps {
  initialNotifications: any[];
}

export function NotificationsView({
  initialNotifications,
}: NotificationsViewProps) {
  const router = useRouter();
  const [notifications, setNotifications] = React.useState(initialNotifications);

  const markAllRead = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      if (res.ok) {
        toast.success("All notifications marked as read");
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        router.refresh();
      }
    } catch {
      toast.error("Failed to update notifications");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "BOOKING":
        return <Calendar className="h-5 w-5 text-emerald-600" />;
      case "PAYMENT":
        return <CreditCard className="h-5 w-5 text-sky-600" />;
      case "WORKOUT":
        return <Dumbbell className="h-5 w-5 text-purple-600" />;
      case "ATTENDANCE":
        return <ClipboardCheck className="h-5 w-5 text-amber-600" />;
      default:
        return <Bell className="h-5 w-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Notifications Center
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time updates regarding bookings, workouts, payments, and coach attendance logs.
          </p>
        </div>
        {notifications.some((n) => !n.isRead) && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <Check className="mr-1.5 h-4 w-4" /> Mark All As Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border bg-card p-8">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto opacity-40 mb-3" />
          <h3 className="text-base font-bold">No notifications yet</h3>
          <p className="text-xs text-muted-foreground mt-1">
            When trainers update your workouts or verify sessions, alerts will arrive here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                notif.isRead
                  ? "bg-card opacity-80"
                  : "bg-emerald-500/5 border-emerald-500/30 shadow-sm"
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-background border shadow-xs shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {notif.title}
                    </h4>
                    {!notif.isRead && (
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {notif.message}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatDate(notif.createdAt)}
                  </p>
                </div>
              </div>

              {notif.link && (
                <Link href={notif.link}>
                  <Button size="sm" variant="ghost" className="text-xs font-semibold shrink-0">
                    View <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
