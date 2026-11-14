"use client";

import React, { useState, useEffect } from "react";
import { Dumbbell, Plus, X, CheckCircle2, Layers, IndianRupee, Clock, Calendar } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatINR } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminWorkoutPlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // New workout plan form state
  const [formData, setFormData] = useState({
    title: "",
    category: "Muscle Building",
    description: "",
    durationWeeks: 8,
    sessionCount: 16,
    difficulty: "Intermediate",
    price: 11999,
    benefitsText: "1-on-1 Dedicated Trainer Coaching\nPersonalized Nutrition & Diet Plan\nWeekly Body Composition Assessment\nWhatsApp Accountability & Form Check",
  });

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin?type=plans");
      const data = await res.json();
      setPlans(data.plans || []);
    } catch (err) {
      toast.error("Failed to load workout packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error("Please provide both Plan Title and Description.");
      return;
    }

    try {
      setCreating(true);
      const benefits = formData.benefitsText
        .split("\n")
        .map((b) => b.trim())
        .filter((b) => b.length > 0);

      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createWorkoutPlan",
          title: formData.title,
          category: formData.category,
          description: formData.description,
          durationWeeks: Number(formData.durationWeeks) || 8,
          sessionCount: Number(formData.sessionCount) || 16,
          difficulty: formData.difficulty,
          price: Number(formData.price) || 9999,
          benefits,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(`Workout plan '${formData.title}' created and published!`);
      setIsModalOpen(false);
      setFormData({
        title: "",
        category: "Muscle Building",
        description: "",
        durationWeeks: 8,
        sessionCount: 16,
        difficulty: "Intermediate",
        price: 11999,
        benefitsText: "1-on-1 Dedicated Trainer Coaching\nPersonalized Nutrition & Diet Plan\nWeekly Body Composition Assessment\nWhatsApp Accountability & Form Check",
      });
      fetchPlans();
    } catch (err) {
      toast.error(err.message || "Failed to create workout plan");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Workout Packages & Pricing
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Configure multi-week training tiers, pricing in ₹ INR, and platform session allotments.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white hover:bg-zinc-800 text-xs font-bold gap-2 h-9 shadow-sm"
        >
          <Plus className="h-4 w-4" /> Create New Workout Plan
        </Button>
      </div>

      {/* Grid of Plans */}
      {loading ? (
        <p className="text-xs text-zinc-500 text-center py-12">Loading workout packages...</p>
      ) : plans.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <Dumbbell className="h-8 w-8 text-zinc-400 mx-auto" />
          <h3 className="font-bold text-sm text-black">No Workout Packages Found</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Create your first workout plan to allow trainees to book training packages.
          </p>
          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white text-xs font-bold"
          >
            Create Plan
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p) => (
            <Card
              key={p.id}
              className="p-5 flex flex-col justify-between space-y-4 hover:border-black transition-all bg-white border border-zinc-200 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                    {p.category}
                  </Badge>
                  <Badge variant="success" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                    Active
                  </Badge>
                </div>

                <div>
                  <h3 className="font-bold text-base text-black tracking-tight">{p.title}</h3>
                  <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center justify-between text-xs font-semibold text-zinc-700">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                    {p.durationWeeks} Weeks
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-zinc-400" />
                    {p.sessionCount} Sessions
                  </span>
                </div>

                <ul className="space-y-1.5 text-xs text-zinc-600 pt-1">
                  {p.benefits?.slice(0, 4).map((b, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-[11px] leading-tight">
                      <CheckCircle2 className="h-3.5 w-3.5 text-black shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Package Price</p>
                  <p className="text-lg font-black text-black tracking-tight">{formatINR(p.price)}</p>
                </div>
                <Badge variant="outline" className="text-[10px] font-bold">
                  {p.difficulty}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create New Workout Plan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-zinc-200 shadow-2xl p-6 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-black text-white rounded-lg flex items-center justify-center">
                  <Dumbbell className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-black">Create Workout Plan & Package</h3>
                  <p className="text-xs text-zinc-500">Define package duration, sessions, price in ₹ INR, and deliverables.</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-black rounded-lg hover:bg-zinc-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-4 text-xs">
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Plan Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lean Muscle Hypertrophy Program"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg bg-white font-medium focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      <option value="Muscle Building">Muscle Building</option>
                      <option value="Weight Loss">Weight Loss / Fat Loss</option>
                      <option value="Strength Training">Strength Training</option>
                      <option value="Personal Training">1-on-1 Personal Training</option>
                      <option value="Beginner Fitness">Beginner Fitness Starter</option>
                      <option value="Advanced Fitness">Advanced Athletic Fitness</option>
                      <option value="Customized Workout Plan">Customized Transformation Plan</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Plan Description *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Comprehensive periodized progressive overload program focusing on aesthetic muscle building..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Duration (Weeks)</label>
                    <input
                      type="number"
                      min="1"
                      max="52"
                      required
                      value={formData.durationWeeks}
                      onChange={(e) => setFormData({ ...formData, durationWeeks: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Total Sessions</label>
                    <input
                      type="number"
                      min="1"
                      max="200"
                      required
                      value={formData.sessionCount}
                      onChange={(e) => setFormData({ ...formData, sessionCount: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Difficulty</label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg bg-white font-medium focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Price (₹ INR)</label>
                    <input
                      type="number"
                      min="499"
                      step="500"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg font-bold focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">
                    Key Deliverables & Benefits (1 per line)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="16 1-on-1 Personalized Coaching Sessions&#10;Custom Progressive Overload Logbook&#10;High-Protein Indian Diet Chart included&#10;Weekly Form Check & Mobility Drills"
                    value={formData.benefitsText}
                    onChange={(e) => setFormData({ ...formData, benefitsText: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <p className="text-[10px] text-zinc-400 mt-1">
                    Enter each package benefit on a separate line to display with checkmarks.
                  </p>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-zinc-200 flex items-center justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={creating}
                  className="bg-black text-white hover:bg-zinc-800 text-xs font-bold h-9 px-5 shadow-sm"
                >
                  {creating ? "Publishing..." : "Publish Workout Plan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
