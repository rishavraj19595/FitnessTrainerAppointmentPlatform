"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Dumbbell,
  LayoutDashboard,
  Calendar,
  Package,
  TrendingUp,
  ClipboardCheck,
  CreditCard,
  Bell,
  User,
  Users,
  Clock,
  ShieldCheck,
  DollarSign,
  Settings,
  LogOut,
  FileText,
  Star,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role || "CLIENT";

  const clientLinks = [
    { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { title: "My Bookings", href: "/dashboard/bookings", icon: Calendar },
    { title: "My Packages", href: "/dashboard/packages", icon: Package },
    { title: "Workout Plans", href: "/dashboard/workouts", icon: Dumbbell },
    { title: "Fitness Progress", href: "/dashboard/progress", icon: TrendingUp },
    { title: "Attendance History", href: "/dashboard/attendance", icon: ClipboardCheck },
    { title: "Payment History", href: "/dashboard/payments", icon: CreditCard },
    { title: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { title: "Profile", href: "/dashboard/profile", icon: User },
  ];

  const trainerLinks = [
    { title: "Trainer Overview", href: "/trainer/dashboard", icon: LayoutDashboard },
    { title: "My Profile", href: "/trainer/profile", icon: User },
    { title: "Workout Packages", href: "/trainer/packages", icon: Package },
    { title: "Set Availability", href: "/trainer/availability", icon: Clock },
    { title: "Appointments", href: "/trainer/bookings", icon: Calendar },
    { title: "My Clients", href: "/trainer/clients", icon: Users },
    { title: "Workout Plans", href: "/trainer/workouts", icon: Dumbbell },
    { title: "Mark Attendance", href: "/trainer/attendance", icon: ClipboardCheck },
    { title: "Earnings & Revenue", href: "/trainer/earnings", icon: DollarSign },
    { title: "Notifications", href: "/trainer/notifications", icon: Bell },
    { title: "Trainer Settings", href: "/trainer/settings", icon: Settings },
  ];

  const adminLinks = [
    { title: "Analytics Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { title: "User Management", href: "/admin/users", icon: Users },
    { title: "Trainer Verification", href: "/admin/trainers", icon: ShieldCheck },
    { title: "All Bookings", href: "/admin/bookings", icon: Calendar },
    { title: "Payment Transactions", href: "/admin/payments", icon: CreditCard },
    { title: "Review Moderation", href: "/admin/reviews", icon: Star },
    { title: "Reports & Logs", href: "/admin/reports", icon: FileText },
    { title: "Platform Settings", href: "/admin/settings", icon: Settings },
  ];

  const links =
    role === "ADMIN"
      ? adminLinks
      : role === "TRAINER"
      ? trainerLinks
      : clientLinks;

  return (
    <aside className="w-64 border-r bg-card h-screen sticky top-0 flex flex-col justify-between shrink-0 shadow-sm z-30 hidden md:flex">
      <div>
        {/* Brand header */}
        <div className="h-20 border-b flex items-center px-6">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Dumbbell className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center">
                FIT<span className="text-emerald-600 ml-0.5">PULSE</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600/90 block -mt-1">
                {role} Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation items */}
        <div className="px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
          <div className="px-3 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Menu Navigation
            </span>
          </div>

          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center space-x-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all group",
                  isActive
                    ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 font-bold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                    isActive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                  )}
                />
                <span className="truncate">{link.title}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer / user info & logout */}
      <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 truncate">
            <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 text-sm shrink-0">
              {session?.user?.name?.charAt(0) || "U"}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold truncate text-slate-800 dark:text-slate-200">
                {session?.user?.name || "User"}
              </p>
              <Badge variant="outline" className="text-[9px] py-0 px-1 mt-0.5">
                {role}
              </Badge>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg dark:hover:bg-rose-950/20 transition-colors"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
