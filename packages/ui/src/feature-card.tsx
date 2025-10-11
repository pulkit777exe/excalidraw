import * as React from "react";
import { cn } from "./utils/cn";

export interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  variant?: "default" | "glass" | "gradient";
  hover?: boolean;
}

const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ className, icon, title, description, variant = "glass", hover = true, ...props }, ref) => {
    const variants = {
      default: "bg-slate-800 border border-slate-700",
      glass: "bg-white/5 backdrop-blur-xl border border-white/20 hover:border-white/30",
      gradient: "bg-gradient-to-br from-white/5 to-white/0 border-2 border-white/10 hover:border-white/30",
    };

    const hoverStyles = hover ? "transition-all duration-300 hover:shadow-xl hover:-translate-y-1" : "";

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl p-6 text-left",
          variants[variant],
          hoverStyles,
          className
        )}
        {...props}
      >
        {icon && (
          <div className="w-12 h-12 bg-gradient-to-br from-neutral-200 to-neutral-400 rounded-xl flex items-center justify-center flex-shrink-0 mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-bold text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-zinc-300">
          {description}
        </p>
      </div>
    );
  }
);

FeatureCard.displayName = "FeatureCard";

export { FeatureCard };
