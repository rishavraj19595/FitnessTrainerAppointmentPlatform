# FitPulse - Fitness Trainer Appointment & Progress Management Platform

A complete, production-ready, full-stack Fitness Trainer SaaS platform connecting fitness coaches with clients. Features real-time appointment booking, workout package eCommerce, Razorpay payment verification, interactive body metric tracking with Recharts, trainer attendance verification, in-app notifications, and role-based access control (RBAC).

---

## 🚀 Key Platform Features

### 🏋️ Client / Athlete Experience
- **Trainer Directory**: Search and filter certified trainers by specialization, price, and ratings.
- **Detailed Trainer Profiles**: View credentials, CSCS/NASM certifications, languages, client reviews, and hourly rates.
- **Workout Package Store**: Purchase multi-session packages with session credits tracking.
- **Appointment Booking System**: Live slot selection with automated double-booking prevention.
- **Fitness Progress & Biometrics**: Interactive Recharts weight trajectory charts, circumference logs (waist, chest), and body fat percentage.
- **Workout Plan Viewer**: View prescribed daily routines, sets, reps, weight (kg), rest intervals, and mark exercises completed.
- **Attendance History**: View sessions verified by trainers with performance notes.
- **Payment History**: Official Razorpay receipts and order references.

### 💼 Coach / Trainer Experience
- **Trainer Dashboard**: Monitor today's appointments, active clients, and net earnings.
- **Profile Management**: Update professional headline, bio, consultation pricing, and specializations.
- **Package Management**: Create, price, and publish multi-week packages with included perks.
- **Availability Scheduler**: Set weekly availability slots (Monday through Sunday) with 60-minute duration intervals.
- **Client Roster & Biometrics**: Access assigned clients' weight logs and measurement history.
- **Workout Plan Builder**: Prescribe customized exercises, day splits, sets, reps, and coaching cues.
- **Attendance Logging**: Mark client attendance as **Present**, **Absent**, or **No-Show** with feedback notes.
- **Earnings & Revenue**: Real-time revenue charts with automatic 15% platform commission deductions.

### 🛡️ Admin Experience
- **Platform Analytics Hub**: Track total users, coaches, gross sales volume, and platform commission.
- **Trainer Verification**: Review coach applications and toggle **Approved** / **Rejected** / **Pending** verification badges.
- **User Management**: Audit registered users, manage roles, and delete accounts.
- **Bookings & Payments Ledger**: Full transparency across all sessions and Razorpay payment transactions.
- **Platform Settings**: Configure commission take-rate percentage, support contacts, and maintenance mode.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React, Recharts, Sonner Toasts, Radix UI Primitives, Canvas Confetti.
- **Backend**: Next.js Route Handlers & Server Actions, Node.js, Zod validation.
- **Database**: PostgreSQL with Prisma ORM (`prisma/schema.prisma`), plus a persistent local JSON fallback engine for seamless zero-config local runs.
- **Authentication**: Auth.js / NextAuth with BCrypt password hashing and role-based JWT sessions (`CLIENT`, `TRAINER`, `ADMIN`).
- **Payments**: Razorpay test-mode integration with server-side HMAC SHA-256 signature verification.

---

## 🔑 Pre-Configured Demo Accounts

Use the **1-Click Autofill** buttons on the `/login` page or use the credentials below:

| Role | Email | Password | Access Area |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@fitpulse.com` | `admin123` | `/admin/dashboard` |
| **Trainer** | `trainer1@fitpulse.com` | `trainer123` | `/trainer/dashboard` |
| **Client** | `client@fitpulse.com` | `client123` | `/dashboard` |

---

## 🗺️ Route Map

### Public Routes
- `/` - Modern Hero Landing page with categories, stats, and featured coaches
- `/trainers` - Searchable and filterable coach directory
- `/trainers/[id]` - Coach profile, packages, availability calendar, and reviews
- `/packages` - Public workout package catalogue
- `/about` - Platform mission, safety standards, and team
- `/contact` - Concierge and customer support inquiries
- `/login` - Sign-in with quick 1-click test account autofill
- `/register` - Member / client registration
- `/register/trainer` - Coach partnership application
- `/forgot-password` & `/reset-password` - Password recovery flows

### Client Dashboard (`/dashboard/*`)
- `/dashboard` - Overview, next session, active package credits, and progress snapshot
- `/dashboard/bookings` - Appointment management with cancellation and credit refunds
- `/dashboard/packages` - Purchased package cards with remaining session balances
- `/dashboard/workouts` - Active routines with interactive completion toggles
- `/dashboard/progress` - Recharts weight visualization, measurements, and PR logging
- `/dashboard/attendance` - Verified attendance logs with coach feedback
- `/dashboard/payments` - Transaction receipts and invoices
- `/dashboard/notifications` - Real-time notification center
- `/dashboard/profile` - Profile management

### Trainer Dashboard (`/trainer/*`)
- `/trainer/dashboard` - Today's appointments, client roster, and revenue
- `/trainer/profile` - Bio, certifications, hourly rates, and specializations
- `/trainer/packages` - Package builder with difficulty levels and services
- `/trainer/availability` - Weekly scheduling and hourly slots
- `/trainer/bookings` - Session requests and appointment management
- `/trainer/clients` & `/trainer/clients/[id]` - Client roster & biometrics viewer
- `/trainer/workouts` - Custom workout routine creator and exercise builder
- `/trainer/attendance` - Check-in verification (Present / Absent / No-Show)
- `/trainer/earnings` - Net payout calculations, charts, and transaction history
- `/trainer/notifications` - Trainer notifications
- `/trainer/settings` - Notification alerts and preferences

### Admin Dashboard (`/admin/*`)
- `/admin/dashboard` - Platform statistics, gross volume, and commission
- `/admin/users` - User directory and role management
- `/admin/trainers` - Trainer verification approval / rejection console
- `/admin/bookings` - Global booking audit
- `/admin/payments` - Platform payments and transaction records
- `/admin/reviews` - Review moderation
- `/admin/reports` - Analytics and financial reports
- `/admin/settings` - Platform take-rate and support settings

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.x or 20.x
- npm or pnpm

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Default `.env` configuration:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fitpulse?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="fitpulse-production-super-secret-key-32chars"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_fitpulseDemoKeyId123"
RAZORPAY_KEY_SECRET="fitpulseDemoKeySecretXYZ456"
```

### 4. Database Setup & Seeding
Generate the Prisma client:
```bash
npm run db:generate
```

Seed the platform with initial trainers, clients, bookings, and progress data:
```bash
npm run db:seed
```

*(When connecting to an external PostgreSQL instance such as Neon or Supabase, push the schema using `npm run db:push`)*.

### 5. Running the Application
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Running Tests
Run the built-in test suite:
```bash
node --test tests/platform.test.mjs
```

---

## 🔒 Security & Business Rules Implemented

1. **Transactional Double-Booking Prevention**: Validates coach availability on the server to prevent concurrent booking collisions.
2. **Package Session Consumption & Automatic Refunds**: Booking a package session deducts 1 session credit; cancelling restores the credit immediately.
3. **Cryptographic Payment Verification**: Verifies Razorpay HMAC SHA-256 signatures server-side before activating packages.
4. **Role-Based Access Control (RBAC)**: Validates `CLIENT`, `TRAINER`, and `ADMIN` permissions on every API endpoint and server action.
5. **Trainer Attendance Accountability**: Only the assigned trainer can verify session attendance and award completion check-ins.
