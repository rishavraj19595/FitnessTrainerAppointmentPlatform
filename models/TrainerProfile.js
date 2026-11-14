import mongoose from "mongoose";

const TrainerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    headline: {
      type: String,
      default: "Certified Elite Strength & Fitness Coach",
    },
    bio: {
      type: String,
      default: "",
    },
    experienceYears: {
      type: Number,
      default: 5,
    },
    specializations: {
      type: [String],
      default: ["Strength Training", "Fat Loss", "Nutrition"],
    },
    certifications: [
      {
        title: String,
        org: String,
        year: Number,
      },
    ],
    hourlyRate: {
      type: Number,
      default: 2500, // ₹ INR
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    reviewCount: {
      type: Number,
      default: 12,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    verificationStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "APPROVED",
    },
    location: {
      type: String,
      default: "Mumbai / Bengaluru (IST)",
    },
    languages: {
      type: [String],
      default: ["English", "Hindi"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.TrainerProfile ||
  mongoose.model("TrainerProfile", TrainerProfileSchema);
