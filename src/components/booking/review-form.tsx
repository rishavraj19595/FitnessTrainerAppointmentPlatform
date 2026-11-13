"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReviewForm({
  trainerProfileId,
  trainerName,
}: {
  trainerProfileId: string;
  trainerName: string;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [rating, setRating] = React.useState<number>(5);
  const [hoverRating, setHoverRating] = React.useState<number>(0);
  const [comment, setComment] = React.useState<string>("");
  const [submitting, setSubmitting] = React.useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please log in to submit a review");
      return;
    }

    if (!comment.trim() || comment.length < 5) {
      toast.error("Review comment must be at least 5 characters long");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainerProfileId,
          rating,
          comment,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit review");
      }

      toast.success("Thank you! Your verified review has been posted.");
      setComment("");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to post review");
    } finally {
      setSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="p-6 rounded-2xl border bg-slate-50 dark:bg-slate-900 text-center text-sm text-muted-foreground">
        <p>Please sign in to leave a review for {trainerName}.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-2xl border bg-card space-y-4 shadow-sm"
    >
      <h4 className="font-bold text-base text-slate-900 dark:text-white">
        Leave a Review for {trainerName}
      </h4>

      {/* Star rating selector */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
          Rating
        </label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const active = (hoverRating || rating) >= star;
            return (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`h-6 w-6 ${
                    active
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300 dark:text-slate-700"
                  }`}
                />
              </button>
            );
          })}
          <span className="text-xs font-bold ml-2 text-slate-700 dark:text-slate-300">
            {rating} out of 5 stars
          </span>
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
          Your Experience & Feedback
        </label>
        <textarea
          rows={3}
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={`Describe your results, coach's technique, and progress under ${trainerName}...`}
          className="w-full p-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="font-bold shadow-md shadow-emerald-600/20"
      >
        {submitting ? "Submitting..." : "Post Review"}
      </Button>
    </form>
  );
}
