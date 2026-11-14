"use client";

import React, { useState, useEffect } from "react";
import { Dumbbell, CheckCircle2, Clock, Calendar, CheckSquare, Square } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export default function TraineeWorkoutsPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/workouts");
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (err) {
      toast.error("Failed to load workout tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggleTask = async (taskId) => {
    try {
      const res = await fetch("/api/workouts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(
        data.task.status === "COMPLETED"
          ? "Workout marked completed! Great job!"
          : "Task status reverted to pending."
      );

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? data.task : t))
      );
    } catch (err) {
      toast.error(err.message || "Failed to update task");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Assigned Workout Routines
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Complete the assigned exercises, sets, and repetitions provided by your certified trainer.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-xs text-zinc-500">
          Loading assigned routines...
        </div>
      ) : tasks.length === 0 ? (
        <Card className="text-center py-16 space-y-3">
          <Dumbbell className="h-10 w-10 text-zinc-400 mx-auto" />
          <p className="text-sm font-semibold text-zinc-700">No workout tasks assigned yet</p>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Your assigned coach will upload your periodized lifting and conditioning schedule here.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {tasks.map((task) => {
            const isCompleted = task.status === "COMPLETED";

            return (
              <Card
                key={task.id}
                className={`p-6 border transition-all ${
                  isCompleted ? "border-emerald-200 bg-emerald-50/20" : "border-zinc-200 bg-white"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-base text-black">{task.title}</span>
                      <Badge variant={isCompleted ? "success" : "secondary"}>
                        {isCompleted ? "Completed" : "Pending"}
                      </Badge>
                    </div>
                    <p className="text-xs text-zinc-600">
                      Assigned by <span className="font-bold text-black">{task.trainerName}</span> • Schedule: <span className="font-semibold text-black">{task.dayOfWeek}</span>
                    </p>
                    {task.description && (
                      <p className="text-xs text-zinc-500 italic mt-0.5">
                        "{task.description}"
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={() => handleToggleTask(task.id)}
                    variant={isCompleted ? "outline" : "default"}
                    size="sm"
                    className="text-xs font-bold gap-1.5 h-9"
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        Completed (Undo)
                      </>
                    ) : (
                      <>
                        <Square className="h-4 w-4" />
                        Mark Routine Complete
                      </>
                    )}
                  </Button>
                </div>

                {/* Exercise Grid */}
                <div className="pt-4 space-y-3">
                  <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    Exercise Protocol:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {task.exercises?.map((ex, i) => (
                      <div
                        key={i}
                        className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-zinc-900">{ex.name}</span>
                          <span className="text-[10px] font-bold bg-white px-2 py-0.5 border rounded text-zinc-700">
                            {ex.sets} Sets × {ex.reps}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                          <span>Target Load: <strong className="text-black">{ex.weightKg ? `${ex.weightKg} kg` : "Bodyweight"}</strong></span>
                          <span>Rest: <strong className="text-black">{ex.restSeconds || 60}s</strong></span>
                        </div>
                        {ex.instructions && (
                          <p className="text-[10px] text-zinc-500 pt-0.5">
                            Tip: {ex.instructions}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
