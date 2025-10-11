import * as React from "react";
import { cn } from "./utils/cn";

export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "centered" | "sidebar" | "grid";
  spacing?: "none" | "sm" | "md" | "lg";
}

const Layout = React.forwardRef<HTMLDivElement, LayoutProps>(
  ({ className, variant = "default", spacing = "md", children, ...props }, ref) => {
    const variants = {
      default: "flex flex-col",
      centered: "flex items-center justify-center min-h-screen",
      sidebar: "flex",
      grid: "grid",
    };

    const spacings = {
      none: "",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
    };

    return (
      <div
        ref={ref}
        className={cn(
          variants[variant],
          spacings[spacing],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Layout.displayName = "Layout";

const LayoutHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-between py-4 px-6 bg-black/30 backdrop-blur-sm border-b border-white/10", className)}
      {...props}
    >
      {children}
    </div>
  )
);
LayoutHeader.displayName = "LayoutHeader";

const LayoutMain = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex-1", className)}
      {...props}
    >
      {children}
    </div>
  )
);
LayoutMain.displayName = "LayoutMain";

const LayoutFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("py-4 px-6 bg-black/30 backdrop-blur-sm border-t border-white/10", className)}
      {...props}
    >
      {children}
    </div>
  )
);
LayoutFooter.displayName = "LayoutFooter";

const LayoutSidebar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("w-64 bg-white/5 backdrop-blur-sm border-r border-white/10", className)}
      {...props}
    >
      {children}
    </div>
  )
);
LayoutSidebar.displayName = "LayoutSidebar";

const LayoutContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex-1", className)}
      {...props}
    >
      {children}
    </div>
  )
);
LayoutContent.displayName = "LayoutContent";

export { Layout, LayoutHeader, LayoutMain, LayoutFooter, LayoutSidebar, LayoutContent };
