"use client";

import React, { useState } from "react";
import { Clock, ShieldCheck, CheckCircle2, Calendar } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export default function TrainerSchedulePage() {
  const [hourlyRate, setHourlyRate] = useState(2500);
  const [activeSlots, setActiveSlots] = useState([
    "06:00 AM",
    "07:00 AM",
    "08:00 AM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
  ]);

  const allAvailableSlots = [
    "06:00 AM",
    "07:00 AM",
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
  ];

  const toggleSlot = (slot) => {
    setActiveSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const handleSave = () => {
    toast.success("Trainer schedule and consultation rates updated successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
          Schedule & Slot Availability
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Manage your available time windows for 1-on-1 coaching sessions. Conflicting double-bookings are automatically blocked.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hourly Rate Settings */}
        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-bold text-black uppercase tracking-wider">
            Consultation Pricing
          </h2>
          <div className="space-y-2 text-xs">
            <label className="block font-semibold text-zinc-700">
              Hourly Session Charge (₹ INR)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 font-bold text-zinc-500">₹</span>
              <input
                type="number"
                step="100"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full pl-8 pr-3 py-2 border border-zinc-300 rounded-lg text-sm font-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <p className="text-[11px] text-zinc-500 pt-1">
              Platform take-rate is 15%. You receive <strong>85% net ({new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(hourlyRate * 0.85)})</strong> deposited to your registered bank account.
            </p>
          </div>
        </Card>

        {/* Available IST Slots */}
        <Card className="md:col-span-2 p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <h2 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-black" />
              Daily IST Time Slots (Click to Toggle)
            </h2>
            <Badge variant="secondary" className="text-[10px]">
              {activeSlots.length} Active Slots
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            {allAvailableSlots.map((slot) => {
              const isSelected = activeSlots.includes(slot);
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => toggleSlot(slot)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? "bg-black text-white border-black shadow-sm"
                      : "bg-white text-zinc-600 border-zinc-200 hover:border-black"
                  }`}
                >
                  <span>{slot}</span>
                  <span className="text-[9px] font-normal opacity-80">
                    {isSelected ? "Available" : "Blocked"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
            <span className="text-[11px] text-zinc-500 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Auto conflict resolution active
            </span>
            <Button onClick={handleSave} className="bg-black text-white hover:bg-zinc-800 text-xs font-bold h-9 px-6">
              Save Schedule Settings
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
