import * as React from "react";
import { cn } from "./utils/cn";
import { TopToolbar } from "./top-toolbar";
import { BottomToolbar } from "./bottom-toolbar";

export interface CanvasLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedTool?: string;
  onToolSelect?: (tool: string) => void;
  onMenuClick?: () => void;
  onShareClick?: () => void;
  onLibraryClick?: () => void;
  zoom?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onScrollToContent?: () => void;
}

const CanvasLayout = React.forwardRef<HTMLDivElement, CanvasLayoutProps>(
  ({ 
    className, 
    children,
    selectedTool = "hand",
    onToolSelect,
    onMenuClick,
    onShareClick,
    onLibraryClick,
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
        className={cn("w-full h-screen flex flex-col", className)}
        style={{
          backgroundColor: "var(--bg-default)",
        }}
        {...props}
      >
        {/* Top Toolbar */}
        <TopToolbar
          selectedTool={selectedTool}
          onToolSelect={onToolSelect}
          onMenuClick={onMenuClick}
          onShareClick={onShareClick}
          onLibraryClick={onLibraryClick}
        />

        {/* Main Canvas Area */}
        <div 
          className="flex-1 relative overflow-hidden"
          style={{
            backgroundColor: "var(--bg-default)",
          }}
        >
          {children}
        </div>

        {/* Bottom Toolbar */}
        <BottomToolbar
          zoom={zoom}
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          onUndo={onUndo}
          onRedo={onRedo}
          onScrollToContent={onScrollToContent}
        />
      </div>
    );
  }
);

CanvasLayout.displayName = "CanvasLayout";

export { CanvasLayout };
