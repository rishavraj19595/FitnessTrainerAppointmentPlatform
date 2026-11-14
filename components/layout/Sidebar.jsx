"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Dumbbell,
  Utensils,
  TrendingUp,
  CreditCard,
  UserCheck,
  CheckSquare,
  Clock,
  DollarSign,
  ShieldAlert,
  BarChart2,
  Settings,
  LogOut,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export function Sidebar({ role = "trainee" }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const traineeLinks = [
    { label: "Dashboard", href: "/trainee/dashboard", icon: LayoutDashboard },
    { label: "Find Trainers", href: "/trainee/trainers", icon: Search },
    { label: "My Bookings", href: "/trainee/bookings", icon: CalendarCheck },
    { label: "Fitness Progress", href: "/trainee/progress", icon: TrendingUp },
    { label: "Workout Tasks", href: "/trainee/workouts", icon: Dumbbell },
    { label: "Diet Chart", href: "/trainee/diet", icon: Utensils },
    { label: "Payments (₹ INR)", href: "/trainee/payments", icon: CreditCard },
    { label: "My Profile", href: "/trainee/profile", icon: UserCheck },
  ];

  const trainerLinks = [
    { label: "Dashboard", href: "/trainer/dashboard", icon: LayoutDashboard },
    { label: "My Trainees", href: "/trainer/trainees", icon: Users },
    { label: "Mark Attendance", href: "/trainer/attendance", icon: CheckSquare },
    { label: "Workout Tasks", href: "/trainer/workouts", icon: Dumbbell },
    { label: "Diet Plans", href: "/trainer/diet", icon: Utensils },
    { label: "Schedule & Slots", href: "/trainer/schedule", icon: Clock },
    { label: "Earnings (85%)", href: "/trainer/earnings", icon: DollarSign },
    { label: "Trainer Profile", href: "/trainer/profile", icon: UserCheck },
  ];

  const adminLinks = [
    { label: "Admin Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Manage Trainees", href: "/admin/trainees", icon: Users },
    { label: "Verify Trainers", href: "/admin/trainers", icon: ShieldAlert },
    { label: "All Bookings", href: "/admin/bookings", icon: CalendarCheck },
    { label: "Workout Plans", href: "/admin/workout-plans", icon: Dumbbell },
    { label: "Platform Payments", href: "/admin/payments", icon: CreditCard },
    { label: "Analytics & Reports", href: "/admin/analytics", icon: BarChart2 },
    { label: "Platform Settings", href: "/admin/settings", icon: Settings },
  ];

  let links = traineeLinks;
  if (role === "trainer") links = trainerLinks;
  if (role === "admin") links = adminLinks;

  return (
    <aside className="w-64 bg-zinc-950 text-white flex flex-col justify-between border-r border-zinc-800 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        {/* User Card */}
        {session?.user && (
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center space-x-3">
            <img
              src={session.user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"}
              alt={session.user.name}
              className="h-10 w-10 rounded-full object-cover border border-zinc-700"
            />
            <div className="overflow-hidden">
              <p className="font-bold text-xs text-white truncate">
                {session.user.name}
              </p>
              <Badge variant="secondary" className="mt-0.5 text-[9px] bg-zinc-800 text-zinc-300 capitalize border-zinc-700 px-1.5 py-0">
                {role}
              </Badge>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all",
                  isActive
                    ? "bg-white text-black shadow-sm font-bold"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-black" : "text-zinc-400")} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout button at bottom */}
      <div className="p-4 border-t border-zinc-800">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
