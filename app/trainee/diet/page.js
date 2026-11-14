import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { dbService } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Utensils, Droplets, Moon, Apple, ShieldCheck } from "lucide-react";

export const revalidate = 0;

export default async function TraineeDietPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login?redirect=/trainee/diet");
  }

  const dietCharts = await dbService.getDietCharts({ traineeId: session.user.id });
  const activeDiet = dietCharts[0] || null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
          Personalized Indian Diet Chart
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Daily nutrition schedule, macro targets, and meal timings assigned by your coach.
        </p>
      </div>

      {!activeDiet ? (
        <Card className="text-center py-16 space-y-3">
          <Utensils className="h-10 w-10 text-zinc-400 mx-auto" />
          <p className="text-sm font-semibold text-zinc-700">No diet chart assigned yet</p>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Your personal trainer will configure your tailored vegetarian, eggetarian, or non-veg meal plan here.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Macro Targets Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="text-center">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Daily Calories
              </p>
              <p className="text-2xl font-black text-black mt-1">
                {activeDiet.dailyCalories} <span className="text-xs font-normal">kcal</span>
              </p>
            </Card>

            <Card className="text-center">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Target Protein
              </p>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                {activeDiet.targetProtein} <span className="text-xs font-normal">grams</span>
              </p>
            </Card>

            <Card className="text-center">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Carbohydrates
              </p>
              <p className="text-2xl font-black text-black mt-1">
                {activeDiet.targetCarbs} <span className="text-xs font-normal">grams</span>
              </p>
            </Card>

            <Card className="text-center">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Healthy Fats
              </p>
              <p className="text-2xl font-black text-black mt-1">
                {activeDiet.targetFats} <span className="text-xs font-normal">grams</span>
              </p>
            </Card>
          </div>

          {/* Coach Guidelines & Water Intake */}
          <Card className="p-4 bg-zinc-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs uppercase tracking-wider text-zinc-400">
                  Coach Nutrition Directives
                </span>
                <Badge variant="secondary" className="bg-zinc-800 text-white text-[10px] border-zinc-700">
                  Assigned by {activeDiet.trainerName}
                </Badge>
              </div>
              <p className="text-xs text-zinc-300 italic">
                "{activeDiet.instructions}"
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 bg-zinc-800 px-3 py-2 rounded-lg text-xs font-semibold">
              <Droplets className="h-4 w-4 text-cyan-400" />
              <span>Target Hydration: {activeDiet.waterIntakeLiters || 3.5}L / day</span>
            </div>
          </Card>

          {/* Meals Timeline */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-black uppercase tracking-wider">
              Daily Meal Schedule & Food Choices
            </h2>

            <div className="space-y-3">
              {activeDiet.meals?.map((meal, index) => (
                <Card
                  key={index}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-black transition-all"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-black text-xs uppercase bg-black text-white px-2 py-0.5 rounded">
                        {meal.mealType.replace("_", " ")}
                      </span>
                      <span className="text-xs font-bold text-zinc-500">
                        {meal.timing}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-zinc-900">
                      {meal.items}
                    </p>
                  </div>

                  <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-100 gap-1">
                    <span className="text-xs font-black text-black">
                      {meal.calories} kcal
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {meal.proteinGrams}g Protein
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
