"use client";

import * as React from "react";
import { toast } from "sonner";
import { Clock, Calendar, Check, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TrainerAvailabilityPage() {
  const days = [
    { day: "Monday", id: 1 },
    { day: "Tuesday", id: 2 },
    { day: "Wednesday", id: 3 },
    { day: "Thursday", id: 4 },
    { day: "Friday", id: 5 },
    { day: "Saturday", id: 6 },
    { day: "Sunday", id: 0 },
  ];

  const [schedule, setSchedule] = React.useState<
    Record<number, { active: boolean; start: string; end: string }>
  >({
    1: { active: true, start: "09:00", end: "17:00" },
    2: { active: true, start: "09:00", end: "17:00" },
    3: { active: true, start: "09:00", end: "17:00" },
    4: { active: true, start: "09:00", end: "17:00" },
    5: { active: true, start: "09:00", end: "17:00" },
    6: { active: true, start: "10:00", end: "14:00" },
    0: { active: false, start: "10:00", end: "14:00" },
  });

  const toggleDay = (id: number) => {
    setSchedule((prev) => ({
      ...prev,
      [id]: { ...prev[id], active: !prev[id].active },
    }));
  };

  const updateTime = (id: number, field: "start" | "end", val: string) => {
    setSchedule((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: val },
    }));
  };

  const handleSave = () => {
    toast.success("Weekly availability schedule updated successfully!");
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Appointment Availability
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure the days and hourly slots during which clients can book consultations with you.
          </p>
        </div>
        <Button onClick={handleSave} className="font-bold shadow-md shadow-emerald-600/20">
          <Save className="mr-2 h-4 w-4" /> Save Schedule
        </Button>
      </div>

      <div className="p-8 rounded-3xl border bg-card shadow-sm space-y-4">
        <div className="space-y-3">
          {days.map((item) => {
            const config = schedule[item.id];
            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  config.active
                    ? "bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800"
                    : "bg-slate-100/40 dark:bg-slate-950/40 opacity-60"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={`day-${item.id}`}
                    checked={config.active}
                    onChange={() => toggleDay(item.id)}
                    className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <label
                    htmlFor={`day-${item.id}`}
                    className="font-bold text-sm text-slate-900 dark:text-white cursor-pointer select-none"
                  >
                    {item.day}
                  </label>
                  <Badge variant={config.active ? "success" : "outline"} className="text-[10px]">
                    {config.active ? "Available" : "Unavailable"}
                  </Badge>
                </div>

                {config.active ? (
                  <div className="flex items-center space-x-2 text-xs">
                    <input
                      type="time"
                      value={config.start}
                      onChange={(e) => updateTime(item.id, "start", e.target.value)}
                      className="h-9 px-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-muted-foreground">to</span>
                    <input
                      type="time"
                      value={config.end}
                      onChange={(e) => updateTime(item.id, "end", e.target.value)}
                      className="h-9 px-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground italic">
                    No bookings accepted
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
