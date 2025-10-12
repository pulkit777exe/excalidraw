import * as React from "react";
import { cn } from "./utils/cn";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "hero" | "features" | "cta" | "footer";
  background?: "default" | "gradient" | "glass" | "dark";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, variant = "default", background = "default", padding = "lg", children, ...props }, ref) => {
    const getBackgroundStyles = () => {
      switch (background) {
        case "gradient":
          return {
            background: "linear-gradient(135deg, var(--matty-black) 0%, var(--matty-brown) 50%, var(--matty-blue) 100%)",
          };
        case "glass":
          return {
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(4px)",
          };
        case "dark":
          return {
            backgroundColor: "var(--matty-black)",
          };
        default:
          return {
            backgroundColor: "var(--bg-default)",
          };
      }
    };

    const getPaddingStyles = () => {
      switch (padding) {
        case "none":
          return { padding: "0" };
        case "sm":
          return { padding: "2rem 0" };
        case "md":
          return { padding: "3rem 0" };
        case "xl":
          return { padding: "6rem 0" };
        default:
          return { padding: "4rem 0" };
      }
    };

    const getVariantStyles = () => {
      switch (variant) {
        case "hero":
          return {
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          };
        case "features":
          return { padding: "5rem 0" };
        case "cta":
          return { padding: "4rem 0" };
        case "footer":
          return { padding: "2rem 0" };
        default:
          return {};
      }
    };

    return (
      <section
        ref={ref}
        className={cn("section", className)}
        style={{
          position: "relative",
          overflow: "hidden",
          ...getBackgroundStyles(),
          ...getPaddingStyles(),
          ...getVariantStyles(),
        }}
        {...props}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = "Section";

const SectionContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("section-container", className)}
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 1rem",
      }}
      {...props}
    >
      {children}
    </div>
  )
);
SectionContainer.displayName = "SectionContainer";

const SectionHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("section-header", className)}
      style={{
        textAlign: "center",
        marginBottom: "3rem",
      }}
      {...props}
    >
      {children}
    </div>
  )
);
SectionHeader.displayName = "SectionHeader";

const SectionTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn("section-title", className)}
      style={{
        fontSize: "clamp(2rem, 5vw, 3rem)",
        fontWeight: "900",
        background: "linear-gradient(135deg, var(--matty-skin) 0%, var(--matty-blue) 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        marginBottom: "1rem",
        letterSpacing: "-0.02em",
      }}
      {...props}
    >
      {children}
    </h2>
  )
);
SectionTitle.displayName = "SectionTitle";

const SectionDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("section-description", className)}
      style={{
        fontSize: "1.125rem",
        color: "var(--content-muted)",
        fontWeight: "300",
        maxWidth: "32rem",
        margin: "0 auto",
      }}
      {...props}
    >
      {children}
    </p>
  )
);
SectionDescription.displayName = "SectionDescription";

export { Section, SectionContainer, SectionHeader, SectionTitle, SectionDescription };