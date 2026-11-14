"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle, Award, UserPlus, X, Dumbbell } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatINR } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminTrainersPage() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // New trainer form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "Password123!",
    avatar: "",
    headline: "ACE Certified Elite Strength & Conditioning Coach",
    bio: "Specializing in progressive overload, functional movement biomechanics, and aesthetic physique transformations.",
    experienceYears: 6,
    hourlyRate: 2500,
    specializationsText: "Strength Training, Muscle Hypertrophy, Functional Fitness, Injury Prevention",
    certificationsText: "ACE Certified Personal Trainer, K11 Master Trainer, CSCS",
    location: "Connaught Place, New Delhi (IST)",
    languagesText: "English, Hindi, Punjabi",
    verificationStatus: "APPROVED",
  });

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/trainers");
      const data = await res.json();
      setTrainers(data.trainers || []);
    } catch (err) {
      toast.error("Failed to load trainers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const handleVerify = async (trainerProfileId, status) => {
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verifyTrainer",
          trainerProfileId,
          status,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(
        status === "APPROVED"
          ? "Trainer verified & approved for public booking!"
          : "Trainer verification updated."
      );
      fetchTrainers();
    } catch (err) {
      toast.error(err.message || "Verification update failed");
    }
  };

  const handleCreateTrainer = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Name and Email are required.");
      return;
    }

    try {
      setCreating(true);

      const specializations = formData.specializationsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const languages = formData.languagesText
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createTrainer",
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          avatar: formData.avatar,
          headline: formData.headline,
          bio: formData.bio,
          experienceYears: Number(formData.experienceYears) || 4,
          hourlyRate: Number(formData.hourlyRate) || 2000,
          specializations,
          certifications: formData.certificationsText,
          location: formData.location,
          languages,
          isVerified: formData.verificationStatus === "APPROVED",
          verificationStatus: formData.verificationStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(`Coach ${formData.name} successfully registered and verified!`);
      setIsModalOpen(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "Password123!",
        avatar: "",
        headline: "ACE Certified Elite Strength & Conditioning Coach",
        bio: "Specializing in progressive overload, functional movement biomechanics, and aesthetic physique transformations.",
        experienceYears: 6,
        hourlyRate: 2500,
        specializationsText: "Strength Training, Muscle Hypertrophy, Functional Fitness, Injury Prevention",
        certificationsText: "ACE Certified Personal Trainer, K11 Master Trainer, CSCS",
        location: "Connaught Place, New Delhi (IST)",
        languagesText: "English, Hindi, Punjabi",
        verificationStatus: "APPROVED",
      });
      fetchTrainers();
    } catch (err) {
      toast.error(err.message || "Failed to onboard trainer");
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
            Trainer Verification & Accreditation
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Review credentials, onboard certified fitness coaches, and approve trainers for public trainee booking.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white hover:bg-zinc-800 text-xs font-bold gap-2 h-9 shadow-sm"
        >
          <UserPlus className="h-4 w-4" /> Add New Trainer
        </Button>
      </div>

      <Card className="p-6 space-y-4">
        <h2 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-2">
          <Award className="h-4 w-4 text-black" />
          Registered Trainers ({trainers.length})
        </h2>

        {loading ? (
          <p className="text-xs text-zinc-500 text-center py-8">Loading trainer data...</p>
        ) : trainers.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-8">No trainers registered yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-zinc-50 text-zinc-500 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">Coach</th>
                  <th className="py-3 px-4">Specialization</th>
                  <th className="py-3 px-4">Experience</th>
                  <th className="py-3 px-4">Rate (₹/hr)</th>
                  <th className="py-3 px-4 text-center">Verification</th>
                  <th className="py-3 px-4 text-center">Admin Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y text-zinc-700">
                {trainers.map((t) => {
                  const isApproved = t.verificationStatus === "APPROVED";
                  const isPending = t.verificationStatus === "PENDING";

                  return (
                    <tr key={t.id} className="hover:bg-zinc-50/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={t.avatar || "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format&fit=crop&q=80"}
                            alt={t.name}
                            className="h-9 w-9 rounded-full object-cover border border-zinc-200"
                          />
                          <div>
                            <p className="font-bold text-black flex items-center gap-1">
                              {t.name}
                              {isApproved && (
                                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                              )}
                            </p>
                            <p className="text-[11px] text-zinc-500">{t.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {t.specializations?.slice(0, 2).map((s, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded bg-zinc-100 text-[9px] font-semibold text-zinc-700"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-semibold text-zinc-800">
                        {t.experienceYears} Years
                      </td>

                      <td className="py-3 px-4 font-black text-black">
                        {formatINR(t.hourlyRate)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <Badge
                          variant={
                            isApproved
                              ? "success"
                              : isPending
                              ? "warning"
                              : "danger"
                          }
                          className="text-[10px] font-bold"
                        >
                          {t.verificationStatus}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          {isPending ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleVerify(t.id, "APPROVED")}
                                className="bg-black text-white hover:bg-zinc-800 text-[10px] font-bold h-7 px-3"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleVerify(t.id, "REJECTED")}
                                className="border-red-300 text-red-600 hover:bg-red-50 text-[10px] font-bold h-7 px-2"
                              >
                                Reject
                              </Button>
                            </>
                          ) : isApproved ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleVerify(t.id, "PENDING")}
                              className="text-[10px] text-zinc-500 hover:text-black h-7"
                            >
                              Revoke
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleVerify(t.id, "APPROVED")}
                              className="bg-black text-white text-[10px] h-7"
                            >
                              Re-Approve
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add New Trainer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-zinc-200 shadow-2xl p-6 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-black text-white rounded-lg flex items-center justify-center">
                  <UserPlus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-black">Onboard & Register Certified Coach</h3>
                  <p className="text-xs text-zinc-500">Add coach credentials, certifications, hourly rates in ₹ INR, and accreditation.</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-black rounded-lg hover:bg-zinc-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTrainer} className="space-y-4 text-xs">
              {/* Personal Info */}
              <div className="space-y-3">
                <p className="font-bold text-zinc-900 uppercase tracking-wider text-[11px] border-b pb-1">
                  1. Coach Account Credentials
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Coach Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Karan Mehra"
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
                      placeholder="e.g. karan@fitpulse.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Mobile Phone (India)</label>
                    <input
                      type="text"
                      placeholder="e.g. +91 98111 22334"
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

              {/* Professional Credentials */}
              <div className="space-y-3 pt-2">
                <p className="font-bold text-zinc-900 uppercase tracking-wider text-[11px] border-b pb-1">
                  2. Coaching Accreditation & Rates
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Experience (Years)</label>
                    <input
                      type="number"
                      min="1"
                      max="40"
                      value={formData.experienceYears}
                      onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Hourly Consultation Rate (₹)</label>
                    <input
                      type="number"
                      min="500"
                      step="100"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg font-bold focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Initial Status</label>
                    <select
                      value={formData.verificationStatus}
                      onChange={(e) => setFormData({ ...formData, verificationStatus: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg bg-white font-bold text-emerald-700 focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      <option value="APPROVED">APPROVED (Immediately Bookable)</option>
                      <option value="PENDING">PENDING (Review Required)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Professional Headline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ACE Certified Elite Strength & Functional Training Specialist"
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Specializations (comma separated)</label>
                    <input
                      type="text"
                      placeholder="Strength Training, Hypertrophy, Mobility"
                      value={formData.specializationsText}
                      onChange={(e) => setFormData({ ...formData, specializationsText: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Certifications (comma separated)</label>
                    <input
                      type="text"
                      placeholder="ACE CPT, K11 Master Trainer, CSCS"
                      value={formData.certificationsText}
                      onChange={(e) => setFormData({ ...formData, certificationsText: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Gym Location / City (IST)</label>
                    <input
                      type="text"
                      placeholder="e.g. Connaught Place, New Delhi (IST)"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Languages Spoken</label>
                    <input
                      type="text"
                      placeholder="English, Hindi, Punjabi"
                      value={formData.languagesText}
                      onChange={(e) => setFormData({ ...formData, languagesText: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Coaching Bio & Methodology</label>
                  <textarea
                    rows={2}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
                  />
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
                  {creating ? "Onboarding..." : "Register & Verify Trainer"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
