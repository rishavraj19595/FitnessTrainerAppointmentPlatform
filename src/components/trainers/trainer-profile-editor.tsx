"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User, DollarSign, Award, Globe, Save, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface TrainerProfileEditorProps {
  profile: any;
}

export function TrainerProfileEditor({ profile }: TrainerProfileEditorProps) {
  const router = useRouter();
  const [headline, setHeadline] = React.useState(profile?.headline || "");
  const [bio, setBio] = React.useState(profile?.bio || "");
  const [price, setPrice] = React.useState<number>(profile?.consultationPrice || 3000);
  const [experienceYears, setExperienceYears] = React.useState<number>(
    profile?.experienceYears || 5
  );
  const [languagesStr, setLanguagesStr] = React.useState(
    profile?.languages?.join(", ") || "English"
  );
  const [specializationsStr, setSpecializationsStr] = React.useState(
    profile?.specializations?.map((s: any) => s.name).join(", ") ||
      "Strength Training, Personal Training"
  );
  const [profileImage, setProfileImage] = React.useState(
    profile?.profileImage || ""
  );
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const languages = languagesStr
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
      const specializations = specializationsStr
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline,
          bio,
          consultationPrice: Number(price),
          experienceYears: Number(experienceYears),
          languages,
          specializations,
          image: profileImage,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save trainer profile");
      }

      toast.success("Trainer profile updated successfully!");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Manage Trainer Profile
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure your public listing headline, consultation pricing, and specializations.
          </p>
        </div>
        <Badge
          variant={profile?.isVerified ? "success" : "warning"}
          className="text-xs font-bold gap-1"
        >
          {profile?.isVerified ? (
            <>
              <ShieldCheck className="h-3.5 w-3.5" /> Verified Coach
            </>
          ) : (
            "Verification Pending"
          )}
        </Badge>
      </div>

      <div className="p-8 rounded-3xl border bg-card shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="headline">Professional Headline</Label>
            <Input
              id="headline"
              required
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. CSCS Elite Strength Coach & Body Transformation Expert"
              className="h-11"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="price">Consultation Hourly Rate (INR ₹)</Label>
              <Input
                id="price"
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="h-11"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="experience">Years of Coaching Experience</Label>
              <Input
                id="experience"
                type="number"
                required
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="specializations">
              Specializations (comma separated)
            </Label>
            <Input
              id="specializations"
              required
              value={specializationsStr}
              onChange={(e) => setSpecializationsStr(e.target.value)}
              placeholder="Strength Training, Hypertrophy, Nutrition, Injury Rehab"
              className="h-11"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="languages">Languages Spoken (comma separated)</Label>
            <Input
              id="languages"
              value={languagesStr}
              onChange={(e) => setLanguagesStr(e.target.value)}
              placeholder="English, Spanish, Hindi"
              className="h-11"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="image">Profile Photo URL</Label>
            <Input
              id="image"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="h-11"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Detailed Bio & Philosophy</Label>
            <textarea
              id="bio"
              rows={4}
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Detail your coaching background, philosophy, achievements, and training approach..."
              className="w-full p-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-11 font-bold shadow-md shadow-emerald-600/20"
          >
            <Save className="mr-2 h-4 w-4" />
            {submitting ? "Saving..." : "Save Trainer Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
}
