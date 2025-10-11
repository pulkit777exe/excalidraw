import * as React from "react";
import { cn } from "./utils/cn";

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "sm" | "md" | "lg";
  label?: string;
  description?: string;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, size = "md", label, description, ...props }, ref) => {
    const sizes = {
      sm: "h-4 w-7",
      md: "h-5 w-9",
      lg: "h-6 w-11",
    };

    const thumbSizes = {
      sm: "h-3 w-3 data-[state=checked]:translate-x-3",
      md: "h-4 w-4 data-[state=checked]:translate-x-4",
      lg: "h-5 w-5 data-[state=checked]:translate-x-5",
    };

    const switchElement = (
      <div className="flex items-center space-x-2">
        <div className="relative inline-flex">
          <input
            type="checkbox"
            className="sr-only"
            ref={ref}
            {...props}
          />
          <div
            className={cn(
              "peer inline-flex items-center rounded-full border-2 border-transparent transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "bg-input data-[state=checked]:bg-primary",
              sizes[size],
              className
            )}
            data-state={props.checked ? "checked" : "unchecked"}
          >
            <div
              className={cn(
                "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform",
                thumbSizes[size]
              )}
              data-state={props.checked ? "checked" : "unchecked"}
            />
          </div>
        </div>
        {(label || description) && (
          <div className="grid gap-1.5 leading-none">
            {label && (
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor={props.id}
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );

    return switchElement;
  }
);

Switch.displayName = "Switch";

export { Switch };
