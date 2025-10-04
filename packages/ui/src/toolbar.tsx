import * as React from "react";
import { cn } from "./utils/cn";

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "floating";
}

const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-gray-800 border-b border-gray-700",
      floating: "bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl",
    };

    return (
      <div
        ref={ref}
        className={cn("p-4 flex gap-4 items-center", variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Toolbar.displayName = "Toolbar";

export interface ToolbarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

const ToolbarGroup = React.forwardRef<HTMLDivElement, ToolbarGroupProps>(
  ({ className, label, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex gap-2 items-center", className)}
      {...props}
    >
      {label && (
        <span className="text-sm text-gray-400 font-medium mr-2">{label}</span>
      )}
      {children}
    </div>
  )
);

ToolbarGroup.displayName = "ToolbarGroup";

export interface ToolbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon?: React.ReactNode;
}

const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, active, icon, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "px-4 py-2 rounded-lg font-medium transition-all duration-200",
        "flex items-center gap-2",
        active
          ? "bg-blue-600 text-white shadow-lg"
          : "bg-gray-600 text-gray-200 hover:bg-gray-500",
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
);

ToolbarButton.displayName = "ToolbarButton";

export interface ToolbarColorPickerProps {
  colors: string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const ToolbarColorPicker: React.FC<ToolbarColorPickerProps> = ({
  colors,
  selectedColor,
  onColorSelect,
}) => (
  <div className="flex gap-2">
    {colors.map((color) => (
      <button
        key={color}
        onClick={() => onColorSelect(color)}
        className={cn(
          "w-8 h-8 rounded-lg border-2 transition-all duration-200",
          "hover:scale-110",
          selectedColor === color
            ? "border-white shadow-lg scale-110"
            : "border-gray-400"
        )}
        style={{ backgroundColor: color }}
        title={color}
      />
    ))}
  </div>
);

ToolbarColorPicker.displayName = "ToolbarColorPicker";

const ToolbarSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("w-px h-8 bg-gray-600", className)}
      {...props}
    />
  )
);

ToolbarSeparator.displayName = "ToolbarSeparator";

export { Toolbar, ToolbarGroup, ToolbarButton, ToolbarColorPicker, ToolbarSeparator };