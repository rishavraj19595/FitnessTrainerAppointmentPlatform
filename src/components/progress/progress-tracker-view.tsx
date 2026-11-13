"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  TrendingUp,
  Plus,
  Trash2,
  Calendar,
  Activity,
  Flame,
  Award,
  Scale,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";

interface ProgressTrackerViewProps {
  initialEntries: any[];
}

export function ProgressTrackerView({
  initialEntries,
}: ProgressTrackerViewProps) {
  const router = useRouter();
  const [entries, setEntries] = React.useState(initialEntries);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  // Form states
  const [weightKg, setWeightKg] = React.useState<number | "">("");
  const [waistCm, setWaistCm] = React.useState<number | "">("");
  const [chestCm, setChestCm] = React.useState<number | "">("");
  const [bodyFat, setBodyFat] = React.useState<number | "">("");
  const [strengthNotes, setStrengthNotes] = React.useState("");
  const [personalNotes, setPersonalNotes] = React.useState("");

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weightKg) {
      toast.error("Please enter your current body weight");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weightKg: Number(weightKg),
          waistCm: waistCm ? Number(waistCm) : undefined,
          chestCm: chestCm ? Number(chestCm) : undefined,
          bodyFatPercentage: bodyFat ? Number(bodyFat) : undefined,
          strengthNotes,
          personalNotes,
          date: new Date().toISOString(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to log progress");
      }

      toast.success("Progress logged successfully!");
      setModalOpen(false);
      setWeightKg("");
      setWaistCm("");
      setChestCm("");
      setBodyFat("");
      setStrengthNotes("");
      setPersonalNotes("");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to save entry");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this progress entry?")) return;

    try {
      const res = await fetch(`/api/progress?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Entry removed");
        router.refresh();
      }
    } catch {
      toast.error("Failed to delete entry");
    }
  };

  // Prepare chart data
  const chartData = entries.map((e) => ({
    date: formatDate(e.date),
    weight: e.weightKg,
    bodyFat: e.bodyFatPercentage || null,
    waist: e.waistCm || null,
  }));

  const firstEntry = entries[0];
  const lastEntry = entries[entries.length - 1];
  const weightDiff =
    firstEntry && lastEntry
      ? Math.round((lastEntry.weightKg - firstEntry.weightKg) * 10) / 10
      : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Body Progress & Biometrics
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Visualize body weight fluctuations, measurements, and personal strength records.
          </p>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="font-bold shadow-md shadow-emerald-600/20"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Log Measurements
        </Button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border bg-card space-y-1">
          <p className="text-xs font-semibold text-muted-foreground">Current Weight</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {lastEntry ? `${lastEntry.weightKg} kg` : "—"}
          </p>
          <p className="text-xs text-muted-foreground">
            {weightDiff !== 0 ? (
              <span className={weightDiff < 0 ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                {weightDiff > 0 ? "+" : ""}{weightDiff} kg since starting
              </span>
            ) : (
              "First benchmark"
            )}
          </p>
        </div>

        <div className="p-6 rounded-2xl border bg-card space-y-1">
          <p className="text-xs font-semibold text-muted-foreground">Body Fat Estimate</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {lastEntry?.bodyFatPercentage ? `${lastEntry.bodyFatPercentage}%` : "—"}
          </p>
          <p className="text-xs text-muted-foreground">Caliper / DEXA benchmark</p>
        </div>

        <div className="p-6 rounded-2xl border bg-card space-y-1">
          <p className="text-xs font-semibold text-muted-foreground">Waist Circumference</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {lastEntry?.waistCm ? `${lastEntry.waistCm} cm` : "—"}
          </p>
          <p className="text-xs text-muted-foreground">Abdominal midpoint metric</p>
        </div>
      </div>

      {/* Recharts Weight Line Chart */}
      <div className="p-6 sm:p-8 rounded-3xl border bg-card shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Weight Trajectory Over Time
              </h3>
              <p className="text-xs text-muted-foreground">Body weight in kilograms</p>
            </div>
          </div>
        </div>

        {chartData.length > 0 ? (
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={["dataMin - 2", "dataMax + 2"]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderRadius: "12px",
                    border: "none",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  name="Weight (kg)"
                  stroke="#059669"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#weightGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-center py-10 text-muted-foreground">
            No measurements recorded yet. Click above to log your first weight entry!
          </p>
        )}
      </div>

      {/* Progress Log History Table */}
      <div className="p-6 sm:p-8 rounded-3xl border bg-card shadow-sm space-y-4">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">
          Measurement Log History
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50/60 dark:bg-slate-900/40 text-xs font-bold uppercase text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Weight (kg)</th>
                <th className="py-3 px-4">Waist (cm)</th>
                <th className="py-3 px-4">Body Fat %</th>
                <th className="py-3 px-4">PRs & Strength Notes</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y text-xs">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                  <td className="py-3.5 px-4 font-semibold">{formatDate(entry.date)}</td>
                  <td className="py-3.5 px-4 font-black text-emerald-600 text-sm">
                    {entry.weightKg} kg
                  </td>
                  <td className="py-3.5 px-4">{entry.waistCm ? `${entry.waistCm} cm` : "—"}</td>
                  <td className="py-3.5 px-4">{entry.bodyFatPercentage ? `${entry.bodyFatPercentage}%` : "—"}</td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                    {entry.strengthNotes || entry.personalNotes || "—"}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg dark:hover:bg-rose-950/20 transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Progress Measurement Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Scale className="h-5 w-5 text-emerald-600" />
              Log Body Progress Metrics
            </DialogTitle>
            <DialogDescription>
              Record your morning fasted weight and body circumference metrics.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddEntry} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="weight">Weight (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  required
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  placeholder="78.5"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="bodyFat">Body Fat % (Optional)</Label>
                <Input
                  id="bodyFat"
                  type="number"
                  step="0.1"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(Number(e.target.value))}
                  placeholder="16.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="waist">Waist (cm)</Label>
                <Input
                  id="waist"
                  type="number"
                  step="0.5"
                  value={waistCm}
                  onChange={(e) => setWaistCm(Number(e.target.value))}
                  placeholder="82.0"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="chest">Chest (cm)</Label>
                <Input
                  id="chest"
                  type="number"
                  step="0.5"
                  value={chestCm}
                  onChange={(e) => setChestCm(Number(e.target.value))}
                  placeholder="104.0"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="prNotes">Strength Milestones / PRs</Label>
              <Input
                id="prNotes"
                value={strengthNotes}
                onChange={(e) => setStrengthNotes(e.target.value)}
                placeholder="e.g. Squat 120kg x 5, 20 consecutive pull-ups"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="notes">Reflections / Diet Notes</Label>
              <textarea
                id="notes"
                rows={2}
                value={personalNotes}
                onChange={(e) => setPersonalNotes(e.target.value)}
                placeholder="High energy levels today, water intake 3.5L..."
                className="w-full p-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-11 font-bold shadow-md shadow-emerald-600/20"
            >
              {submitting ? "Saving..." : "Save Measurement"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
