import * as React from "react";
import { cn } from "./utils/cn";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "away" | "busy";
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, name, size = "md", status, ...props }, ref) => {
    const getSizeStyles = () => {
      switch (size) {
        case "sm":
          return { width: "2rem", height: "2rem", fontSize: "0.75rem" };
        case "lg":
          return { width: "3rem", height: "3rem", fontSize: "1rem" };
        case "xl":
          return { width: "4rem", height: "4rem", fontSize: "1.25rem" };
        default:
          return { width: "2.5rem", height: "2.5rem", fontSize: "0.875rem" };
      }
    };

    const getStatusColors = () => {
      switch (status) {
        case "online":
          return { backgroundColor: "var(--content-success)" };
        case "offline":
          return { backgroundColor: "var(--content-muted)" };
        case "away":
          return { backgroundColor: "var(--content-attention)" };
        case "busy":
          return { backgroundColor: "var(--content-error)" };
        default:
          return {};
      }
    };

    const getInitials = (name: string) => {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    return (
      <div
        ref={ref}
        className={cn("avatar", className)}
        style={{
          position: "relative",
          display: "inline-flex",
          ...getSizeStyles(),
        }}
        {...props}
      >
        <div
          style={{
            borderRadius: "50%",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "600",
            background: "linear-gradient(135deg, var(--matty-blue) 0%, var(--matty-skin) 100%)",
            color: "var(--content-inverted)",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            ...getSizeStyles(),
          }}
        >
          {src ? (
            <img 
              src={src} 
              alt={alt || name || "Avatar"} 
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "cover" 
              }} 
            />
          ) : (
            <span>{name ? getInitials(name) : "?"}</span>
          )}
        </div>
        {status && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "0.75rem",
              height: "0.75rem",
              borderRadius: "50%",
              border: "2px solid var(--matty-black)",
              ...getStatusColors(),
            }}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

const AvatarGroup: React.FC<{ children: React.ReactNode; max?: number; className?: string }> = ({
  children,
  max = 3,
  className,
}) => {
  const childArray = React.Children.toArray(children);
  const displayChildren = max ? childArray.slice(0, max) : childArray;
  const remaining = childArray.length - displayChildren.length;

  return (
    <div 
      className={cn("avatar-group", className)}
      style={{
        display: "flex",
        alignItems: "center",
        marginLeft: "-0.5rem",
      }}
    >
      {displayChildren}
      {remaining > 0 && (
        <div style={{
          width: "2.5rem",
          height: "2.5rem",
          borderRadius: "50%",
          backgroundColor: "var(--bg-emphasis)",
          border: "2px solid rgba(255, 255, 255, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.75rem",
          fontWeight: "600",
          color: "var(--content-emphasis)",
          zIndex: 10,
        }}>
          +{remaining}
        </div>
      )}
    </div>
  );
};

AvatarGroup.displayName = "AvatarGroup";

export { Avatar, AvatarGroup };