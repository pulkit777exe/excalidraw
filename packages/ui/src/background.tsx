import * as React from "react";
import { cn } from "./utils/cn";

export interface BackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "gradient" | "animated" | "glass";
  pattern?: "dots" | "grid" | "waves" | "none";
}

const Background = React.forwardRef<HTMLDivElement, BackgroundProps>(
  ({ className, variant = "gradient", pattern = "animated", children, ...props }, ref) => {
    const variants = {
      default: "bg-bg-default",
      gradient: "bg-gradient-to-br from-neutral-950 via-zinc-900 to-neutral-900",
      animated: "bg-gradient-to-br from-neutral-950 via-zinc-900 to-neutral-900",
      glass: "bg-white/5 backdrop-blur-sm",
    };

    const patterns: Record<string, string> = {
      dots: "relative before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] before:bg-[length:20px_20px]",
      grid: "relative before:absolute before:inset-0 before:bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] before:bg-[length:20px_20px]",
      waves: "relative before:absolute before:inset-0 before:bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]",
      none: "",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden",
          variants[variant],
          patterns[pattern],
          className
        )}
        {...props}
      >
        {variant === "animated" && (
          <>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
          </>
        )}
        {children}
      </div>
    );
  }
);

Background.displayName = "Background";

export { Background };
