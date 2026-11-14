import mongoose from "mongoose";

const MealSchema = new mongoose.Schema({
  mealType: {
    type: String,
    enum: [
      "BREAKFAST",
      "MID_MORNING",
      "LUNCH",
      "EVENING_SNACK",
      "DINNER",
      "POST_WORKOUT",
    ],
    required: true,
  },
  timing: {
    type: String,
    required: true, // e.g. "08:30 AM IST"
  },
  items: {
    type: String,
    required: true, // e.g. "4 Boiled Egg Whites / 150g Paneer + Rolled Oats with Chia seeds"
  },
  calories: {
    type: Number,
    default: 450,
  },
  proteinGrams: {
    type: Number,
    default: 30,
  },
});

const DietChartSchema = new mongoose.Schema(
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
      default: "High Protein Indian Gym Nutrition Plan",
    },
    dailyCalories: {
      type: Number,
      default: 2300,
    },
    targetProtein: {
      type: Number,
      default: 140, // grams
    },
    targetCarbs: {
      type: Number,
      default: 240, // grams
    },
    targetFats: {
      type: Number,
      default: 60, // grams
    },
    waterIntakeLiters: {
      type: Number,
      default: 3.5,
    },
    instructions: {
      type: String,
      default:
        "Drink at least 3.5L water daily. Avoid refined sugars and processed seed oils. Prioritize sleep.",
    },
    meals: [MealSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.DietChart ||
  mongoose.model("DietChart", DietChartSchema);
