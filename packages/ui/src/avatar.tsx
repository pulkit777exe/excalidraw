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
    const sizes = {
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-12 h-12 text-base",
      xl: "w-16 h-16 text-xl",
    };

    const statusColors = {
      online: "bg-green-400",
      offline: "bg-gray-400",
      away: "bg-yellow-400",
      busy: "bg-red-400",
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
        className={cn("relative inline-flex", sizes[size], className)}
        {...props}
      >
        <div
          className={cn(
            "rounded-full overflow-hidden flex items-center justify-center font-semibold",
            "bg-gradient-to-br from-purple-400 to-pink-400 text-white",
            "border-2 border-white/20 shadow-lg",
            sizes[size]
          )}
        >
          {src ? (
            <img src={src} alt={alt || name || "Avatar"} className="w-full h-full object-cover" />
          ) : (
            <span>{name ? getInitials(name) : "?"}</span>
          )}
        </div>
        {status && (
          <div
            className={cn(
              "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900",
              statusColors[status]
            )}
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
    <div className={cn("flex items-center -space-x-2", className)}>
      {displayChildren}
      {remaining > 0 && (
        <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-white/20 flex items-center justify-center text-xs font-semibold text-white z-10">
          +{remaining}
        </div>
      )}
    </div>
  );
};

AvatarGroup.displayName = "AvatarGroup";

export { Avatar, AvatarGroup };