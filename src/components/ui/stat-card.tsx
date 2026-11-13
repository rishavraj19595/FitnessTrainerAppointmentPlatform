import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  colorScheme?: "emerald" | "amber" | "blue" | "purple";
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  colorScheme = "emerald",
}: StatCardProps) {
  const colorMap = {
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    blue: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {value}
          </h3>
        </div>
        <div className={cn("rounded-2xl border p-3", colorMap[colorScheme])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {(description || trend) && (
        <div className="mt-4 flex items-center space-x-2 text-xs">
          {trend && (
            <span
              className={cn(
                "inline-flex items-center font-semibold",
                trend.isPositive ? "text-emerald-600" : "text-rose-600"
              )}
            >
              {trend.isPositive ? "+" : "-"}
              {trend.value}%
            </span>
          )}
          {description && (
            <span className="text-muted-foreground">{description}</span>
          )}
        </div>
      )}
    </div>
  );
}
