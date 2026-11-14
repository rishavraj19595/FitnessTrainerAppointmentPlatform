# FitPulse (India) - Fitness Trainer Appointment & Management Platform

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![JavaScript](https://img.shields.io/badge/Language-JavaScript%20(Pure)-yellow?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-black?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2B%20Mongoose-emerald?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Razorpay](https://img.shields.io/badge/Payments-Razorpay%20(%E2%82%B9%20INR)-blue?style=for-the-badge)](https://razorpay.com/)
[![License](https://img.shields.io/badge/License-MIT-zinc?style=for-the-badge)](LICENSE)

---

## 📌 1. Project Overview & Mission

**FitPulse** is an enterprise-grade, full-stack Fitness Trainer Appointment & Gym Operations SaaS platform engineered specifically for the Indian fitness and strength training industry.

Designed with a high-contrast **black and white minimalist aesthetic** and built exclusively using **pure JavaScript (`.js` and `.jsx`)**, FitPulse bridges the gap between certified personal trainers, gym trainees, and gym administrators. The platform incorporates transparent Indian Rupee (`₹ INR`) pricing, Indian Standard Time (`IST`) session slot scheduling, regional Indian dietary planning (Vegetarian, Eggetarian, Non-Vegetarian, Jain, Vegan), automated double-booking prevention, Razorpay payment verification, trainer attendance tracking, and deep administrative control.

### Core Architecture Pillars
- **Zero TypeScript Policy**: Built 100% in pure ECMAScript and React JSX. No `.ts` or `.tsx` files, no compile-time interfaces, maintaining maximum runtime agility.
- **Role-Based Access Control (RBAC)**: Strict segregation among three primary roles: **Trainee**, **Trainer**, and **Admin**. Users are physically prevented from accessing routes or API records outside their privilege level.
- **Tab/Window Close Auto-Logout**: Zero-trace security architecture utilizing client-side `sessionStorage` tab-state monitors and HTTP session cookies to ensure closing browser tabs automatically terminates active sessions.
- **Dual-Engine Persistence**: Native MongoDB Mongoose models paired with a zero-dependency JSON database engine for instant local evaluation without requiring external database provisioning.

---

## 🇮🇳 2. Tailored for the Indian Fitness Industry

Unlike generic Western workout templates, FitPulse is purpose-built to address the structural realities of Indian commercial gyms and freelance personal training:

1. **Currency & Banking**: Standardized on Indian Rupee (`₹ INR`) across all consultation hourly rates, package tiers, trainer earnings, and Razorpay test payment surfaces.
2. **Timezone Standardization**: All workout schedules, client appointments, and slot availability management run strictly on Indian Standard Time (`IST`, UTC+5:30).
3. **Indian Nutrition & Diet Charts**: Support for traditional Indian dietary staples including Paneer Bhurji, Soya Chunks Curry, Thick Moong Dal, Brown Rice, Multigrain Rotis, Curd, Sprouts, and Sattu protein targets.
4. **Trainer Accreditation**: Recognition of premier Indian and international credentials including **K11 School of Fitness Sciences**, **CSCS (NSCA)**, **ACE (American Council on Exercise)**, and **NASM**.
5. **Platform Economics**: Automated 15% platform fee retention and 85% net coach payout calculations across single sessions and multi-week training tiers.

---

## 🛠️ 3. Technology Stack & Design System

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Next.js 14.2 (App Router) | Dynamic server-side rendering, API route handlers, and client components |
| **Language** | JavaScript (ES6+ / JSX) | 100% pure JavaScript with zero TypeScript overhead or dependencies |
| **Styling** | Tailwind CSS 3.4 | Custom black, white, and zinc palette with high-contrast typography |
| **UI Icons** | Lucide React | High-performance scalable SVG icons |
| **Notifications** | Sonner | Rich, responsive toast notifications with light/dark feedback states |
| **Database** | MongoDB & Mongoose | Flexible NoSQL schemas with local JSON-file mirrored fallback engine |
| **Authentication** | NextAuth.js (Auth.js) | JWT session strategy, BCrypt password hashing, session cookies |
| **Payments** | Razorpay SDK | Razorpay order generation, modal checkout, and HMAC SHA-256 verification |
| **Charts** | Recharts & SVG | Progress tracking, weight trajectories, and financial analytics |
| **Testing** | Node.js Test Runner | Native ESM test suite with zero external assertion bloat |

### Design System Principles
- **Black, White & Zinc**: Bold black headers, crisp white surface cards, and subtle zinc borders.
- **Indian Typography**: Prominent `₹` symbol placement, uppercase metadata labels, and high readability.
- **Tactile Feedback**: Micro-transitions, focus rings (`focus:ring-black`), and accessible interactive states.

---

## 👥 4. Role-Based Dashboards & Feature Sets

FitPulse features three completely decoupled, secure dashboards tailored to user responsibilities:

### 4.1 Trainee Experience (`/trainee/*`)
Designed for gym members and personal training clients:
- **Welcome & Daily Overview (`/trainee/dashboard`)**:
  - Time-based greeting (`Good morning / Good afternoon / Good evening, <Name>`).
  - Active personal coach summary with 1-click consultation booking.
  - Quick metrics: Attendance percentage, completed workouts, and weight trajectory.
  - Upcoming scheduled sessions with direct calendar links.
- **Coach Discovery & Booking (`/trainee/trainers`)**:
  - Searchable directory of verified coaches by name and specialization (Strength, Fat Loss, Hypertrophy, PCOS).
  - High-res trainer photo cards displaying experience years, hourly rates (`₹/hr`), and average ratings (`★ 4.9+`).
  - Interactive appointment booking modal with morning and evening IST slot selections.
  - Dynamic checkout via Razorpay online test surface.
  - **Visitor Friendly**: Unauthenticated visitors can freely browse coaches without seeing the private trainee sidebar until they log in.
- **My Appointments (`/trainee/bookings`)**:
  - Live list of confirmed, completed, and pending appointments.
  - Booking cancellation with automatic slot release.
- **Fitness Progress Tracking (`/trainee/progress`)**:
  - Interactive weight trajectory charts comparing starting weight vs. current weight vs. target weight.
  - Historical body composition logging.
- **Daily Workout Tasks (`/trainee/workouts`)**:
  - Prescriptions assigned directly by their personal coach.
  - View target sets, repetitions range, barbell/dumbbell weight (`kg`), and coach cues.
  - One-click task completion status toggles.
- **Indian Diet Chart (`/trainee/diet`)**:
  - Daily calorie targets, target protein (g), carbs (g), and fats (g).
  - Daily hydration directives in Liters (`L`).
  - Meal breakdowns: Breakfast, Mid-Morning, Lunch, Evening Snack, Dinner, and Post-Workout.
- **Transaction History (`/trainee/payments`)**:
  - Transparent itemized payment logs with Razorpay order IDs and payment timestamps.
- **Trainee Profile (`/trainee/profile`)**:
  - Manage personal biometrics: Age, Gender, Height (cm), Weight (kg), Fitness Goal, Dietary Preference, and Medical Notes.

---

### 4.2 Trainer Experience (`/trainer/*`)
A dedicated command center for certified personal fitness trainers:
- **Trainer Overview (`/trainer/dashboard`)**:
  - Time-based dynamic greeting (`Good morning / Good afternoon / Good evening, Coach <Name>`).
  - Real-time stat cards: Total Assigned Trainees, Verified Attendance, and Monthly Net Earnings (`₹ INR`).
  - Rapid shortcuts to attendance marking and routine creation.
- **Client Roster (`/trainer/trainees`)**:
  - Exclusive access to trainees assigned directly to the coach.
  - View client fitness goals, current weight, dietary preferences, and session attendance percentage.
- **Attendance Verification (`/trainer/attendance`)**:
  - Mark trainees **PRESENT** or **ABSENT** for daily training appointments.
  - Add session feedback notes (e.g., *"Completed deadlift PR of 120kg. Great bracing."*).
  - Automatically updates the trainee's attendance percentage.
- **Workout Programmer (`/trainer/workouts`)**:
  - Create and publish periodized lifting routines for individual trainees.
  - **Clear Table Column Headers**: Prominently displays `EXERCISE NAME`, `SETS (COUNT)`, `REPS (RANGE)`, `WEIGHT (KG)`, and `DELETE`.
  - Add or delete exercise rows on the fly with custom coach technique cues.
- **Diet Chart Manager (`/trainer/diet`)**:
  - Build customized Indian meal plans for specific trainees.
  - Set daily calorie goals, macro targets (protein, carbs, fats), and water directives.
  - **Structured Meal Table**: High-contrast headers for `MEAL TYPE`, `TIME (IST)`, `FOOD ITEMS & PORTIONS`, `CALORIES (KCAL)`, and `PROTEIN (G)`.
- **Availability & Slot Scheduler (`/trainer/schedule`)**:
  - Configure weekly working days (Monday through Saturday).
  - Set consultation working hours (e.g., `07:00 AM` to `08:00 PM`).
  - Automatically prevents double bookings for the same coach.
- **Earnings & Financials (`/trainer/earnings`)**:
  - Transparent payout tracking displaying 85% net coach earnings.
  - Monthly revenue graphs and completed consultation logs.
- **Trainer Profile Management (`/trainer/profile`)**:
  - Edit professional headline, biography, certifications, languages, and hourly consultation rate (`₹/hr`).

---

### 4.3 Admin Experience (`/admin/*`)
Full administrative oversight and control over the platform ecosystem:
- **Administrative Command Center (`/admin/dashboard`)**:
  - Macro platform analytics: Total Trainees, Total Trainers, Verified Coaches, Total Bookings, and Gross Sales Volume.
  - Financial split analytics: Gross Platform Revenue vs. 15% Platform Commission vs. Trainer Payouts.
- **Trainee & Account Management (`/admin/trainees`)**:
  - Roster of all registered trainees.
  - **Suspend & Reactivate**: One-click account suspension and reactivation. Suspended accounts are immediately blocked at authentication.
  - **Onboard New Trainee**: Admin modal to register a new member with full credentials, age, gender, height, weight, fitness goals, diet preference, and assigned coach.
  - **Reassign Coach**: Reassign personal trainers to trainees directly from a dropdown.
- **Trainer Accreditation Hub (`/admin/trainers`)**:
  - Audit trainer profiles, experience, and certifications.
  - **Approve / Reject / Revoke**: Control whether a coach is publicly bookable.
  - **`+ Add New Trainer`**: Modal to onboard certified coaches with their credentials, hourly rates, specializations, certifications, and initial approved status.
- **Workout Packages & Pricing (`/admin/workout-plans`)**:
  - Browse active training package tiers.
  - **`+ Create New Workout Plan`**: Define new workout plans with title, category, description, duration in weeks, session count, difficulty, price in `₹ INR`, and itemized benefits.
- **Bookings Master Ledger (`/admin/bookings`)**:
  - Audit every appointment booked across the entire platform.
- **Platform Payments (`/admin/payments`)**:
  - Ledger of all Razorpay transactions, platform fee cuts, and payout records.
- **Platform Settings (`/admin/settings`)**:
  - Configure platform commission rates, support email, phone numbers, and operational flags.

---

## 🔒 5. Key Functional Modules & Implementation Details

### 5.1 Dynamic Greeting & Navigation System
- Implemented in `components/layout/Navbar.jsx`.
- Calculates current Indian Standard Time hour (`hour = new Date().getHours()`).
- Returns:
  - `04:00 - 11:59`: `Good morning, Coach <Name>` (or `Good morning, <Name>`)
  - `12:00 - 16:59`: `Good afternoon, Coach <Name>`
  - `17:00 - 03:59`: `Good evening, Coach <Name>`
- **Logged-In Behavior**: When a user or trainer is signed in, public marketing links (`Find Trainers`, `Workout Packages`, `How It Works`) are removed from the center navbar and replaced by the friendly dynamic greeting.

### 5.2 Window / Tab Close Auto-Logout Architecture
To comply with strict enterprise SaaS session hygiene:
1. **Session-Scoped Storage (`sessionStorage`)**:
   - When a user logs in via `/login` or registers via `/signup`, `sessionStorage.setItem("fitpulse_session_active", "true")` is set.
   - Unlike `localStorage`, `sessionStorage` is destroyed by the browser the moment the window or tab is closed.
2. **SessionTabWatcher (`components/providers.jsx`)**:
   - Watches the authentication status.
   - If an authenticated session is detected on load, it checks for the presence of `fitpulse_session_active`.
   - If missing (e.g., tab or window was closed and reopened fresh), it queries sibling tabs via `BroadcastChannel("fitpulse_tab_channel")`.
   - If no other sibling tab confirms an active session within 300ms, it executes `signOut({ redirect: true, callbackUrl: "/login?reason=session_ended" })`.
3. **Session Cookies**:
   - Configured in `lib/auth.js` without persistent `maxAge`, ensuring the browser discards the session token upon closing the browser application.

### 5.3 Account Suspension State Machine
- When an administrator clicks **"Suspend"** on `/admin/trainees`:
  - `status` is toggled to `"suspended"`.
  - In `lib/auth.js`, the `authorize` credential callback verifies `user.status !== "suspended"`.
  - If a suspended user attempts to log in, NextAuth throws:
    > *"Your account has been suspended by administration. Please contact support."*
  - In `SessionTabWatcher`, if an already-logged-in user's session token reflects `"suspended"`, they are immediately logged out.
- When an administrator clicks **"Reactivate"**:
  - `status` transitions back to `"active"`, immediately restoring login and booking capabilities.

### 5.4 Razorpay Payment Flow & Financial Ledger
1. Trainee initiates booking on `/trainee/trainers`.
2. Frontend requests `/api/payments/create-order` with trainer ID and hourly rate.
3. Server initializes a Razorpay order entity and stores the record with `status: "PENDING"`.
4. Trainee completes the simulated Razorpay test checkout surface.
5. Verification occurs at `/api/payments/verify`:
   - Validates the HMAC SHA-256 signature against `RAZORPAY_KEY_SECRET`.
   - Updates payment status to `"SUCCESS"`.
   - Records the 15% platform commission and 85% coach net payout.
   - Generates the confirmed appointment record and sends notifications to both trainee and coach.

---

## 📂 6. File & Directory Structure

```text
FitnessTrainerAppointmentPlatform/
├── app/                                    # Next.js 14 App Router Root
│   ├── layout.js                           # Root application layout with Providers & Navbar
│   ├── page.js                             # Public marketing homepage
│   ├── login/                              # Authentication: Sign-in page
│   │   └── page.js
│   ├── signup/                             # Authentication: Sign-up page
│   │   └── page.js
│   ├── forgot-password/                    # Password reset flow
│   │   └── page.js
│   ├── trainers/                           # Public coach redirect route
│   │   └── page.js
│   ├── trainee/                            # Trainee Dashboard Module
│   │   ├── layout.js                       # Conditional Trainee Layout (Hides sidebar before login)
│   │   ├── dashboard/page.js               # Trainee personal overview
│   │   ├── trainers/page.js                # Public / Member trainer search & booking
│   │   ├── bookings/page.js                # Training appointments & schedule
│   │   ├── progress/page.js                # Weight & fitness progress tracker
│   │   ├── workouts/page.js                # Daily prescribed workout tasks
│   │   ├── diet/page.js                    # Nutrition & Indian diet chart view
│   │   ├── payments/page.js                # Payment history & receipts
│   │   └── profile/page.js                 # Personal biometrics management
│   ├── trainer/                            # Trainer Dashboard Module
│   │   ├── layout.js                       # Trainer layout with role sidebar
│   │   ├── dashboard/page.js               # Coach command center & greeting
│   │   ├── trainees/page.js                # Assigned trainee roster
│   │   ├── attendance/page.js              # Daily session check-in verification
│   │   ├── workouts/page.js                # Exercise prescriptions table & routines
│   │   ├── diet/page.js                    # Indian diet schedule builder & macros
│   │   ├── schedule/page.js                # Weekly working hours & availability
│   │   ├── earnings/page.js                # Net earnings (85%) & payout history
│   │   └── profile/page.js                 # Coach bio, certifications & rate
│   ├── admin/                              # Administrator Control Module
│   │   ├── layout.js                       # Admin layout with admin sidebar
│   │   ├── dashboard/page.js               # Executive analytics & platform stats
│   │   ├── trainees/page.js                # Trainee management, suspend/reactivate & add
│   │   ├── trainers/page.js                # Trainer verification & add new trainer modal
│   │   ├── workout-plans/page.js           # Package catalogue & add plan builder
│   │   ├── bookings/page.js                # Master appointment ledger
│   │   ├── payments/page.js                # Platform transaction ledger
│   │   ├── analytics/page.js               # Revenue & attendance reports
│   │   └── settings/page.js                # Commission & platform configurations
│   └── api/                                # Backend Next.js Route Handlers
│       ├── admin/route.js                  # Administrative management endpoints
│       ├── attendance/route.js             # Session attendance operations
│       ├── auth/
│       │   ├── [...nextauth]/route.js      # NextAuth authentication handler
│       │   └── register/route.js           # Member & coach registration endpoint
│       ├── bookings/route.js               # Booking creation & slot validation
│       ├── diet/route.js                   # Diet chart creation & updates
│       ├── payments/
│       │   ├── route.js                    # Transaction history fetching
│       │   ├── create-order/route.js       # Razorpay order generation
│       │   └── verify/route.js             # HMAC SHA-256 signature verification
│       ├── trainees/route.js               # Trainee roster & profiles
│       ├── trainers/route.js               # Trainer catalog & filtering
│       └── workouts/route.js               # Workout routine assignment & completion
├── components/                             # Reusable UI & Layout Components
│   ├── forms/
│   │   └── PaymentModal.jsx                # Razorpay test checkout modal
│   ├── layout/
│   │   ├── Navbar.jsx                      # Sticky top navigation with dynamic greeting
│   │   ├── Sidebar.jsx                     # High-contrast role-based sidebar
│   │   └── Footer.jsx                      # Indian gym SaaS branding footer
│   ├── ui/
│   │   ├── Badge.jsx                       # Variant badge badges
│   │   ├── Button.jsx                      # Primary, ghost & outline buttons
│   │   ├── Card.jsx                        # Standard cards & StatCard widgets
│   │   └── Modal.jsx                       # Reusable accessible dialog backdrop
│   └── providers.jsx                       # SessionProvider & SessionTabWatcher
├── lib/                                    # Core Utility & Service Layer
│   ├── auth.js                             # NextAuth options, JWT callbacks & session cookies
│   ├── db.js                               # Unified Database Service (Fallback engine + Mongo)
│   ├── mongodb.js                          # Mongoose connection manager
│   ├── razorpay.js                         # Razorpay client & HMAC SHA-256 validator
│   └── utils.js                            # formatINR, formatDateIST, cn utility
├── models/                                 # Mongoose Data Models (Pure JavaScript)
│   ├── User.js                             # Base user schema (trainee, trainer, admin)
│   ├── TrainerProfile.js                   # Trainer accreditation, rate & bio
│   ├── TraineeProfile.js                   # Trainee biometrics & health profile
│   ├── Booking.js                          # Session appointments & slot times
│   ├── Attendance.js                       # Attendance check-ins (PRESENT / ABSENT)
│   ├── WorkoutPlan.js                      # Multi-week workout packages
│   ├── WorkoutTask.js                      # Daily exercise prescriptions & sets/reps
│   ├── DietChart.js                        # Daily meal schedules, macros & water
│   ├── Payment.js                          # Razorpay transaction ledger
│   ├── TrainerAvailability.js              # Weekly availability hours
│   ├── Review.js                           # Trainee reviews & star ratings
│   └── Notification.js                     # In-app notifications
├── tests/
│   └── platform.test.mjs                   # 12-test automated verification suite
├── .env.example                            # Template environment configurations
├── jsconfig.json                           # JavaScript path alias configurations (`@/*`)
├── next.config.mjs                         # Next.js build & external packages config
├── package.json                            # Scripts, dependencies, and metadata
├── postcss.config.mjs                      # PostCSS plugins
└── tailwind.config.js                      # Tailwind theme & design tokens
```

---

## 🗄️ 7. Database Schemas (12 Mongoose Models)

All database models reside in `/models` and are written exclusively in **pure JavaScript**:

1. **`User.js`**: Core authentication record with `name`, `email`, `password` (bcrypt hash), `role` (`trainee`, `trainer`, `admin`), `phone`, `avatar`, and `status` (`active`, `suspended`, `pending`).
2. **`TrainerProfile.js`**: Coach details referencing `User`. Contains `headline`, `bio`, `experienceYears`, `specializations` (Array), `certifications` (Array of title/org/year), `hourlyRate`, `rating`, `reviewCount`, `isVerified`, `verificationStatus` (`PENDING`, `APPROVED`, `REJECTED`), `location`, and `languages`.
3. **`TraineeProfile.js`**: Member biometrics referencing `User`. Contains `assignedTrainer` (ref `User`), `age`, `gender`, `heightCm`, `weightKg`, `targetWeightKg`, `fitnessGoal`, `activityLevel`, `dietaryPreference`, `medicalConsiderations`, and `trainingExperience`.
4. **`Booking.js`**: Appointment bookings referencing `traineeId`, `trainerId`, and optional `workoutPlanId`. Contains `date`, `startTime`, `endTime`, `sessionType` (`CONSULTATION`, `PACKAGE_SESSION`), `status` (`CONFIRMED`, `COMPLETED`, `CANCELLED`), and `amount`.
5. **`Attendance.js`**: Verified attendance logs referencing `trainerId`, `traineeId`, and `bookingId`. Tracks `date`, `status` (`PRESENT`, `ABSENT`), `notes`, and `markedAt`.
6. **`WorkoutPlan.js`**: Training packages featuring `title`, `description`, `category`, `durationWeeks`, `sessionCount`, `price` (in ₹ INR), `difficulty`, `benefits` (Array of strings), and `isActive`.
7. **`WorkoutTask.js`**: Periodized routines assigned by trainers. Contains `title`, `description`, `dayOfWeek`, `exercises` (Array of objects: `name`, `sets`, `reps`, `weightKg`, `restSeconds`, `instructions`), `status` (`PENDING`, `COMPLETED`), and `completedAt`.
8. **`DietChart.js`**: Nutrition schedules assigned by trainers. Contains `title`, `dailyCalories`, `targetProtein`, `targetCarbs`, `targetFats`, `waterIntakeLiters`, `instructions`, and `meals` (Array of objects: `mealType`, `timing`, `items`, `calories`, `proteinGrams`).
9. **`Payment.js`**: Razorpay financial records with `userId`, `bookingId`, `workoutPlanId`, `amount`, `currency` (`INR`), `paymentMethod`, `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature`, `platformFee` (15%), `trainerPayout` (85%), and `status` (`SUCCESS`, `PENDING`, `FAILED`).
10. **`TrainerAvailability.js`**: Weekly consultation slots. Tracks `trainerId`, `dayOfWeek`, `startTime`, `endTime`, `slotDurationMinutes`, and `isAvailable`.
11. **`Review.js`**: Client testimonials with `trainerId`, `traineeId`, `rating` (1–5), `comment`, and `date`.
12. **`Notification.js`**: In-app alerts with `userId`, `title`, `message`, `type` (`BOOKING`, `ATTENDANCE`, `DIET`, `WORKOUT`, `SYSTEM`), `link`, and `isRead`.

---

## 🌐 8. API Reference Documentation

All endpoints are hosted under `/api` and feature Next.js 14 `force-dynamic` execution.

### Authentication & Trainees
- **`POST /api/auth/register`**: Register a new trainee or coach account.
  - Body: `{ name, email, password, role, phone, specializations, hourlyRate, experienceYears }`
- **`GET /api/trainees`**: Retrieve trainees. Returns assigned trainees for coaches or full roster for admins.
- **`GET /api/trainers`**: Browse certified trainers.
  - Query parameters: `?search=karan&specialization=Strength&verifiedOnly=true`

### Administrative Control (`/api/admin`)
- **`GET /api/admin`**: Fetches macro metrics (total trainees, trainers, revenue, commissions).
  - Query parameters: `?type=plans` returns all workout packages.
- **`POST /api/admin`**: Handles administrative actions:
  - `action: "verifyTrainer"`: `{ trainerProfileId, status: "APPROVED" | "REJECTED" }`
  - `action: "assignTrainee"`: `{ traineeId, trainerId }`
  - `action: "updateUserStatus"`: `{ userId, status: "active" | "suspended" }`
  - `action: "createTrainee"`: Full trainee onboarding payload (personal, physical, goals, coach).
  - `action: "createTrainer"`: Full coach onboarding payload (personal, headline, rate, specializations, certifications).
  - `action: "createWorkoutPlan"`: Workout plan creation payload (title, category, duration, sessions, price, benefits).

### Bookings & Attendance
- **`GET /api/bookings`**: Retrieve bookings filtered by session role.
- **`POST /api/bookings`**: Create a booking slot with collision checking.
- **`GET /api/attendance`**: Fetch verified check-ins.
- **`POST /api/attendance`**: Trainer marks session attendance (`PRESENT` / `ABSENT` with feedback notes).

### Routines & Nutrition
- **`GET /api/workouts`**: Retrieve prescribed workout tasks.
- **`POST /api/workouts`**: Coach creates a new routine with sets, reps, and weights.
- **`PATCH /api/workouts`**: Trainee marks routine completed.
- **`GET /api/diet`**: Retrieve active diet chart.
- **`POST /api/diet`**: Coach publishes meal schedules, macro targets, and hydration notes.

### Payments (`/api/payments`)
- **`POST /api/payments/create-order`**: Generates a Razorpay order entity with calculated ₹ INR amounts.
- **`POST /api/payments/verify`**: Verifies HMAC SHA-256 signature and records 15%/85% splits.

---

## ⚡ 9. Installation & Getting Started

### Prerequisites
- **Node.js**: v18.17.0 or higher
- **npm** or **pnpm**
- **MongoDB**: Local MongoDB instance or free MongoDB Atlas cluster URI

### Step-by-Step Setup

1. **Clone Repository**:
   ```bash
   git clone https://github.com/your-username/fitness-trainer-appointment-platform.git
   cd FitnessTrainerAppointmentPlatform
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (see Section 10).

4. **Run Platform Test Suite**:
   Verify core engines, HMAC cryptographic signatures, and RBAC rules:
   ```bash
   node tests/platform.test.mjs
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

6. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 🔐 10. Environment Variables (`.env`)

Create a `.env` file in the project root:

```env
# Database Connections
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/fitpulse?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=fitpulse-production-super-secret-jwt-signing-key-32chars-minimum

# Razorpay Payment Gateway (Test Mode Keys)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_51Abcdef123456
RAZORPAY_KEY_SECRET=secret_test_xyz987654321

# Platform Operational Defaults
NEXT_PUBLIC_PLATFORM_NAME="FitPulse India"
NEXT_PUBLIC_SUPPORT_EMAIL="support@fitpulse.in"
NEXT_PUBLIC_DEFAULT_CURRENCY="INR"
```

> **Note**: If `MONGODB_URI` is omitted or temporarily unreachable, the platform's self-healing persistence engine gracefully operates using the mirrored local JSON database, ensuring 100% feature continuity for testing.

---

## 🧪 11. Automated Test Suite

FitPulse includes an automated native verification suite (`tests/platform.test.mjs`) covering 12 mission-critical platform subsystems:

```bash
node tests/platform.test.mjs
```

### Verified Test Cases
1. **Password Hashing & Verification**: BCrypt salt generation and hash comparison.
2. **Cryptographic Payments**: Razorpay HMAC SHA-256 signature computation and tamper rejection.
3. **Slot Conflict Engine**: Double-booking collision prevention for same coach, date, and hour.
4. **Package Session Deductions**: Session credit decrements on booking and refunds upon cancellation.
5. **Attendance Percentage**: Accurate attendance rate calculation over historical logs.
6. **Trainer Verification Flow**: State machine validation for coach approval and rejection.
7. **Financial Ledger & Split**: 15% platform take-rate and 85% coach net payout calculation balancing to 100%.
8. **Trainee Suspension & Reactivation**: Access state transitions and authentication lock verification.
9. **Trainee Metric Validation**: Biometric verification (height, weight, target weight, diet preference).
10. **Workout Package Creation**: Multi-week plan structure with ₹ INR pricing validation.
11. **Trainer Onboarding & Availability**: Automated weekly availability slot generation for newly added coaches.
12. **Role Segregation & Session Hygiene**: RBAC route access verification.

---

## 🔑 12. Pre-Configured Demo Accounts

For demonstration and quality assurance, pre-seeded accounts are readily available:

| Role | Email Address | Password | Landing Page | Key Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | `admin@fitpulse.in` | `Password123!` | `/admin/dashboard` | Suspend/reactivate trainees, add coaches, publish packages, financial ledger |
| **Certified Coach** | `vikram@fitpulse.in` | `Password123!` | `/trainer/dashboard` | Prescribe exercises, build Indian diet charts, mark attendance, track earnings |
| **Certified Coach** | `ananya@fitpulse.in` | `Password123!` | `/trainer/dashboard` | PCOS & women's fat loss coaching, schedule consultations, view trainees |
| **Gym Trainee** | `rahul@gmail.com` | `Password123!` | `/trainee/dashboard` | Book sessions, view exercise tasks, view diet plan, Razorpay payment |
| **Gym Trainee** | `sneha@gmail.com` | `Password123!` | `/trainee/dashboard` | View attendance, track weight progress, browse certified trainers |

> **Quick Autofill**: You can also use the one-click quick login buttons on the `/login` page to sign into any role instantly.

---

## 📜 13. Security & Operational Standards

- **Bcrypt Password Security**: Passwords salted with 10 rounds; plaintext passwords are never stored.
- **Protected APIs**: Every route handler inspects session tokens via `getServerSession(authOptions)` and enforces role checks.
- **HMAC Verification**: Server-side verification for every online Razorpay payment.
- **Client Sanitization**: All user inputs sanitized to eliminate Cross-Site Scripting (XSS).
- **Session Disposal**: Zero persistent credentials left in browser memory upon window/tab closure.

---

## ❓ 14. Troubleshooting & Frequently Asked Questions (FAQ)

### Q1: How do I resolve `EADDRINUSE: address already in use :::3000`?
If port 3000 is occupied by a background process on Windows, find and terminate the active listener:
```powershell
# Identify the Process ID (PID) listening on port 3000
netstat -ano | findstr :3000

# Terminate the process (replace <PID> with the actual process ID)
taskkill /F /PID <PID>
```

### Q2: Why does closing the browser tab log me out automatically?
This is an intentional enterprise security feature (`SessionTabWatcher`). The platform ties authentication lifetime to browser tab activity through `sessionStorage` and transient browser session cookies. If a user closes all active tabs or the browser window, the session key is discarded. When reopened, the user is redirected to `/login?reason=session_ended` to prevent unauthorized physical access.

### Q3: Why is the sidebar hidden when browsing trainers on the homepage?
Visitors browsing coaches via the *"Find Trainers"* link on the homepage are prospective clients who may not yet have an account. The platform dynamically renders the trainer catalog in a clean, full-width layout without dashboard links until they sign in or register. Once authenticated, the complete Trainee sidebar appears automatically.

### Q4: Can I test the platform without a live MongoDB Atlas connection?
Yes. FitPulse features a resilient dual-engine persistence layer. If `MONGODB_URI` is not configured or offline, the platform automatically switches to its high-speed local JSON database mirror. All CRUD operations (creating trainers, assigning routines, marking attendance, creating workout packages) persist across restarts.

### Q5: How do I test the Razorpay payment gateway?
The platform comes equipped with a Razorpay test surface modal. When booking a 1-on-1 session or purchasing a package:
1. Click **"Book Session"** or select a package.
2. Select an available IST date and slot time.
3. Click **"Proceed to Secure Checkout"**.
4. The Razorpay simulated payment modal will open with pre-filled test credentials.
5. Click **"Complete Simulated Test Payment"** to trigger server-side HMAC SHA-256 verification and confirm the appointment.

---

## 🚀 15. Roadmap & Future Enhancements

- [ ] **WhatsApp Business API Integration**: Automated WhatsApp appointment reminders 2 hours before scheduled IST gym sessions.
- [ ] **InBody & DEXA Scan Uploads**: Direct PDF parsing for body composition and visceral fat tracking.
- [ ] **Custom Exercise Video Library**: Embedded video demonstrations for Indian vernacular gym trainees (Hindi, Marathi, Bengali, Tamil).
- [ ] **UPI AutoPay Subscriptions**: Monthly recurring gym personal training fee deductions via Razorpay Subscriptions.
- [ ] **Live Video Consultations**: WebRTC-based 1-on-1 live virtual coaching rooms directly in the dashboard.

---

## 🤝 16. Contributing & Code Standards

We welcome contributions from fitness and technology enthusiasts. Please follow these guidelines:

1. **Pure JavaScript**: Strictly avoid introducing TypeScript syntax, `.ts`, or `.tsx` files.
2. **Component Conventions**: Keep components modular, self-contained, and placed under `/components`.
3. **Styling Consistency**: Adhere to the established high-contrast black, white, and zinc minimalist theme.
4. **Test Verification**: Always execute `node tests/platform.test.mjs` before committing changes to ensure zero regressions across core engines.

### Development Workflow
```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Run test suite
node tests/platform.test.mjs

# Build and verify production compilation
npm run build

# Commit changes
git commit -m "feat: describe your feature"
```

---

## 📄 17. License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  <b>FitPulse India</b> • Engineered for Elite Indian Strength & Fitness Training
</p>
