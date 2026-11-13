"use client";

import * as React from "react";
import { toast } from "sonner";
import { Settings, Shield, Percent, Save, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminSettingsPage() {
  const [commission, setCommission] = React.useState(15);
  const [supportEmail, setSupportEmail] = React.useState("support@fitpulse.com");
  const [supportPhone, setSupportPhone] = React.useState("+1 (800) FIT-PULSE");
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Platform settings updated successfully!");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Platform Configuration & Settings
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Adjust platform commission take-rate, support channels, and compliance flags.
        </p>
      </div>

      <div className="p-8 rounded-3xl border bg-card shadow-sm space-y-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="comm">Platform Commission Take-Rate (%)</Label>
            <div className="relative">
              <Percent className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="comm"
                type="number"
                min={0}
                max={50}
                required
                value={commission}
                onChange={(e) => setCommission(Number(e.target.value))}
                className="pl-10 h-11"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Applied automatically to coach earnings upon session completion.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Official Support Email</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                required
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Official Support Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </div>

          <div className="pt-2 border-t space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm font-semibold">Enable Platform Maintenance Mode</span>
            </label>
            <p className="text-[11px] text-muted-foreground">
              Restricts client checkout operations while routine database migrations are performed.
            </p>
          </div>

          <Button type="submit" className="w-full h-11 font-bold shadow-md shadow-emerald-600/20">
            <Save className="mr-2 h-4 w-4" /> Save Configuration
          </Button>
        </form>
      </div>
    </div>
  );
}
