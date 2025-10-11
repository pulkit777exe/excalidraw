import * as React from "react";
import { cn } from "./utils/cn";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "hero" | "features" | "cta" | "footer";
  background?: "default" | "gradient" | "glass" | "dark";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, variant = "default", background = "default", padding = "lg", children, ...props }, ref) => {
    const backgrounds = {
      default: "bg-bg-default",
      gradient: "bg-gradient-to-br from-neutral-950 via-zinc-900 to-neutral-900",
      glass: "bg-white/5 backdrop-blur-sm",
      dark: "bg-black",
    };

    const paddings = {
      none: "",
      sm: "py-8",
      md: "py-12",
      lg: "py-16",
      xl: "py-24",
    };

    const variants = {
      default: "",
      hero: "min-h-screen flex items-center justify-center",
      features: "py-20",
      cta: "py-16",
      footer: "py-8",
    };

    return (
      <section
        ref={ref}
        className={cn(
          "relative overflow-hidden",
          backgrounds[background],
          paddings[padding],
          variants[variant],
          className
        )}
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
      className={cn("container mx-auto px-4", className)}
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
      className={cn("text-center mb-12", className)}
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
      className={cn("text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 via-zinc-300 to-slate-200 mb-4 tracking-tight", className)}
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
      className={cn("text-lg text-zinc-300 font-light max-w-2xl mx-auto", className)}
      {...props}
    >
      {children}
    </p>
  )
);
SectionDescription.displayName = "SectionDescription";

export { Section, SectionContainer, SectionHeader, SectionTitle, SectionDescription };
