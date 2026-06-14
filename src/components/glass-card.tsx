"use client";

import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "dark" | "amber" | "green";
  onClick?: () => void;
}

const variantClass = {
  default: "glass-card",
  dark: "glass-dark",
  amber: "glass-amber",
  green: "glass-green",
};

export function GlassCard({ children, className, variant = "default", onClick }: GlassCardProps) {
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cn(variantClass[variant], "w-full text-left", className)}>
        {children}
      </button>
    );
  }
  return <div className={cn(variantClass[variant], className)}>{children}</div>;
}
