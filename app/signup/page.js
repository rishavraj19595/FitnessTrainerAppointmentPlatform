"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Dumbbell, ArrowRight, UserCheck, Dumbbell as TrainerIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState("trainee");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          phone,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      toast.success("Account created successfully! Signing you in...");

      // Automatically sign in
      const loginRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (loginRes?.error) {
        router.push("/login");
        return;
      }

      if (typeof window !== "undefined") {
        sessionStorage.setItem("fitpulse_session_active", "true");
        try {
          const bc = new BroadcastChannel("fitpulse_tab_channel");
          bc.postMessage("TAB_IS_ACTIVE");
          bc.close();
        } catch (e) {}
      }

      if (role === "trainer") {
        router.push("/trainer/dashboard");
      } else {
        router.push("/trainee/dashboard");
      }
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="h-12 w-12 bg-black text-white rounded-xl flex items-center justify-center font-black mx-auto">
            <Dumbbell className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black text-zinc-950 tracking-tight">
            Create Your Account
          </h2>
          <p className="text-xs text-zinc-500">
            Join India's dedicated fitness and gym training network.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 rounded-xl">
          <button
            type="button"
            onClick={() => setRole("trainee")}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              role === "trainee"
                ? "bg-white text-black shadow-sm"
                : "text-zinc-600 hover:text-black"
            }`}
          >
            <UserCheck className="h-3.5 w-3.5" />
            I am a Trainee
          </button>
          <button
            type="button"
            onClick={() => setRole("trainer")}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              role === "trainer"
                ? "bg-white text-black shadow-sm"
                : "text-zinc-600 hover:text-black"
            }`}
          >
            <TrainerIcon className="h-3.5 w-3.5" />
            I am a Trainer
          </button>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aryan Sharma"
              className="w-full text-xs px-3 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Email Address *
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

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Mobile Number (India +91)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full text-xs px-3 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Create Password (min. 6 characters) *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs px-3 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-black text-white hover:bg-zinc-800 font-bold text-xs shadow-sm flex items-center justify-center gap-2 mt-4"
          >
            {loading ? "Creating Account..." : `Register as ${role === "trainer" ? "Trainer" : "Trainee"}`}{" "}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </form>

        <p className="text-center text-xs text-zinc-500">
          Already registered?{" "}
          <Link href="/login" className="font-bold text-black hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
