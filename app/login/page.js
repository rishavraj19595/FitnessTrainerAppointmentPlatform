"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Dumbbell, ShieldCheck, ArrowRight, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("reason") === "session_ended") {
        toast.info("Session closed. You have been logged out as the tab/window was closed.");
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        toast.error(res.error);
        setLoading(false);
        return;
      }

      // Mark session active in current browser window
      if (typeof window !== "undefined") {
        sessionStorage.setItem("fitpulse_session_active", "true");
        try {
          const bc = new BroadcastChannel("fitpulse_tab_channel");
          bc.postMessage("TAB_IS_ACTIVE");
          bc.close();
        } catch (e) {}
      }

      toast.success("Signed in successfully!");

      // Route according to user role or fetch session
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      const role = sessionData?.user?.role || "trainee";

      if (role === "trainer") {
        router.push("/trainer/dashboard");
      } else if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/trainee/dashboard");
      }
      router.refresh();
    } catch (err) {
      toast.error("An unexpected error occurred.");
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword("Password123!");
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="h-12 w-12 bg-black text-white rounded-xl flex items-center justify-center font-black mx-auto">
            <Dumbbell className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black text-zinc-950 tracking-tight">
            Sign In to FitPulse
          </h2>
          <p className="text-xs text-zinc-500">
            Access your Trainee, Trainer, or Admin gym dashboard.
          </p>
        </div>

        {/* Demo Credentials Helper */}
        <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
          <p className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider">
            Quick 1-Click Demo Logins:
          </p>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin("rahul@gmail.com")}
              className="px-2 py-1.5 bg-white border border-zinc-200 rounded font-semibold text-zinc-800 hover:border-black transition-all text-center"
            >
              Trainee
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("vikram@fitpulse.in")}
              className="px-2 py-1.5 bg-white border border-zinc-200 rounded font-semibold text-zinc-800 hover:border-black transition-all text-center"
            >
              Trainer
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("admin@fitpulse.in")}
              className="px-2 py-1.5 bg-white border border-zinc-200 rounded font-semibold text-zinc-800 hover:border-black transition-all text-center"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="h-4 w-4 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs pl-9 pr-3 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-zinc-700">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] font-semibold text-zinc-500 hover:text-black"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="h-4 w-4 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-9 pr-3 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-black text-white hover:bg-zinc-800 font-bold text-xs shadow-sm flex items-center justify-center gap-2 mt-2"
          >
            {loading ? "Verifying..." : "Sign In to Dashboard"} <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </form>

        <p className="text-center text-xs text-zinc-500">
          Don't have an account?{" "}
          <Link href="/signup" className="font-bold text-black hover:underline">
            Register as Trainee or Trainer
          </Link>
        </p>
      </div>
    </div>
  );
}
