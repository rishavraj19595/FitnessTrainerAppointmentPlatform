"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User, Mail, Phone, FileText, Camera, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ProfileFormViewProps {
  user: any;
}

export function ProfileFormView({ user }: ProfileFormViewProps) {
  const router = useRouter();
  const [name, setName] = React.useState(user?.name || "");
  const [phone, setPhone] = React.useState(user?.phone || "");
  const [bio, setBio] = React.useState(user?.bio || "");
  const [image, setImage] = React.useState(user?.image || "");
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          bio,
          image,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Profile information updated successfully!");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Account Profile & Settings
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Update your public profile details and contact information.
        </p>
      </div>

      <div className="p-8 rounded-3xl border bg-card shadow-sm space-y-6">
        <div className="flex items-center space-x-4 border-b pb-6">
          <Avatar className="h-16 w-16 ring-2 ring-emerald-500">
            <AvatarImage src={image || user?.image || ""} />
            <AvatarFallback className="text-xl font-bold">
              {name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {name}
            </h3>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
            <Badge variant="success" className="mt-1 text-[10px] uppercase font-bold">
              {user?.role} Member
            </Badge>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email Address (Read-only)</Label>
            <Input
              id="email"
              disabled
              value={user?.email || ""}
              className="h-11 bg-slate-50 dark:bg-slate-900 text-muted-foreground cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="h-11"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="image">Profile Image URL</Label>
            <Input
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="h-11"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio & Fitness Aspirations</Label>
            <textarea
              id="bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell your coaches about your target sports, dietary habits, or injury history..."
              className="w-full p-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-11 font-bold shadow-md shadow-emerald-600/20"
          >
            <Save className="mr-2 h-4 w-4" />
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}
