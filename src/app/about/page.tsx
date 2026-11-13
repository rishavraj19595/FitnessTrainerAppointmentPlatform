import Link from "next/link";
import { Dumbbell, ShieldCheck, Heart, Award, Users, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-16">
          <div className="text-center space-y-4">
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-600">
              Our Mission
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Empowering Human Potential Through World-Class Fitness Mentorship
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              FitPulse was founded to bridge the gap between dedicated clients
              seeking real physical change and certified coaches who understand
              evidence-based exercise science.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border bg-card space-y-3">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                100% Verified Trainers
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every trainer on FitPulse undergoes manual identity, certification,
                and insurance verification by our admin team before listing.
              </p>
            </div>

            <div className="p-6 rounded-2xl border bg-card space-y-3">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Science-Backed Programming
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our periodized workout plans and session tracking replace guesswork
                with consistent progressive overload and metric tracking.
              </p>
            </div>

            <div className="p-6 rounded-2xl border bg-card space-y-3">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Heart className="h-6 w-6 text-rose-500" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Client-Centric Philosophy
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                From fair cancellation rules to seamless Razorpay payments and
                attendance logging, we safeguard the client experience.
              </p>
            </div>
          </div>

          <div className="p-10 rounded-3xl bg-slate-900 text-white text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black">
              Ready to find your fitness mentor?
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto text-sm">
              Explore our trainer directory and schedule your first assessment session today.
            </p>
            <Link href="/trainers">
              <Button size="lg" className="bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold">
                Explore All Coaches
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
