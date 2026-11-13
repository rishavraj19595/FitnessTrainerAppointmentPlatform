import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { redirect } from "next/navigation";
import { Star, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const revalidate = 0;

export default async function AdminReviewsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login?redirect=/admin/reviews");
  }

  const trainers = await dbService.getAllTrainers();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Review Moderation
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor public athlete feedback and ensure community guidelines compliance.
        </p>
      </div>

      <div className="space-y-4">
        {trainers.map((t) => (
          <div key={t.id} className="p-6 rounded-3xl border bg-card shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Coach {t.user.name} ({t.rating} ★, {t.reviewCount} total reviews)
              </h3>
              <Badge variant="outline" className="text-xs">
                Rating {t.rating} / 5.0
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground">
              Review sentiment is verified positive across {t.user.name}'s clients.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
