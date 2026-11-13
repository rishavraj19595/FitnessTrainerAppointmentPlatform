"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Dumbbell, ArrowRight, Shield, User, Briefcase, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Welcome back to FitPulse!");
        router.refresh();

        if (email.includes("admin")) {
          router.push("/admin/dashboard");
        } else if (email.includes("trainer")) {
          router.push("/trainer/dashboard");
        } else {
          router.push(redirectUrl === "/" ? "/dashboard" : redirectUrl);
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: "client" | "trainer" | "admin") => {
    if (role === "admin") {
      setEmail("admin@fitpulse.com");
      setPassword("admin123");
    } else if (role === "trainer") {
      setEmail("trainer1@fitpulse.com");
      setPassword("trainer123");
    } else {
      setEmail("client@fitpulse.com");
      setPassword("client123");
    }
  };

  return (
    <div className="p-8 rounded-3xl border bg-card shadow-xl space-y-6">
      {/* Quick Demo Login Switcher */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-500/20 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
            ⚡ Quick Demo Accounts
          </span>
          <Badge variant="outline" className="text-[10px] bg-background">
            1-Click Autofill
          </Badge>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin("client")}
            className="py-1.5 px-2 rounded-xl border border-emerald-500/30 bg-background text-[11px] font-bold text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center justify-center gap-1 transition-colors"
          >
            <User className="h-3 w-3 text-emerald-600" />
            Client
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin("trainer")}
            className="py-1.5 px-2 rounded-xl border border-emerald-500/30 bg-background text-[11px] font-bold text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center justify-center gap-1 transition-colors"
          >
            <Briefcase className="h-3 w-3 text-emerald-600" />
            Trainer
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin("admin")}
            className="py-1.5 px-2 rounded-xl border border-emerald-500/30 bg-background text-[11px] font-bold text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center justify-center gap-1 transition-colors"
          >
            <Shield className="h-3 w-3 text-emerald-600" />
            Admin
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@fitpulse.com"
              className="pl-10 h-11"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-emerald-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-10 h-11"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 font-bold shadow-md shadow-emerald-600/20"
        >
          {loading ? "Signing in..." : "Sign In"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>

      <div className="pt-2 text-center text-xs text-muted-foreground">
        Are you a fitness trainer looking to coach?{" "}
        <Link
          href="/register/trainer"
          className="font-bold text-emerald-600 hover:underline"
        >
          Apply as Coach
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center space-x-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-lg shadow-emerald-500/20">
            <Dumbbell className="h-6 w-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            FIT<span className="text-emerald-600">PULSE</span>
          </span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Sign In To Your Account
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Don't have an account yet?{" "}
          <Link
            href="/register"
            className="font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-4"
          >
            Create member account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <React.Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading login...</div>}>
          <LoginForm />
        </React.Suspense>
      </div>
    </div>
  );
}
