"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Package,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/utils";

interface TrainerPackagesViewProps {
  initialPackages: any[];
}

export function TrainerPackagesView({
  initialPackages,
}: TrainerPackagesViewProps) {
  const router = useRouter();
  const [packages, setPackages] = React.useState(initialPackages);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  // Form states
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [durationWeeks, setDurationWeeks] = React.useState(8);
  const [sessionCount, setSessionCount] = React.useState(8);
  const [price, setPrice] = React.useState(7500);
  const [trainingType, setTrainingType] = React.useState("Hypertrophy & Strength");
  const [difficultyLevel, setDifficultyLevel] = React.useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED">("INTERMEDIATE");
  const [includedServicesStr, setIncludedServicesStr] = React.useState(
    "1-on-1 Coaching Sessions, Macro Blueprint, Form Video Check, 24/7 Chat"
  );
  const [targetGoal, setTargetGoal] = React.useState("Build lean muscle and increase deadlift/squat strength");

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const includedServices = includedServicesStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          durationWeeks: Number(durationWeeks),
          sessionCount: Number(sessionCount),
          price: Number(price),
          trainingType,
          difficultyLevel,
          includedServices,
          targetGoal,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create package");
      }

      toast.success("Workout package published successfully!");
      setModalOpen(false);
      setTitle("");
      setDescription("");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to create package");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this workout package?")) return;

    try {
      const res = await fetch(`/api/packages/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Package removed");
        router.refresh();
      }
    } catch {
      toast.error("Failed to delete package");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Workout Packages Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Create, price, and publish multi-session coaching packages for clients.
          </p>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="font-bold shadow-md shadow-emerald-600/20"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Create New Package
        </Button>
      </div>

      {packages.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border bg-card p-8 space-y-4">
          <Package className="h-12 w-12 text-muted-foreground mx-auto opacity-40" />
          <h3 className="text-lg font-bold">No packages published</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            You haven't created any workout packages yet. Packages allow clients to purchase bundles of sessions with you.
          </p>
          <Button onClick={() => setModalOpen(true)}>Create Your First Package</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="p-6 rounded-2xl border bg-card shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] uppercase font-bold">
                    {pkg.difficultyLevel}
                  </Badge>
                  <button
                    onClick={() => handleDeletePackage(pkg.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Delete package"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {pkg.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {pkg.description}
                </p>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sessions:</span>
                    <strong className="text-foreground">{pkg.sessionCount} Sessions</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <strong className="text-foreground">{pkg.durationWeeks} Weeks</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Target Goal:</span>
                    <span className="text-foreground truncate max-w-[150px]">{pkg.targetGoal}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-muted-foreground block">Price</span>
                  <span className="text-xl font-black text-emerald-600">
                    {formatPrice(pkg.price)}
                  </span>
                </div>
                <Badge variant="success" className="text-[10px] font-bold">
                  Active
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Package Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              Publish Workout Package
            </DialogTitle>
            <DialogDescription>
              Define your coaching package details, duration, pricing, and perks.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreatePackage} className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label htmlFor="pkgTitle">Package Title *</Label>
              <Input
                id="pkgTitle"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 12-Week Total Body Transformation"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="sessions">Sessions *</Label>
                <Input
                  id="sessions"
                  type="number"
                  required
                  min={1}
                  value={sessionCount}
                  onChange={(e) => setSessionCount(Number(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="duration">Weeks *</Label>
                <Input
                  id="duration"
                  type="number"
                  required
                  min={1}
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(Number(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  required
                  min={100}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="type">Training Type</Label>
                <Input
                  id="type"
                  required
                  value={trainingType}
                  onChange={(e) => setTrainingType(e.target.value)}
                  placeholder="Strength & Conditioning"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="diff">Difficulty Level</Label>
                <select
                  id="diff"
                  value={difficultyLevel}
                  onChange={(e) => setDifficultyLevel(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="included">Included Services (comma separated)</Label>
              <Input
                id="included"
                required
                value={includedServicesStr}
                onChange={(e) => setIncludedServicesStr(e.target.value)}
                placeholder="Coaching sessions, Macro plan, Chat support"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="goal">Target Fitness Goal</Label>
              <Input
                id="goal"
                required
                value={targetGoal}
                onChange={(e) => setTargetGoal(e.target.value)}
                placeholder="Drop body fat and build compound strength"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="desc">Full Description</Label>
              <textarea
                id="desc"
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the structure, weekly milestones, and who this program is best for..."
                className="w-full p-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-11 font-bold shadow-md shadow-emerald-600/20"
            >
              {submitting ? "Publishing..." : "Publish Package"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
