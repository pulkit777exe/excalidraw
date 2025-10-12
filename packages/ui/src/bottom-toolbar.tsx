import * as React from "react";
import { cn } from "./utils/cn";

export interface BottomToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  zoom?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onScrollToContent?: () => void;
}

const BottomToolbar = React.forwardRef<HTMLDivElement, BottomToolbarProps>(
  ({ 
    className, 
    zoom = 70,
    onZoomIn,
    onZoomOut,
    onUndo,
    onRedo,
    onScrollToContent,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full h-12 flex items-center justify-between px-4",
          "bg-var(--bg-default) border-t border-var(--border-default)",
          className
        )}
        style={{
          backgroundColor: "var(--bg-default)",
          borderTop: "1px solid var(--border-default)",
        }}
        {...props}
      >
        {/* Left: Zoom and Undo/Redo Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onZoomOut}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{
              backgroundColor: "var(--bg-subtle)",
              color: "var(--content-default)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg-emphasis)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg-subtle)";
            }}
          >
            <span className="text-sm font-medium">-</span>
          </button>
          
          <span 
            className="px-2 py-1 text-sm font-medium"
            style={{ color: "var(--content-default)" }}
          >
            {zoom}%
          </span>
          
          <button
            onClick={onZoomIn}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{
              backgroundColor: "var(--bg-subtle)",
              color: "var(--content-default)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg-emphasis)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg-subtle)";
            }}
          >
            <span className="text-sm font-medium">+</span>
          </button>
          
          <button
            onClick={onUndo}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{
              backgroundColor: "var(--bg-subtle)",
              color: "var(--content-default)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg-emphasis)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg-subtle)";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7v6h6"/>
              <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
            </svg>
          </button>
          
          <button
            onClick={onRedo}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{
              backgroundColor: "var(--bg-subtle)",
              color: "var(--content-default)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg-emphasis)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg-subtle)";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 7v6h-6"/>
              <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/>
            </svg>
          </button>
        </div>

        {/* Center: Scroll to Content Button */}
        <button
          onClick={onScrollToContent}
          className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
          style={{
            backgroundColor: "var(--bg-subtle)",
            color: "var(--content-default)",
            border: "1px solid var(--border-default)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--bg-emphasis)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--bg-subtle)";
          }}
        >
          Scroll back to content
        </button>

        {/* Right: Status Icons */}
        <div className="flex items-center gap-2">
          <div 
            className="w-6 h-6 flex items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--matty-blue)" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20,6 9,17 4,12"/>
            </svg>
          </div>
          
          <div 
            className="w-6 h-6 flex items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--bg-subtle)" }}
          >
            <span className="text-xs font-medium" style={{ color: "var(--content-default)" }}>?</span>
          </div>
        </div>
      </div>
    );
  }
);

BottomToolbar.displayName = "BottomToolbar";

export { BottomToolbar };
