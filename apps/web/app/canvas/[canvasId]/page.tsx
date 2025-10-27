"use client";

import { useEffect, useRef, use, useState } from "react";
import { CanvasLayout } from "@repo/ui";
import { useCanvasStore, useAuthStore, useRoomStore } from "@repo/store";
import { CollaborativeEngine } from "../../../utils/engine";

interface CollaboratorUser {
  id: string;
  name: string;
  status: "online" | "offline";
}

export default function CanvasPage({
  params,
}: {
  params: Promise<{ canvasId: string }>;
}) {
  const { canvasId } = use(params);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<CollaborativeEngine | null>(null);
  const [selectedTool, setSelectedTool] = useState("hand");
  const [zoom, setZoom] = useState(34);

  const { currentShape, currentColor, currentTool, setTool } = useCanvasStore();

  const { user, token } = useAuthStore();

  const { addCollaborator, setConnected } = useRoomStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const userName = user?.name || "User";
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
      status: "online",
    });

    const interval = setInterval(() => {
      const mockUsers: CollaboratorUser[] = [
        { id: user?.id || "1", name: userName, status: "online" },
        { id: "2", name: "Alex Smith", status: "online" },
        { id: "3", name: "Jordan Lee", status: "online" },
      ];

      mockUsers
        .slice(0, Math.floor(Math.random() * 3) + 1)
        .forEach((collab) => {
          addCollaborator(collab);
        });
    }, 5000);

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        engineRef.current?.render();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
      engineRef.current?.destroy();
      setConnected(false);
    };
  }, [
    canvasId,
    currentColor,
    currentShape,
    user,
    token,
    addCollaborator,
    setConnected,
  ]);

  useEffect(() => {
    engineRef.current?.setShape(currentShape);
  }, [currentShape]);

  useEffect(() => {
    engineRef.current?.setColor(currentColor);
  }, [currentColor]);

  useEffect(() => {
    engineRef.current?.setTool(selectedTool);
  }, [selectedTool]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        engineRef.current?.deleteSelected();
      } else if (e.key === "d" || e.key === "D") {
        setSelectedTool("pen");
      } else if (e.key === "s" || e.key === "S") {
        setSelectedTool("cursor");
      } else if (e.key === " ") {
        e.preventDefault();
        setSelectedTool("hand");
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === " ") {
        setSelectedTool("pen");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 10));
  };

  return (
    <CanvasLayout
      selectedTool={selectedTool}
      onToolSelect={setSelectedTool}
      onMenuClick={() => console.log("Menu clicked")}
      onShareClick={() => console.log("Share clicked")}
      onLibraryClick={() => console.log("Library clicked")}
      zoom={zoom}
      onZoomIn={handleZoomIn}
      onZoomOut={handleZoomOut}
      onUndo={() => console.log("Undo")}
      onRedo={() => console.log("Redo")}
      onScrollToContent={() => console.log("Scroll to content")}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          cursor:
            selectedTool === "hand"
              ? "grab"
              : selectedTool === "cursor"
                ? "pointer"
                : "crosshair",
        }}
      />
    </CanvasLayout>
  );
}
