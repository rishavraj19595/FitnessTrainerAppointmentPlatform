"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Dumbbell, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (!session) return "/login";
    if (session.user.role === "trainer") return "/trainer/dashboard";
    if (session.user.role === "admin") return "/admin/dashboard";
    return "/trainee/dashboard";
  };

  const getGreeting = () => {
    if (!session?.user?.name) return "";
    const hour = new Date().getHours();
    let salutation = "Good evening";
    if (hour >= 4 && hour < 12) {
      salutation = "Good morning";
    } else if (hour >= 12 && hour < 17) {
      salutation = "Good afternoon";
    } else {
      salutation = "Good evening";
    }
    const coachPrefix = session.user.role === "trainer" ? "Coach " : "";
    return `${salutation}, ${coachPrefix}${session.user.name}`;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-black text-white border-b border-zinc-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-2.5">
          <div className="h-9 w-9 bg-white text-black rounded-lg flex items-center justify-center font-black">
            <Dumbbell className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-wider text-white">
              FIT<span className="text-zinc-400">PULSE</span>
            </span>
            <span className="text-[9px] font-semibold tracking-widest text-zinc-400 uppercase">
              INDIA • GYM SAAS
            </span>
          </div>
        </Link>

        {/* Center: Greeting after login (replacing the 3 buttons) OR Public Navigation Links when logged out */}
        {session ? (
          <div className="hidden md:flex items-center space-x-2 text-sm font-semibold text-zinc-200">
            <span className="text-base">👋</span>
            <span className="font-bold tracking-tight text-white">{getGreeting()}</span>
          </div>
        ) : (
          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-zinc-300">
            <Link href="/trainee/trainers" className="hover:text-white transition-colors">
              Find Trainers
            </Link>
            <Link href="/#packages" className="hover:text-white transition-colors">
              Workout Packages
            </Link>
            <Link href="/#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </Link>
          </nav>
        )}

        {/* Right Action Section */}
        <div className="hidden md:flex items-center space-x-3">
          {session ? (
            <div className="flex items-center space-x-3">
              <Link href={getDashboardLink()}>
                <Button size="sm" className="bg-white text-black hover:bg-zinc-200 text-xs font-bold gap-1.5 h-8">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </Button>
              </Link>

              <Badge variant="secondary" className="bg-zinc-800 text-zinc-200 border-zinc-700 capitalize text-[10px]">
                {session.user.role}
              </Badge>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                title="Log out"
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white hover:bg-zinc-900 text-xs h-8">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-white text-black hover:bg-zinc-200 text-xs font-bold h-8">
                  Join Now
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-400 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-zinc-800 px-4 pt-2 pb-6 space-y-3">
          {session ? (
            <div className="py-2 text-sm font-bold text-white border-b border-zinc-800">
              👋 {getGreeting()}
            </div>
          ) : (
            <>
              <Link
                href="/trainee/trainers"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-zinc-300 hover:text-white py-2"
              >
                Find Trainers
              </Link>
              <Link
                href="/#packages"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-zinc-300 hover:text-white py-2"
              >
                Workout Packages
              </Link>
            </>
          )}

          <div className="pt-3 border-t border-zinc-800 space-y-2">
            {session ? (
              <>
                <Link
                  href={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block"
                >
                  <Button className="w-full bg-white text-black font-bold text-xs h-9">
                    Go to Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full border-zinc-700 text-white bg-transparent hover:bg-zinc-900 text-xs h-9"
                >
                  Log Out
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-zinc-700 text-white bg-transparent text-xs h-9">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-white text-black text-xs font-bold h-9">
                    Join Now
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
