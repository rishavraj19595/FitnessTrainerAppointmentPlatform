import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { dbService } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatINR } from "@/lib/utils";
import { ShieldCheck, Award, Star, MapPin, Globe } from "lucide-react";

export const revalidate = 0;

export default async function TrainerProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "trainer" && session.user.role !== "admin")) {
    redirect("/login?redirect=/trainer/profile");
  }

  const profile = await dbService.getTrainerByUserId(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
          Trainer Public Profile
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Review your verified coach bio, credentials, hourly rate, and client rating.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="p-6 text-center space-y-4">
          <img
            src={session.user.avatar || profile?.avatar}
            alt={session.user.name}
            className="h-28 w-28 rounded-full object-cover mx-auto border-2 border-black"
          />
          <div>
            <h2 className="font-black text-lg text-black flex items-center justify-center gap-1.5">
              {session.user.name}
              {profile?.isVerified && (
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
              )}
            </h2>
            <p className="text-xs text-zinc-500">{profile?.headline}</p>

            <div className="flex items-center justify-center gap-1 text-xs font-bold text-black mt-2">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{profile?.rating || 4.9}</span>
              <span className="text-zinc-400 font-normal">
                ({profile?.reviewCount || 48} reviews)
              </span>
            </div>

            <Badge variant="success" className="mt-3 text-[10px]">
              Verified Coach
            </Badge>
          </div>
        </Card>

        {/* Credentials and Bio */}
        <Card className="md:col-span-2 p-6 space-y-5">
          <h3 className="font-bold text-sm text-black uppercase tracking-wider pb-2 border-b border-zinc-100">
            Professional Bio & Qualifications
          </h3>

          <p className="text-xs text-zinc-700 leading-relaxed">
            {profile?.bio || "Experienced fitness coach specializing in progressive overload, clinical nutrition, and body transformation."}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs pt-2">
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase">Experience</span>
              <p className="font-black text-black text-sm mt-0.5">{profile?.experienceYears || 8} Years</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase">Hourly Session Charge</span>
              <p className="font-black text-black text-sm mt-0.5">{formatINR(profile?.hourlyRate || 2500)}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase">Base Location</span>
              <p className="font-black text-black text-sm mt-0.5">{profile?.location || "Mumbai (IST)"}</p>
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-2 pt-3 border-t border-zinc-100">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Accredited Certifications:
            </span>
            <div className="space-y-2">
              {profile?.certifications?.map((c, i) => (
                <div key={i} className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-black" />
                    <div>
                      <p className="font-bold text-zinc-900">{c.title}</p>
                      <p className="text-[10px] text-zinc-500">Issuing Body: {c.org} • {c.year}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[9px]">Verified</Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
