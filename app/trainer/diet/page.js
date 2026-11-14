"use client";

import React, { useState, useEffect } from "react";
import { Utensils, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { toast } from "sonner";

export default function TrainerDietPage() {
  const [trainees, setTrainees] = useState([]);
  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedTrainee, setSelectedTrainee] = useState("");
  const [title, setTitle] = useState("High Protein Indian Gym Plan");
  const [dailyCalories, setDailyCalories] = useState(2400);
  const [targetProtein, setTargetProtein] = useState(150);
  const [targetCarbs, setTargetCarbs] = useState(250);
  const [targetFats, setTargetFats] = useState(65);
  const [waterIntakeLiters, setWaterIntakeLiters] = useState(4.0);
  const [instructions, setInstructions] = useState(
    "Drink 500ml water upon waking. Consume post-workout Whey protein within 45 mins. No sugary beverages."
  );

  const [meals, setMeals] = useState([
    {
      mealType: "BREAKFAST",
      timing: "08:00 AM",
      items: "120g Low-fat Paneer bhurji + 2 Multigrain Rotis + Green Tea",
      calories: 480,
      proteinGrams: 32,
    },
    {
      mealType: "LUNCH",
      timing: "01:30 PM",
      items: "1.5 cups Thick Moong Dal + 1 cup Brown Rice + Curd & Cucumber Salad",
      calories: 620,
      proteinGrams: 30,
    },
    {
      mealType: "DINNER",
      timing: "08:30 PM",
      items: "100g Soya chunks curry / Tofu + 2 Jowar Rotis + Steamed veggies",
      calories: 520,
      proteinGrams: 38,
    },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tRes, dRes] = await Promise.all([
        fetch("/api/trainees"),
        fetch("/api/diet"),
      ]);
      const tData = await tRes.json();
      const dData = await dRes.json();

      setTrainees(tData.trainees || []);
      setCharts(dData.charts || []);
      if (tData.trainees?.length > 0) {
        setSelectedTrainee(tData.trainees[0].userId);
      }
    } catch (err) {
      toast.error("Failed to load diet plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddMeal = () => {
    setMeals((prev) => [
      ...prev,
      {
        mealType: "EVENING_SNACK",
        timing: "05:00 PM",
        items: "50g Roasted Chana + 1 Banana (Pre-workout)",
        calories: 250,
        proteinGrams: 12,
      },
    ]);
  };

  const handleRemoveMeal = (index) => {
    setMeals((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMealChange = (index, field, value) => {
    setMeals((prev) => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  const handleCreateDiet = async (e) => {
    e.preventDefault();
    if (!selectedTrainee || !title) {
      toast.error("Please fill in trainee and title.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/diet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          traineeId: selectedTrainee,
          title,
          dailyCalories,
          targetProtein,
          targetCarbs,
          targetFats,
          waterIntakeLiters,
          instructions,
          meals,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Diet chart published and assigned to trainee!");
      fetchData();
    } catch (err) {
      toast.error(err.message || "Failed to create diet chart");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
          Indian Diet Chart Management
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Create and assign personalized nutrition schedules with Indian food staples and macro breakdowns.
        </p>
      </div>

      {/* Diet Creation Card */}
      <Card className="p-6 space-y-4">
        <h2 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-2">
          <Utensils className="h-4 w-4 text-black" />
          Publish Custom Diet Chart
        </h2>

        <form onSubmit={handleCreateDiet} className="space-y-4 text-xs">
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
                    {t.name} ({t.dietaryPreference})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-zinc-700 mb-1">Diet Chart Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Vegetarian High Protein Lean Mass Protocol"
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          {/* Macro Targets */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
            <div>
              <label className="block font-bold text-zinc-600 text-[10px] uppercase">Calories (kcal)</label>
              <input
                type="number"
                value={dailyCalories}
                onChange={(e) => setDailyCalories(Number(e.target.value))}
                className="w-full px-2 py-1.5 border border-zinc-300 rounded mt-1 text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-zinc-600 text-[10px] uppercase">Protein (g)</label>
              <input
                type="number"
                value={targetProtein}
                onChange={(e) => setTargetProtein(Number(e.target.value))}
                className="w-full px-2 py-1.5 border border-zinc-300 rounded mt-1 text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-zinc-600 text-[10px] uppercase">Carbs (g)</label>
              <input
                type="number"
                value={targetCarbs}
                onChange={(e) => setTargetCarbs(Number(e.target.value))}
                className="w-full px-2 py-1.5 border border-zinc-300 rounded mt-1 text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-zinc-600 text-[10px] uppercase">Fats (g)</label>
              <input
                type="number"
                value={targetFats}
                onChange={(e) => setTargetFats(Number(e.target.value))}
                className="w-full px-2 py-1.5 border border-zinc-300 rounded mt-1 text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-zinc-600 text-[10px] uppercase">Water (L)</label>
              <input
                type="number"
                step="0.5"
                value={waterIntakeLiters}
                onChange={(e) => setWaterIntakeLiters(Number(e.target.value))}
                className="w-full px-2 py-1.5 border border-zinc-300 rounded mt-1 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-zinc-700 mb-1">Coach Notes & Water Directives</label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Meals List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-zinc-900 uppercase tracking-wider text-xs">
                  Daily Meals Schedule Table
                </span>
                <p className="text-[11px] text-zinc-500">
                  Configure breakfast, lunch, snacks, and dinner with calories and protein values.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddMeal}
                className="text-xs font-bold h-8 gap-1.5 border-zinc-300 hover:border-black"
              >
                <Plus className="h-3.5 w-3.5" /> Add Meal Row
              </Button>
            </div>

            {/* Table Header Row */}
            <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-zinc-900 text-white rounded-lg text-[11px] font-bold uppercase tracking-wider items-center">
              <div className="col-span-2">Meal Type</div>
              <div className="col-span-2">Time (IST)</div>
              <div className="col-span-4">Food Items & Portions</div>
              <div className="col-span-2 text-center">Calories (kcal)</div>
              <div className="col-span-1 text-center">Protein (g)</div>
              <div className="col-span-1 text-center">Delete</div>
            </div>

            {/* Table Body Rows */}
            <div className="space-y-2">
              {meals.map((meal, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg items-center text-xs hover:border-zinc-300 transition-all"
                >
                  <div className="col-span-2">
                    <select
                      value={meal.mealType}
                      onChange={(e) => handleMealChange(index, "mealType", e.target.value)}
                      className="w-full px-2 py-1.5 border border-zinc-300 rounded text-xs font-bold bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      <option value="BREAKFAST">BREAKFAST</option>
                      <option value="MID_MORNING">MID-MORNING</option>
                      <option value="LUNCH">LUNCH</option>
                      <option value="EVENING_SNACK">EVENING SNACK</option>
                      <option value="DINNER">DINNER</option>
                      <option value="POST_WORKOUT">POST WORKOUT</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="e.g. 08:30 AM"
                      value={meal.timing}
                      onChange={(e) => handleMealChange(index, "timing", e.target.value)}
                      className="w-full px-2 py-1.5 border border-zinc-300 rounded text-xs bg-white font-medium focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div className="col-span-4">
                    <input
                      type="text"
                      placeholder="e.g. 120g Paneer / Soya + 2 Multigrain Rotis"
                      value={meal.items}
                      onChange={(e) => handleMealChange(index, "items", e.target.value)}
                      className="w-full px-2 py-1.5 border border-zinc-300 rounded text-xs bg-white font-medium focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        placeholder="Calories"
                        value={meal.calories}
                        onChange={(e) => handleMealChange(index, "calories", Number(e.target.value))}
                        className="w-full px-2 py-1.5 border border-zinc-300 rounded text-xs text-center font-bold bg-white focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        placeholder="Protein"
                        value={meal.proteinGrams}
                        onChange={(e) => handleMealChange(index, "proteinGrams", Number(e.target.value))}
                        className="w-full px-1.5 py-1.5 border border-zinc-300 rounded text-xs text-center font-bold bg-white focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>
                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      title="Remove meal"
                      onClick={() => handleRemoveMeal(index)}
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
            {submitting ? "Publishing..." : "Assign Diet Chart to Trainee"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
