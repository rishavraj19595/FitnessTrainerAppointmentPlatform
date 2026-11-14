"use client";

import React, { useState, useEffect } from "react";
import { Dumbbell, Plus, Trash2, CheckCircle2, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export default function TrainerWorkoutsPage() {
  const [trainees, setTrainees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Workout Form State
  const [selectedTrainee, setSelectedTrainee] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("Monday");
  const [exercises, setExercises] = useState([
    { name: "Barbell Squats", sets: 4, reps: "8-10", weightKg: 70, restSeconds: 90 },
    { name: "Romanian Deadlift", sets: 3, reps: "10-12", weightKg: 60, restSeconds: 60 },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tRes, wRes] = await Promise.all([
        fetch("/api/trainees"),
        fetch("/api/workouts"),
      ]);
      const tData = await tRes.json();
      const wData = await wRes.json();

      setTrainees(tData.trainees || []);
      setTasks(wData.tasks || []);
      if (tData.trainees?.length > 0) {
        setSelectedTrainee(tData.trainees[0].userId);
      }
    } catch (err) {
      toast.error("Failed to load workout data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddExercise = () => {
    setExercises((prev) => [
      ...prev,
      { name: "", sets: 3, reps: "10-12", weightKg: 20, restSeconds: 60 },
    ]);
  };

  const handleRemoveExercise = (index) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExerciseChange = (index, field, value) => {
    setExercises((prev) => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!selectedTrainee || !title) {
      toast.error("Please fill in trainee and routine title.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          traineeId: selectedTrainee,
          title,
          description,
          dayOfWeek,
          exercises,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Workout routine assigned successfully to trainee!");
      setTitle("");
      setDescription("");
      fetchData();
    } catch (err) {
      toast.error(err.message || "Failed to create workout task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
          Workout Task Programmer
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Create and assign periodized gym lifting routines, sets, reps, and instructions for your trainees.
        </p>
      </div>

      {/* Create New Task Form */}
      <Card className="p-6 space-y-5">
        <h2 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-2">
          <Dumbbell className="h-4 w-4 text-black" />
          Assign New Workout Routine
        </h2>

        <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Select Trainee</label>
              <select
                value={selectedTrainee}
                onChange={(e) => setSelectedTrainee(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-black font-semibold"
              >
                {trainees.map((t) => (
                  <option key={t.id} value={t.userId}>
                    {t.name} ({t.fitnessGoal})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">Routine Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Legs & Core Hypertrophy"
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">Schedule Day</label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-black font-semibold"
              >
                <option value="Monday">Monday (Chest & Triceps)</option>
                <option value="Tuesday">Tuesday (Back & Biceps)</option>
                <option value="Wednesday">Wednesday (Legs & Abs)</option>
                <option value="Thursday">Thursday (Shoulders & Arms)</option>
                <option value="Friday">Friday (Full Body Strength)</option>
                <option value="Saturday">Saturday (HIIT & Conditioning)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-zinc-700 mb-1">Coach Instructions</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Focus on full depth on squats. Rest 90 seconds between sets."
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Dynamic Exercises List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-zinc-900 uppercase tracking-wider text-xs">
                  Exercise Prescriptions Table
                </span>
                <p className="text-[11px] text-zinc-500">
                  Specify exercise name, number of sets, target rep range, and barbell/dumbbell weight in kg.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddExercise}
                className="text-xs font-bold h-8 gap-1.5 border-zinc-300 hover:border-black"
              >
                <Plus className="h-3.5 w-3.5" /> Add Exercise Row
              </Button>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-zinc-900 text-white rounded-lg text-[11px] font-bold uppercase tracking-wider items-center">
              <div className="col-span-5">Exercise Name</div>
              <div className="col-span-2 text-center">Sets (Count)</div>
              <div className="col-span-2 text-center">Reps (Range)</div>
              <div className="col-span-2 text-center">Weight (kg)</div>
              <div className="col-span-1 text-center">Delete</div>
            </div>

            {/* Table Rows */}
            <div className="space-y-2">
              {exercises.map((ex, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg items-center text-xs hover:border-zinc-300 transition-all"
                >
                  <div className="col-span-5">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Barbell Bench Press"
                      value={ex.name}
                      onChange={(e) => handleExerciseChange(index, "name", e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-zinc-300 rounded text-xs bg-white font-medium focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        placeholder="Sets"
                        value={ex.sets}
                        onChange={(e) => handleExerciseChange(index, "sets", Number(e.target.value))}
                        className="w-full px-2 py-1.5 border border-zinc-300 rounded text-xs text-center font-bold bg-white focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. 8-10"
                        value={ex.reps}
                        onChange={(e) => handleExerciseChange(index, "reps", e.target.value)}
                        className="w-full px-2 py-1.5 border border-zinc-300 rounded text-xs text-center font-bold bg-white focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        placeholder="Weight (kg)"
                        value={ex.weightKg}
                        onChange={(e) => handleExerciseChange(index, "weightKg", Number(e.target.value))}
                        className="w-full px-2 py-1.5 border border-zinc-300 rounded text-xs text-center font-bold bg-white focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>
                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      title="Remove exercise"
                      onClick={() => handleRemoveExercise(index)}
                      className="text-zinc-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mx-auto" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitting || trainees.length === 0}
            className="bg-black text-white hover:bg-zinc-800 text-xs font-bold h-9 px-6 mt-2"
          >
            {submitting ? "Assigning..." : "Assign Routine to Trainee"}
          </Button>
        </form>
      </Card>

      {/* Assigned Tasks Roster */}
      <Card className="p-6 space-y-4">
        <h2 className="text-sm font-bold text-black uppercase tracking-wider">
          Currently Assigned Routines ({tasks.length})
        </h2>

        {tasks.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-6">No routines created yet.</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((t) => (
              <div key={t.id} className="p-4 border border-zinc-200 rounded-xl bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-black">{t.title}</h3>
                    <p className="text-xs text-zinc-500">
                      Trainee: <strong className="text-black">{t.traineeName}</strong> • Day: {t.dayOfWeek}
                    </p>
                  </div>
                  <Badge variant={t.status === "COMPLETED" ? "success" : "secondary"} className="text-xs">
                    {t.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {t.exercises?.map((ex, i) => (
                    <div key={i} className="p-2 bg-zinc-50 border border-zinc-200 rounded">
                      <p className="font-bold text-zinc-900 truncate">{ex.name}</p>
                      <p className="text-[10px] text-zinc-500">{ex.sets} sets × {ex.reps} • {ex.weightKg}kg</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
