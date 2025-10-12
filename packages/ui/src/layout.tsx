import * as React from "react";
import { cn } from "./utils/cn";

export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "centered" | "sidebar" | "grid";
  spacing?: "none" | "sm" | "md" | "lg";
}

const Layout = React.forwardRef<HTMLDivElement, LayoutProps>(
  ({ className, variant = "default", spacing = "md", children, ...props }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case "centered":
          return {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          };
        case "sidebar":
          return {
            display: "flex",
          };
        case "grid":
          return {
            display: "grid",
          };
        default:
          return {
            display: "flex",
            flexDirection: "column",
          };
      }
    };

    const getSpacingStyles = () => {
      switch (spacing) {
        case "none":
          return { gap: "0" };
        case "sm":
          return { gap: "0.5rem" };
        case "lg":
          return { gap: "1.5rem" };
        default:
          return { gap: "1rem" };
      }
    };

    return (
      <div
        ref={ref}
        className={cn("layout", className)}
        style={{
          ...getVariantStyles(),
          ...getSpacingStyles(),
        }}
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
      className={cn("layout-header", className)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 1.5rem",
        backgroundColor: "rgba(32, 30, 31, 0.3)",
        backdropFilter: "blur(4px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
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
      className={cn("layout-main", className)}
      style={{ flex: 1 }}
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
      className={cn("layout-footer", className)}
      style={{
        padding: "1rem 1.5rem",
        backgroundColor: "rgba(32, 30, 31, 0.3)",
        backdropFilter: "blur(4px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
      }}
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
      className={cn("layout-sidebar", className)}
      style={{
        width: "16rem",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(4px)",
        borderRight: "1px solid rgba(255, 255, 255, 0.1)",
      }}
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
      className={cn("layout-content", className)}
      style={{ flex: 1 }}
      {...props}
    >
      {children}
    </div>
  )
);
LayoutContent.displayName = "LayoutContent";

export { Layout, LayoutHeader, LayoutMain, LayoutFooter, LayoutSidebar, LayoutContent };