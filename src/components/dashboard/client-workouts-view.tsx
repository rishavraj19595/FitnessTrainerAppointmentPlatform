"use client";

import * as React from "react";
import { Dumbbell, CheckCircle2, Clock, Flame, Calendar, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface ClientWorkoutsViewProps {
  workoutPlans: any[];
}

export function ClientWorkoutsView({ workoutPlans }: ClientWorkoutsViewProps) {
  const [completedExercises, setCompletedExercises] = React.useState<Record<string, boolean>>({});

  const toggleExercise = (id: string) => {
    setCompletedExercises((prev) => {
      const next = !prev[id];
      if (next) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
        toast.success("Set completed! Keep pushing!");
      }
      return { ...prev, [id]: next };
    });
  };

  const getDayName = (dayNum: number) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayNum] || `Day ${dayNum}`;
  };

  if (workoutPlans.length === 0) {
    return (
      <div className="py-20 text-center rounded-2xl border bg-card p-8 space-y-4">
        <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto opacity-40" />
        <h3 className="text-lg font-bold">No assigned workout plans</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Your coach hasn't assigned a customized workout plan yet. Book a session to get your program started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          My Workout Plans & Exercises
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Customized training regimens tailored by your personal trainer.
        </p>
      </div>

      {workoutPlans.map((plan) => {
        // Group exercises by day
        const daysMap: Record<number, any[]> = {};
        plan.exercises?.forEach((ex: any) => {
          if (!daysMap[ex.dayOfWeek]) daysMap[ex.dayOfWeek] = [];
          daysMap[ex.dayOfWeek].push(ex);
        });

        return (
          <div key={plan.id} className="p-6 sm:p-8 rounded-3xl border bg-card shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
              <div>
                <div className="flex items-center space-x-2">
                  <Badge variant="success" className="text-[10px] uppercase font-bold">
                    {plan.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Assigned by Coach {plan.trainer?.name}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {plan.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Target Goal: <span className="font-semibold text-foreground">{plan.targetGoal}</span>
                </p>
              </div>

              <div className="flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <Flame className="h-4 w-4 text-emerald-600" />
                <span>Periodized Split</span>
              </div>
            </div>

            {/* Days list */}
            <div className="space-y-6">
              {Object.entries(daysMap).map(([dayStr, exercises]) => {
                const dayNum = Number(dayStr);
                return (
                  <div key={dayNum} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <h4 className="font-bold text-base text-slate-900 dark:text-white">
                        {getDayName(dayNum)} Routine
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        ({exercises.length} exercises)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {exercises.map((ex: any) => {
                        const isDone = completedExercises[ex.id];
                        return (
                          <div
                            key={ex.id}
                            onClick={() => toggleExercise(ex.id)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                              isDone
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200"
                                : "bg-slate-50/50 dark:bg-slate-900/30 hover:border-slate-300"
                            }`}
                          >
                            <div className="space-y-1 pr-3">
                              <p className={`text-sm font-bold ${isDone ? "line-through opacity-70" : ""}`}>
                                {ex.exerciseName}
                              </p>
                              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                <span className="font-semibold text-foreground">
                                  {ex.sets} Sets × {ex.reps} Reps
                                </span>
                                {ex.weightKg && (
                                  <span>• {ex.weightKg} kg</span>
                                )}
                                <span>• {ex.restSeconds}s Rest</span>
                              </div>
                              {ex.notes && (
                                <p className="text-[11px] text-slate-500 italic mt-1">
                                  Cues: "{ex.notes}"
                                </p>
                              )}
                            </div>

                            <button
                              type="button"
                              className={`h-6 w-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                isDone
                                  ? "bg-emerald-600 border-emerald-600 text-white"
                                  : "border-slate-300 hover:border-emerald-500"
                              }`}
                            >
                              {isDone && <CheckCircle2 className="h-4 w-4" />}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
