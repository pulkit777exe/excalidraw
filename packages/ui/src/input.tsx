import * as React from "react";
import { cn } from "./utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon, ...props }, ref) => {
    return (
      <div style={{ width: "100%" }}>
        {label && (
          <label 
            style={{ 
              display: "block", 
              fontSize: "0.875rem", 
              fontWeight: "500", 
              color: "var(--content-emphasis)", 
              marginBottom: "0.5rem" 
            }}
          >
            {label}
          </label>
        )}
        <div style={{ position: "relative" }}>
          {icon && (
            <div 
              style={{ 
                position: "absolute", 
                left: "0.75rem", 
                top: "50%", 
                transform: "translateY(-50%)", 
                color: "var(--content-muted)" 
              }}
            >
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn("input", className)}
            style={{
              width: "100%",
              padding: icon ? "0.75rem 1rem 0.75rem 2.5rem" : "0.75rem 1rem",
              backgroundColor: "var(--bg-emphasis)",
              border: `2px solid ${error ? "var(--content-error)" : "var(--border-default)"}`,
              borderRadius: "0.75rem",
              outline: "none",
              transition: "all 0.3s ease",
              color: "var(--content-emphasis)",
              fontSize: "1rem",
            }}
            ref={ref}
            {...props}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--matty-blue)";
              e.target.style.boxShadow = "0 0 0 2px rgba(107, 122, 137, 0.2)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = error ? "var(--content-error)" : "var(--border-default)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
        {error && (
          <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: "var(--content-error)", margin: 0 }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };