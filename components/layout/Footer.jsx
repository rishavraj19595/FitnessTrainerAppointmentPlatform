import React from "react";
import Link from "next/link";
import { Dumbbell, ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-black text-white border-t border-zinc-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-zinc-800">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-white text-black rounded flex items-center justify-center font-black">
                <Dumbbell className="h-4 w-4" />
              </div>
              <span className="font-black tracking-wider text-base">
                FIT<span className="text-zinc-400">PULSE</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              India’s premier fitness trainer appointment & progress management platform. Connecting trainees with verified CSCS, ACE, and K11 coaches nationwide.
            </p>
          </div>

          {/* Trainee links */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-white uppercase tracking-wider">
              For Trainees
            </p>
            <ul className="space-y-1.5 text-xs text-zinc-400">
              <li>
                <Link href="/trainee/trainers" className="hover:text-white transition-colors">
                  Find Verified Coaches
                </Link>
              </li>
              <li>
                <Link href="/trainee/workouts" className="hover:text-white transition-colors">
                  Workout Tracker
                </Link>
              </li>
              <li>
                <Link href="/trainee/diet" className="hover:text-white transition-colors">
                  Indian Diet Charts
                </Link>
              </li>
              <li>
                <Link href="/trainee/payments" className="hover:text-white transition-colors">
                  Razorpay Invoices
                </Link>
              </li>
            </ul>
          </div>

          {/* Trainer links */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-white uppercase tracking-wider">
              For Trainers
            </p>
            <ul className="space-y-1.5 text-xs text-zinc-400">
              <li>
                <Link href="/signup" className="hover:text-white transition-colors">
                  Become a Trainer
                </Link>
              </li>
              <li>
                <Link href="/trainer/attendance" className="hover:text-white transition-colors">
                  Mark Attendance
                </Link>
              </li>
              <li>
                <Link href="/trainer/earnings" className="hover:text-white transition-colors">
                  Trainer Payouts (85%)
                </Link>
              </li>
              <li>
                <Link href="/trainer/schedule" className="hover:text-white transition-colors">
                  Schedule & Slot Manager
                </Link>
              </li>
            </ul>
          </div>

          {/* Indian Gyms & Compliance */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-white uppercase tracking-wider">
              Indian Gym Standards
            </p>
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg space-y-1 text-[11px] text-zinc-400">
              <div className="flex items-center gap-1.5 text-zinc-200 font-semibold">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>₹ INR Razorpay Certified</span>
              </div>
              <p>All training sessions adhere to IST scheduling and Indian fitness standards.</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-3">
          <p>© 2026 FitPulse India Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <Link href="/" className="hover:text-zinc-300">Privacy Policy</Link>
            <Link href="/" className="hover:text-zinc-300">Terms of Service</Link>
            <Link href="/" className="hover:text-zinc-300">Razorpay Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
