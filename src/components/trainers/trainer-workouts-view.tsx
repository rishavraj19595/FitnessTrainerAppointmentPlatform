"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Dumbbell,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  Sparkles,
  User,
} from "lucide-react";
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

interface TrainerWorkoutsViewProps {
  workoutPlans: any[];
  clients: any[];
}

interface ExerciseItem {
  dayOfWeek: number;
  exerciseName: string;
  sets: number;
  reps: number;
  weightKg?: number;
  restSeconds: number;
  notes?: string;
}

export function TrainerWorkoutsView({
  workoutPlans,
  clients,
}: TrainerWorkoutsViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedClientId = searchParams.get("clientId") || "";

  const [modalOpen, setModalOpen] = React.useState(Boolean(preselectedClientId));
  const [submitting, setSubmitting] = React.useState(false);

  // Form states
  const [clientId, setClientId] = React.useState(preselectedClientId || clients[0]?.id || "");
  const [title, setTitle] = React.useState("8-Week Hypertrophy & Athletic Power Protocol");
  const [description, setDescription] = React.useState("Customized 4-day training split emphasizing progressive overload.");
  const [targetGoal, setTargetGoal] = React.useState("Increase muscle definition & squat / deadlift strength");

  const [exercises, setExercises] = React.useState<ExerciseItem[]>([
    {
      dayOfWeek: 1,
      exerciseName: "Barbell Bench Press",
      sets: 4,
      reps: 8,
      weightKg: 80,
      restSeconds: 90,
      notes: "Focus on leg drive and scapular retraction.",
    },
    {
      dayOfWeek: 1,
      exerciseName: "Incline Dumbbell Press",
      sets: 3,
      reps: 10,
      weightKg: 28,
      restSeconds: 60,
      notes: "Control the eccentric.",
    },
    {
      dayOfWeek: 2,
      exerciseName: "Barbell Back Squat",
      sets: 4,
      reps: 6,
      weightKg: 100,
      restSeconds: 120,
      notes: "Full depth below parallel.",
    },
  ]);

  const addExercise = () => {
    setExercises((prev) => [
      ...prev,
      {
        dayOfWeek: 1,
        exerciseName: "",
        sets: 3,
        reps: 10,
        weightKg: 20,
        restSeconds: 60,
        notes: "",
      },
    ]);
  };

  const removeExercise = (index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: keyof ExerciseItem, val: any) => {
    setExercises((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      toast.error("Please select a client");
      return;
    }
    if (exercises.length === 0) {
      toast.error("Please include at least one exercise");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          title,
          description,
          targetGoal,
          exercises,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create workout plan");
      }

      toast.success("Workout plan created and assigned to client!");
      setModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to save workout plan");
    } finally {
      setSubmitting(false);
    }
  };

  const getDayLabel = (d: number) => {
    const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return names[d] || `Day ${d}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Client Workout Plans
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Build periodized workout routines with sets, reps, and cues assigned to clients.
          </p>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="font-bold shadow-md shadow-emerald-600/20"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Create Routine
        </Button>
      </div>

      {workoutPlans.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border bg-card p-8 space-y-4">
          <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto opacity-40" />
          <h3 className="text-lg font-bold">No workout routines created</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Design personalized routines for your clients to view and complete in their dashboards.
          </p>
          <Button onClick={() => setModalOpen(true)}>Create Workout Plan</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {workoutPlans.map((plan) => (
            <div
              key={plan.id}
              className="p-6 sm:p-8 rounded-3xl border bg-card shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="success" className="text-[10px] uppercase font-bold">
                      {plan.status}
                    </Badge>
                    <span className="text-xs font-semibold text-emerald-600">
                      Assigned to: {plan.client?.name}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                    {plan.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Goal: {plan.targetGoal}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {plan.exercises?.map((ex: any) => (
                  <div
                    key={ex.id}
                    className="p-3.5 rounded-xl border bg-slate-50/50 dark:bg-slate-900/30 text-xs space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <strong className="text-foreground">{ex.exerciseName}</strong>
                      <Badge variant="outline" className="text-[9px]">
                        {getDayLabel(ex.dayOfWeek)}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">
                      {ex.sets} Sets × {ex.reps} Reps {ex.weightKg ? `@ ${ex.weightKg}kg` : ""} ({ex.restSeconds}s rest)
                    </p>
                    {ex.notes && (
                      <p className="text-[11px] text-slate-500 italic">
                        "{ex.notes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Routine Builder Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              Build Client Workout Plan
            </DialogTitle>
            <DialogDescription>
              Assign customized workout routines with exercise sets, reps, and coaching cues.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreatePlan} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="clientSelect">Select Client *</Label>
                <select
                  id="clientSelect"
                  required
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {clients.length === 0 ? (
                    <option value="">No clients found</option>
                  ) : (
                    clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.email})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="routineTitle">Routine Title *</Label>
                <Input
                  id="routineTitle"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 12-Week Lean Hypertrophy"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="routineGoal">Target Milestone Goal *</Label>
              <Input
                id="routineGoal"
                required
                value={targetGoal}
                onChange={(e) => setTargetGoal(e.target.value)}
                placeholder="e.g. Master deadlift 140kg & drop 3kg body fat"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="routineDesc">Protocol Overview</Label>
              <textarea
                id="routineDesc"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Upper/lower 4-day split..."
                className="w-full p-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Prescribed Exercises Builder */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Prescribed Exercises ({exercises.length})
                </h4>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addExercise}
                  className="text-xs"
                >
                  <Plus className="mr-1 h-3.5 w-3.5" /> Add Exercise
                </Button>
              </div>

              <div className="space-y-3">
                {exercises.map((ex, index) => (
                  <div
                    key={index}
                    className="p-3.5 rounded-2xl border bg-slate-50 dark:bg-slate-900/40 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Exercise #{index + 1}
                      </span>
                      {exercises.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExercise(index)}
                          className="text-rose-500 p-1 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                      <div className="sm:col-span-2">
                        <Input
                          placeholder="Exercise Name (e.g. Barbell Squat)"
                          required
                          value={ex.exerciseName}
                          onChange={(e) =>
                            updateExercise(index, "exerciseName", e.target.value)
                          }
                          className="h-9 text-xs"
                        />
                      </div>
                      <div>
                        <select
                          value={ex.dayOfWeek}
                          onChange={(e) =>
                            updateExercise(index, "dayOfWeek", Number(e.target.value))
                          }
                          className="w-full h-9 px-2 rounded-lg border bg-background text-xs"
                        >
                          <option value={1}>Monday</option>
                          <option value={2}>Tuesday</option>
                          <option value={3}>Wednesday</option>
                          <option value={4}>Thursday</option>
                          <option value={5}>Friday</option>
                          <option value={6}>Saturday</option>
                          <option value={0}>Sunday</option>
                        </select>
                      </div>
                      <div className="flex gap-1.5">
                        <Input
                          type="number"
                          placeholder="Sets"
                          min={1}
                          value={ex.sets}
                          onChange={(e) =>
                            updateExercise(index, "sets", Number(e.target.value))
                          }
                          className="h-9 text-xs w-16"
                        />
                        <Input
                          type="number"
                          placeholder="Reps"
                          min={1}
                          value={ex.reps}
                          onChange={(e) =>
                            updateExercise(index, "reps", Number(e.target.value))
                          }
                          className="h-9 text-xs w-16"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Weight (kg)"
                        value={ex.weightKg || ""}
                        onChange={(e) =>
                          updateExercise(index, "weightKg", Number(e.target.value))
                        }
                        className="h-9 text-xs"
                      />
                      <Input
                        placeholder="Coaching Cues (e.g. Chest up, pause at bottom)"
                        value={ex.notes || ""}
                        onChange={(e) => updateExercise(index, "notes", e.target.value)}
                        className="h-9 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-11 font-bold shadow-md shadow-emerald-600/20"
            >
              {submitting ? "Assigning Routine..." : "Assign Routine to Client"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
