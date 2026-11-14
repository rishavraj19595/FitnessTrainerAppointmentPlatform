"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Dumbbell, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your registered email address.");
      return;
    }
    setSubmitted(true);
    toast.success("Password reset instructions simulated to your email.");
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 bg-black text-white rounded-xl flex items-center justify-center font-black mx-auto">
            <Dumbbell className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black text-zinc-950 tracking-tight">
            Reset Password
          </h2>
          <p className="text-xs text-zinc-500">
            Enter your email to receive password recovery instructions.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
            <p className="text-xs font-bold text-emerald-900">
              Reset link sent to {email}
            </p>
            <p className="text-[11px] text-emerald-700">
              Please check your inbox or spam folder.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Registered Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs px-3 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-10 bg-black text-white hover:bg-zinc-800 font-bold text-xs shadow-sm"
            >
              Send Reset Link
            </Button>
          </form>
        )}

        <div className="text-center pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-black"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
