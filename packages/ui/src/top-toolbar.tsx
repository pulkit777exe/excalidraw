import * as React from "react";
import { cn } from "./utils/cn";

export interface TopToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  onMenuClick?: () => void;
  onShareClick?: () => void;
  onLibraryClick?: () => void;
  selectedTool?: string;
  onToolSelect?: (tool: string) => void;
}

const TopToolbar = React.forwardRef<HTMLDivElement, TopToolbarProps>(
  ({ 
    className, 
    onMenuClick, 
    onShareClick, 
    onLibraryClick, 
    selectedTool = "hand",
    onToolSelect,
    ...props 
  }, ref) => {
    const tools = [
      { id: "lock", icon: "🔒", label: "Lock" },
      { id: "hand", icon: "✋", label: "Hand" },
      { id: "cursor", icon: "↖", label: "Cursor" },
      { id: "square", icon: "⬜", label: "Square" },
      { id: "diamond", icon: "♦", label: "Diamond" },
      { id: "circle", icon: "⭕", label: "Circle" },
      { id: "arrow", icon: "→", label: "Arrow" },
      { id: "line", icon: "—", label: "Line" },
      { id: "pen", icon: "✏", label: "Pen" },
      { id: "text", icon: "A", label: "Text" },
      { id: "image", icon: "🖼", label: "Image" },
      { id: "eraser", icon: "🧹", label: "Eraser" },
      { id: "grid", icon: "⊞", label: "Grid" },
    ];

    return (
      <div
        ref={ref}
        className={cn(
          "w-full h-16 flex items-center justify-between px-4",
          "bg-var(--bg-default) border-b border-var(--border-default)",
          className
        )}
        style={{
          backgroundColor: "var(--bg-default)",
          borderBottom: "1px solid var(--border-default)",
        }}
        {...props}
      >
        {/* Left: Menu Button */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-var(--bg-subtle) transition-colors"
          style={{
            color: "var(--content-default)",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--bg-subtle)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        {/* Center: Toolbar */}
        <div className="flex items-center gap-1 px-4 py-2 rounded-lg" style={{ backgroundColor: "var(--bg-subtle)" }}>
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onToolSelect?.(tool.id)}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200",
                "hover:scale-105"
              )}
              style={{
                backgroundColor: selectedTool === tool.id ? "var(--matty-blue)" : "transparent",
                color: selectedTool === tool.id ? "var(--content-inverted)" : "var(--content-default)",
              }}
              title={tool.label}
            >
              <span className="text-lg">{tool.icon}</span>
            </button>
          ))}
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onShareClick}
            className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
            style={{
              backgroundColor: "var(--matty-blue)",
              color: "var(--content-inverted)",
            }}
          >
            Share
          </button>
          <button
            onClick={onLibraryClick}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200"
            style={{
              backgroundColor: "var(--bg-subtle)",
              color: "var(--content-default)",
              border: "1px solid var(--border-default)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            Library
          </button>
        </div>
      </div>
    );
  }
);

TopToolbar.displayName = "TopToolbar";

export { TopToolbar };
