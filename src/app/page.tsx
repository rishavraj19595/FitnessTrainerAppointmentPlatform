import Link from "next/link";
import {
  Dumbbell,
  Search,
  Star,
  ShieldCheck,
  Calendar,
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
  ArrowRight,
  Flame,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatPrice } from "@/lib/utils";
import { dbService } from "@/lib/db-service";

export const revalidate = 0;

export default async function HomePage() {
  const trainers = await dbService.getAllTrainers();
  const packages = await dbService.getAllPackages();

  const categories = [
    { name: "Strength Training", icon: "🏋️‍♂️", count: "12+ Coaches", desc: "Barbell mastery, hypertrophy & power" },
    { name: "Yoga & Mobility", icon: "🧘‍♀️", count: "8+ Coaches", desc: "Flexibility, breathwork & joint longevity" },
    { name: "Metabolic Fat Loss", icon: "🔥", count: "15+ Coaches", desc: "High-density HIIT & rapid calorie burn" },
    { name: "Personal Coaching", icon: "🎯", count: "20+ Coaches", desc: "1-on-1 customized transformation" },
    { name: "Injury Rehabilitation", icon: "🩹", count: "6+ Coaches", desc: "Kinesiology & postural restoration" },
    { name: "Nutrition Coaching", icon: "🥗", count: "10+ Coaches", desc: "Macro blueprints & sustainable dieting" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950/20 via-background to-background pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))]" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-6">
            <Flame className="h-4 w-4 text-emerald-500" />
            <span>The #1 Rated Platform For Certified Personal Trainers</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Your Fitness Journey Starts With The{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-500">
              Right Trainer.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Discover verified elite fitness trainers, book 1-on-1 consultations,
            purchase periodized workout packages, and track real body metrics with
            actionable analytics.
          </p>

          {/* Quick Search Box */}
          <div className="mt-10 max-w-2xl mx-auto p-2 rounded-2xl border bg-card/90 shadow-xl backdrop-blur flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by trainer name, strength, yoga, HIIT..."
                className="w-full h-12 pl-11 pr-4 bg-transparent text-sm focus:outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Link href="/trainers" className="shrink-0">
              <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-emerald-600/30 font-bold">
                Find Coaches
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-1.5" />
              100% Certified CSCS & NASM Trainers
            </span>
            <span className="flex items-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-1.5" />
              Razorpay Secured Checkout
            </span>
            <span className="flex items-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-1.5" />
              Zero Double-Booking Guarantee
            </span>
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section className="border-y bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-black text-emerald-400">
                50+
              </p>
              <p className="text-sm font-medium text-slate-400 mt-1">
                Verified Pro Trainers
              </p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-emerald-400">
                12,500+
              </p>
              <p className="text-sm font-medium text-slate-400 mt-1">
                Sessions Completed
              </p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-emerald-400">
                4.9 / 5.0
              </p>
              <p className="text-sm font-medium text-slate-400 mt-1">
                Average Client Rating
              </p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-emerald-400">
                98.4%
              </p>
              <p className="text-sm font-medium text-slate-400 mt-1">
                Goal Achievement Rate
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FITNESS CATEGORIES */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 mb-3">
              Explore Disciplines
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Targeted Training For Every Goal
            </h2>
            <p className="mt-3 text-muted-foreground">
              Whatever your personal milestone — from powerlifting to rehab — our
              coaches provide customized science-backed blueprints.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <Link
                key={i}
                href={`/trainers?specialization=${encodeURIComponent(cat.name)}`}
                className="group p-6 rounded-2xl border bg-card hover:border-emerald-500/50 hover:shadow-lg transition-all"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
                    {cat.count}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED TRAINERS */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 mb-3">
                Top Certified Coaches
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                Featured Fitness Mentors
              </h2>
              <p className="mt-2 text-muted-foreground">
                Hand-picked, background-verified professionals ready to train you.
              </p>
            </div>
            <Link href="/trainers" className="mt-4 md:mt-0">
              <Button variant="outline" className="font-semibold">
                Browse All Coaches
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainers.slice(0, 3).map((trainer) => (
              <div
                key={trainer.id}
                className="rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                {/* Image Banner */}
                <div className="relative h-48 w-full bg-slate-200 overflow-hidden">
                  <img
                    src={trainer.bannerImage || trainer.profileImage || ""}
                    alt={trainer.user.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="success" className="bg-emerald-600 text-white font-bold text-[10px]">
                      Verified Coach
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>{trainer.rating}</span>
                    <span className="text-slate-400">({trainer.reviewCount})</span>
                  </div>
                </div>

                {/* Profile info */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <Avatar className="h-12 w-12 border-2 border-emerald-500">
                        <AvatarImage src={trainer.profileImage || ""} />
                        <AvatarFallback>{trainer.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                          {trainer.user.name}
                        </h3>
                        <p className="text-xs text-muted-foreground font-medium">
                          {trainer.experienceYears} Years Experience
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                      {trainer.headline || trainer.bio}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {trainer.specializations?.slice(0, 3).map((s: any) => (
                        <span
                          key={s.id}
                          className="text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-2 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-muted-foreground font-medium">
                        Consultation Fee
                      </p>
                      <p className="text-lg font-black text-emerald-600">
                        {formatPrice(trainer.consultationPrice)}
                        <span className="text-xs font-normal text-muted-foreground">/hr</span>
                      </p>
                    </div>
                    <Link href={`/trainers/${trainer.id}`}>
                      <Button size="sm" className="font-semibold shadow-sm">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 mb-3">
              Streamlined Experience
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              How FitPulse Works
            </h2>
            <p className="mt-3 text-slate-400">
              Four simple steps to start working with your dedicated fitness coach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700 text-center relative">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-xl mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold text-lg mb-2">Discover Trainers</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Filter by discipline, pricing, and client ratings to find your ideal coach.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700 text-center relative">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-xl mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold text-lg mb-2">Choose Package</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Book a 1-on-1 consultation or select multi-week transformation packages.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700 text-center relative">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-xl mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold text-lg mb-2">Book Your Slot</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Pick available calendar slots with live conflict-prevention guarantees.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700 text-center relative">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-xl mx-auto mb-4">
                4
              </div>
              <h3 className="font-bold text-lg mb-2">Track & Transform</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Log weights, body fat %, workout completion, and view attendance stats.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA SECTION */}
      <section className="py-24 bg-gradient-to-tr from-emerald-600 to-teal-700 text-white text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Ready To Transform Your Physique And Energy?
          </h2>
          <p className="mt-6 text-lg text-emerald-100 max-w-xl mx-auto">
            Join thousands of active members training with certified pros. Zero
            guesswork. Real accountability.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-white text-emerald-800 hover:bg-slate-100 font-extrabold shadow-xl">
                Get Started Today
              </Button>
            </Link>
            <Link href="/register/trainer">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-bold">
                Apply As A Trainer
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
