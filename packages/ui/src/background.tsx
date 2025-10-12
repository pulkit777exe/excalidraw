import * as React from "react";
import { cn } from "./utils/cn";

export interface BackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "gradient" | "animated" | "glass";
  pattern?: "dots" | "grid" | "waves" | "none";
}

const Background = React.forwardRef<HTMLDivElement, BackgroundProps>(
  ({ className, variant = "gradient", pattern = "animated", children, ...props }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case "gradient":
          return {
            background: "linear-gradient(135deg, var(--matty-black) 0%, var(--matty-brown) 50%, var(--matty-blue) 100%)",
          };
        case "animated":
          return {
            background: "linear-gradient(135deg, var(--matty-black) 0%, var(--matty-brown) 50%, var(--matty-blue) 100%)",
          };
        case "glass":
          return {
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(4px)",
          };
        default:
          return {
            backgroundColor: "var(--bg-default)",
          };
      }
    };

    const getPatternStyles = () => {
      switch (pattern) {
        case "dots":
          return {
            position: "relative" as const,
          };
        case "grid":
          return {
            position: "relative" as const,
          };
        case "waves":
          return {
            position: "relative" as const,
          };
        default:
          return {};
      }
    };

    return (
      <div
        ref={ref}
        className={cn("background", className)}
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: "100vh",
          ...getVariantStyles(),
          ...getPatternStyles(),
        }}
        {...props}
      >
        {variant === "animated" && (
          <>
            <div 
              style={{
                position: "absolute",
                top: "25%",
                left: "25%",
                width: "24rem",
                height: "24rem",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderRadius: "50%",
                filter: "blur(48px)",
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }}
            />
            <div 
              style={{
                position: "absolute",
                bottom: "25%",
                right: "25%",
                width: "24rem",
                height: "24rem",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "50%",
                filter: "blur(48px)",
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                animationDelay: "1s",
              }}
            />
          </>
        )}
        {children}
      </div>
    );
  }
);

Background.displayName = "Background";

export { Background };