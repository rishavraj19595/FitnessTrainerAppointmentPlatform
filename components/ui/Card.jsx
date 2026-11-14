import React from "react";
import { cn } from "@/lib/utils";

export function Card({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "bg-white border border-zinc-200 rounded-xl p-5 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function StatCard({ title, value, subtitle, icon: Icon, trend }) {
  return (
    <Card className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          {title}
        </p>
        <p className="text-2xl font-black text-zinc-950 mt-1">{value}</p>
        {subtitle && (
          <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>
        )}
      </div>
      {Icon && (
        <div className="p-2.5 rounded-lg bg-zinc-100 text-zinc-900 border border-zinc-200">
          <Icon className="h-5 w-5" />
        </div>
      )}
    </Card>
  );
}
