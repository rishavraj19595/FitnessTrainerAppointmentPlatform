import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { dbService } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { WeightProgressChart } from "@/components/charts/ProgressCharts";
import { formatDateIST } from "@/lib/utils";
import { TrendingUp, Scale, Activity } from "lucide-react";

export const revalidate = 0;

export default async function TraineeProgressPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login?redirect=/trainee/progress");
  }

  const trainee = await dbService.getTraineeByUserId(session.user.id);
  const logs = await dbService.getFitnessProgress(session.user.id);

  const currentWeight = logs.length > 0 ? logs[logs.length - 1].weightKg : trainee?.weightKg || 78;
  const initialWeight = logs.length > 0 ? logs[0].weightKg : currentWeight;
  const weightChange = (currentWeight - initialWeight).toFixed(1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
          Fitness Progress Analytics
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Monitor your body weight curve, waist circumference, and physiological milestones.
        </p>
      </div>

      {/* Snapshot Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase">Current Weight</p>
              <p className="text-2xl font-black text-black mt-1">{currentWeight} kg</p>
            </div>
            <Scale className="h-6 w-6 text-zinc-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase">Target Weight</p>
              <p className="text-2xl font-black text-black mt-1">{trainee?.targetWeightKg || 72} kg</p>
            </div>
            <Activity className="h-6 w-6 text-zinc-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase">Total Net Loss</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">{weightChange} kg</p>
            </div>
            <TrendingUp className="h-6 w-6 text-emerald-600" />
          </div>
        </Card>
      </div>

      {/* Line Chart */}
      <Card className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-black uppercase tracking-wider">
            Body Weight Trendline (kg)
          </h2>
          <span className="text-xs text-zinc-500 font-medium">Monthly Progress Curve</span>
        </div>
        <WeightProgressChart data={logs} />
      </Card>

      {/* History Log Table */}
      <Card className="space-y-4">
        <h2 className="text-sm font-bold text-black uppercase tracking-wider">
          Progress Logbook History
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b bg-zinc-50 text-zinc-500 font-bold uppercase">
              <tr>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Weight (kg)</th>
                <th className="py-2.5 px-4">Waist (cm)</th>
                <th className="py-2.5 px-4">Chest (cm)</th>
                <th className="py-2.5 px-4">Coach Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y text-zinc-700">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-50/50">
                  <td className="py-3 px-4 font-semibold text-black">{formatDateIST(log.date)}</td>
                  <td className="py-3 px-4 font-black text-zinc-900">{log.weightKg} kg</td>
                  <td className="py-3 px-4">{log.waistCm ? `${log.waistCm} cm` : "—"}</td>
                  <td className="py-3 px-4">{log.chestCm ? `${log.chestCm} cm` : "—"}</td>
                  <td className="py-3 px-4 text-zinc-500">{log.notes || "Recorded on scale"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
