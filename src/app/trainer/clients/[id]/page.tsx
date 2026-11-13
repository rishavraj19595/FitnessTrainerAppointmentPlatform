import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import Link from "next/link";
import {
  User,
  TrendingUp,
  Dumbbell,
  ClipboardCheck,
  Calendar,
  ArrowLeft,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";

export const revalidate = 0;

interface PageProps {
  params: { id: string };
}

export default async function TrainerClientDetailsPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "TRAINER" && session.user.role !== "ADMIN")) {
    redirect("/login?redirect=/trainer/clients");
  }

  const client = await dbService.getUserById(params.id);
  if (!client) {
    notFound();
  }

  const progress = await dbService.getProgressByClient(params.id);
  const workoutPlans = await dbService.getWorkoutPlansByClient(params.id);
  const attendances = await dbService.getAttendanceByClient(params.id);

  const latestProgress = progress[progress.length - 1] || null;

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center space-x-3">
        <Link href="/trainer/clients">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Roster
          </Button>
        </Link>
        <span className="text-sm font-semibold text-muted-foreground">
          Client Biometrics & Progress Record
        </span>
      </div>

      {/* Client Summary Header */}
      <div className="p-8 rounded-3xl border bg-card shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 ring-2 ring-emerald-500">
            <AvatarImage src={client.image || ""} />
            <AvatarFallback className="text-xl font-bold">
              {client.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                {client.name}
              </h1>
              <Badge variant="success">Active Client</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{client.email}</p>
            {client.phone && (
              <p className="text-xs text-muted-foreground">{client.phone}</p>
            )}
          </div>
        </div>

        <Link href={`/trainer/workouts?clientId=${client.id}`}>
          <Button className="font-bold shadow-md shadow-emerald-600/20">
            <Dumbbell className="mr-2 h-4 w-4" />
            Assign New Routine
          </Button>
        </Link>
      </div>

      {/* Biometrics Snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border bg-card space-y-1">
          <p className="text-xs font-semibold text-muted-foreground">Latest Weight</p>
          <p className="text-3xl font-black text-emerald-600">
            {latestProgress ? `${latestProgress.weightKg} kg` : "—"}
          </p>
          <p className="text-xs text-muted-foreground">Fasted baseline</p>
        </div>

        <div className="p-6 rounded-2xl border bg-card space-y-1">
          <p className="text-xs font-semibold text-muted-foreground">Waist Circumference</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {latestProgress?.waistCm ? `${latestProgress.waistCm} cm` : "—"}
          </p>
          <p className="text-xs text-muted-foreground">Midsection metric</p>
        </div>

        <div className="p-6 rounded-2xl border bg-card space-y-1">
          <p className="text-xs font-semibold text-muted-foreground">Body Fat</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {latestProgress?.bodyFatPercentage ? `${latestProgress.bodyFatPercentage}%` : "—"}
          </p>
          <p className="text-xs text-muted-foreground">Composition benchmark</p>
        </div>
      </div>

      {/* Progress History Table */}
      <div className="p-8 rounded-3xl border bg-card shadow-sm space-y-4">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
          Client Historical Measurements
        </h3>

        {progress.length === 0 ? (
          <p className="text-sm text-center py-8 text-muted-foreground">
            Client has not entered any self-reported body measurements yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-slate-50/60 dark:bg-slate-900/40 text-xs font-bold uppercase text-muted-foreground">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Weight (kg)</th>
                  <th className="py-3 px-4">Waist (cm)</th>
                  <th className="py-3 px-4">Body Fat %</th>
                  <th className="py-3 px-4">Client Strength Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs">
                {progress.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                    <td className="py-3.5 px-4 font-semibold">{formatDate(p.date)}</td>
                    <td className="py-3.5 px-4 font-black text-emerald-600 text-sm">
                      {p.weightKg} kg
                    </td>
                    <td className="py-3.5 px-4">{p.waistCm ? `${p.waistCm} cm` : "—"}</td>
                    <td className="py-3.5 px-4">{p.bodyFatPercentage ? `${p.bodyFatPercentage}%` : "—"}</td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-600 dark:text-slate-300">
                      {p.strengthNotes || p.personalNotes || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assigned Workout Routines */}
      <div className="p-8 rounded-3xl border bg-card shadow-sm space-y-4">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-emerald-600" />
          Assigned Workout Routines ({workoutPlans.length})
        </h3>

        {workoutPlans.length === 0 ? (
          <p className="text-sm text-center py-6 text-muted-foreground">
            No active workout plan assigned. Click the assign routine button above to build one.
          </p>
        ) : (
          <div className="space-y-3">
            {workoutPlans.map((plan) => (
              <div
                key={plan.id}
                className="p-4 rounded-2xl border bg-slate-50/60 dark:bg-slate-900/40 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    {plan.title}
                  </h4>
                  <Badge variant="success" className="text-[10px]">
                    {plan.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{plan.description}</p>
                <p className="text-xs font-semibold text-emerald-600">
                  Target: {plan.targetGoal} • {plan.exercises?.length || 0} exercises prescribed
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
