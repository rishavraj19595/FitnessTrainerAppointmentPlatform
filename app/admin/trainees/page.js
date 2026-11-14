"use client";

import React, { useState, useEffect } from "react";
import { Users, UserPlus, X, ShieldAlert, CheckCircle2, Dumbbell, UserCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export default function AdminTraineesPage() {
  const [trainees, setTrainees] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // New trainee form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "Password123!",
    age: 26,
    gender: "Male",
    heightCm: 175,
    weightKg: 78,
    targetWeightKg: 72,
    fitnessGoal: "Fat Loss & Lean Muscle",
    dietaryPreference: "Vegetarian",
    trainingExperience: "Intermediate",
    medicalConsiderations: "None",
    assignedTrainerId: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [trRes, tRes] = await Promise.all([
        fetch("/api/trainees"),
        fetch("/api/trainers"),
      ]);
      const trData = await trRes.json();
      const tData = await tRes.json();

      setTrainees(trData.trainees || []);
      setTrainers(tData.trainers || []);
    } catch (err) {
      toast.error("Failed to load trainee management data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignTrainer = async (traineeId, trainerId) => {
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "assignTrainee",
          traineeId,
          trainerId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Trainer successfully assigned to trainee!");
      fetchData();
    } catch (err) {
      toast.error(err.message || "Failed to assign trainer");
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const isCurrentlyActive = currentStatus !== "suspended";
    const nextStatus = isCurrentlyActive ? "suspended" : "active";

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateUserStatus",
          userId,
          status: nextStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (nextStatus === "suspended") {
        toast.warning("Trainee account has been SUSPENDED. Access revoked.");
      } else {
        toast.success("Trainee account REACTIVATED. Full access restored.");
      }
      fetchData();
    } catch (err) {
      toast.error(err.message || "Failed to update user status");
    }
  };

  const handleCreateTrainee = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Name and Email are required.");
      return;
    }

    try {
      setCreating(true);
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createTrainee",
          ...formData,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(`Trainee ${formData.name} successfully registered and onboarded!`);
      setIsModalOpen(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "Password123!",
        age: 26,
        gender: "Male",
        heightCm: 175,
        weightKg: 78,
        targetWeightKg: 72,
        fitnessGoal: "Fat Loss & Lean Muscle",
        dietaryPreference: "Vegetarian",
        trainingExperience: "Intermediate",
        medicalConsiderations: "None",
        assignedTrainerId: "",
      });
      fetchData();
    } catch (err) {
      toast.error(err.message || "Failed to create trainee account");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Trainee & Assignment Management
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Review registered gym members, suspend or reactivate access, and onboard new trainees.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white hover:bg-zinc-800 text-xs font-bold gap-2 h-9 shadow-sm"
        >
          <UserPlus className="h-4 w-4" /> Add New Trainee
        </Button>
      </div>

      {/* Trainees Roster Table */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
          <h2 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-2">
            <Users className="h-4 w-4 text-black" />
            Registered Trainees Roster ({trainees.length})
          </h2>
        </div>

        {loading ? (
          <p className="text-xs text-zinc-500 text-center py-8">Loading trainee data...</p>
        ) : trainees.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-8">No trainees registered yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-zinc-50 text-zinc-500 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">Trainee</th>
                  <th className="py-3 px-4">Goal & Diet</th>
                  <th className="py-3 px-4">Assigned Coach</th>
                  <th className="py-3 px-4">Reassign Coach</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Attendance</th>
                  <th className="py-3 px-4 text-center">Account Action</th>
                </tr>
              </thead>
              <tbody className="divide-y text-zinc-700">
                {trainees.map((t) => {
                  const isSuspended = t.status === "suspended";
                  return (
                    <tr key={t.id || t.userId} className="hover:bg-zinc-50/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={t.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80"}
                            alt={t.name}
                            className="h-8 w-8 rounded-full object-cover border border-zinc-200"
                          />
                          <div>
                            <p className="font-bold text-black flex items-center gap-1.5">
                              {t.name}
                            </p>
                            <p className="text-[11px] text-zinc-500">{t.email}</p>
                            {t.phone && <p className="text-[10px] text-zinc-400">{t.phone}</p>}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-semibold text-black">{t.fitnessGoal}</p>
                        <p className="text-[11px] text-zinc-500">
                          {t.dietaryPreference} • {t.weightKg}kg (Goal: {t.targetWeightKg || t.weightKg}kg)
                        </p>
                      </td>

                      <td className="py-3 px-4 font-bold text-black">
                        {t.trainerName}
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={t.assignedTrainerId || ""}
                          onChange={(e) => handleAssignTrainer(t.userId, e.target.value)}
                          className="px-2 py-1 border border-zinc-300 rounded bg-white text-[11px] font-semibold text-zinc-800 focus:outline-none focus:ring-1 focus:ring-black"
                        >
                          <option value="">Choose Coach...</option>
                          {trainers.map((tr) => (
                            <option key={tr.id} value={tr.userId}>
                              {tr.name} ({tr.specializations?.[0] || "Coach"})
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3 px-4 text-center">
                        {isSuspended ? (
                          <Badge variant="outline" className="border-red-300 bg-red-50 text-red-700 font-bold text-[10px]">
                            SUSPENDED
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                            ACTIVE
                          </Badge>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <Badge variant="secondary" className="text-[10px] font-bold">
                          {t.attendanceRate || 0}%
                        </Badge>
                      </td>

                      <td className="py-3 px-4 text-center">
                        {isSuspended ? (
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(t.userId, t.status)}
                            className="text-[11px] font-bold px-3 py-1 rounded border border-emerald-600 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors shadow-sm"
                          >
                            Reactivate
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(t.userId, t.status)}
                            className="text-[11px] font-bold px-3 py-1 rounded border border-red-300 text-red-600 bg-red-50/50 hover:bg-red-50 transition-colors shadow-sm"
                          >
                            Suspend
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add New Trainee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-zinc-200 shadow-2xl p-6 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-black text-white rounded-lg flex items-center justify-center">
                  <UserPlus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-black">Onboard New Gym Trainee</h3>
                  <p className="text-xs text-zinc-500">Register gym member credentials, body metrics, and assigned coach.</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-black rounded-lg hover:bg-zinc-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTrainee} className="space-y-4 text-xs">
              {/* Personal Info */}
              <div className="space-y-3">
                <p className="font-bold text-zinc-900 uppercase tracking-wider text-[11px] border-b pb-1">
                  1. Personal & Contact Credentials
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rohan Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rohan.sharma@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Mobile Phone (India)</label>
                    <input
                      type="text"
                      placeholder="e.g. +91 98200 12345"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Initial Password</label>
                    <input
                      type="text"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>
              </div>

              {/* Physical Metrics */}
              <div className="space-y-3 pt-2">
                <p className="font-bold text-zinc-900 uppercase tracking-wider text-[11px] border-b pb-1">
                  2. Physical Metrics & Health Profile
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Age</label>
                    <input
                      type="number"
                      min="14"
                      max="85"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg bg-white font-medium focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Height (cm)</label>
                    <input
                      type="number"
                      min="100"
                      max="240"
                      value={formData.heightCm}
                      onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Current Weight (kg)</label>
                    <input
                      type="number"
                      min="30"
                      max="250"
                      value={formData.weightKg}
                      onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>
              </div>

              {/* Fitness & Diet Goals */}
              <div className="space-y-3 pt-2">
                <p className="font-bold text-zinc-900 uppercase tracking-wider text-[11px] border-b pb-1">
                  3. Fitness Objectives & Coach Assignment
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Primary Fitness Goal</label>
                    <select
                      value={formData.fitnessGoal}
                      onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg bg-white font-medium focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      <option value="Fat Loss & Lean Muscle">Fat Loss & Lean Muscle</option>
                      <option value="Muscle Hypertrophy">Muscle Hypertrophy</option>
                      <option value="Strength Training">Strength Training</option>
                      <option value="General Fitness">General Fitness</option>
                      <option value="PCOS / Metabolic Health">PCOS / Metabolic Health</option>
                      <option value="Athletic Conditioning">Athletic Conditioning</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Dietary Preference</label>
                    <select
                      value={formData.dietaryPreference}
                      onChange={(e) => setFormData({ ...formData, dietaryPreference: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg bg-white font-medium focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Non-Vegetarian">Non-Vegetarian</option>
                      <option value="Eggetarian">Eggetarian</option>
                      <option value="Vegan">Vegan</option>
                      <option value="Jain">Jain</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Assign Personal Coach</label>
                    <select
                      value={formData.assignedTrainerId}
                      onChange={(e) => setFormData({ ...formData, assignedTrainerId: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg bg-white font-medium focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      <option value="">No Coach (Unassigned)</option>
                      {trainers.map((tr) => (
                        <option key={tr.id} value={tr.userId}>
                          {tr.name} ({tr.specializations?.[0] || "Coach"})
                        </option>
                      ))}
                    </select>
                  </div>
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
                  {creating ? "Registering..." : "Onboard Trainee Account"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
