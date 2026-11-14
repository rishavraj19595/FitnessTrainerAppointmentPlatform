import mongoose from "mongoose";

const TimeSlotSchema = new mongoose.Schema({
  startTime: { type: String, required: true }, // e.g. "06:00 AM"
  endTime: { type: String, required: true },   // e.g. "07:00 AM"
  isBooked: { type: Boolean, default: false },
});

const TrainerAvailabilitySchema = new mongoose.Schema(
  {
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dayOfWeek: {
      type: Number,
      min: 0,
      max: 6,
      required: true,
    },
    slots: [TimeSlotSchema],
    blockedDates: {
      type: [Date],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.TrainerAvailability ||
  mongoose.model("TrainerAvailability", TrainerAvailabilitySchema);
