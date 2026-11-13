import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Settings, Bell, Lock, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const revalidate = 0;

export default async function TrainerSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "TRAINER" && session.user.role !== "ADMIN")) {
    redirect("/login?redirect=/trainer/settings");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Coach Account Settings
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure security, notifications, and booking alerts.
        </p>
      </div>

      <div className="p-8 rounded-3xl border bg-card shadow-sm space-y-6">
        <h3 className="font-bold text-base flex items-center gap-2">
          <Bell className="h-4 w-4 text-emerald-600" />
          Notification Preferences
        </h3>

        <div className="space-y-3 text-sm">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span>Email me whenever a client books a new workout session</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span>Email me when a client cancels or reschedules an appointment</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span>Notify me when a client logs new biometrics or milestones</span>
          </label>
        </div>

        <div className="border-t pt-6 space-y-4">
          <h3 className="font-bold text-base flex items-center gap-2">
            <Lock className="h-4 w-4 text-emerald-600" />
            Security & Session
          </h3>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input disabled value={session.user.email || ""} className="bg-slate-50 dark:bg-slate-900" />
          </div>
        </div>

        <Button className="w-full font-bold shadow-md shadow-emerald-600/20">
          Save Settings
        </Button>
      </div>
    </div>
  );
}
