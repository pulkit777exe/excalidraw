"use client";

import { useEffect, useRef, use, useState } from "react";
import { 
  CanvasLayout
} from "@repo/ui";
import { useCanvasStore, useAuthStore, useRoomStore } from "@repo/store";
import { CollaborativeEngine } from "../../../utils/engine";

interface CollaboratorUser {
  id: string;
  name: string;
  status: "online" | "offline";
}

export default function CanvasPage({ params }: { params: Promise<{ canvasId: string }> }) {
  const { canvasId } = use(params);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<CollaborativeEngine | null>(null);
  const [selectedTool, setSelectedTool] = useState("hand");
  const [zoom, setZoom] = useState(70);

  const { 
    currentShape, 
    currentColor, 
    currentTool, 
    setTool 
  } = useCanvasStore();

  const { user, token } = useAuthStore();
  
  const { 
    addCollaborator, 
    setConnected 
  } = useRoomStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const userName = user?.name || "Anonymous";
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";

    engineRef.current = new CollaborativeEngine(
      canvas,
      userName,
      canvasId,
      `${wsUrl}?token=${token}`,
      currentShape,
      currentColor
    );

    setConnected(true);

    addCollaborator({
      id: user?.id || "1",
      name: userName,
      status: "online"
    });

    const interval = setInterval(() => {
      const mockUsers: CollaboratorUser[] = [
        { id: user?.id || "1", name: userName, status: "online" },
        { id: "2", name: "Alex Smith", status: "online" },
        { id: "3", name: "Jordan Lee", status: "online" },
      ];
      
      // Update collaborators in store
      mockUsers.slice(0, Math.floor(Math.random() * 3) + 1).forEach(collab => {
        addCollaborator(collab);
      });
    }, 5000);

    return () => {
      clearInterval(interval);
      engineRef.current?.destroy();
      setConnected(false);
    };
  }, [canvasId, currentColor, currentShape, user, token, addCollaborator, setConnected]);

  useEffect(() => {
    engineRef.current?.setShape(currentShape);
  }, [currentShape]);

  useEffect(() => {
    engineRef.current?.setColor(currentColor);
  }, [currentColor]);

  useEffect(() => {
    engineRef.current?.setTool(currentTool);
  }, [currentTool]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        engineRef.current?.deleteSelected();
      } else if (e.key === "d" || e.key === "D") {
        setTool("draw");
      } else if (e.key === "s" || e.key === "S") {
        setTool("select");
      } else if (e.key === " ") {
        e.preventDefault();
        setTool("pan");
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === " ") {
        setTool("draw");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", handleKeyUp);
    
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [setTool]);

  const handleToolSelect = (tool: string) => {
    setSelectedTool(tool);
    if (tool === "hand") {
      setTool("pan");
    } else if (tool === "cursor") {
      setTool("select");
    } else if (tool === "pen") {
      setTool("draw");
    } else {
      setTool("pan");
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 10));
  };

  const handleUndo = () => {
    console.log("Undo clicked");
  };

  const handleRedo = () => {
    console.log("Redo clicked");
  };

  const handleScrollToContent = () => {
    console.log("Scroll to content");
  };

  const handleMenuClick = () => {
    console.log("Menu clicked");
  };

  const handleShareClick = () => {
    console.log("Share clicked");
  };

  const handleLibraryClick = () => {
    console.log("Library clicked");
  };

  return (
    <CanvasLayout
      selectedTool={selectedTool}
      onToolSelect={handleToolSelect}
      onMenuClick={handleMenuClick}
      onShareClick={handleShareClick}
      onLibraryClick={handleLibraryClick}
      zoom={zoom}
      onZoomIn={handleZoomIn}
      onZoomOut={handleZoomOut}
      onUndo={handleUndo}
      onRedo={handleRedo}
      onScrollToContent={handleScrollToContent}
    >
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full h-full max-w-6xl max-h-4xl">
          <canvas
            ref={canvasRef}
            className="w-full h-full bg-white dark:bg-neutral-900 rounded-lg shadow-lg"
            style={{
              cursor: currentTool === "pan" ? "grab" : currentTool === "select" ? "pointer" : "crosshair"
            }}
          />
        </div>
      </div>
    </CanvasLayout>
  );
}