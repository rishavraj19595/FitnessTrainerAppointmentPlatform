"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function Button({
  children,
  className,
  variant = "default",
  size = "default",
  disabled = false,
  type = "button",
  onClick,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg";

  const variants = {
    default:
      "bg-black text-white hover:bg-zinc-800 active:scale-[0.99] focus:ring-zinc-900 shadow-sm",
    outline:
      "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100 focus:ring-zinc-400",
    secondary:
      "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 focus:ring-zinc-300",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost:
      "text-zinc-700 hover:bg-zinc-100 hover:text-black",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    default: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
    icon: "h-9 w-9 p-0",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
