import * as React from "react";
import Link from "next/link";
import { Dumbbell, Heart, Shield, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-slate-950 text-slate-400">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20">
                <Dumbbell className="h-6 w-6" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                FIT<span className="text-emerald-500">PULSE</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-slate-400">
              The premier fitness trainer appointment & progress management platform.
              Connect with top certified strength coaches, personal trainers, and
              physiotherapists to hit your peak athletic goals.
            </p>
            <div className="flex items-center space-x-4 pt-2 text-sm text-slate-300">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-emerald-400" />
                <span>100% Certified Trainers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-rose-400" />
                <span>Transformations Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/trainers"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Trainer Directory
                </Link>
              </li>
              <li>
                <Link
                  href="/packages"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Workout Packages
                </Link>
              </li>
              <li>
                <Link
                  href="/register/trainer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Become a Coach
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Client Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Fitness Disciplines */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Disciplines
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Hypertrophy & Bodybuilding
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Functional Yoga & Mobility
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Metabolic Fat Loss & HIIT
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Injury Prehab & Posture
                </span>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Get in Touch
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center space-x-2.5">
                <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>support@fitpulse.com</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>+1 (800) FIT-PULSE</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>San Francisco, CA & Remote Global</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800/80 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FitPulse SaaS Technologies Inc. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/about" className="hover:text-slate-300">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-slate-300">
              Support
            </Link>
            <span className="text-slate-600">Privacy Policy</span>
            <span className="text-slate-600">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
