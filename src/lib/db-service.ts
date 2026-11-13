import fs from "fs";
import path from "path";
import {
  INITIAL_USERS,
  INITIAL_TRAINER_PROFILES,
  INITIAL_PACKAGES,
  INITIAL_AVAILABILITIES,
  INITIAL_PURCHASES,
  INITIAL_BOOKINGS,
  INITIAL_ATTENDANCES,
  INITIAL_PROGRESS,
  INITIAL_WORKOUT_PLANS,
  INITIAL_REVIEWS,
  INITIAL_PAYMENTS,
  INITIAL_NOTIFICATIONS,
} from "./seed-data";
import {
  UserRole,
  VerificationStatus,
  BookingStatus,
  AttendanceStatus,
  PaymentStatus,
  NotificationType,
} from "@/types";

interface DbSchema {
  users: Array<{
    id: string;
    name: string;
    email: string;
    password?: string | null;
    role: UserRole;
    image?: string | null;
    phone?: string | null;
    bio?: string | null;
    createdAt: Date;
  }>;
  trainerProfiles: any[];
  packages: any[];
  availabilities: any[];
  purchases: any[];
  bookings: any[];
  attendances: any[];
  progress: any[];
  workoutPlans: any[];
  reviews: any[];
  payments: any[];
  notifications: any[];
}

const DB_FILE_PATH = path.join(process.cwd(), ".fitpulse_db.json");

function getInitialState(): DbSchema {
  return {
    users: [...INITIAL_USERS],
    trainerProfiles: [...INITIAL_TRAINER_PROFILES],
    packages: [...INITIAL_PACKAGES],
    availabilities: [...INITIAL_AVAILABILITIES],
    purchases: [...INITIAL_PURCHASES],
    bookings: [...INITIAL_BOOKINGS],
    attendances: [...INITIAL_ATTENDANCES],
    progress: [...INITIAL_PROGRESS],
    workoutPlans: [...INITIAL_WORKOUT_PLANS],
    reviews: [...INITIAL_REVIEWS],
    payments: [...INITIAL_PAYMENTS],
    notifications: [...INITIAL_NOTIFICATIONS],
  };
}

let inMemoryDb: DbSchema | null = null;

function loadDb(): DbSchema {
  if (inMemoryDb) return inMemoryDb;

  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const content = fs.readFileSync(DB_FILE_PATH, "utf-8");
      inMemoryDb = JSON.parse(content, (key, value) => {
        // parse ISO dates
        if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
          return new Date(value);
        }
        return value;
      });
      return inMemoryDb!;
    }
  } catch (error) {
    console.error("Failed to read database file, initializing default:", error);
  }

  inMemoryDb = getInitialState();
  saveDb(inMemoryDb);
  return inMemoryDb;
}

function saveDb(db: DbSchema) {
  inMemoryDb = db;
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to persist database file:", error);
  }
}

// -------------------------------------------------------------
// DATABASE SERVICE METHODS
// -------------------------------------------------------------

export const dbService = {
  // USER METHODS
  async getUserByEmail(email: string) {
    const db = loadDb();
    const user = db.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );
    return user || null;
  },

  async getUserById(id: string) {
    const db = loadDb();
    const user = db.users.find((u) => u.id === id);
    return user || null;
  },

  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    bio?: string;
  }) {
    const db = loadDb();
    const newUser = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      password: userData.password,
      role: userData.role,
      image: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80`,
      phone: userData.phone || null,
      bio: userData.bio || null,
      createdAt: new Date(),
    };

    db.users.push(newUser);

    if (userData.role === "TRAINER") {
      db.trainerProfiles.push({
        id: `profile-${newUser.id}`,
        userId: newUser.id,
        headline: "Professional Certified Fitness Trainer",
        bio: userData.bio || "Passionate about health, strength, and transformation.",
        experienceYears: 1,
        consultationPrice: 2000,
        languages: ["English"],
        rating: 5.0,
        reviewCount: 0,
        isVerified: false,
        verificationStatus: "PENDING",
        profileImage: newUser.image,
        bannerImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80",
        createdAt: new Date(),
        specializations: [{ id: `spec-${Date.now()}`, name: "Personal Training" }],
        certifications: [],
      });
    }

    saveDb(db);
    return newUser;
  },

  async updateUser(
    id: string,
    data: { name?: string; phone?: string; bio?: string; image?: string }
  ) {
    const db = loadDb();
    const userIndex = db.users.findIndex((u) => u.id === id);
    if (userIndex === -1) return null;

    db.users[userIndex] = {
      ...db.users[userIndex],
      ...data,
      phone: data.phone !== undefined ? data.phone : db.users[userIndex].phone,
      bio: data.bio !== undefined ? data.bio : db.users[userIndex].bio,
      image: data.image !== undefined ? data.image : db.users[userIndex].image,
    };

    saveDb(db);
    return db.users[userIndex];
  },

  // TRAINER METHODS
  async getAllTrainers(filters?: {
    search?: string;
    specialization?: string;
    maxPrice?: number;
    minRating?: number;
  }) {
    const db = loadDb();
    let profiles = [...db.trainerProfiles];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      profiles = profiles.filter((p: any) => {
        const user = db.users.find((u: any) => u.id === p.userId);
        const nameMatch = user?.name.toLowerCase().includes(q);
        const headlineMatch = p.headline?.toLowerCase().includes(q);
        const specMatch = p.specializations?.some((s: any) =>
          s.name.toLowerCase().includes(q)
        );
        return nameMatch || headlineMatch || specMatch;
      });
    }

    if (filters?.specialization && filters.specialization !== "All") {
      profiles = profiles.filter((p: any) =>
        p.specializations?.some(
          (s: any) => s.name.toLowerCase() === filters.specialization?.toLowerCase()
        )
      );
    }

    if (filters?.maxPrice) {
      profiles = profiles.filter((p: any) => p.consultationPrice <= filters.maxPrice!);
    }

    if (filters?.minRating) {
      profiles = profiles.filter((p: any) => p.rating >= filters.minRating!);
    }

    return profiles.map((p: any) => {
      const user = db.users.find((u: any) => u.id === p.userId);
      const packages = db.packages.filter((pkg: any) => pkg.trainerProfileId === p.id && pkg.isActive);
      return {
        ...p,
        user: {
          id: user?.id || "",
          name: user?.name || "Trainer",
          email: user?.email || "",
          image: p.profileImage || user?.image,
          phone: user?.phone,
        },
        packages,
      };
    });
  },

  async getTrainerById(idOrUserId: string) {
    const db = loadDb();
    const profile = db.trainerProfiles.find(
      (p: any) => p.id === idOrUserId || p.userId === idOrUserId
    );
    if (!profile) return null;

    const user = db.users.find((u: any) => u.id === profile.userId);
    const packages = db.packages.filter(
      (pkg: any) => pkg.trainerProfileId === profile.id && pkg.isActive
    );
    const availabilities = db.availabilities.filter(
      (a: any) => a.trainerProfileId === profile.id
    );
    const reviews = db.reviews
      .filter((r: any) => r.trainerProfileId === profile.id)
      .map((r: any) => {
        const client = db.users.find((u: any) => u.id === r.clientId);
        return {
          ...r,
          client: {
            name: client?.name || "Client",
            image: client?.image,
          },
        };
      });

    return {
      ...profile,
      user: {
        id: user?.id || "",
        name: user?.name || "Trainer",
        email: user?.email || "",
        image: profile.profileImage || user?.image,
        phone: user?.phone,
      },
      packages,
      availabilities,
      reviews,
    };
  },

  async updateTrainerProfile(
    userId: string,
    data: {
      headline?: string;
      bio?: string;
      experienceYears?: number;
      consultationPrice?: number;
      languages?: string[];
      profileImage?: string;
      bannerImage?: string;
      specializations?: string[];
    }
  ) {
    const db = loadDb();
    const index = db.trainerProfiles.findIndex((p: any) => p.userId === userId);
    if (index === -1) return null;

    const current = db.trainerProfiles[index];
    const updated = {
      ...current,
      headline: data.headline ?? current.headline,
      bio: data.bio ?? current.bio,
      experienceYears: data.experienceYears ?? current.experienceYears,
      consultationPrice: data.consultationPrice ?? current.consultationPrice,
      languages: data.languages ?? current.languages,
      profileImage: data.profileImage ?? current.profileImage,
      bannerImage: data.bannerImage ?? current.bannerImage,
      specializations: data.specializations
        ? data.specializations.map((name: string, i: number) => ({ id: `spec-${i}-${Date.now()}`, name }))
        : current.specializations,
    };

    db.trainerProfiles[index] = updated;
    saveDb(db);
    return updated;
  },

  async updateTrainerVerification(
    trainerProfileId: string,
    status: VerificationStatus,
    isVerified: boolean
  ) {
    const db = loadDb();
    const index = db.trainerProfiles.findIndex((p: any) => p.id === trainerProfileId);
    if (index === -1) return null;

    db.trainerProfiles[index].verificationStatus = status;
    db.trainerProfiles[index].isVerified = isVerified;
    saveDb(db);
    return db.trainerProfiles[index];
  },

  // WORKOUT PACKAGES
  async getAllPackages() {
    const db = loadDb();
    return db.packages.map((pkg: any) => {
      const profile = db.trainerProfiles.find((p: any) => p.id === pkg.trainerProfileId);
      const user = db.users.find((u: any) => u.id === profile?.userId);
      return {
        ...pkg,
        trainerProfile: {
          id: profile?.id,
          rating: profile?.rating || 5.0,
          user: {
            name: user?.name || "Trainer",
            image: profile?.profileImage || user?.image,
          },
        },
      };
    });
  },

  async getPackageById(packageId: string) {
    const db = loadDb();
    const pkg = db.packages.find((p: any) => p.id === packageId);
    if (!pkg) return null;

    const profile = db.trainerProfiles.find((p: any) => p.id === pkg.trainerProfileId);
    const user = db.users.find((u: any) => u.id === profile?.userId);

    return {
      ...pkg,
      trainerProfile: {
        id: profile?.id,
        userId: profile?.userId,
        rating: profile?.rating || 5.0,
        user: {
          id: user?.id,
          name: user?.name || "Trainer",
          image: profile?.profileImage || user?.image,
        },
      },
    };
  },

  async createPackage(data: {
    trainerProfileId: string;
    title: string;
    description: string;
    durationWeeks: number;
    sessionCount: number;
    price: number;
    trainingType: string;
    difficultyLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    includedServices: string[];
    targetGoal: string;
    coverImage?: string;
  }) {
    const db = loadDb();
    const newPkg = {
      id: `pkg-${Date.now()}`,
      trainerProfileId: data.trainerProfileId,
      title: data.title,
      description: data.description,
      coverImage:
        data.coverImage ||
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
      durationWeeks: data.durationWeeks,
      sessionCount: data.sessionCount,
      price: data.price,
      trainingType: data.trainingType,
      difficultyLevel: data.difficultyLevel,
      includedServices: data.includedServices,
      targetGoal: data.targetGoal,
      isActive: true,
      createdAt: new Date(),
    };

    db.packages.push(newPkg);
    saveDb(db);
    return newPkg;
  },

  async updatePackage(
    packageId: string,
    data: Partial<typeof INITIAL_PACKAGES[0]>
  ) {
    const db = loadDb();
    const index = db.packages.findIndex((p: any) => p.id === packageId);
    if (index === -1) return null;

    db.packages[index] = { ...db.packages[index], ...data };
    saveDb(db);
    return db.packages[index];
  },

  async deletePackage(packageId: string) {
    const db = loadDb();
    db.packages = db.packages.filter((p: any) => p.id !== packageId);
    saveDb(db);
    return true;
  },

  // PACKAGE PURCHASES
  async purchasePackage({
    userId,
    packageId,
    purchasePrice,
    razorpayOrderId,
    razorpayPaymentId,
  }: {
    userId: string;
    packageId: string;
    purchasePrice: number;
    razorpayOrderId: string;
    razorpayPaymentId: string;
  }) {
    const db = loadDb();
    const pkg = db.packages.find((p: any) => p.id === packageId);
    if (!pkg) throw new Error("Package not found");

    const newPurchase = {
      id: `purchase-${Date.now()}`,
      userId,
      packageId,
      purchasePrice,
      totalSessions: pkg.sessionCount,
      remainingSessions: pkg.sessionCount,
      status: "ACTIVE" as const,
      expiresAt: new Date(Date.now() + pkg.durationWeeks * 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    };

    db.purchases.push(newPurchase);

    // Record Payment
    db.payments.push({
      id: `pay-${Date.now()}`,
      userId,
      packageId,
      bookingId: null,
      amount: purchasePrice,
      currency: "INR",
      paymentMethod: "RAZORPAY",
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature: "test_signature_valid",
      status: "SUCCESS",
      createdAt: new Date(),
    });

    // Notify Client
    db.notifications.push({
      id: `notif-${Date.now()}`,
      userId,
      title: "Package Purchased Successfully!",
      message: `You have successfully purchased '${pkg.title}'. Your balance is ${pkg.sessionCount} sessions.`,
      type: "PAYMENT",
      link: "/dashboard/packages",
      isRead: false,
      createdAt: new Date(),
    });

    saveDb(db);
    return newPurchase;
  },

  async getUserPurchases(userId: string) {
    const db = loadDb();
    return db.purchases
      .filter((p: any) => p.userId === userId)
      .map((p: any) => {
        const pkg = db.packages.find((pk: any) => pk.id === p.packageId);
        const profile = db.trainerProfiles.find(
          (tp: any) => tp.id === pkg?.trainerProfileId
        );
        const trainer = db.users.find((u: any) => u.id === profile?.userId);

        return {
          ...p,
          package: {
            id: pkg?.id || "pkg",
            trainerProfileId: pkg?.trainerProfileId || "",
            title: pkg?.title || "Workout Package",
            description: pkg?.description || "",
            durationWeeks: pkg?.durationWeeks || 4,
            sessionCount: pkg?.sessionCount || 8,
            price: pkg?.price || 0,
            trainer: {
              id: trainer?.id || "",
              name: trainer?.name || "Trainer",
              image: profile?.profileImage || trainer?.image,
            },
          },
        };
      });
  },

  // BOOKING SYSTEM
  async createBooking({
    clientId,
    trainerId,
    packagePurchaseId,
    date,
    startTime,
    endTime,
    sessionType,
    clientNotes,
    amount,
  }: {
    clientId: string;
    trainerId: string;
    packagePurchaseId?: string | null;
    date: Date | string;
    startTime: string;
    endTime: string;
    sessionType: "CONSULTATION" | "PACKAGE_SESSION";
    clientNotes?: string;
    amount: number;
  }) {
    const db = loadDb();
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const dateStr = dateObj.toISOString().split("T")[0];

    // Conflict Check: Prevent double booking with the trainer on same date & time
    const existingConflict = db.bookings.find((b: any) => {
      if (b.trainerId !== trainerId || b.status === "CANCELLED" || b.status === "REJECTED") {
        return false;
      }
      const bDateStr = new Date(b.date).toISOString().split("T")[0];
      return bDateStr === dateStr && b.startTime === startTime;
    });

    if (existingConflict) {
      throw new Error(
        "This time slot is already booked for this trainer. Please pick another available time."
      );
    }

    // If package session, verify and decrement session count
    if (sessionType === "PACKAGE_SESSION" && packagePurchaseId) {
      const purchaseIndex = db.purchases.findIndex(
        (p: any) => p.id === packagePurchaseId && p.userId === clientId
      );
      if (purchaseIndex === -1) {
        throw new Error("Active package purchase not found.");
      }
      if (db.purchases[purchaseIndex].remainingSessions <= 0) {
        throw new Error("No remaining sessions left in this package.");
      }
      db.purchases[purchaseIndex].remainingSessions -= 1;
      if (db.purchases[purchaseIndex].remainingSessions === 0) {
        db.purchases[purchaseIndex].status = "COMPLETED";
      }
    }

    const newBooking = {
      id: `book-${Date.now()}`,
      clientId,
      trainerId,
      packagePurchaseId: packagePurchaseId || null,
      date: dateObj,
      startTime,
      endTime,
      sessionType,
      status: "CONFIRMED" as const,
      cancellationReason: null,
      clientNotes: clientNotes || "",
      trainerNotes: "",
      amount,
      createdAt: new Date(),
    };

    db.bookings.push(newBooking);

    // Notifications
    const clientUser = db.users.find((u: any) => u.id === clientId);
    const trainerUser = db.users.find((u: any) => u.id === trainerId);

    db.notifications.push({
      id: `notif-${Date.now()}-1`,
      userId: clientId,
      title: "Booking Confirmed",
      message: `Your appointment with ${trainerUser?.name || "Trainer"} on ${dateStr} at ${startTime} is confirmed.`,
      type: "BOOKING",
      link: "/dashboard/bookings",
      isRead: false,
      createdAt: new Date(),
    });

    db.notifications.push({
      id: `notif-${Date.now()}-2`,
      userId: trainerId,
      title: "New Appointment Booked",
      message: `${clientUser?.name || "A client"} has booked a session for ${dateStr} at ${startTime}.`,
      type: "BOOKING",
      link: "/trainer/bookings",
      isRead: false,
      createdAt: new Date(),
    });

    saveDb(db);
    return newBooking;
  },

  async getBookingsByClient(clientId: string) {
    const db = loadDb();
    return db.bookings
      .filter((b: any) => b.clientId === clientId)
      .map((b: any) => {
        const trainer = db.users.find((u: any) => u.id === b.trainerId);
        const trainerProfile = db.trainerProfiles.find(
          (p: any) => p.userId === b.trainerId
        );
        const attendance = db.attendances.find((a: any) => a.bookingId === b.id);
        const purchase = b.packagePurchaseId
          ? db.purchases.find((p: any) => p.id === b.packagePurchaseId)
          : null;
        const pkg = purchase
          ? db.packages.find((pk: any) => pk.id === purchase.packageId)
          : null;

        return {
          ...b,
          trainer: {
            id: trainer?.id || "",
            name: trainer?.name || "Trainer",
            image: trainerProfile?.profileImage || trainer?.image,
            email: trainer?.email,
            phone: trainer?.phone,
          },
          package: pkg ? { title: pkg.title } : null,
          attendance: attendance || null,
        };
      })
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getBookingsByTrainer(trainerId: string) {
    const db = loadDb();
    return db.bookings
      .filter((b: any) => b.trainerId === trainerId)
      .map((b: any) => {
        const client = db.users.find((u: any) => u.id === b.clientId);
        const attendance = db.attendances.find((a: any) => a.bookingId === b.id);
        const purchase = b.packagePurchaseId
          ? db.purchases.find((p: any) => p.id === b.packagePurchaseId)
          : null;
        const pkg = purchase
          ? db.packages.find((pk: any) => pk.id === purchase.packageId)
          : null;

        return {
          ...b,
          client: {
            id: client?.id || "",
            name: client?.name || "Client",
            image: client?.image,
            email: client?.email,
            phone: client?.phone,
          },
          package: pkg ? { title: pkg.title } : null,
          attendance: attendance || null,
        };
      })
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async updateBookingStatus(
    bookingId: string,
    status: BookingStatus,
    reason?: string
  ) {
    const db = loadDb();
    const index = db.bookings.findIndex((b: any) => b.id === bookingId);
    if (index === -1) return null;

    db.bookings[index].status = status;
    if (reason) {
      db.bookings[index].cancellationReason = reason;
    }

    // If cancelled and it was a package session, refund session balance
    if (
      status === "CANCELLED" &&
      db.bookings[index].packagePurchaseId &&
      db.bookings[index].sessionType === "PACKAGE_SESSION"
    ) {
      const purchaseIndex = db.purchases.findIndex(
        (p: any) => p.id === db.bookings[index].packagePurchaseId
      );
      if (purchaseIndex !== -1) {
        db.purchases[purchaseIndex].remainingSessions += 1;
        db.purchases[purchaseIndex].status = "ACTIVE";
      }
    }

    saveDb(db);
    return db.bookings[index];
  },

  // ATTENDANCE MANAGEMENT
  async recordAttendance({
    bookingId,
    trainerId,
    clientId,
    status,
    notes,
  }: {
    bookingId: string;
    trainerId: string;
    clientId: string;
    status: AttendanceStatus;
    notes?: string;
  }) {
    const db = loadDb();
    const booking = db.bookings.find((b: any) => b.id === bookingId);
    if (!booking) throw new Error("Booking not found");

    const existingIndex = db.attendances.findIndex((a: any) => a.bookingId === bookingId);
    const attendanceRecord = {
      id: existingIndex !== -1 ? db.attendances[existingIndex].id : `att-${Date.now()}`,
      bookingId,
      trainerId,
      clientId,
      date: new Date(booking.date),
      status,
      notes: notes || "",
      recordedAt: new Date(),
    };

    if (existingIndex !== -1) {
      db.attendances[existingIndex] = attendanceRecord;
    } else {
      db.attendances.push(attendanceRecord);
    }

    // Update booking status to completed
    const bookingIndex = db.bookings.findIndex((b: any) => b.id === bookingId);
    if (bookingIndex !== -1) {
      db.bookings[bookingIndex].status =
        status === "NO_SHOW" ? "NO_SHOW" : "COMPLETED";
    }

    // Notify client
    db.notifications.push({
      id: `notif-${Date.now()}`,
      userId: clientId,
      title: "Attendance Logged",
      message: `Your session on ${new Date(booking.date).toLocaleDateString()} was marked as ${status}.`,
      type: "ATTENDANCE",
      link: "/dashboard/attendance",
      isRead: false,
      createdAt: new Date(),
    });

    saveDb(db);
    return attendanceRecord;
  },

  async getAttendanceByClient(clientId: string) {
    const db = loadDb();
    return db.attendances
      .filter((a: any) => a.clientId === clientId)
      .map((a: any) => {
        const trainer = db.users.find((u: any) => u.id === a.trainerId);
        const booking = db.bookings.find((b: any) => b.id === a.bookingId);
        return {
          ...a,
          trainer: {
            name: trainer?.name || "Trainer",
            image: trainer?.image,
          },
          booking: {
            startTime: booking?.startTime || "",
            endTime: booking?.endTime || "",
            sessionType: booking?.sessionType || "CONSULTATION",
          },
        };
      })
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getAttendanceByTrainer(trainerId: string) {
    const db = loadDb();
    return db.attendances
      .filter((a: any) => a.trainerId === trainerId)
      .map((a: any) => {
        const client = db.users.find((u: any) => u.id === a.clientId);
        const booking = db.bookings.find((b: any) => b.id === a.bookingId);
        return {
          ...a,
          client: {
            name: client?.name || "Client",
            image: client?.image,
          },
          booking: {
            startTime: booking?.startTime || "",
            endTime: booking?.endTime || "",
            sessionType: booking?.sessionType || "CONSULTATION",
          },
        };
      })
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  // FITNESS PROGRESS TRACKING
  async getProgressByClient(clientId: string) {
    const db = loadDb();
    return db.progress
      .filter((p: any) => p.clientId === clientId)
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  async addProgressEntry(data: {
    clientId: string;
    date: Date | string;
    weightKg: number;
    chestCm?: number;
    waistCm?: number;
    hipsCm?: number;
    armsCm?: number;
    thighsCm?: number;
    bodyFatPercentage?: number;
    strengthNotes?: string;
    personalNotes?: string;
    photoUrl?: string;
  }) {
    const db = loadDb();
    const newEntry = {
      id: `prog-${Date.now()}`,
      clientId: data.clientId,
      date: typeof data.date === "string" ? new Date(data.date) : data.date,
      weightKg: data.weightKg,
      chestCm: data.chestCm || null,
      waistCm: data.waistCm || null,
      hipsCm: data.hipsCm || null,
      armsCm: data.armsCm || null,
      thighsCm: data.thighsCm || null,
      bodyFatPercentage: data.bodyFatPercentage || null,
      strengthNotes: data.strengthNotes || null,
      personalNotes: data.personalNotes || null,
      photoUrl: data.photoUrl || null,
      createdAt: new Date(),
    };

    db.progress.push(newEntry);
    saveDb(db);
    return newEntry;
  },

  async deleteProgressEntry(id: string, clientId: string) {
    const db = loadDb();
    db.progress = db.progress.filter(
      (p: any) => !(p.id === id && p.clientId === clientId)
    );
    saveDb(db);
    return true;
  },

  // WORKOUT PLANS
  async getWorkoutPlansByClient(clientId: string) {
    const db = loadDb();
    return db.workoutPlans
      .filter((wp: any) => wp.clientId === clientId)
      .map((wp: any) => {
        const trainer = db.users.find((u: any) => u.id === wp.trainerId);
        return {
          ...wp,
          trainer: {
            name: trainer?.name || "Trainer",
            image: trainer?.image,
          },
        };
      });
  },

  async getWorkoutPlansByTrainer(trainerId: string) {
    const db = loadDb();
    return db.workoutPlans
      .filter((wp: any) => wp.trainerId === trainerId)
      .map((wp: any) => {
        const client = db.users.find((u: any) => u.id === wp.clientId);
        return {
          ...wp,
          client: {
            name: client?.name || "Client",
            image: client?.image,
          },
        };
      });
  },

  async createWorkoutPlan(data: {
    trainerId: string;
    clientId: string;
    title: string;
    description: string;
    targetGoal: string;
    exercises: {
      dayOfWeek: number;
      exerciseName: string;
      sets: number;
      reps: number;
      weightKg?: number;
      durationMinutes?: number;
      restSeconds: number;
      notes?: string;
    }[];
  }) {
    const db = loadDb();
    const newPlan = {
      id: `plan-${Date.now()}`,
      trainerId: data.trainerId,
      clientId: data.clientId,
      title: data.title,
      description: data.description,
      targetGoal: data.targetGoal,
      startDate: new Date(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      status: "ACTIVE" as const,
      createdAt: new Date(),
      exercises: data.exercises.map((ex, i) => ({
        id: `ex-${Date.now()}-${i}`,
        ...ex,
        orderIndex: i + 1,
      })),
    };

    db.workoutPlans.push(newPlan);

    // Notify client
    db.notifications.push({
      id: `notif-${Date.now()}`,
      userId: data.clientId,
      title: "New Workout Plan Assigned!",
      message: `Your coach assigned a new workout plan: '${data.title}'. Check it out!`,
      type: "WORKOUT",
      link: "/dashboard/workouts",
      isRead: false,
      createdAt: new Date(),
    });

    saveDb(db);
    return newPlan;
  },

  // NOTIFICATIONS
  async getNotifications(userId: string) {
    const db = loadDb();
    return db.notifications
      .filter((n: any) => n.userId === userId)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async markNotificationAsRead(id: string, userId: string) {
    const db = loadDb();
    const index = db.notifications.findIndex(
      (n: any) => n.id === id && n.userId === userId
    );
    if (index !== -1) {
      db.notifications[index].isRead = true;
      saveDb(db);
    }
    return true;
  },

  async markAllNotificationsAsRead(userId: string) {
    const db = loadDb();
    db.notifications.forEach((n: any) => {
      if (n.userId === userId) n.isRead = true;
    });
    saveDb(db);
    return true;
  },

  // PAYMENTS & EARNINGS
  async getPaymentsByUser(userId: string) {
    const db = loadDb();
    return db.payments
      .filter((p: any) => p.userId === userId)
      .map((p: any) => {
        const pkg = p.packageId ? db.packages.find((pk: any) => pk.id === p.packageId) : null;
        const booking = p.bookingId ? db.bookings.find((b: any) => b.id === p.bookingId) : null;
        return {
          ...p,
          itemTitle: pkg?.title || (booking ? `Consultation Booking` : "Fitness Service"),
        };
      })
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getTrainerEarnings(trainerUserId: string) {
    const db = loadDb();
    const trainerBookings = db.bookings.filter(
      (b: any) => b.trainerId === trainerUserId && b.status === "COMPLETED"
    );

    const profile = db.trainerProfiles.find((p: any) => p.userId === trainerUserId);
    const trainerPackageIds = db.packages
      .filter((pk: any) => pk.trainerProfileId === profile?.id)
      .map((pk: any) => pk.id);

    const packageSales = db.payments.filter(
      (p: any) => p.packageId && trainerPackageIds.includes(p.packageId) && p.status === "SUCCESS"
    );

    const consultationSales = db.payments.filter(
      (p: any) =>
        p.bookingId &&
        trainerBookings.some((b: any) => b.id === p.bookingId) &&
        p.status === "SUCCESS"
    );

    const totalPackageRevenue = packageSales.reduce((acc: number, curr: any) => acc + curr.amount, 0);
    const totalConsultationRevenue = consultationSales.reduce(
      (acc: number, curr: any) => acc + curr.amount,
      0
    );

    const grossRevenue = totalPackageRevenue + totalConsultationRevenue;
    const platformCommissionPercent = 15; // 15% platform cut
    const netEarnings = Math.round(grossRevenue * (1 - platformCommissionPercent / 100));

    return {
      grossRevenue,
      netEarnings,
      platformCut: grossRevenue - netEarnings,
      completedSessionsCount: trainerBookings.length,
      packagesSold: packageSales.length,
      recentTransactions: [...packageSales, ...consultationSales].slice(0, 10),
    };
  },

  // ADMIN ANALYTICS
  async getAdminStats() {
    const db = loadDb();
    const totalUsers = db.users.filter((u: any) => u.role === "CLIENT").length;
    const totalTrainers = db.users.filter((u: any) => u.role === "TRAINER").length;
    const verifiedTrainers = db.trainerProfiles.filter((p: any) => p.isVerified).length;
    const totalBookings = db.bookings.length;
    const completedBookings = db.bookings.filter((b: any) => b.status === "COMPLETED").length;

    const totalRevenue = db.payments
      .filter((p: any) => p.status === "SUCCESS")
      .reduce((sum: number, p: any) => sum + p.amount, 0);

    const platformCommission = Math.round(totalRevenue * 0.15);

    return {
      totalUsers,
      totalTrainers,
      verifiedTrainers,
      totalBookings,
      completedBookings,
      totalRevenue,
      platformCommission,
      recentUsers: db.users.slice(-6).reverse(),
      recentBookings: db.bookings.slice(-6).reverse().map((b: any) => {
        const client = db.users.find((u: any) => u.id === b.clientId);
        const trainer = db.users.find((u: any) => u.id === b.trainerId);
        return {
          ...b,
          clientName: client?.name || "Client",
          trainerName: trainer?.name || "Trainer",
        };
      }),
      recentPayments: db.payments.slice(-6).reverse().map((p: any) => {
        const user = db.users.find((u: any) => u.id === p.userId);
        return {
          ...p,
          userName: user?.name || "User",
        };
      }),
    };
  },

  async getAllUsers() {
    const db = loadDb();
    return db.users.map((u: any) => {
      const profile = db.trainerProfiles.find((p: any) => p.userId === u.id);
      return {
        ...u,
        trainerProfile: profile || null,
      };
    });
  },

  async deleteUser(userId: string) {
    const db = loadDb();
    db.users = db.users.filter((u: any) => u.id !== userId);
    saveDb(db);
    return true;
  },

  async addReview({
    clientId,
    trainerProfileId,
    rating,
    comment,
  }: {
    clientId: string;
    trainerProfileId: string;
    rating: number;
    comment: string;
  }) {
    const db = loadDb();
    const newRev = {
      id: `rev-${Date.now()}`,
      clientId,
      trainerProfileId,
      rating,
      comment,
      createdAt: new Date(),
    };
    db.reviews.push(newRev);

    // Update trainer rating average
    const trainerReviews = db.reviews.filter((r: any) => r.trainerProfileId === trainerProfileId);
    const avg =
      trainerReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / trainerReviews.length;

    const pIndex = db.trainerProfiles.findIndex((p: any) => p.id === trainerProfileId);
    if (pIndex !== -1) {
      db.trainerProfiles[pIndex].rating = Math.round(avg * 10) / 10;
      db.trainerProfiles[pIndex].reviewCount = trainerReviews.length;
    }

    saveDb(db);
    return newRev;
  },
};
