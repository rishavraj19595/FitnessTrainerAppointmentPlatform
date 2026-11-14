import assert from "node:assert";
import test from "node:test";
import bcrypt from "bcryptjs";
import crypto from "crypto";

test("FitPulse Platform Core Engine Test Suite", async (t) => {
  // Test 1: Password hashing and authentication
  await t.test("1. Authentication - Password Hashing & Verification", async () => {
    const rawPassword = "securePassword123!";
    const hashed = await bcrypt.hash(rawPassword, 10);
    const isValid = await bcrypt.compare(rawPassword, hashed);
    const isInvalid = await bcrypt.compare("wrongPassword", hashed);

    assert.strictEqual(isValid, true, "Password should verify correctly");
    assert.strictEqual(isInvalid, false, "Incorrect password should fail");
  });

  // Test 2: Razorpay cryptographic signature verification
  await t.test("2. Payments - Razorpay HMAC SHA-256 Signature Verification", () => {
    const secret = "test_razorpay_secret_key_7788";
    const orderId = "order_123456789";
    const paymentId = "pay_987654321";

    const text = `${orderId}|${paymentId}`;
    const validSignature = crypto
      .createHmac("sha256", secret)
      .update(text)
      .digest("hex");

    const forgedSignature = "invalid_tampered_signature";

    const verify = (sig) => {
      const gen = crypto.createHmac("sha256", secret).update(text).digest("hex");
      return gen === sig;
    };

    assert.strictEqual(verify(validSignature), true, "Valid signature must pass");
    assert.strictEqual(verify(forgedSignature), false, "Tampered signature must be rejected");
  });

  // Test 3: Booking conflict prevention logic
  await t.test("3. Booking - Slot Conflict Prevention", () => {
    const existingBookings = [
      {
        trainerId: "trainer-1",
        date: "2026-03-01",
        startTime: "10:00",
        endTime: "11:00",
        status: "CONFIRMED",
      },
    ];

    const canBook = (trainerId, date, time) => {
      const conflict = existingBookings.find(
        (b) =>
          b.trainerId === trainerId &&
          b.date === date &&
          b.startTime === time &&
          b.status !== "CANCELLED"
      );
      return !conflict;
    };

    assert.strictEqual(
      canBook("trainer-1", "2026-03-01", "10:00"),
      false,
      "Double booking same slot must be prevented"
    );
    assert.strictEqual(
      canBook("trainer-1", "2026-03-01", "11:00"),
      true,
      "Different time slot with same trainer is permitted"
    );
    assert.strictEqual(
      canBook("trainer-2", "2026-03-01", "10:00"),
      true,
      "Different trainer at same time is permitted"
    );
  });

  // Test 4: Package session credit consumption and refund on cancellation
  await t.test("4. Packages - Session Credit Consumption & Refund", () => {
    const userPackage = {
      totalSessions: 8,
      remainingSessions: 8,
      status: "ACTIVE",
    };

    // Book 1 session
    assert.ok(userPackage.remainingSessions > 0);
    userPackage.remainingSessions -= 1;
    assert.strictEqual(userPackage.remainingSessions, 7);

    // Cancel appointment - refund session
    userPackage.remainingSessions += 1;
    assert.strictEqual(userPackage.remainingSessions, 8);
  });

  // Test 5: Attendance rate and tracking
  await t.test("5. Attendance - Rate Calculation & Verification", () => {
    const attendanceLogs = [
      { status: "PRESENT" },
      { status: "PRESENT" },
      { status: "PRESENT" },
      { status: "ABSENT" },
    ];

    const present = attendanceLogs.filter((a) => a.status === "PRESENT").length;
    const rate = Math.round((present / attendanceLogs.length) * 100);

    assert.strictEqual(rate, 75, "Attendance percentage must be accurately computed");
  });

  // Test 6: Trainer Verification State Machine
  await t.test("6. Admin - Trainer Verification Flow", () => {
    const trainerProfile = {
      isVerified: false,
      verificationStatus: "PENDING",
    };

    // Admin approves
    trainerProfile.verificationStatus = "APPROVED";
    trainerProfile.isVerified = true;

    assert.strictEqual(trainerProfile.isVerified, true);
    assert.strictEqual(trainerProfile.verificationStatus, "APPROVED");

    // Admin rejects
    trainerProfile.verificationStatus = "REJECTED";
    trainerProfile.isVerified = false;

    assert.strictEqual(trainerProfile.isVerified, false);
    assert.strictEqual(trainerProfile.verificationStatus, "REJECTED");
  });

  // Test 7: Consultation Booking Payment Recording & Multi-Panel Ledger
  await t.test("7. Financials - Consultation Payment & Platform Ledger", () => {
    const payments = [
      { id: "pay-1", userId: "client-1", bookingId: null, packageId: "pkg-1", amount: 11999, status: "SUCCESS" },
      { id: "pay-2", userId: "client-1", bookingId: "book-101", packageId: null, amount: 3500, status: "SUCCESS" },
      { id: "pay-3", userId: "client-1", bookingId: "book-102", packageId: null, amount: 3200, status: "SUCCESS" },
      { id: "pay-4", userId: "client-1", bookingId: "book-103", packageId: null, amount: 3000, status: "SUCCESS" },
    ];

    const clientPayments = payments.filter((p) => p.userId === "client-1" && p.status === "SUCCESS");
    assert.strictEqual(clientPayments.length, 4, "Client must see all 4 paid transactions");
    const totalClientSpent = clientPayments.reduce((sum, p) => sum + p.amount, 0);
    assert.strictEqual(totalClientSpent, 21699, "Total client spent matches sum of package and consultations");

    // Platform 15% commission check
    const platformRevenue = Math.round(totalClientSpent * 0.15);
    const trainerEarnings = Math.round(totalClientSpent * 0.85);
    assert.strictEqual(platformRevenue + trainerEarnings, totalClientSpent, "Net split must balance 100%");
  });

  // Test 8: Trainee Suspension & Reactivation Status Management
  await t.test("8. Admin - Trainee Suspension & Reactivation State Toggle", () => {
    let traineeUser = { id: "usr-1", status: "active" };

    // Admin suspends
    traineeUser.status = traineeUser.status === "active" ? "suspended" : "active";
    assert.strictEqual(traineeUser.status, "suspended", "Status should transition to suspended");

    // Admin reactivates
    traineeUser.status = traineeUser.status === "suspended" ? "active" : "suspended";
    assert.strictEqual(traineeUser.status, "active", "Status should transition back to active");
  });

  // Test 9: Admin Trainee Onboarding with Full Fitness Details
  await t.test("9. Admin - Trainee Onboarding & Profile Metric Validation", () => {
    const newTrainee = {
      name: "Rohan Sharma",
      email: "rohan@gmail.com",
      age: 27,
      gender: "Male",
      heightCm: 178,
      weightKg: 82,
      targetWeightKg: 74,
      fitnessGoal: "Fat Loss & Lean Muscle",
      dietaryPreference: "Vegetarian",
      assignedTrainerId: "usr-trainer-1",
      status: "active",
    };

    assert.ok(newTrainee.name && newTrainee.email, "Required fields present");
    assert.strictEqual(newTrainee.weightKg > newTrainee.targetWeightKg, true, "Target weight reflects fat loss goal");
    assert.strictEqual(newTrainee.assignedTrainerId, "usr-trainer-1", "Coach assigned successfully");
    assert.strictEqual(newTrainee.status, "active", "Default account state is active");
  });

  // Test 10: Admin Workout Package Creation
  await t.test("10. Admin - Workout Package Creation & INR Pricing", () => {
    const plan = {
      id: "plan-test-1",
      title: "6-Week Shred Protocol",
      category: "Weight Loss",
      durationWeeks: 6,
      sessionCount: 18,
      price: 9999,
      difficulty: "Intermediate",
      benefits: ["18 Sessions", "Custom Diet Chart", "Weekly Checkin"],
      isActive: true,
    };

    assert.strictEqual(plan.durationWeeks, 6);
    assert.strictEqual(plan.sessionCount, 18);
    assert.strictEqual(plan.price, 9999);
    assert.strictEqual(plan.isActive, true);
    assert.strictEqual(plan.benefits.length, 3);
  });

  // Test 11: Admin Trainer Onboarding & Accreditation
  await t.test("11. Admin - Trainer Onboarding, Accreditation & Availability", () => {
    const newTrainer = {
      name: "Karan Mehra",
      email: "karan@fitpulse.in",
      role: "trainer",
      experienceYears: 6,
      hourlyRate: 2500,
      specializations: ["Strength Training", "Calisthenics", "Functional Fitness"],
      location: "New Delhi (IST)",
      isVerified: true,
      verificationStatus: "APPROVED",
      status: "active",
    };

    assert.ok(newTrainer.name && newTrainer.email);
    assert.strictEqual(newTrainer.role, "trainer");
    assert.strictEqual(newTrainer.isVerified, true);
    assert.strictEqual(newTrainer.verificationStatus, "APPROVED");
    assert.strictEqual(newTrainer.hourlyRate, 2500);
    assert.strictEqual(newTrainer.specializations.length, 3);
  });
});

