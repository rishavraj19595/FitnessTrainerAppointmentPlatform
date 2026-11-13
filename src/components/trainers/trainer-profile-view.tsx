"use client";

import * as React from "react";
import {
  Star,
  Award,
  Clock,
  Globe,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Dumbbell,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookingModal } from "@/components/booking/booking-modal";
import { ReviewForm } from "@/components/booking/review-form";
import { PackageCheckoutButton } from "@/components/packages/package-checkout-button";
import { formatPrice, formatDate } from "@/lib/utils";

interface TrainerProfileViewProps {
  trainer: any;
  userPurchases: any[];
}

export function TrainerProfileView({
  trainer,
  userPurchases,
}: TrainerProfileViewProps) {
  const [bookingModalOpen, setBookingModalOpen] = React.useState(false);

  // Check if client has an active package with this trainer
  const matchingPurchase = userPurchases.find(
    (p) =>
      p.status === "ACTIVE" &&
      p.remainingSessions > 0 &&
      trainer.packages?.some((pkg: any) => pkg.id === p.packageId)
  );

  return (
    <div className="space-y-10">
      {/* Hero Banner & Trainer Header */}
      <div className="relative rounded-3xl border bg-card overflow-hidden shadow-sm">
        {/* Banner image */}
        <div className="h-64 sm:h-80 w-full relative bg-slate-900">
          <img
            src={
              trainer.bannerImage ||
              "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400&auto=format&fit=crop&q=80"
            }
            alt="Trainer Banner"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        {/* Content overlapping banner */}
        <div className="px-6 sm:px-10 pb-8 -mt-20 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            <Avatar className="h-32 w-32 ring-4 ring-background shadow-2xl shrink-0">
              <AvatarImage src={trainer.profileImage || ""} />
              <AvatarFallback className="text-3xl font-black">
                {trainer.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  {trainer.user.name}
                </h1>
                {trainer.isVerified && (
                  <Badge variant="success" className="font-bold gap-1 py-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified Coach
                  </Badge>
                )}
              </div>

              <p className="text-base sm:text-lg font-semibold text-emerald-600">
                {trainer.headline}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-medium pt-1">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <strong className="text-foreground">{trainer.rating}</strong> (
                  {trainer.reviewCount} Reviews)
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  {trainer.experienceYears} Years Exp
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="h-4 w-4 text-emerald-600" />
                  {trainer.languages?.join(", ")}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Button
              size="lg"
              onClick={() => setBookingModalOpen(true)}
              className="font-bold shadow-lg shadow-emerald-600/30 h-12 px-6"
            >
              <Calendar className="mr-2 h-5 w-5" />
              {matchingPurchase
                ? "Book Session (1 Credit)"
                : `Book Consultation (${formatPrice(trainer.consultationPrice)})`}
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Details & Bio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Bio, Certs, Specializations */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Me */}
          <div className="p-8 rounded-2xl border bg-card space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-emerald-600" />
              About Coach {trainer.user.name}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              {trainer.bio}
            </p>

            <div className="pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Core Specializations
              </h4>
              <div className="flex flex-wrap gap-2">
                {trainer.specializations?.map((spec: any) => (
                  <Badge
                    key={spec.id}
                    variant="secondary"
                    className="px-3 py-1 text-xs font-semibold"
                  >
                    {spec.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Certifications & Qualifications */}
          <div className="p-8 rounded-2xl border bg-card space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-600" />
              Verified Certifications & Accreditations
            </h3>

            {trainer.certifications && trainer.certifications.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {trainer.certifications.map((cert: any) => (
                  <div
                    key={cert.id}
                    className="p-4 rounded-xl border bg-slate-50/60 dark:bg-slate-900/40 space-y-1"
                  >
                    <p className="font-bold text-sm text-slate-900 dark:text-white">
                      {cert.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {cert.issuingOrg} • Awarded {cert.year}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Trainer has verified state credentials on file.
              </p>
            )}
          </div>

          {/* Workout Packages Section */}
          <div className="p-8 rounded-2xl border bg-card space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                  Workout Packages & Programs
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Structured multi-session regimens with 1-on-1 coaching
                </p>
              </div>
            </div>

            {trainer.packages && trainer.packages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {trainer.packages.map((pkg: any) => (
                  <div
                    key={pkg.id}
                    className="p-6 rounded-2xl border bg-slate-50/50 dark:bg-slate-900/30 flex flex-col justify-between space-y-4 group hover:border-emerald-500/40 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold">
                          {pkg.difficultyLevel}
                        </Badge>
                        <span className="text-xs font-semibold text-emerald-600">
                          {pkg.sessionCount} Sessions ({pkg.durationWeeks} Weeks)
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                        {pkg.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {pkg.description}
                      </p>

                      <ul className="space-y-1.5 pt-1">
                        {pkg.includedServices?.slice(0, 3).map((srv: string, i: number) => (
                          <li key={i} className="flex items-center text-xs text-slate-600 dark:text-slate-300">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mr-2 shrink-0" />
                            <span className="truncate">{srv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-medium">
                          Full Program Price
                        </span>
                        <span className="text-xl font-black text-emerald-600">
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
            ) : (
              <p className="text-sm text-muted-foreground">
                No active public packages at this time. Book a consultation above!
              </p>
            )}
          </div>

          {/* Client Reviews Section */}
          <div className="p-8 rounded-2xl border bg-card space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                  Verified Client Reviews ({trainer.reviews?.length || 0})
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Average rating {trainer.rating} / 5.0 from verified sessions
                </p>
              </div>
            </div>

            {/* List Reviews */}
            <div className="space-y-4">
              {trainer.reviews && trainer.reviews.length > 0 ? (
                trainer.reviews.map((rev: any) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-xl border bg-slate-50/50 dark:bg-slate-900/30 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-xs">
                            {rev.client.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {rev.client.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      "{rev.comment}"
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {formatDate(rev.createdAt)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No client reviews yet. Be the first to train with {trainer.user.name}!
                </p>
              )}
            </div>

            {/* Submit Review Form */}
            <div className="pt-4 border-t">
              <ReviewForm
                trainerProfileId={trainer.id}
                trainerName={trainer.user.name}
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar: Sticky Booking Card & Quick Facts */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border bg-card shadow-sm sticky top-28 space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Consultation Rate
              </p>
              <div className="mt-1 flex items-baseline space-x-2">
                <span className="text-3xl font-black text-emerald-600">
                  {formatPrice(trainer.consultationPrice)}
                </span>
                <span className="text-sm text-muted-foreground font-medium">
                  / 60-min session
                </span>
              </div>
            </div>

            <Button
              size="lg"
              onClick={() => setBookingModalOpen(true)}
              className="w-full font-bold shadow-lg shadow-emerald-600/20 h-12"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book Appointment Now
            </Button>

            <div className="border-t pt-4 space-y-3 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Availability</span>
                <span className="font-semibold text-foreground">Mon - Sat</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Location</span>
                <span className="font-semibold text-foreground">Online & In-Gym</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Cancellation</span>
                <span className="font-semibold text-foreground">Up to 24h prior</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Payment</span>
                <span className="font-semibold text-emerald-600">Secure via Razorpay</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        trainer={{
          id: trainer.id,
          userId: trainer.userId,
          name: trainer.user.name,
          consultationPrice: trainer.consultationPrice,
          availabilities: trainer.availabilities,
        }}
        packagePurchase={
          matchingPurchase
            ? {
                id: matchingPurchase.id,
                title: matchingPurchase.package.title,
                remainingSessions: matchingPurchase.remainingSessions,
              }
            : null
        }
      />
    </div>
  );
}
