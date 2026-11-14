"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Star,
  ShieldCheck,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { PaymentModal } from "@/components/forms/PaymentModal";
import { formatINR } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function TraineeTrainersPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");

  // Booking Modal State
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [bookingDate, setBookingDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [selectedSlot, setSelectedSlot] = useState("07:00 AM");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Razorpay Checkout Modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);

  const availableSlots = [
    "06:00 AM",
    "07:00 AM",
    "08:00 AM",
    "09:00 AM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
  ];

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (search) query.set("search", search);
      if (specialization) query.set("specialization", specialization);
      query.set("verifiedOnly", "true");

      const res = await fetch(`/api/trainers?${query.toString()}`);
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
  }, [specialization]);

  const handleOpenBooking = (trainer) => {
    if (!session) {
      toast.info("Please sign in or join to book a personal training consultation.");
      router.push("/login?redirect=/trainee/trainers");
      return;
    }
    setSelectedTrainer(trainer);
  };

  const handleProceedToPayment = async () => {
    if (!selectedTrainer) return;

    setSubmitting(true);
    try {
      // 1. Initialize Razorpay order on server
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainerId: selectedTrainer.userId,
          amount: selectedTrainer.hourlyRate,
          type: "CONSULTATION",
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || "Failed to create order");
      }

      setPendingOrder({
        orderId: orderData.orderId,
        amount: orderData.amount,
        title: `1-on-1 Session with ${selectedTrainer.name}`,
      });

      // Open Razorpay test surface
      setPaymentModalOpen(true);
    } catch (err) {
      toast.error(err.message || "Failed to initiate payment");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = async ({ orderId, paymentId, signature }) => {
    try {
      // 2. Confirm booking on server with payment records
      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainerId: selectedTrainer.userId,
          date: bookingDate,
          startTime: selectedSlot,
          endTime: "08:00 AM",
          amount: selectedTrainer.hourlyRate,
          clientNotes: notes,
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
        }),
      });

      const bookingData = await bookingRes.json();
      if (!bookingRes.ok) {
        throw new Error(bookingData.error || "Failed to confirm booking");
      }

      toast.success(
        `Appointment booked successfully with ${selectedTrainer.name}!`
      );
      setSelectedTrainer(null);
      router.push("/trainee/bookings");
    } catch (err) {
      toast.error(err.message || "Booking creation failed");
      throw err;
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
          Find & Book Verified Trainers
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Browse certified Indian fitness coaches, review credentials, and reserve training slots.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-zinc-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchTrainers()}
            placeholder="Search coach by name or specialization..."
            className="w-full text-xs pl-9 pr-3 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white"
          />
        </div>

        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="text-xs px-3 py-2.5 border border-zinc-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-black font-semibold text-zinc-700"
        >
          <option value="">All Specializations</option>
          <option value="Strength Training">Strength Training</option>
          <option value="Fat Loss">Fat Loss</option>
          <option value="Muscle Hypertrophy">Muscle Hypertrophy</option>
          <option value="Olympic Weightlifting">Olympic Weightlifting</option>
          <option value="Yoga & Mobility">Yoga & Mobility</option>
          <option value="Clinical Nutrition">Clinical Nutrition</option>
        </select>

        <Button onClick={fetchTrainers} className="text-xs font-bold h-10 px-5">
          Search
        </Button>
      </div>

      {/* Trainers Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-zinc-500">
          Loading certified trainers...
        </div>
      ) : trainers.length === 0 ? (
        <div className="py-16 text-center text-xs text-zinc-500 bg-white border border-zinc-200 rounded-2xl">
          No coaches found matching your criteria. Try resetting the filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers.map((trainer) => (
            <Card
              key={trainer.id}
              className="flex flex-col justify-between hover:border-black transition-all p-5"
            >
              <div className="space-y-4">
                <div className="relative h-52 w-full rounded-xl overflow-hidden bg-zinc-100">
                  <img
                    src={trainer.avatar}
                    alt={trainer.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {trainer.rating} ({trainer.reviewCount})
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-base text-zinc-900">
                      {trainer.name}
                    </h3>
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">
                    {trainer.headline}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    {trainer.location} • {trainer.experienceYears} Years Exp.
                  </p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {trainer.specializations?.map((spec, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-zinc-100 text-[10px] font-semibold text-zinc-700"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {trainer.certifications?.length > 0 && (
                  <div className="p-2 bg-zinc-50 border border-zinc-200 rounded-lg text-[10px] text-zinc-600">
                    <span className="font-bold text-black">Certification: </span>
                    {trainer.certifications[0]?.title} ({trainer.certifications[0]?.org})
                  </div>
                )}
              </div>

              <div className="pt-5 border-t border-zinc-100 mt-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold">Session Fee</p>
                  <p className="text-lg font-black text-black">
                    {formatINR(trainer.hourlyRate)}
                  </p>
                </div>
                <Button
                  onClick={() => handleOpenBooking(trainer)}
                  className="bg-black text-white hover:bg-zinc-800 text-xs font-bold h-9 px-4 gap-1.5"
                >
                  <Calendar className="h-3.5 w-3.5" /> Book Session
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Booking Form Modal */}
      {selectedTrainer && (
        <Modal
          isOpen={!!selectedTrainer && !paymentModalOpen}
          onClose={() => setSelectedTrainer(null)}
          title={`Book 1-on-1 Session with ${selectedTrainer.name}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            {/* Trainer Snapshot */}
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-black">{selectedTrainer.name}</p>
                <p className="text-[11px] text-zinc-500">{selectedTrainer.location}</p>
              </div>
              <p className="font-black text-base text-black">
                {formatINR(selectedTrainer.hourlyRate)}
              </p>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block font-bold text-zinc-700 mb-1">
                Select Date (IST)
              </label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white"
              />
            </div>

            {/* Slot Selection */}
            <div>
              <label className="block font-bold text-zinc-700 mb-1">
                Select Available Time Slot (IST)
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-2 text-center rounded-lg border font-semibold transition-all ${selectedSlot === slot
                      ? "bg-black text-white border-black"
                      : "bg-white text-zinc-800 border-zinc-200 hover:border-black"
                      }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block font-bold text-zinc-700 mb-1">
                Notes for Coach (Goals / Injuries / Questions)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Focus on squat form check; mild shoulder stiffness."
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Pricing breakdown */}
            <div className="p-3 bg-zinc-100 rounded-lg space-y-1 text-zinc-700">
              <div className="flex justify-between">
                <span>Coaching Session Fee (1 hour):</span>
                <span className="font-semibold">{formatINR(selectedTrainer.hourlyRate)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Booking Guarantee:</span>
                <span className="font-semibold text-emerald-700">Included</span>
              </div>
              <div className="pt-2 border-t border-zinc-200 flex justify-between font-black text-black text-sm">
                <span>Total Payable (INR):</span>
                <span>{formatINR(selectedTrainer.hourlyRate)}</span>
              </div>
            </div>

            <Button
              onClick={handleProceedToPayment}
              disabled={submitting}
              className="w-full h-10 bg-black text-white hover:bg-zinc-800 font-bold text-xs"
            >
              {submitting ? "Preparing Razorpay Order..." : "Proceed to Razorpay Checkout"}
            </Button>
          </div>
        </Modal>
      )}

      {/* Razorpay Simulated Test Modal */}
      {pendingOrder && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          amount={pendingOrder.amount}
          itemTitle={pendingOrder.title}
          orderId={pendingOrder.orderId}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
