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
    const getVariantStyles = () => {
      switch (variant) {
        case "glass":
          return {
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          };
        case "gradient":
          return {
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)",
            border: "2px solid rgba(255, 255, 255, 0.1)",
          };
        default:
          return {
            backgroundColor: "var(--bg-emphasis)",
            border: "1px solid var(--border-default)",
          };
      }
    };

    const baseStyles = {
      borderRadius: "1rem",
      padding: "1.5rem",
      textAlign: "left" as const,
      transition: hover ? "all 0.3s ease" : "none",
      cursor: props.onClick ? "pointer" : "default",
      ...getVariantStyles(),
    };

    const hoverStyles = hover ? {
      transform: "translateY(-4px)",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    } : {};

    return (
      <div
        ref={ref}
        className={cn("feature-card", className)}
        style={baseStyles}
        onMouseEnter={(e) => {
          if (hover) {
            Object.assign(e.currentTarget.style, hoverStyles);
          }
        }}
        onMouseLeave={(e) => {
          if (hover) {
            e.currentTarget.style.transform = "";
            e.currentTarget.style.boxShadow = "";
          }
        }}
        {...props}
      >
        {icon && (
          <div 
            style={{
              width: "3rem",
              height: "3rem",
              background: "linear-gradient(135deg, var(--matty-skin) 0%, var(--matty-blue) 100%)",
              borderRadius: "0.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginBottom: "1rem",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (hover) {
                e.currentTarget.style.transform = "scale(1.1)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
            }}
          >
            {icon}
          </div>
        )}
        <h3 style={{ 
          fontSize: "1.125rem", 
          fontWeight: "700", 
          color: "var(--content-emphasis)", 
          marginBottom: "0.5rem",
          margin: 0
        }}>
          {title}
        </h3>
        <p style={{ 
          fontSize: "0.875rem", 
          color: "var(--content-muted)",
          margin: 0
        }}>
          {description}
        </p>
      </div>
    );
  }
);

FeatureCard.displayName = "FeatureCard";

export { FeatureCard };