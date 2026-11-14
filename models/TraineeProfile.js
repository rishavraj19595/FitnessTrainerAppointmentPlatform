import mongoose from "mongoose";

const TraineeProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    assignedTrainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    age: {
      type: Number,
      default: 26,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Prefer not to say"],
      default: "Male",
    },
    heightCm: {
      type: Number,
      default: 175,
    },
    weightKg: {
      type: Number,
      default: 78,
    },
    targetWeightKg: {
      type: Number,
      default: 72,
    },
    fitnessGoal: {
      type: String,
      default: "Fat Loss & Lean Muscle",
    },
    activityLevel: {
      type: String,
      default: "Moderately Active",
    },
    dietaryPreference: {
      type: String,
      enum: ["Vegetarian", "Non-Vegetarian", "Eggetarian", "Vegan", "Jain"],
      default: "Vegetarian",
    },
    medicalConsiderations: {
      type: String,
      default: "None reported",
    },
    trainingExperience: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Intermediate",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.TraineeProfile ||
  mongoose.model("TraineeProfile", TraineeProfileSchema);
