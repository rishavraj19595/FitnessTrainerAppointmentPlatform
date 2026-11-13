import Link from "next/link";
import {
  Search,
  Star,
  SlidersHorizontal,
  Dumbbell,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatPrice } from "@/lib/utils";
import { dbService } from "@/lib/db-service";

export const revalidate = 0;

interface PageProps {
  searchParams: {
    search?: string;
    specialization?: string;
    maxPrice?: string;
    minRating?: string;
  };
}

export default async function TrainersDirectoryPage({ searchParams }: PageProps) {
  const search = searchParams.search;
  const specialization = searchParams.specialization;
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined;
  const minRating = searchParams.minRating ? Number(searchParams.minRating) : undefined;

  const trainers = await dbService.getAllTrainers({
    search,
    specialization,
    maxPrice,
    minRating,
  });

  const specializationsList = [
    "All",
    "Strength Training",
    "Muscle Building",
    "Yoga",
    "Weight Loss",
    "Personal Training",
    "Injury Rehabilitation",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Title */}
          <div className="max-w-3xl mb-8">
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 mb-2">
              Trainer Directory
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Discover Top Certified Fitness Coaches
            </h1>
            <p className="mt-3 text-muted-foreground text-base sm:text-lg">
              Book personalized consultations, purchase structured packages, or
              master your fitness technique with 1-on-1 guidance.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="p-6 rounded-2xl border bg-card shadow-sm mb-10">
            <form method="GET" action="/trainers" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Keyword Search */}
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <input
                    name="search"
                    defaultValue={search}
                    type="text"
                    placeholder="Search coach by name, title, or keywords..."
                    className="w-full h-11 pl-10 pr-4 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Specialization Select */}
                <div>
                  <select
                    name="specialization"
                    defaultValue={specialization || "All"}
                    className="w-full h-11 px-3.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {specializationsList.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filter / Submit Button */}
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 h-11 font-semibold">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  {(search || (specialization && specialization !== "All") || maxPrice || minRating) && (
                    <Link href="/trainers">
                      <Button variant="outline" type="button" className="h-11">
                        Reset
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-semibold text-muted-foreground">
              Showing <span className="text-foreground">{trainers.length}</span>{" "}
              available fitness trainers
            </p>
          </div>

          {/* Trainers Grid */}
          {trainers.length === 0 ? (
            <div className="py-20 text-center rounded-2xl border bg-card p-8">
              <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-40" />
              <h3 className="text-xl font-bold">No trainers found</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                Try adjusting your search criteria or reset filters to see all
                available trainers.
              </p>
              <Link href="/trainers" className="mt-4 inline-block">
                <Button variant="outline">Reset All Filters</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trainers.map((trainer) => (
                <div
                  key={trainer.id}
                  className="rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
                >
                  {/* Banner / Photo */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={trainer.bannerImage || trainer.profileImage || ""}
                      alt={trainer.user.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {trainer.isVerified && (
                        <Badge variant="success" className="bg-emerald-600 text-white font-bold text-[10px]">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{trainer.rating}</span>
                      <span className="text-slate-400">({trainer.reviewCount})</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-3">
                        <Avatar className="h-12 w-12 ring-2 ring-emerald-500">
                          <AvatarImage src={trainer.profileImage || ""} />
                          <AvatarFallback>
                            {trainer.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                            {trainer.user.name}
                          </h3>
                          <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                            <Clock className="h-3 w-3 text-emerald-600" />
                            {trainer.experienceYears} Years Experience
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                        {trainer.headline || trainer.bio}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {trainer.specializations?.map((s: any) => (
                          <span
                            key={s.id}
                            className="text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md"
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>

                      {trainer.packages && trainer.packages.length > 0 && (
                        <div className="mb-4 p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-500/20 text-xs">
                          <span className="font-bold text-emerald-700 dark:text-emerald-400">
                            {trainer.packages.length} Active Package{trainer.packages.length > 1 ? "s" : ""}
                          </span>
                          <span className="text-slate-500 block mt-0.5 truncate">
                            Latest: {trainer.packages[0].title}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-4 mt-2 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-muted-foreground font-medium">
                          Consultation
                        </p>
                        <p className="text-xl font-black text-emerald-600">
                          {formatPrice(trainer.consultationPrice)}
                          <span className="text-xs font-normal text-muted-foreground">/hr</span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/trainers/${trainer.id}`}>
                          <Button size="sm" className="font-semibold shadow-sm">
                            View & Book
                            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
