import * as React from "react";
import { cn } from "./utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary" | "outline" | "ghost" | "destructive" | "success";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case "primary":
          return {
            backgroundColor: "var(--matty-blue)",
            color: "var(--content-inverted)",
            border: "2px solid var(--matty-blue)",
          };
        case "secondary":
          return {
            backgroundColor: "var(--matty-brown)",
            color: "var(--content-inverted)",
            border: "2px solid var(--matty-brown)",
          };
        case "outline":
          return {
            backgroundColor: "transparent",
            color: "var(--content-emphasis)",
            border: "2px solid var(--border-emphasis)",
          };
        case "ghost":
          return {
            backgroundColor: "transparent",
            color: "var(--content-emphasis)",
            border: "none",
          };
        case "destructive":
          return {
            backgroundColor: "var(--content-error)",
            color: "var(--content-inverted)",
            border: "2px solid var(--content-error)",
          };
        case "success":
          return {
            backgroundColor: "var(--content-success)",
            color: "var(--content-inverted)",
            border: "2px solid var(--content-success)",
          };
        default:
          return {
            backgroundColor: "var(--bg-emphasis)",
            color: "var(--content-emphasis)",
            border: "2px solid var(--border-default)",
          };
      }
    };

    const getSizeStyles = () => {
      switch (size) {
        case "sm":
          return {
            padding: "0.375rem 0.75rem",
            fontSize: "0.875rem",
          };
        case "lg":
          return {
            padding: "0.75rem 1.5rem",
            fontSize: "1.125rem",
          };
        default:
          return {
            padding: "0.5rem 1rem",
            fontSize: "1rem",
          };
      }
    };

    const baseStyles = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "600",
      borderRadius: "0.75rem",
      transition: "all 0.3s ease",
      cursor: disabled || isLoading ? "not-allowed" : "pointer",
      opacity: disabled || isLoading ? 0.5 : 1,
      outline: "none",
      ...getVariantStyles(),
      ...getSizeStyles(),
    };

    const hoverStyles = {
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    };

    return (
      <button
        ref={ref}
        className={cn("button", className)}
        disabled={disabled || isLoading}
        style={baseStyles}
        onMouseEnter={(e) => {
          if (!disabled && !isLoading) {
            Object.assign(e.currentTarget.style, hoverStyles);
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !isLoading) {
            e.currentTarget.style.transform = "";
            e.currentTarget.style.boxShadow = "";
          }
        }}
        {...props}
      >
        {isLoading && (
          <svg 
            style={{ 
              animation: "spin 1s linear infinite",
              marginRight: "0.5rem",
              width: "1rem",
              height: "1rem"
            }} 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              style={{ opacity: 0.25 }} 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              style={{ opacity: 0.75 }} 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };