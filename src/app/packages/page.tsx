import Link from "next/link";
import {
  Package,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Dumbbell,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PackageCheckoutButton } from "@/components/packages/package-checkout-button";
import { formatPrice } from "@/lib/utils";
import { dbService } from "@/lib/db-service";

export const revalidate = 0;

export default async function PackagesPage() {
  const packages = await dbService.getAllPackages();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 mb-2">
              Transformational Programs
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Structured Workout Packages
            </h1>
            <p className="mt-3 text-muted-foreground text-base sm:text-lg">
              Get dedicated 1-on-1 coaching sessions, personalized workout
              plans, and nutrition guidance packaged for maximum athletic
              results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={pkg.coverImage || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="default" className="font-bold text-[10px] uppercase">
                        {pkg.difficultyLevel}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold">
                      {pkg.sessionCount} Sessions ({pkg.durationWeeks} Wks)
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-9 w-9 ring-1 ring-emerald-500">
                        <AvatarImage src={pkg.trainerProfile?.user?.image || ""} />
                        <AvatarFallback>
                          {pkg.trainerProfile?.user?.name?.charAt(0) || "T"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Coach</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {pkg.trainerProfile?.user?.name}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                        {pkg.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {pkg.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        Included in this package
                      </p>
                      <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                        {pkg.includedServices.slice(0, 4).map((service: string, i: number) => (
                          <li key={i} className="flex items-center space-x-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            <span className="truncate">{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-muted-foreground font-medium">
                      Total Package Price
                    </span>
                    <span className="text-2xl font-black text-emerald-600">
                      {formatPrice(pkg.price)}
                    </span>
                  </div>

                  <PackageCheckoutButton
                    packageId={pkg.id}
                    packageTitle={pkg.title}
                    price={pkg.price}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
