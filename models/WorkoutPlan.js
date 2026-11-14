import mongoose from "mongoose";

const WorkoutPlanSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Weight Loss",
        "Muscle Building",
        "Strength Training",
        "Personal Training",
        "Beginner Fitness",
        "Advanced Fitness",
        "Customized Plan",
      ],
      default: "Personal Training",
    },
    durationWeeks: {
      type: Number,
      default: 8,
    },
    sessionCount: {
      type: Number,
      default: 16,
    },
    price: {
      type: Number,
      required: true, // ₹ INR
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Intermediate",
    },
    benefits: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.WorkoutPlan ||
  mongoose.model("WorkoutPlan", WorkoutPlanSchema);
