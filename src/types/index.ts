export type UserRole = "CLIENT" | "TRAINER" | "ADMIN";

export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type DifficultyLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type PackagePurchaseStatus = "ACTIVE" | "EXPIRED" | "COMPLETED" | "CANCELLED";

export type BookingSessionType = "CONSULTATION" | "PACKAGE_SESSION";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED"
  | "NO_SHOW";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

export type WorkoutPlanStatus = "ACTIVE" | "COMPLETED" | "ARCHIVED";

export type AttendanceStatus = "PRESENT" | "ABSENT" | "NO_SHOW";

export type NotificationType =
  | "BOOKING"
  | "PAYMENT"
  | "WORKOUT"
  | "PROGRESS"
  | "ATTENDANCE"
  | "VERIFICATION"
  | "SYSTEM";

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string | null;
  phone?: string | null;
  bio?: string | null;
  createdAt: string | Date;
}

export interface TrainerProfileWithDetails {
  id: string;
  userId: string;
  headline?: string | null;
  bio?: string | null;
  experienceYears: number;
  consultationPrice: number;
  languages: string[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  profileImage?: string | null;
  bannerImage?: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    phone?: string | null;
  };
  specializations: { id: string; name: string }[];
  certifications: {
    id: string;
    name: string;
    issuingOrg: string;
    year: number;
    certificateUrl?: string | null;
  }[];
  packages?: WorkoutPackageItem[];
  availabilities?: TrainerAvailabilityItem[];
  reviews?: ReviewItem[];
}

export interface WorkoutPackageItem {
  id: string;
  trainerProfileId: string;
  title: string;
  description: string;
  coverImage?: string | null;
  durationWeeks: number;
  sessionCount: number;
  price: number;
  trainingType: string;
  difficultyLevel: DifficultyLevel;
  includedServices: string[];
  targetGoal: string;
  isActive: boolean;
  trainerProfile?: {
    user: {
      name: string;
      image?: string | null;
    };
  };
}

export interface TrainerAvailabilityItem {
  id: string;
  trainerProfileId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  isAvailable: boolean;
}

export interface BookingItem {
  id: string;
  clientId: string;
  client: SafeUser;
  trainerId: string;
  trainer: SafeUser;
  packagePurchaseId?: string | null;
  packagePurchase?: {
    id: string;
    package: {
      title: string;
    };
    remainingSessions: number;
  } | null;
  date: string | Date;
  startTime: string;
  endTime: string;
  sessionType: BookingSessionType;
  status: BookingStatus;
  cancellationReason?: string | null;
  clientNotes?: string | null;
  trainerNotes?: string | null;
  amount: number;
  createdAt: string | Date;
  attendance?: {
    id: string;
    status: AttendanceStatus;
    notes?: string | null;
  } | null;
  payment?: {
    id: string;
    amount: number;
    status: PaymentStatus;
    razorpayPaymentId?: string | null;
  } | null;
}

export interface ProgressEntryItem {
  id: string;
  clientId: string;
  date: string | Date;
  weightKg: number;
  chestCm?: number | null;
  waistCm?: number | null;
  hipsCm?: number | null;
  armsCm?: number | null;
  thighsCm?: number | null;
  bodyFatPercentage?: number | null;
  strengthNotes?: string | null;
  personalNotes?: string | null;
  photoUrl?: string | null;
  createdAt: string | Date;
}

export interface AttendanceItem {
  id: string;
  bookingId: string;
  trainerId: string;
  clientId: string;
  date: string | Date;
  status: AttendanceStatus;
  notes?: string | null;
  recordedAt: string | Date;
  client: SafeUser;
  trainer: SafeUser;
  booking: {
    startTime: string;
    endTime: string;
    sessionType: BookingSessionType;
  };
}

export interface ReviewItem {
  id: string;
  clientId: string;
  trainerProfileId: string;
  rating: number;
  comment: string;
  createdAt: string | Date;
  client: {
    name: string;
    image?: string | null;
  };
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string | null;
  isRead: boolean;
  createdAt: string | Date;
}
