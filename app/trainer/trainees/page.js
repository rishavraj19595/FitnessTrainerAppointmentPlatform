import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { dbService } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Users, Dumbbell, Utensils, CheckCircle2 } from "lucide-react";

export const revalidate = 0;

export default async function TrainerTraineesPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "trainer" && session.user.role !== "admin")) {
    redirect("/login?redirect=/trainer/trainees");
  }

  const trainees = await dbService.getTrainees(session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Assigned Trainee Roster
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Manage your personal gym trainees, program their routines, and monitor physiological targets.
          </p>
        </div>
      </div>

      {trainees.length === 0 ? (
        <Card className="text-center py-16 space-y-3">
          <Users className="h-10 w-10 text-zinc-400 mx-auto" />
          <p className="text-sm font-semibold text-zinc-700">No trainees assigned</p>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Once administration assigns gym members to your coaching roster, their profiles and goals will display here.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trainees.map((t) => (
            <Card key={t.id} className="p-6 space-y-4 hover:border-black transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-12 w-12 rounded-full object-cover border border-zinc-200"
                  />
                  <div>
                    <h3 className="font-bold text-base text-black">{t.name}</h3>
                    <p className="text-xs text-zinc-500">{t.email}</p>
                    <p className="text-[11px] text-zinc-400">{t.phone || "No phone provided"}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {t.attendanceRate}% Attendance
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2 border-y border-zinc-100 text-xs">
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">Weight</span>
                  <p className="font-bold text-black">{t.weightKg} kg</p>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">Target</span>
                  <p className="font-bold text-black">{t.targetWeightKg} kg</p>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">Diet</span>
                  <p className="font-bold text-black">{t.dietaryPreference}</p>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">Level</span>
                  <p className="font-bold text-black">{t.trainingExperience}</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Fitness Goal:</span>
                <p className="text-xs font-semibold text-zinc-900 mt-0.5">{t.fitnessGoal}</p>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <Link href="/trainer/workouts" className="flex-1">
                  <Button size="sm" variant="outline" className="w-full text-xs font-semibold h-8 gap-1.5">
                    <Dumbbell className="h-3.5 w-3.5" /> Assign Workout
                  </Button>
                </Link>
                <Link href="/trainer/diet" className="flex-1">
                  <Button size="sm" className="w-full bg-black text-white hover:bg-zinc-800 text-xs font-semibold h-8 gap-1.5">
                    <Utensils className="h-3.5 w-3.5" /> Assign Diet
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
