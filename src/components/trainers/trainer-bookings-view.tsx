"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate, formatTime } from "@/lib/utils";

interface TrainerBookingsViewProps {
  initialBookings: any[];
}

export function TrainerBookingsView({
  initialBookings,
}: TrainerBookingsViewProps) {
  const router = useRouter();
  const [filter, setFilter] = React.useState<string>("ALL");

  const filteredBookings = initialBookings.filter((b) => {
    if (filter === "ALL") return true;
    return b.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge variant="success">Confirmed</Badge>;
      case "COMPLETED":
        return <Badge variant="default">Completed</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "NO_SHOW":
        return <Badge variant="warning">No Show</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Client Appointments
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your schedule, review client notes, and record completed sessions.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs font-semibold">
          {["ALL", "CONFIRMED", "COMPLETED", "CANCELLED"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === st
                  ? "bg-white dark:bg-slate-800 text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border bg-card p-8">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto opacity-40 mb-3" />
          <h3 className="text-base font-bold">No appointments found</h3>
          <p className="text-xs text-muted-foreground mt-1">
            There are no appointments matching the selected filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="p-6 rounded-2xl border bg-card shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12 ring-2 ring-emerald-500">
                    <AvatarImage src={b.client.image || ""} />
                    <AvatarFallback>{b.client.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {b.client.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {b.package?.title || "1-on-1 Consultation Session"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {getStatusBadge(b.status)}
                  <Link href="/trainer/attendance">
                    <Button size="sm" variant="outline" className="font-bold">
                      Mark Attendance
                    </Button>
                  </Link>
                  <Link href={`/trainer/clients/${b.client.id}`}>
                    <Button size="sm" variant="ghost">
                      Client Profile <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t pt-4 text-xs">
                <div>
                  <span className="text-muted-foreground block font-medium">Session Date</span>
                  <span className="font-bold text-foreground">
                    {formatDate(b.date)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">Time</span>
                  <span className="font-bold text-emerald-600">
                    {formatTime(b.startTime)} - {formatTime(b.endTime)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">Category</span>
                  <span className="font-bold text-foreground">
                    {b.sessionType.replace("_", " ")}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">Status</span>
                  <span className="font-bold text-foreground">
                    {b.attendance ? b.attendance.status : "Pending Attendance"}
                  </span>
                </div>
              </div>

              {b.clientNotes && (
                <div className="text-xs bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border text-muted-foreground">
                  <strong className="text-foreground">Client Pre-Session Note:</strong> "{b.clientNotes}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
