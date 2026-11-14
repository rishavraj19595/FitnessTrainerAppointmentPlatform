import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number, default: 4 },
  reps: { type: String, default: "10-12" },
  weightKg: { type: Number, default: 0 },
  durationMinutes: { type: Number, default: 0 },
  restSeconds: { type: Number, default: 60 },
  instructions: { type: String, default: "" },
});

const WorkoutTaskSchema = new mongoose.Schema(
  {
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trainee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    dayOfWeek: {
      type: String,
      default: "Day 1",
    },
    exercises: [ExerciseSchema],
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED"],
      default: "PENDING",
    },
    deadline: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.WorkoutTask ||
  mongoose.model("WorkoutTask", WorkoutTaskSchema);
