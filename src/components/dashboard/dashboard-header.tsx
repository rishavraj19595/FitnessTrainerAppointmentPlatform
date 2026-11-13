"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Bell,
  Menu,
  X,
  Dumbbell,
  LogOut,
  User,
  ChevronRight,
  Shield,
  Briefcase,
  Calendar,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function DashboardHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const role = session?.user?.role || "CLIENT";

  // Derive human friendly page title
  const getPageTitle = () => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 1 && parts[0] === "dashboard") return "Client Dashboard";
    if (parts.length === 2 && parts[0] === "trainer" && parts[1] === "dashboard")
      return "Trainer Dashboard";
    if (parts.length === 2 && parts[0] === "admin" && parts[1] === "dashboard")
      return "Admin Dashboard";

    const last = parts[parts.length - 1];
    return last
      ? last.charAt(0).toUpperCase() + last.slice(1).replace("-", " ")
      : "Dashboard";
  };

  return (
    <header className="sticky top-0 z-20 h-20 border-b bg-background/95 backdrop-blur px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {getPageTitle()}
          </h1>
          <div className="flex items-center space-x-1.5 text-xs text-muted-foreground mt-0.5">
            <Link href="/" className="hover:text-emerald-600">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {role} Space
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Role Pill */}
        <Badge
          variant={
            role === "ADMIN"
              ? "destructive"
              : role === "TRAINER"
              ? "accent"
              : "success"
          }
          className="hidden sm:inline-flex uppercase font-bold text-[10px] tracking-wider"
        >
          {role}
        </Badge>

        {/* Notifications */}
        <Link
          href={
            role === "TRAINER"
              ? "/trainer/notifications"
              : "/dashboard/notifications"
          }
          className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          title="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
        </Link>

        {/* User avatar menu */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 rounded-full p-1 hover:bg-slate-100"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback>
                {session?.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-52 rounded-2xl border bg-card p-2 shadow-xl z-50 animate-in fade-in zoom-in-95"
              onClick={() => setDropdownOpen(false)}
            >
              <div className="px-3 py-2 border-b mb-1">
                <p className="text-sm font-bold truncate">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {session?.user?.email}
                </p>
              </div>
              <Link
                href={
                  role === "TRAINER" ? "/trainer/profile" : "/dashboard/profile"
                }
                className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <User className="h-4 w-4" />
                <span>My Profile</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center space-x-2 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
