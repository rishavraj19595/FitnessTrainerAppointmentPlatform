import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import connectToDatabase from "./mongodb";
import User from "@/models/User";
import TrainerProfile from "@/models/TrainerProfile";
import TraineeProfile from "@/models/TraineeProfile";
import WorkoutPlan from "@/models/WorkoutPlan";
import Booking from "@/models/Booking";
import Attendance from "@/models/Attendance";
import WorkoutTask from "@/models/WorkoutTask";
import DietChart from "@/models/DietChart";
import Payment from "@/models/Payment";
import TrainerAvailability from "@/models/TrainerAvailability";
import Notification from "@/models/Notification";

const isServerless = Boolean(
  process.env.NETLIFY ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.VERCEL
);
const DB_DIR = isServerless ? "/tmp" : process.cwd();
const DB_FILE = path.join(DB_DIR, ".fitpulse_mongo.json");

let memoryDb = null;

// Helper to seed initial high-quality Indian gym dataset
function getInitialData() {
  const salt = bcrypt.genSaltSync(10);
  const hashPass = (pw) => bcrypt.hashSync(pw, salt);

  const defaultPasswordHash = hashPass("Password123!");

  return {
    users: [
      {
        id: "usr-admin-1",
        name: "Devendra Singhal (Admin)",
        email: "admin@fitpulse.in",
        password: defaultPasswordHash,
        role: "admin",
        phone: "+91 98765 43210",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
        status: "active",
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr-trainer-1",
        name: "Vikram Malhotra",
        email: "vikram@fitpulse.in",
        password: defaultPasswordHash,
        role: "trainer",
        phone: "+91 98201 12345",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
        status: "active",
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr-trainer-2",
        name: "Ananya Sen",
        email: "ananya@fitpulse.in",
        password: defaultPasswordHash,
        role: "trainer",
        phone: "+91 98450 67890",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
        status: "active",
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr-trainer-3",
        name: "Rohit Sharma",
        email: "rohit@fitpulse.in",
        password: defaultPasswordHash,
        role: "trainer",
        phone: "+91 98111 22334",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
        status: "active",
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr-trainer-4",
        name: "Priya Nair",
        email: "priya@fitpulse.in",
        password: defaultPasswordHash,
        role: "trainer",
        phone: "+91 98480 99887",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
        status: "active",
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr-trainee-1",
        name: "Rahul Verma",
        email: "rahul@gmail.com",
        password: defaultPasswordHash,
        role: "trainee",
        phone: "+91 99887 76655",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
        status: "active",
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr-trainee-2",
        name: "Sneha Patel",
        email: "sneha@gmail.com",
        password: defaultPasswordHash,
        role: "trainee",
        phone: "+91 98777 66554",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
        status: "active",
        createdAt: new Date().toISOString(),
      },
    ],

    trainerProfiles: [
      {
        id: "tp-1",
        userId: "usr-trainer-1",
        headline: "CSCS & K11 Certified Elite Strength & Bodybuilding Coach",
        bio: "Former national physique athlete with 8+ years experience coaching executives, athletes, and beginners across Mumbai. Specializing in progressive overload and hypertrophy.",
        experienceYears: 8,
        specializations: ["Strength Training", "Muscle Hypertrophy", "Injury Prevention", "Powerlifting"],
        certifications: [
          { title: "Certified Strength & Conditioning Specialist (CSCS)", org: "NSCA", year: 2018 },
          { title: "Master Personal Trainer", org: "K11 School of Fitness Sciences", year: 2017 },
        ],
        hourlyRate: 2500,
        rating: 4.95,
        reviewCount: 48,
        isVerified: true,
        verificationStatus: "APPROVED",
        location: "Bandra, Mumbai (IST)",
        languages: ["English", "Hindi", "Marathi"],
      },
      {
        id: "tp-2",
        userId: "usr-trainer-2",
        headline: "ACE Certified Clinical Nutritionist & Women's Fat Loss Coach",
        bio: "Specializing in scientific fat loss, hormonal balance, PCOS/PCOD fitness management, and sustainable Indian dietary transformations without crash dieting.",
        experienceYears: 6,
        specializations: ["Fat Loss", "PCOS & Hormonal Health", "Clinical Nutrition", "HIIT & Cardio"],
        certifications: [
          { title: "Certified Personal Trainer", org: "American Council on Exercise (ACE)", year: 2019 },
          { title: "Certified Sports Nutritionist", org: "Precision Nutrition", year: 2020 },
        ],
        hourlyRate: 2200,
        rating: 4.91,
        reviewCount: 36,
        isVerified: true,
        verificationStatus: "APPROVED",
        location: "Indiranagar, Bengaluru (IST)",
        languages: ["English", "Hindi", "Bengali"],
      },
      {
        id: "tp-3",
        userId: "usr-trainer-3",
        headline: "NASM CPT & Olympic Weightlifting Performance Coach",
        bio: "Specializes in explosive power, athletic conditioning, kettlebell training, and mobility for runners and sports enthusiasts.",
        experienceYears: 7,
        specializations: ["Olympic Weightlifting", "Functional Fitness", "Speed & Agility", "Kettlebell"],
        certifications: [
          { title: "CPT & Performance Enhancement Specialist", org: "NASM", year: 2018 },
        ],
        hourlyRate: 2800,
        rating: 4.88,
        reviewCount: 29,
        isVerified: true,
        verificationStatus: "APPROVED",
        location: "Cyber City, Gurugram (IST)",
        languages: ["English", "Hindi", "Punjabi"],
      },
      {
        id: "tp-4",
        userId: "usr-trainer-4",
        headline: "Yoga Alliance RYT-500 & Mobility Specialist",
        bio: "Integrating modern biomechanics with traditional Ashtanga and Hatha yoga to enhance athletic recovery, core stability, and mental focus.",
        experienceYears: 5,
        specializations: ["Yoga & Mobility", "Core Conditioning", "Breathwork & Meditation", "Pilates"],
        certifications: [
          { title: "RYT-500 Registered Yoga Teacher", org: "Yoga Alliance", year: 2020 },
        ],
        hourlyRate: 1800,
        rating: 4.85,
        reviewCount: 22,
        isVerified: false,
        verificationStatus: "PENDING",
        location: "Jubilee Hills, Hyderabad (IST)",
        languages: ["English", "Hindi", "Telugu"],
      },
    ],

    traineeProfiles: [
      {
        id: "trp-1",
        userId: "usr-trainee-1",
        assignedTrainerId: "usr-trainer-1",
        age: 28,
        gender: "Male",
        heightCm: 178,
        weightKg: 78.5,
        targetWeightKg: 72,
        fitnessGoal: "Fat Loss & Lean Muscle",
        activityLevel: "Moderately Active",
        dietaryPreference: "Vegetarian",
        medicalConsiderations: "Mild lower back stiffness from sitting long hours at desk.",
        trainingExperience: "Intermediate",
      },
      {
        id: "trp-2",
        userId: "usr-trainee-2",
        assignedTrainerId: "usr-trainer-2",
        age: 25,
        gender: "Female",
        heightCm: 162,
        weightKg: 64,
        targetWeightKg: 56,
        fitnessGoal: "Fat Loss & Core Strength",
        activityLevel: "Lightly Active",
        dietaryPreference: "Eggetarian",
        medicalConsiderations: "None reported",
        trainingExperience: "Beginner",
      },
    ],

    workoutPlans: [
      {
        id: "plan-1",
        title: "Lean Muscle Hypertrophy Program",
        description: "Comprehensive 8-week periodized progressive overload program focusing on aesthetic muscle building and joint longevity.",
        category: "Muscle Building",
        durationWeeks: 8,
        sessionCount: 16,
        price: 11999, // ₹ INR
        difficulty: "Intermediate",
        benefits: [
          "16 1-on-1 Personalized Coaching Sessions",
          "Custom Progressive Overload Logbook",
          "High-Protein Indian Diet Chart included",
          "Weekly Form Check & Mobility Drills",
        ],
        isActive: true,
      },
      {
        id: "plan-2",
        title: "Metabolic Fat Loss Accelerator",
        description: "High-intensity calorie-burning protocol combining compound lifts, metabolic conditioning, and structured nutrition for rapid fat reduction.",
        category: "Weight Loss",
        durationWeeks: 12,
        sessionCount: 24,
        price: 15999, // ₹ INR
        difficulty: "Beginner",
        benefits: [
          "24 Scheduled Personal Training Sessions",
          "Dedicated Calorie & Macro Tracking Chart",
          "Cardio & Steps Target Guidance",
          "24/7 WhatsApp Coach Accountability",
        ],
        isActive: true,
      },
      {
        id: "plan-3",
        title: "Beginner Gym Starter & Foundation",
        description: "Master barbell, dumbbell, and machine biomechanics safely with certified coaches. Zero prior gym experience required.",
        category: "Beginner Fitness",
        durationWeeks: 4,
        sessionCount: 8,
        price: 6499, // ₹ INR
        difficulty: "Beginner",
        benefits: [
          "8 Foundation Gym Technique Sessions",
          "Injury-Prevention Lifting Drills",
          "Beginner Nutrition & Hydration Plan",
        ],
        isActive: true,
      },
      {
        id: "plan-4",
        title: "Elite Personal Strength & Conditioning",
        description: "1-on-1 private coaching designed for serious fitness enthusiasts seeking personal bests in squat, bench, deadlift, and stamina.",
        category: "Personal Training",
        durationWeeks: 16,
        sessionCount: 32,
        price: 24999, // ₹ INR
        difficulty: "Advanced",
        benefits: [
          "32 Private One-on-One Sessions",
          "Advanced Periodized Strength Programming",
          "Full Body Composition & InBody Analytics",
          "VIP Slot Priority",
        ],
        isActive: true,
      },
    ],

    bookings: [
      {
        id: "bk-1",
        traineeId: "usr-trainee-1",
        trainerId: "usr-trainer-1",
        workoutPlanId: "plan-1",
        date: new Date(Date.now() + 86400000).toISOString(),
        startTime: "07:00 AM",
        endTime: "08:00 AM",
        sessionType: "PACKAGE_SESSION",
        status: "CONFIRMED",
        amount: 2500,
        paymentId: "pay-1",
        clientNotes: "Focusing on Barbell Flat Bench form check.",
        trainerNotes: "Ready with warm-up mobility drills for rotator cuffs.",
        createdAt: new Date().toISOString(),
      },
      {
        id: "bk-2",
        traineeId: "usr-trainee-1",
        trainerId: "usr-trainer-1",
        workoutPlanId: "plan-1",
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        startTime: "07:00 AM",
        endTime: "08:00 AM",
        sessionType: "PACKAGE_SESSION",
        status: "COMPLETED",
        amount: 2500,
        paymentId: "pay-1",
        clientNotes: "Leg day squat session.",
        trainerNotes: "Hit 80kg x 8 reps cleanly. Solid form.",
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: "bk-3",
        traineeId: "usr-trainee-2",
        trainerId: "usr-trainer-2",
        workoutPlanId: "plan-2",
        date: new Date(Date.now() + 86400000 * 2).toISOString(),
        startTime: "08:30 AM",
        endTime: "09:30 AM",
        sessionType: "CONSULTATION",
        status: "CONFIRMED",
        amount: 2200,
        paymentId: "pay-2",
        clientNotes: "Consultation regarding PCOS weight loss plateau.",
        trainerNotes: "Prepared Indian vegetarian hormonal meal guide.",
        createdAt: new Date().toISOString(),
      },
    ],

    attendance: [
      {
        id: "att-1",
        bookingId: "bk-2",
        trainerId: "usr-trainer-1",
        traineeId: "usr-trainee-1",
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: "PRESENT",
        notes: "Completed full 60 min session on time. Excellent energy.",
        markedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: "att-2",
        bookingId: null,
        trainerId: "usr-trainer-1",
        traineeId: "usr-trainee-1",
        date: new Date(Date.now() - 86400000 * 5).toISOString(),
        status: "PRESENT",
        notes: "Back & Biceps workout completed.",
        markedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        id: "att-3",
        bookingId: null,
        trainerId: "usr-trainer-1",
        traineeId: "usr-trainee-1",
        date: new Date(Date.now() - 86400000 * 7).toISOString(),
        status: "PRESENT",
        notes: "Chest & Shoulders session completed.",
        markedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      },
      {
        id: "att-4",
        bookingId: null,
        trainerId: "usr-trainer-1",
        traineeId: "usr-trainee-1",
        date: new Date(Date.now() - 86400000 * 9).toISOString(),
        status: "ABSENT",
        notes: "Trainee informed about work travel to Pune.",
        markedAt: new Date(Date.now() - 86400000 * 9).toISOString(),
      },
    ],

    workoutTasks: [
      {
        id: "task-1",
        trainerId: "usr-trainer-1",
        traineeId: "usr-trainee-1",
        title: "Upper Body Hypertrophy & Chest Press Focus",
        description: "Maintain a tight arch, keep shoulder blades retracted, and drive through heels on bench press.",
        dayOfWeek: "Monday",
        exercises: [
          { name: "Barbell Flat Bench Press", sets: 4, reps: "8-10", weightKg: 75, restSeconds: 90, instructions: "Control the 3-second eccentric down to lower chest." },
          { name: "Incline Dumbbell Chest Press", sets: 3, reps: "10-12", weightKg: 24, restSeconds: 60, instructions: "Set bench at 30-degree incline." },
          { name: "Standing Cable Flyes", sets: 3, reps: "15", weightKg: 15, restSeconds: 60, instructions: "Squeeze pectorals at contraction peak." },
          { name: "Rope Tricep Pushdowns", sets: 4, reps: "12-15", weightKg: 20, restSeconds: 45, instructions: "Flare ropes outward at bottom lock." },
        ],
        status: "COMPLETED",
        deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
        completedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "task-2",
        trainerId: "usr-trainer-1",
        traineeId: "usr-trainee-1",
        title: "Lower Body Strength & Core Conditioning",
        description: "Warm up hips and ankles with goblet squats before loading barbell.",
        dayOfWeek: "Wednesday",
        exercises: [
          { name: "Barbell Back Squat", sets: 4, reps: "8", weightKg: 85, restSeconds: 120, instructions: "Hit parallel depth with knees tracking toes." },
          { name: "Romanian Deadlift (RDL)", sets: 3, reps: "10", weightKg: 65, restSeconds: 90, instructions: "Hinge at hips, keep bar glued to shins." },
          { name: "Bulgarian Split Squats", sets: 3, reps: "10 each", weightKg: 14, restSeconds: 60, instructions: "Drop back knee towards mat smoothly." },
          { name: "Hanging Leg Raises", sets: 3, reps: "15", weightKg: 0, restSeconds: 45, instructions: "Control swing, engage lower abdominals." },
        ],
        status: "PENDING",
        deadline: new Date(Date.now() + 86400000 * 4).toISOString(),
        completedAt: null,
      },
    ],

    dietCharts: [
      {
        id: "diet-1",
        trainerId: "usr-trainer-1",
        traineeId: "usr-trainee-1",
        title: "High-Protein Vegetarian Indian Gym Diet",
        dailyCalories: 2350,
        targetProtein: 145, // grams
        targetCarbs: 250,   // grams
        targetFats: 60,     // grams
        waterIntakeLiters: 4.0,
        instructions: "Drink 500ml water upon waking. Consume Whey protein within 45 mins post-workout. Avoid sweet chai.",
        meals: [
          {
            mealType: "BREAKFAST",
            timing: "08:00 AM",
            items: "120g Low-fat Paneer bhurji cooked in 5g Olive oil + 2 Multigrain Rotis + 1 cup Black Coffee / Green Tea",
            calories: 480,
            proteinGrams: 32,
          },
          {
            mealType: "MID_MORNING",
            timing: "11:30 AM",
            items: "1 scoop Whey Protein Isolate in water + 10 Soaked Almonds & 2 Walnuts + 1 Medium Apple",
            calories: 310,
            proteinGrams: 28,
          },
          {
            mealType: "LUNCH",
            timing: "01:30 PM",
            items: "1.5 cups Thick Moong/Arhar Dal + 1 cup Brown Rice / 2 Chapatis + 100g Fresh Cucumber-Tomato Salad + 100g Greek Yogurt/Curd",
            calories: 620,
            proteinGrams: 30,
          },
          {
            mealType: "EVENING_SNACK",
            timing: "05:30 PM",
            items: "50g Roasted Chana + 1 Banana (Pre-workout boost)",
            calories: 280,
            proteinGrams: 12,
          },
          {
            mealType: "DINNER",
            timing: "08:30 PM",
            items: "100g Soya Chunks curry / Tofu Stir-Fry + 2 Jowar/Bajra Rotis + Steamed Spinach & Carrots",
            calories: 520,
            proteinGrams: 38,
          },
        ],
        isActive: true,
      },
    ],

    payments: [
      {
        id: "pay-1",
        userId: "usr-trainee-1",
        bookingId: "bk-1",
        workoutPlanId: "plan-1",
        amount: 11999,
        currency: "INR",
        paymentMethod: "RAZORPAY_UPI",
        razorpayOrderId: "order_inr_9281a_pkg",
        razorpayPaymentId: "pay_test_92389102",
        razorpaySignature: "test_signature_valid",
        status: "SUCCESS",
        platformFee: 1800,
        trainerPayout: 10199,
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        id: "pay-2",
        userId: "usr-trainee-2",
        bookingId: "bk-3",
        workoutPlanId: null,
        amount: 2200,
        currency: "INR",
        paymentMethod: "RAZORPAY_CARD",
        razorpayOrderId: "order_inr_con_8819b",
        razorpayPaymentId: "pay_test_77819234",
        razorpaySignature: "test_signature_valid",
        status: "SUCCESS",
        platformFee: 330,
        trainerPayout: 1870,
        createdAt: new Date().toISOString(),
      },
      {
        id: "pay-3",
        userId: "usr-trainee-1",
        bookingId: null,
        workoutPlanId: null,
        amount: 2500,
        currency: "INR",
        paymentMethod: "RAZORPAY_UPI",
        razorpayOrderId: "order_inr_con_4412c",
        razorpayPaymentId: "pay_test_55192834",
        razorpaySignature: "test_signature_valid",
        status: "SUCCESS",
        platformFee: 375,
        trainerPayout: 2125,
        createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
      },
    ],

    progressLogs: [
      {
        id: "prog-1",
        traineeId: "usr-trainee-1",
        date: new Date(Date.now() - 86400000 * 30).toISOString(),
        weightKg: 82.0,
        chestCm: 104,
        waistCm: 92,
        hipsCm: 101,
        bodyFatPercentage: 22.5,
        notes: "Initial starting measurement at gym sign up.",
      },
      {
        id: "prog-2",
        traineeId: "usr-trainee-1",
        date: new Date(Date.now() - 86400000 * 15).toISOString(),
        weightKg: 80.2,
        chestCm: 105,
        waistCm: 89,
        hipsCm: 99,
        bodyFatPercentage: 20.8,
        notes: "Waist reduced by 3 cm, energy levels noticeably higher.",
      },
      {
        id: "prog-3",
        traineeId: "usr-trainee-1",
        date: new Date().toISOString(),
        weightKg: 78.5,
        chestCm: 106,
        waistCm: 86,
        hipsCm: 98,
        bodyFatPercentage: 19.2,
        notes: "Down 3.5 kg total! Bench press increased to 75 kg.",
      },
    ],

    notifications: [
      {
        id: "notif-1",
        userId: "usr-trainee-1",
        title: "Session Booked Successfully",
        message: "Your upcoming workout session with Vikram Malhotra is confirmed for tomorrow 07:00 AM IST.",
        type: "BOOKING",
        isRead: false,
        link: "/trainee/bookings",
        createdAt: new Date().toISOString(),
      },
      {
        id: "notif-2",
        userId: "usr-trainer-1",
        title: "New Trainee Assigned",
        message: "Rahul Verma has been assigned to your roster. Check their fitness goals and diet preference.",
        type: "SYSTEM",
        isRead: false,
        link: "/trainer/trainees",
        createdAt: new Date().toISOString(),
      },
      {
        id: "notif-3",
        userId: "usr-admin-1",
        title: "Payment Received",
        message: "Received ₹11,999 from Rahul Verma via Razorpay for Muscle Building Program.",
        type: "PAYMENT",
        isRead: true,
        link: "/admin/payments",
        createdAt: new Date().toISOString(),
      },
    ],
  };
}

function loadDb() {
  if (memoryDb) return memoryDb;
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf8");
      memoryDb = JSON.parse(raw);
      return memoryDb;
    }
  } catch (err) {
    // Read error fallback
  }

  const initial = getInitialData();
  memoryDb = initial;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf8");
  } catch (err) {
    // In serverless contexts, safely hold in memory
  }
  return memoryDb;
}

function saveDb(data) {
  memoryDb = data;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    // In serverless contexts, safely hold in memory
  }
}

export const dbService = {
  // USER OPERATIONS
  async getAllUsers() {
    const db = loadDb();
    return db.users;
  },

  async findUserByEmail(email) {
    if (!email) return null;
    const db = loadDb();
    return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findUserById(id) {
    if (!id) return null;
    const db = loadDb();
    return db.users.find((u) => u.id === id) || null;
  },

  async createUser({ name, email, password, role = "trainee", phone = "", avatar = "" }) {
    const db = loadDb();
    const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error("A user with this email address already exists.");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      phone,
      avatar: avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      status: "active",
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);

    if (role === "trainer") {
      db.trainerProfiles.push({
        id: `tp-${Date.now()}`,
        userId: newUser.id,
        headline: "Certified Fitness Coach",
        bio: "Dedicated to helping trainees reach their maximum athletic potential.",
        experienceYears: 3,
        specializations: ["General Fitness", "Weight Training"],
        certifications: [],
        hourlyRate: 2000,
        rating: 5.0,
        reviewCount: 0,
        isVerified: false,
        verificationStatus: "PENDING",
        location: "Pan-India (IST)",
        languages: ["English", "Hindi"],
      });
    } else if (role === "trainee") {
      db.traineeProfiles.push({
        id: `trp-${Date.now()}`,
        userId: newUser.id,
        assignedTrainerId: null,
        age: 25,
        gender: "Prefer not to say",
        heightCm: 172,
        weightKg: 70,
        targetWeightKg: 65,
        fitnessGoal: "General Fitness",
        activityLevel: "Moderately Active",
        dietaryPreference: "Vegetarian",
        medicalConsiderations: "None",
        trainingExperience: "Beginner",
      });
    }

    saveDb(db);
    return newUser;
  },

  async updateUserStatus(userId, status) {
    const db = loadDb();
    const user = db.users.find((u) => u.id === userId);
    if (!user) throw new Error("User not found");
    user.status = status;
    saveDb(db);
    return user;
  },

  // TRAINER OPERATIONS
  async getTrainers(filters = {}) {
    const db = loadDb();
    let trainers = db.trainerProfiles.map((tp) => {
      const user = db.users.find((u) => u.id === tp.userId);
      return {
        ...tp,
        name: user?.name || "Trainer",
        email: user?.email || "",
        avatar: user?.avatar || "",
        phone: user?.phone || "",
        status: user?.status || "active",
      };
    });

    if (filters.verifiedOnly) {
      trainers = trainers.filter((t) => t.isVerified);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      trainers = trainers.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.headline.toLowerCase().includes(q) ||
          t.specializations.some((s) => s.toLowerCase().includes(q))
      );
    }
    if (filters.specialization) {
      trainers = trainers.filter((t) =>
        t.specializations.includes(filters.specialization)
      );
    }
    if (filters.maxPrice) {
      trainers = trainers.filter((t) => t.hourlyRate <= Number(filters.maxPrice));
    }

    return trainers;
  },

  async getTrainerByUserId(userId) {
    const db = loadDb();
    const tp = db.trainerProfiles.find((p) => p.userId === userId);
    if (!tp) return null;
    const user = db.users.find((u) => u.id === tp.userId);
    return {
      ...tp,
      name: user?.name || "Trainer",
      email: user?.email || "",
      avatar: user?.avatar || "",
      phone: user?.phone || "",
    };
  },

  async updateTrainerVerification(trainerProfileId, status) {
    const db = loadDb();
    const tp = db.trainerProfiles.find((p) => p.id === trainerProfileId);
    if (!tp) throw new Error("Trainer profile not found");
    tp.verificationStatus = status;
    tp.isVerified = status === "APPROVED";
    saveDb(db);
    return tp;
  },

  // TRAINEE OPERATIONS
  async getTrainees(trainerUserId = null) {
    const db = loadDb();
    return db.traineeProfiles
      .filter((trp) => {
        if (!trainerUserId) return true;
        return trp.assignedTrainerId === trainerUserId;
      })
      .map((trp) => {
        const user = db.users.find((u) => u.id === trp.userId);
        const trainer = trp.assignedTrainerId
          ? db.users.find((u) => u.id === trp.assignedTrainerId)
          : null;
        const traineeAttendance = db.attendance.filter((a) => a.traineeId === trp.userId);
        const presentCount = traineeAttendance.filter((a) => a.status === "PRESENT").length;
        const attendanceRate = traineeAttendance.length
          ? Math.round((presentCount / traineeAttendance.length) * 100)
          : 0;

        return {
          ...trp,
          name: user?.name || "Trainee",
          email: user?.email || "",
          avatar: user?.avatar || "",
          phone: user?.phone || "",
          status: user?.status || "active",
          trainerName: trainer?.name || "Unassigned",
          attendanceRate,
          totalSessions: traineeAttendance.length,
        };
      });
  },

  async getTraineeByUserId(userId) {
    const db = loadDb();
    const trp = db.traineeProfiles.find((p) => p.userId === userId);
    if (!trp) return null;
    const user = db.users.find((u) => u.id === trp.userId);
    const trainer = trp.assignedTrainerId
      ? db.users.find((u) => u.id === trp.assignedTrainerId)
      : null;
    const trainerProfile = trp.assignedTrainerId
      ? db.trainerProfiles.find((tp) => tp.userId === trp.assignedTrainerId)
      : null;

    return {
      ...trp,
      name: user?.name || "Trainee",
      email: user?.email || "",
      avatar: user?.avatar || "",
      phone: user?.phone || "",
      status: user?.status || "active",
      assignedTrainer: trainer
        ? {
            id: trainer.id,
            name: trainer.name,
            avatar: trainer.avatar,
            hourlyRate: trainerProfile?.hourlyRate || 2500,
            specializations: trainerProfile?.specializations || [],
          }
        : null,
    };
  },

  async assignTraineeToTrainer(traineeUserId, trainerUserId) {
    const db = loadDb();
    const trp = db.traineeProfiles.find((p) => p.userId === traineeUserId);
    if (!trp) throw new Error("Trainee profile not found");
    trp.assignedTrainerId = trainerUserId;

    // Send in-app notification
    const trainer = db.users.find((u) => u.id === trainerUserId);
    const trainee = db.users.find((u) => u.id === traineeUserId);

    db.notifications.push({
      id: `notif-${Date.now()}-1`,
      userId: traineeUserId,
      title: "Trainer Assigned!",
      message: `Coach ${trainer?.name || "Trainer"} has been assigned as your primary fitness coach.`,
      type: "SYSTEM",
      isRead: false,
      link: "/trainee/trainers",
      createdAt: new Date().toISOString(),
    });

    db.notifications.push({
      id: `notif-${Date.now()}-2`,
      userId: trainerUserId,
      title: "New Trainee Assigned",
      message: `${trainee?.name || "A trainee"} has been assigned to your training roster.`,
      type: "SYSTEM",
      isRead: false,
      link: "/trainer/trainees",
      createdAt: new Date().toISOString(),
    });

    saveDb(db);
    return trp;
  },

  async createTraineeByAdmin({
    name,
    email,
    password = "Password123!",
    phone = "",
    avatar = "",
    age = 25,
    gender = "Male",
    heightCm = 175,
    weightKg = 75,
    targetWeightKg = 70,
    fitnessGoal = "General Fitness",
    activityLevel = "Moderately Active",
    dietaryPreference = "Vegetarian",
    medicalConsiderations = "None",
    trainingExperience = "Beginner",
    assignedTrainerId = null,
  }) {
    const db = loadDb();
    const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error("A user with this email address already exists.");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const userId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const newUser = {
      id: userId,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "trainee",
      phone: phone || "+91 98000 00000",
      avatar:
        avatar ||
        (gender === "Female"
          ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80"),
      status: "active",
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);

    const newProfile = {
      id: `trp-${Date.now()}`,
      userId,
      assignedTrainerId: assignedTrainerId || null,
      age: Number(age) || 25,
      gender: gender || "Male",
      heightCm: Number(heightCm) || 175,
      weightKg: Number(weightKg) || 75,
      targetWeightKg: Number(targetWeightKg) || 70,
      fitnessGoal: fitnessGoal || "General Fitness",
      activityLevel: activityLevel || "Moderately Active",
      dietaryPreference: dietaryPreference || "Vegetarian",
      medicalConsiderations: medicalConsiderations || "None reported",
      trainingExperience: trainingExperience || "Beginner",
    };

    db.traineeProfiles.push(newProfile);

    // If a trainer was selected, add notification for trainer
    if (assignedTrainerId) {
      const trainer = db.users.find((u) => u.id === assignedTrainerId);
      db.notifications.push({
        id: `notif-${Date.now()}`,
        userId: assignedTrainerId,
        title: "New Trainee Enrolled & Assigned",
        message: `${name} (${fitnessGoal}) has been onboarded and assigned to you by Admin.`,
        type: "SYSTEM",
        isRead: false,
        link: "/trainer/trainees",
        createdAt: new Date().toISOString(),
      });
    }

    saveDb(db);
    return {
      user: newUser,
      profile: newProfile,
    };
  },

  async createTrainerByAdmin({
    name,
    email,
    password = "Password123!",
    phone = "",
    avatar = "",
    headline = "Certified Personal Trainer & Fitness Specialist",
    bio = "Passionate fitness professional dedicated to helping clients achieve their fitness transformation goals.",
    experienceYears = 5,
    specializations = ["Strength Training", "Fat Loss"],
    certifications = [],
    hourlyRate = 2200,
    location = "Mumbai (IST)",
    languages = ["English", "Hindi"],
    isVerified = true,
    verificationStatus = "APPROVED",
  }) {
    const db = loadDb();
    const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error("A user with this email address already exists.");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const userId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const newUser = {
      id: userId,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "trainer",
      phone: phone || "+91 98000 11111",
      avatar:
        avatar ||
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format&fit=crop&q=80",
      status: "active",
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);

    const parsedSpecializations = Array.isArray(specializations)
      ? specializations
      : typeof specializations === "string"
      ? specializations.split(",").map((s) => s.trim()).filter(Boolean)
      : ["General Fitness"];

    const parsedLanguages = Array.isArray(languages)
      ? languages
      : typeof languages === "string"
      ? languages.split(",").map((l) => l.trim()).filter(Boolean)
      : ["English", "Hindi"];

    let parsedCerts = certifications;
    if (typeof certifications === "string" && certifications.trim()) {
      parsedCerts = certifications
        .split(",")
        .map((c) => ({ title: c.trim(), org: "Accredited Academy", year: new Date().getFullYear() }))
        .filter((c) => c.title);
    } else if (!Array.isArray(parsedCerts)) {
      parsedCerts = [];
    }

    const newProfile = {
      id: `tp-${Date.now()}`,
      userId,
      headline: headline || "Certified Fitness Coach",
      bio: bio || "Dedicated to helping trainees reach their maximum athletic potential.",
      experienceYears: Number(experienceYears) || 3,
      specializations: parsedSpecializations.length > 0 ? parsedSpecializations : ["Strength Training", "Fat Loss"],
      certifications: parsedCerts,
      hourlyRate: Number(hourlyRate) || 2000,
      rating: 5.0,
      reviewCount: 0,
      isVerified: Boolean(isVerified),
      verificationStatus: verificationStatus || "APPROVED",
      location: location || "Pan-India (IST)",
      languages: parsedLanguages,
    };

    db.trainerProfiles.push(newProfile);

    // Seed default weekly availability
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    days.forEach((day, idx) => {
      db.trainerAvailability.push({
        id: `avail-${Date.now()}-${idx}`,
        trainerId: userId,
        dayOfWeek: day,
        startTime: "07:00 AM",
        endTime: "08:00 PM",
        slotDurationMinutes: 60,
        isAvailable: true,
      });
    });

    saveDb(db);
    return {
      user: newUser,
      profile: newProfile,
    };
  },

  // BOOKING & APPOINTMENT OPERATIONS
  async getBookings({ traineeId, trainerId } = {}) {
    const db = loadDb();
    return db.bookings
      .filter((b) => {
        if (traineeId && b.traineeId !== traineeId) return false;
        if (trainerId && b.trainerId !== trainerId) return false;
        return true;
      })
      .map((b) => {
        const trainee = db.users.find((u) => u.id === b.traineeId);
        const trainer = db.users.find((u) => u.id === b.trainerId);
        const plan = b.workoutPlanId
          ? db.workoutPlans.find((p) => p.id === b.workoutPlanId)
          : null;
        return {
          ...b,
          traineeName: trainee?.name || "Trainee",
          traineeAvatar: trainee?.avatar,
          trainerName: trainer?.name || "Trainer",
          trainerAvatar: trainer?.avatar,
          planTitle: plan?.title || "1-on-1 Personal Training Session",
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async createBooking({
    traineeId,
    trainerId,
    workoutPlanId = null,
    date,
    startTime,
    endTime,
    sessionType = "CONSULTATION",
    amount = 0,
    clientNotes = "",
    razorpayOrderId = null,
    razorpayPaymentId = null,
  }) {
    const db = loadDb();

    // Check double-booking slot collision
    const existing = db.bookings.find(
      (b) =>
        b.trainerId === trainerId &&
        b.status !== "CANCELLED" &&
        new Date(b.date).toISOString().split("T")[0] ===
          new Date(date).toISOString().split("T")[0] &&
        b.startTime === startTime
    );

    if (existing) {
      throw new Error(
        "This time slot is already booked for this trainer. Please pick another available slot."
      );
    }

    const bookingId = `bk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    // Create payment record if amount > 0
    let paymentId = null;
    if (amount > 0) {
      paymentId = `pay-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const platformFee = Math.round(amount * 0.15);
      const trainerPayout = amount - platformFee;

      db.payments.push({
        id: paymentId,
        userId: traineeId,
        bookingId,
        workoutPlanId,
        amount,
        currency: "INR",
        paymentMethod: "RAZORPAY",
        razorpayOrderId: razorpayOrderId || `order_inr_${Date.now().toString(36)}`,
        razorpayPaymentId: razorpayPaymentId || `pay_test_${Date.now().toString(36)}`,
        razorpaySignature: "test_signature_valid",
        status: "SUCCESS",
        platformFee,
        trainerPayout,
        createdAt: new Date().toISOString(),
      });
    }

    const newBooking = {
      id: bookingId,
      traineeId,
      trainerId,
      workoutPlanId,
      date: new Date(date).toISOString(),
      startTime,
      endTime,
      sessionType,
      status: "CONFIRMED",
      amount,
      paymentId,
      clientNotes,
      trainerNotes: "",
      createdAt: new Date().toISOString(),
    };

    db.bookings.push(newBooking);

    // Auto-assign trainee to trainer if not assigned
    const traineeProfile = db.traineeProfiles.find((p) => p.userId === traineeId);
    if (traineeProfile && !traineeProfile.assignedTrainerId) {
      traineeProfile.assignedTrainerId = trainerId;
    }

    // In-app notifications
    const trainerUser = db.users.find((u) => u.id === trainerId);
    const traineeUser = db.users.find((u) => u.id === traineeId);

    db.notifications.push({
      id: `notif-${Date.now()}-1`,
      userId: traineeId,
      title: "Booking Confirmed",
      message: `Your training appointment with ${trainerUser?.name || "Coach"} on ${startTime} is confirmed.`,
      type: "BOOKING",
      isRead: false,
      link: "/trainee/bookings",
      createdAt: new Date().toISOString(),
    });

    db.notifications.push({
      id: `notif-${Date.now()}-2`,
      userId: trainerId,
      title: "New Appointment Booked",
      message: `${traineeUser?.name || "A trainee"} has booked a session for ${startTime}.`,
      type: "BOOKING",
      isRead: false,
      link: "/trainer/attendance",
      createdAt: new Date().toISOString(),
    });

    saveDb(db);
    return newBooking;
  },

  async updateBookingStatus(bookingId, status) {
    const db = loadDb();
    const b = db.bookings.find((item) => item.id === bookingId);
    if (!b) throw new Error("Booking not found");
    b.status = status;
    saveDb(db);
    return b;
  },

  // ATTENDANCE OPERATIONS
  async getAttendance({ traineeId, trainerId } = {}) {
    const db = loadDb();
    return db.attendance
      .filter((a) => {
        if (traineeId && a.traineeId !== traineeId) return false;
        if (trainerId && a.trainerId !== trainerId) return false;
        return true;
      })
      .map((a) => {
        const trainee = db.users.find((u) => u.id === a.traineeId);
        const trainer = db.users.find((u) => u.id === a.trainerId);
        return {
          ...a,
          traineeName: trainee?.name || "Trainee",
          trainerName: trainer?.name || "Trainer",
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async markAttendance({ bookingId = null, trainerId, traineeId, date, status = "PRESENT", notes = "" }) {
    const db = loadDb();
    const newRecord = {
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      bookingId,
      trainerId,
      traineeId,
      date: new Date(date || Date.now()).toISOString(),
      status,
      notes: notes || (status === "PRESENT" ? "Session completed successfully." : "Trainee absent."),
      markedAt: new Date().toISOString(),
    };

    db.attendance.push(newRecord);

    if (bookingId) {
      const b = db.bookings.find((item) => item.id === bookingId);
      if (b && status === "PRESENT") {
        b.status = "COMPLETED";
      }
    }

    saveDb(db);
    return newRecord;
  },

  // WORKOUT TASKS OPERATIONS
  async getWorkoutTasks({ traineeId, trainerId } = {}) {
    const db = loadDb();
    return db.workoutTasks
      .filter((t) => {
        if (traineeId && t.traineeId !== traineeId) return false;
        if (trainerId && t.trainerId !== trainerId) return false;
        return true;
      })
      .map((t) => {
        const trainee = db.users.find((u) => u.id === t.traineeId);
        const trainer = db.users.find((u) => u.id === t.trainerId);
        return {
          ...t,
          traineeName: trainee?.name || "Trainee",
          trainerName: trainer?.name || "Trainer",
        };
      });
  },

  async createWorkoutTask({ trainerId, traineeId, title, description = "", dayOfWeek = "Monday", exercises = [] }) {
    const db = loadDb();
    const newTask = {
      id: `task-${Date.now()}`,
      trainerId,
      traineeId,
      title,
      description,
      dayOfWeek,
      exercises,
      status: "PENDING",
      deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
      completedAt: null,
      createdAt: new Date().toISOString(),
    };

    db.workoutTasks.push(newTask);

    db.notifications.push({
      id: `notif-${Date.now()}`,
      userId: traineeId,
      title: "New Workout Assigned",
      message: `Your coach assigned a new workout routine: '${title}'.`,
      type: "WORKOUT",
      isRead: false,
      link: "/trainee/workouts",
      createdAt: new Date().toISOString(),
    });

    saveDb(db);
    return newTask;
  },

  async toggleWorkoutTask(taskId, traineeId) {
    const db = loadDb();
    const task = db.workoutTasks.find((t) => t.id === taskId);
    if (!task) throw new Error("Workout task not found");
    if (task.traineeId !== traineeId) throw new Error("Unauthorized to update this task");

    task.status = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";
    task.completedAt = task.status === "COMPLETED" ? new Date().toISOString() : null;
    saveDb(db);
    return task;
  },

  // DIET CHARTS OPERATIONS
  async getDietCharts({ traineeId, trainerId } = {}) {
    const db = loadDb();
    return db.dietCharts
      .filter((d) => {
        if (traineeId && d.traineeId !== traineeId) return false;
        if (trainerId && d.trainerId !== trainerId) return false;
        return true;
      })
      .map((d) => {
        const trainee = db.users.find((u) => u.id === d.traineeId);
        const trainer = db.users.find((u) => u.id === d.trainerId);
        return {
          ...d,
          traineeName: trainee?.name || "Trainee",
          trainerName: trainer?.name || "Trainer",
        };
      });
  },

  async createDietChart({
    trainerId,
    traineeId,
    title,
    dailyCalories = 2200,
    targetProtein = 140,
    targetCarbs = 240,
    targetFats = 60,
    waterIntakeLiters = 3.5,
    instructions = "",
    meals = [],
  }) {
    const db = loadDb();
    const newDiet = {
      id: `diet-${Date.now()}`,
      trainerId,
      traineeId,
      title,
      dailyCalories,
      targetProtein,
      targetCarbs,
      targetFats,
      waterIntakeLiters,
      instructions,
      meals,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    db.dietCharts.push(newDiet);

    db.notifications.push({
      id: `notif-${Date.now()}`,
      userId: traineeId,
      title: "New Diet Plan Published",
      message: `Your coach updated your nutrition chart: '${title}' (${dailyCalories} kcal).`,
      type: "DIET",
      isRead: false,
      link: "/trainee/diet",
      createdAt: new Date().toISOString(),
    });

    saveDb(db);
    return newDiet;
  },

  // WORKOUT PLANS / PACKAGES OPERATIONS
  async getWorkoutPlans() {
    const db = loadDb();
    return db.workoutPlans;
  },

  async getWorkoutPlanById(id) {
    const db = loadDb();
    return db.workoutPlans.find((p) => p.id === id) || null;
  },

  async createWorkoutPlan(planData) {
    const db = loadDb();
    const newPlan = {
      id: `plan-${Date.now()}`,
      ...planData,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    db.workoutPlans.push(newPlan);
    saveDb(db);
    return newPlan;
  },

  // PAYMENTS & FINANCIALS
  async getPayments({ userId, trainerId } = {}) {
    const db = loadDb();
    return db.payments
      .filter((p) => {
        if (userId && p.userId !== userId) return false;
        if (trainerId) {
          const booking = db.bookings.find((b) => b.id === p.bookingId);
          if (!booking || booking.trainerId !== trainerId) return false;
        }
        return true;
      })
      .map((p) => {
        const user = db.users.find((u) => u.id === p.userId);
        const plan = p.workoutPlanId
          ? db.workoutPlans.find((wp) => wp.id === p.workoutPlanId)
          : null;
        const booking = p.bookingId
          ? db.bookings.find((b) => b.id === p.bookingId)
          : null;
        const trainer = booking ? db.users.find((u) => u.id === booking.trainerId) : null;

        return {
          ...p,
          userName: user?.name || "Trainee",
          userEmail: user?.email || "",
          itemTitle: plan?.title || (booking ? `Personal Coaching with ${trainer?.name || "Trainer"}` : "Fitness Service"),
          trainerName: trainer?.name || "Coach",
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getTrainerEarnings(trainerUserId) {
    const db = loadDb();
    const trainerBookings = db.bookings.filter(
      (b) => b.trainerId === trainerUserId && b.amount > 0
    );

    const bookingIds = trainerBookings.map((b) => b.id);
    const trainerPayments = db.payments.filter(
      (p) => bookingIds.includes(p.bookingId) && p.status === "SUCCESS"
    );

    const grossRevenue = trainerPayments.reduce((sum, p) => sum + p.amount, 0);
    const platformCut = Math.round(grossRevenue * 0.15);
    const netEarnings = grossRevenue - platformCut;

    const completedSessions = db.attendance.filter(
      (a) => a.trainerId === trainerUserId && a.status === "PRESENT"
    ).length;

    const assignedTraineesCount = db.traineeProfiles.filter(
      (trp) => trp.assignedTrainerId === trainerUserId
    ).length;

    return {
      grossRevenue,
      netEarnings,
      platformCut,
      completedSessions,
      assignedTraineesCount,
      recentTransactions: trainerPayments.map((p) => {
        const trainee = db.users.find((u) => u.id === p.userId);
        return {
          ...p,
          traineeName: trainee?.name || "Trainee",
          netShare: Math.round(p.amount * 0.85),
        };
      }),
    };
  },

  // FITNESS PROGRESS
  async getFitnessProgress(traineeId) {
    const db = loadDb();
    return (db.progressLogs || [])
      .filter((p) => p.traineeId === traineeId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  async addFitnessProgress(data) {
    const db = loadDb();
    if (!db.progressLogs) db.progressLogs = [];
    const newEntry = {
      id: `prog-${Date.now()}`,
      ...data,
      date: new Date(data.date || Date.now()).toISOString(),
      createdAt: new Date().toISOString(),
    };
    db.progressLogs.push(newEntry);
    saveDb(db);
    return newEntry;
  },

  // ADMIN ANALYTICS & OVERVIEW
  async getAdminStats() {
    const db = loadDb();
    const totalTrainees = db.users.filter((u) => u.role === "trainee").length;
    const totalTrainers = db.users.filter((u) => u.role === "trainer").length;
    const verifiedTrainers = db.trainerProfiles.filter((tp) => tp.isVerified).length;
    const pendingTrainers = db.trainerProfiles.filter((tp) => tp.verificationStatus === "PENDING").length;
    const totalBookings = db.bookings.length;
    const completedSessions = db.attendance.filter((a) => a.status === "PRESENT").length;

    const totalRevenue = db.payments
      .filter((p) => p.status === "SUCCESS")
      .reduce((sum, p) => sum + p.amount, 0);

    const platformCommission = Math.round(totalRevenue * 0.15);
    const trainerPayouts = totalRevenue - platformCommission;

    return {
      totalTrainees,
      totalTrainers,
      verifiedTrainers,
      pendingTrainers,
      totalBookings,
      completedSessions,
      totalRevenue,
      platformCommission,
      trainerPayouts,
      recentUsers: db.users.slice(-6).reverse(),
      recentBookings: db.bookings.slice(-6).reverse().map((b) => {
        const trainee = db.users.find((u) => u.id === b.traineeId);
        const trainer = db.users.find((u) => u.id === b.trainerId);
        return {
          ...b,
          traineeName: trainee?.name || "Trainee",
          trainerName: trainer?.name || "Trainer",
        };
      }),
      recentPayments: db.payments.slice(-6).reverse().map((p) => {
        const user = db.users.find((u) => u.id === p.userId);
        return {
          ...p,
          userName: user?.name || "Trainee",
          userEmail: user?.email || "",
        };
      }),
    };
  },

  // NOTIFICATIONS
  async getNotifications(userId) {
    const db = loadDb();
    return (db.notifications || [])
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async markNotificationRead(id) {
    const db = loadDb();
    const n = (db.notifications || []).find((item) => item.id === id);
    if (n) {
      n.isRead = true;
      saveDb(db);
    }
    return true;
  },
};

export default dbService;
