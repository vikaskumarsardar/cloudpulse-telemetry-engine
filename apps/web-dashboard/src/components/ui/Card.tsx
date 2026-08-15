import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  role?: string;
  ariaLabel?: string;
}

export function Card({ children, className, role, ariaLabel }: CardProps) {
  return (
    <div
      role={role}
      aria-label={ariaLabel}
      className={cn(
        "glass-card rounded-xl p-5 shadow-sm shadow-slate-200/50 dark:shadow-black/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-blue-500/30",
        className
      )}
    >
      {children}
    </div>
  );
}
