"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/utils";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainer: {
    id: string;
    userId: string;
    name: string;
    consultationPrice: number;
    availabilities?: {
      dayOfWeek: number;
      startTime: string;
      endTime: string;
    }[];
  };
  packagePurchase?: {
    id: string;
    title: string;
    remainingSessions: number;
  } | null;
}

export function BookingModal({
  isOpen,
  onClose,
  trainer,
  packagePurchase,
}: BookingModalProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const [selectedDate, setSelectedDate] = React.useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });

  const [selectedSlot, setSelectedSlot] = React.useState<string>("10:00");
  const [clientNotes, setClientNotes] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  // Available hourly slots for demonstration
  const availableSlots = [
    "09:00",
    "10:00",
    "11:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const handleBooking = async () => {
    if (!session) {
      toast.error("Please log in to book an appointment");
      router.push("/login?redirect=" + window.location.pathname);
      return;
    }

    setIsSubmitting(true);
    try {
      // Calculate end time (+1 hour)
      const [startHour, startMin] = selectedSlot.split(":").map(Number);
      const endHour = (startHour + 1).toString().padStart(2, "0");
      const endTime = `${endHour}:${startMin.toString().padStart(2, "0")}`;

      const sessionType = packagePurchase ? "PACKAGE_SESSION" : "CONSULTATION";
      const amount = packagePurchase ? 0 : trainer.consultationPrice;

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainerId: trainer.userId,
          packagePurchaseId: packagePurchase?.id || null,
          date: selectedDate,
          startTime: selectedSlot,
          endTime,
          sessionType,
          clientNotes,
          amount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to confirm appointment");
      }

      toast.success(
        "Appointment booked successfully! Trainer will be notified."
      );
      onClose();
      router.push("/dashboard/bookings");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to book appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-emerald-600" />
            <span>Book Training Session</span>
          </DialogTitle>
          <DialogDescription>
            Booking with coach{" "}
            <span className="font-semibold text-foreground">
              {trainer.name}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {packagePurchase ? (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                Using Active Package:
              </span>{" "}
              {packagePurchase.title}
              <p className="text-slate-500 mt-0.5">
                Remaining sessions: {packagePurchase.remainingSessions}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm">
              <span className="text-muted-foreground">Consultation Fee</span>
              <span className="font-extrabold text-emerald-600">
                {formatPrice(trainer.consultationPrice)}
              </span>
            </div>
          )}

          {/* Date Picker */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
              Select Session Date
            </label>
            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Time Slot Picker */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
              Select Time Slot (1-Hour Duration)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((slot) => {
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                        : "border-input bg-card hover:bg-slate-50 dark:hover:bg-slate-800 text-foreground"
                    }`}
                  >
                    <Clock className="h-3 w-3" />
                    <span>{slot}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Goals or Notes for Trainer (Optional)
            </label>
            <textarea
              rows={2}
              value={clientNotes}
              onChange={(e) => setClientNotes(e.target.value)}
              placeholder="e.g. Focus on squat form, lower back soreness, etc."
              className="w-full p-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Confirmation button */}
          <Button
            onClick={handleBooking}
            disabled={isSubmitting}
            className="w-full h-12 font-bold shadow-md shadow-emerald-600/20"
          >
            {isSubmitting ? (
              "Confirming..."
            ) : packagePurchase ? (
              "Confirm & Deduct 1 Session"
            ) : (
              `Confirm Booking (${formatPrice(trainer.consultationPrice)})`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
