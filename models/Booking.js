import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    trainee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workoutPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkoutPlan",
      default: null,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true, // e.g. "07:00 AM IST"
    },
    endTime: {
      type: String,
      required: true, // e.g. "08:00 AM IST"
    },
    sessionType: {
      type: String,
      enum: ["CONSULTATION", "PACKAGE_SESSION"],
      default: "CONSULTATION",
    },
    status: {
      type: String,
      enum: ["CONFIRMED", "COMPLETED", "CANCELLED", "RESCHEDULED"],
      default: "CONFIRMED",
    },
    amount: {
      type: Number,
      default: 0, // ₹ INR
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
    clientNotes: {
      type: String,
      default: "",
    },
    trainerNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
