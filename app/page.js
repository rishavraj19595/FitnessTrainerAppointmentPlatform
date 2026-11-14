import React from "react";
import Link from "next/link";
import {
  Dumbbell,
  CheckCircle2,
  Star,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Utensils,
  Calendar,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Footer } from "@/components/layout/Footer";
import { dbService } from "@/lib/db";
import { formatINR } from "@/lib/utils";

export const revalidate = 0;

export default async function HomePage() {
  const trainers = await dbService.getTrainers({ verifiedOnly: true });
  const packages = await dbService.getWorkoutPlans();

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative w-full bg-black text-white pt-20 pb-24 border-b border-zinc-850 overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            India's #1 Platform for Verified Personal Trainers
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Transform Your Physique With India's Elite Certified Trainers.
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Book 1-on-1 gym consultations, customized Indian diet charts, progressive strength routines, and track attendance seamlessly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/trainee/trainers">
              <Button size="lg" className="w-full sm:w-auto bg-white text-black hover:bg-zinc-200 font-bold text-sm h-12 px-8 gap-2 shadow-lg">
                Explore Trainers <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-zinc-700 bg-transparent text-white hover:bg-zinc-900 font-semibold text-sm h-12 px-8"
              >
                Become a Trainer
              </Button>
            </Link>
          </div>

          {/* Value Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>100% CSCS, ACE & K11 Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Razorpay Secured (₹ INR)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Zero Double-Booking Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="w-full border-b border-zinc-200 bg-zinc-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-black text-black">50+</p>
            <p className="text-xs font-semibold text-zinc-500 mt-1 uppercase tracking-wider">
              Verified Indian Coaches
            </p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-black">12,500+</p>
            <p className="text-xs font-semibold text-zinc-500 mt-1 uppercase tracking-wider">
              Sessions Completed
            </p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-black">4.92 / 5</p>
            <p className="text-xs font-semibold text-zinc-500 mt-1 uppercase tracking-wider">
              Average Trainer Rating
            </p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-black">98.4%</p>
            <p className="text-xs font-semibold text-zinc-500 mt-1 uppercase tracking-wider">
              Goal Satisfaction Rate
            </p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED TRAINERS */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <Badge variant="secondary" className="mb-2">
              Top Rated
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              Featured Fitness Trainers
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Top certified personal coaches available across India for 1-on-1 training.
            </p>
          </div>
          <Link href="/trainee/trainers">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold">
              View All Coaches <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trainers.slice(0, 4).map((trainer) => (
            <div
              key={trainer.id}
              className="border border-zinc-200 rounded-2xl p-5 bg-white shadow-sm hover:border-black transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="relative h-48 w-full rounded-xl overflow-hidden bg-zinc-100">
                  <img
                    src={trainer.avatar}
                    alt={trainer.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded-full text-[11px] font-bold text-white flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {trainer.rating}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-base text-zinc-900">{trainer.name}</h3>
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">
                    {trainer.headline}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {trainer.specializations.slice(0, 2).map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-zinc-100 text-[10px] font-semibold text-zinc-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-5 border-t border-zinc-100 mt-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-semibold">Hourly Rate</p>
                  <p className="text-base font-black text-black">
                    {formatINR(trainer.hourlyRate)}
                  </p>
                </div>
                <Link href="/trainee/trainers">
                  <Button size="sm" className="bg-black text-white hover:bg-zinc-800 text-xs font-bold h-8 px-4">
                    Book
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. WORKOUT PACKAGES */}
      <section id="packages" className="w-full bg-zinc-50 py-16 border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <Badge variant="secondary">Goal-Oriented Programs</Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              Curated Workout Packages
            </h2>
            <p className="text-sm text-zinc-500">
              Structured multi-week programs designed to deliver guaranteed body recomposition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:border-black transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      {pkg.category}
                    </span>
                    <h3 className="text-lg font-black text-black mt-1">{pkg.title}</h3>
                    <p className="text-xs text-zinc-600 mt-1 line-clamp-2">
                      {pkg.description}
                    </p>
                  </div>

                  <div className="py-2 border-y border-zinc-100 flex items-center justify-between text-xs text-zinc-700 font-semibold">
                    <span>{pkg.durationWeeks} Weeks</span>
                    <span>•</span>
                    <span>{pkg.sessionCount} Sessions</span>
                  </div>

                  <ul className="space-y-2 text-xs text-zinc-600">
                    {pkg.benefits.slice(0, 3).map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-black shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-zinc-100 mt-6 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-zinc-500">Package Fee:</span>
                    <span className="text-xl font-black text-black">
                      {formatINR(pkg.price)}
                    </span>
                  </div>
                  <Link href="/trainee/trainers" className="block">
                    <Button className="w-full bg-black text-white hover:bg-zinc-800 text-xs font-bold h-9">
                      Enroll with Coach
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INDIAN NUTRITION & DIET HIGHLIGHT */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <Badge variant="secondary">Nutrition Science</Badge>
            <h2 className="text-3xl font-black text-black tracking-tight leading-snug">
              Personalized Indian Diet Charts Built Around Your Lifestyle.
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              No foreign food mandates or unsustainable crash diets. Your certified coach creates macro-calculated meal charts featuring everyday Indian staples: Paneer, Moong Dal, Oats, Soya, Chicken Breast, Eggs, and Curd tailored precisely to your calorie and protein targets.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 border border-zinc-200 rounded-xl bg-zinc-50">
                <p className="font-bold text-sm text-black">Vegetarian Friendly</p>
                <p className="text-xs text-zinc-500 mt-1">High protein plans with paneer, tofu, soya chunks & Greek curd.</p>
              </div>
              <div className="p-4 border border-zinc-200 rounded-xl bg-zinc-50">
                <p className="font-bold text-sm text-black">Real-Time Macro Split</p>
                <p className="text-xs text-zinc-500 mt-1">Clear gram targets for Protein, Carbohydrates, and Healthy Fats.</p>
              </div>
            </div>
          </div>

          <div className="p-6 border border-zinc-200 rounded-2xl bg-zinc-50 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <span className="font-bold text-sm text-black flex items-center gap-2">
                <Utensils className="h-4 w-4" /> Sample Coach Diet Plan
              </span>
              <span className="text-xs font-bold text-zinc-600">2,350 kcal • 145g Protein</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-white border border-zinc-200 rounded-lg">
                <p className="font-bold text-black">08:00 AM • Breakfast</p>
                <p className="text-zinc-600 mt-0.5">120g Paneer bhurji + 2 Multigrain Rotis + Black Coffee (32g Protein)</p>
              </div>
              <div className="p-3 bg-white border border-zinc-200 rounded-lg">
                <p className="font-bold text-black">01:30 PM • Lunch</p>
                <p className="text-zinc-600 mt-0.5">1.5 cups Thick Moong Dal + 1 cup Brown Rice + Curd & Salad (30g Protein)</p>
              </div>
              <div className="p-3 bg-white border border-zinc-200 rounded-lg">
                <p className="font-bold text-black">08:30 PM • Dinner</p>
                <p className="text-zinc-600 mt-0.5">100g Soya chunks curry + 2 Jowar rotis + Steamed veggies (38g Protein)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section id="how-it-works" className="w-full bg-black text-white py-16 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">How FitPulse Works</h2>
            <p className="text-sm text-zinc-400">Simple, transparent, four-step transformation process.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl space-y-3">
              <div className="h-10 w-10 mx-auto rounded-full bg-white text-black font-black flex items-center justify-center text-sm">
                1
              </div>
              <h3 className="font-bold text-sm text-white">Choose Trainer</h3>
              <p className="text-xs text-zinc-400">Filter coaches by specialization, experience, rating, and hourly fees.</p>
            </div>

            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl space-y-3">
              <div className="h-10 w-10 mx-auto rounded-full bg-white text-black font-black flex items-center justify-center text-sm">
                2
              </div>
              <h3 className="font-bold text-sm text-white">Select Time Slot</h3>
              <p className="text-xs text-zinc-400">Pick preferred workout slots matching your daily IST schedule.</p>
            </div>

            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl space-y-3">
              <div className="h-10 w-10 mx-auto rounded-full bg-white text-black font-black flex items-center justify-center text-sm">
                3
              </div>
              <h3 className="font-bold text-sm text-white">Razorpay Payment</h3>
              <p className="text-xs text-zinc-400">Complete instant checkout via UPI, Card, or NetBanking in ₹ INR.</p>
            </div>

            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl space-y-3">
              <div className="h-10 w-10 mx-auto rounded-full bg-white text-black font-black flex items-center justify-center text-sm">
                4
              </div>
              <h3 className="font-bold text-sm text-white">Track & Progress</h3>
              <p className="text-xs text-zinc-400">Receive workout tasks, diet plans, and attendance verification.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
