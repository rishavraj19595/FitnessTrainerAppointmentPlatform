import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { dbService } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { UserCheck, ShieldCheck } from "lucide-react";

export const revalidate = 0;

export default async function TraineeProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login?redirect=/trainee/profile");
  }

  const trainee = await dbService.getTraineeByUserId(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
          Trainee Fitness Profile
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Your personal physical measurements, goals, and dietary guidelines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <Card className="p-6 text-center space-y-4">
          <img
            src={session.user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"}
            alt={session.user.name}
            className="h-24 w-24 rounded-full object-cover mx-auto border-2 border-black"
          />
          <div>
            <h2 className="font-black text-lg text-black">{session.user.name}</h2>
            <p className="text-xs text-zinc-500">{session.user.email}</p>
            <Badge variant="secondary" className="mt-2 text-[10px] uppercase">
              Trainee Member
            </Badge>
          </div>
        </Card>

        {/* Physical Metrics Card */}
        <Card className="md:col-span-2 p-6 space-y-4">
          <h3 className="font-bold text-sm text-black uppercase tracking-wider pb-2 border-b border-zinc-100">
            Physical & Dietary Parameters
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <p className="text-zinc-500 font-semibold uppercase text-[10px]">Current Weight</p>
              <p className="text-base font-black text-black mt-0.5">{trainee?.weightKg || 78} kg</p>
            </div>
            <div>
              <p className="text-zinc-500 font-semibold uppercase text-[10px]">Target Weight</p>
              <p className="text-base font-black text-black mt-0.5">{trainee?.targetWeightKg || 72} kg</p>
            </div>
            <div>
              <p className="text-zinc-500 font-semibold uppercase text-[10px]">Height</p>
              <p className="text-base font-black text-black mt-0.5">{trainee?.heightCm || 175} cm</p>
            </div>
            <div>
              <p className="text-zinc-500 font-semibold uppercase text-[10px]">Fitness Goal</p>
              <p className="text-sm font-bold text-black mt-0.5">{trainee?.fitnessGoal || "Fat Loss & Muscle"}</p>
            </div>
            <div>
              <p className="text-zinc-500 font-semibold uppercase text-[10px]">Dietary Preference</p>
              <p className="text-sm font-bold text-black mt-0.5">{trainee?.dietaryPreference || "Vegetarian"}</p>
            </div>
            <div>
              <p className="text-zinc-500 font-semibold uppercase text-[10px]">Experience Level</p>
              <p className="text-sm font-bold text-black mt-0.5">{trainee?.trainingExperience || "Intermediate"}</p>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100 space-y-1">
            <p className="text-[10px] font-bold text-zinc-500 uppercase">
              Medical & Physical Considerations:
            </p>
            <p className="text-xs text-zinc-700 bg-zinc-50 border border-zinc-200 rounded p-2.5">
              {trainee?.medicalConsiderations || "None reported. Cleared for high-intensity lifting."}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
