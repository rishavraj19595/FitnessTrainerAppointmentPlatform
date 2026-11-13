"use client";

import * as React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Dumbbell,
  Menu,
  X,
  User,
  Calendar,
  LogOut,
  Bell,
  Shield,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  const getDashboardLink = () => {
    if (!session?.user) return "/dashboard";
    if (session.user.role === "ADMIN") return "/admin/dashboard";
    if (session.user.role === "TRAINER") return "/trainer/dashboard";
    return "/dashboard";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Dumbbell className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center">
              FIT<span className="text-emerald-600 ml-0.5">PULSE</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600/80 -mt-1">
              Trainer Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link
            href="/trainers"
            className="text-slate-600 hover:text-emerald-600 transition-colors font-medium dark:text-slate-300"
          >
            Find Trainers
          </Link>
          <Link
            href="/packages"
            className="text-slate-600 hover:text-emerald-600 transition-colors font-medium dark:text-slate-300"
          >
            Workout Packages
          </Link>
          <Link
            href="/about"
            className="text-slate-600 hover:text-emerald-600 transition-colors font-medium dark:text-slate-300"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-slate-600 hover:text-emerald-600 transition-colors font-medium dark:text-slate-300"
          >
            Contact
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {status === "loading" ? (
            <div className="h-10 w-24 bg-slate-100 rounded-lg animate-pulse" />
          ) : session?.user ? (
            <div className="flex items-center space-x-4">
              {/* Notification icon link */}
              <Link
                href={
                  session.user.role === "TRAINER"
                    ? "/trainer/notifications"
                    : "/dashboard/notifications"
                }
                className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-emerald-600 transition-colors"
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </Link>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-3 rounded-full p-1 pl-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-semibold leading-none text-slate-900 dark:text-white">
                      {session.user.name}
                    </p>
                    <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mt-0.5">
                      {session.user.role}
                    </p>
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session.user.image || ""} />
                    <AvatarFallback>
                      {session.user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl border bg-white p-2 shadow-xl dark:bg-slate-900 z-50 animate-in fade-in zoom-in-95"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b mb-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {session.user.email}
                      </p>
                      <Badge variant="success" className="mt-1 text-[10px]">
                        {session.user.role} Account
                      </Badge>
                    </div>

                    <Link
                      href={getDashboardLink()}
                      className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-200"
                    >
                      {session.user.role === "ADMIN" ? (
                        <Shield className="h-4 w-4 text-emerald-600" />
                      ) : session.user.role === "TRAINER" ? (
                        <Briefcase className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Calendar className="h-4 w-4 text-emerald-600" />
                      )}
                      <span>Open Dashboard</span>
                    </Link>

                    <Link
                      href={
                        session.user.role === "TRAINER"
                          ? "/trainer/profile"
                          : "/dashboard/profile"
                      }
                      className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-200"
                    >
                      <User className="h-4 w-4 text-slate-500" />
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

              <Link href={getDashboardLink()}>
                <Button className="shadow-md shadow-emerald-600/20">
                  Dashboard
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link href="/login">
                <Button variant="ghost" className="font-semibold">
                  Sign In
                </Button>
              </Link>
              <Link href="/register/trainer">
                <Button variant="outline" className="border-emerald-600 text-emerald-700 hover:bg-emerald-50">
                  Become a Trainer
                </Button>
              </Link>
              <Link href="/register">
                <Button className="shadow-md shadow-emerald-600/20">
                  Join as Member
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center space-x-2">
          {session?.user && (
            <Link href={getDashboardLink()}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user.image || ""} />
                <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b bg-background px-4 pt-2 pb-6 space-y-4">
          <nav className="flex flex-col space-y-3 pt-2">
            <Link
              href="/trainers"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-slate-700 hover:text-emerald-600"
            >
              Find Trainers
            </Link>
            <Link
              href="/packages"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-slate-700 hover:text-emerald-600"
            >
              Workout Packages
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-slate-700 hover:text-emerald-600"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-slate-700 hover:text-emerald-600"
            >
              Contact
            </Link>
          </nav>

          <div className="pt-4 border-t flex flex-col space-y-2">
            {session?.user ? (
              <>
                <Link
                  href={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full">
                    Go to {session.user.role} Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full text-rose-600"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
                <Link
                  href="/register/trainer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="ghost" className="w-full text-emerald-600">
                    Apply as Trainer
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
