"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShieldCheck, CheckCircle2, XCircle, Clock, Award, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatPrice } from "@/lib/utils";

interface AdminTrainersViewProps {
  initialTrainers: any[];
}

export function AdminTrainersView({ initialTrainers }: AdminTrainersViewProps) {
  const router = useRouter();
  const [trainers, setTrainers] = React.useState(initialTrainers);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const handleUpdateStatus = async (
    trainerProfileId: string,
    status: "APPROVED" | "REJECTED" | "PENDING"
  ) => {
    setUpdatingId(trainerProfileId);
    try {
      const res = await fetch("/api/admin/trainers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainerProfileId,
          status,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update verification status");
      }

      toast.success(
        `Coach verification status set to ${status}. Changes are live.`
      );
      setTrainers((prev) =>
        prev.map((t) =>
          t.id === trainerProfileId
            ? {
                ...t,
                verificationStatus: status,
                isVerified: status === "APPROVED",
              }
            : t
        )
      );
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Trainer Verification & Compliance
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Review coach certifications, identity credentials, and grant the official FitPulse Verified Badge.
        </p>
      </div>

      <div className="space-y-4">
        {trainers.map((trainer) => (
          <div
            key={trainer.id}
            className="p-6 rounded-3xl border bg-card shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-14 w-14 ring-2 ring-emerald-500">
                  <AvatarImage src={trainer.profileImage || trainer.user?.image || ""} />
                  <AvatarFallback className="text-lg font-bold">
                    {trainer.user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {trainer.user?.name}
                    </h3>
                    <Badge
                      variant={
                        trainer.verificationStatus === "APPROVED"
                          ? "success"
                          : trainer.verificationStatus === "REJECTED"
                          ? "destructive"
                          : "warning"
                      }
                      className="text-[10px] uppercase font-bold"
                    >
                      {trainer.verificationStatus}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{trainer.headline}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {trainer.verificationStatus !== "APPROVED" && (
                  <Button
                    size="sm"
                    disabled={updatingId === trainer.id}
                    onClick={() => handleUpdateStatus(trainer.id, "APPROVED")}
                    className="bg-emerald-600 hover:bg-emerald-700 font-bold"
                  >
                    <CheckCircle2 className="mr-1.5 h-4 w-4" /> Approve
                  </Button>
                )}
                {trainer.verificationStatus !== "REJECTED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={updatingId === trainer.id}
                    onClick={() => handleUpdateStatus(trainer.id, "REJECTED")}
                    className="text-rose-600 border-rose-200 hover:bg-rose-50"
                  >
                    <XCircle className="mr-1.5 h-4 w-4" /> Reject
                  </Button>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border">
              <strong>Bio:</strong> {trainer.bio}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
              <div>
                <span className="text-muted-foreground block">Experience</span>
                <span className="font-bold text-foreground">
                  {trainer.experienceYears} Years
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Consultation Fee</span>
                <span className="font-bold text-emerald-600">
                  {formatPrice(trainer.consultationPrice)}/hr
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Languages</span>
                <span className="font-bold text-foreground">
                  {trainer.languages?.join(", ")}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Client Rating</span>
                <span className="font-bold text-amber-500">
                  ★ {trainer.rating} ({trainer.reviewCount || 0} reviews)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
