"use client";

import React, { useState } from "react";
import { Settings, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [commission, setCommission] = useState(15);
  const [cancellationHours, setCancellationHours] = useState(12);
  const [supportEmail, setSupportEmail] = useState("support@fitpulse.in");
  const [supportPhone, setSupportPhone] = useState("+91 98765 43210");

  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Platform settings updated successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
          Platform Configuration & Policies
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Manage commission take-rates, cancellation windows, and Razorpay gateway parameters.
        </p>
      </div>

      <Card className="p-6 space-y-6 max-w-2xl">
        <form onSubmit={handleSave} className="space-y-5 text-xs">
          <div className="space-y-1">
            <label className="block font-bold text-zinc-700">
              Platform Take-Rate Commission (%)
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={commission}
              onChange={(e) => setCommission(Number(e.target.value))}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black font-bold text-sm"
            />
            <p className="text-[11px] text-zinc-500">
              Trainers automatically receive the remaining (100 - {commission}) = {100 - commission}% on all settled consultations.
            </p>
          </div>

          <div className="space-y-1">
            <label className="block font-bold text-zinc-700">
              Cancellation & Reschedule Window (Hours prior to session)
            </label>
            <input
              type="number"
              min="1"
              max="48"
              value={cancellationHours}
              onChange={(e) => setCancellationHours(Number(e.target.value))}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black font-bold text-sm"
            />
            <p className="text-[11px] text-zinc-500">
              Trainees can cancel or reschedule with full refund up to {cancellationHours} hours before the slot time.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-zinc-700 mb-1">
                Support Helpline (India)
              </label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <div>
              <label className="block font-bold text-zinc-700 mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <div>
                <p className="font-bold text-black text-xs">Razorpay Test Sandbox Mode</p>
                <p className="text-[10px] text-zinc-500">Currencies: INR (₹) • Mock HMAC Verification Enabled</p>
              </div>
            </div>
            <Badge variant="success" className="text-[10px]">
              Active
            </Badge>
          </div>

          <Button type="submit" className="bg-black text-white hover:bg-zinc-800 text-xs font-bold h-9 px-6">
            Save Platform Settings
          </Button>
        </form>
      </Card>
    </div>
  );
}
