import * as React from "react";
import { cn } from "./utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    const variants = {
      default: "bg-gray-500/20 text-gray-200 border-gray-400/30",
      success: "bg-green-500/20 text-green-200 border-green-400/30",
      warning: "bg-yellow-500/20 text-yellow-200 border-yellow-400/30",
      error: "bg-red-500/20 text-red-200 border-red-400/30",
      info: "bg-blue-500/20 text-blue-200 border-blue-400/30",
    };

    const sizes = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-3 py-1 text-sm",
      lg: "px-4 py-1.5 text-base",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 rounded-full font-medium border backdrop-blur-sm",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = "Badge";

export { Badge };