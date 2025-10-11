"use client";

import { useEffect, useRef } from "react";
import { 
  Toolbar, 
  ToolbarGroup, 
  ToolbarButton, 
  ToolbarColorPicker, 
  ToolbarSeparator,
  Button,
  Badge,
  Avatar,
  AvatarGroup,
  Tooltip,
  Layout,
  Section
} from "@repo/ui";
import { useCanvasStore, useAuthStore, useRoomStore } from "@repo/store";
import TopBar from "../../../components/TopBar";
import { CollaborativeEngine } from "../../../utils/engine";
import { 
  MousePointer2, 
  Hand, 
  Pencil, 
  Square, 
  Circle, 
  Minus, 
  Trash2, 
  Sparkles,
  Users,
  Download,
  Upload,
  Undo2,
  Redo2
} from "lucide-react";

interface CollaboratorUser {
  id: string;
  name: string;
  status: "online" | "offline";
}

export default async function CanvasPage({ params }: { params: Promise<{ canvasId: string }> }) {
  const { canvasId } = await params;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<CollaborativeEngine | null>(null);

  const { 
    currentShape, 
    currentColor, 
    currentTool, 
    setShape, 
    setColor, 
    setTool 
  } = useCanvasStore();

  const { user, token } = useAuthStore();
  
  const { 
    collaborators, 
    isConnected, 
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

  const handleSelectShape = (shape: "rectangle" | "circle" | "line") => {
    setShape(shape);
    setTool("draw");
  };

  const colors: ("none" | "red" | "blue" | "green" | "yellow")[] = ["none", "red", "blue", "green", "yellow"];

  return (
    <Layout>
      <TopBar />
      
      <Section className="bg-neutral-900/50 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-zinc-300 rounded-full animate-pulse"></div>
              <span className="text-sm text-zinc-300 font-medium">
                Room: <span className="text-white font-bold">{canvasId}</span>
              </span>
            </div>
            <Badge variant={isConnected ? "success" : "error"}>
              <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"} animate-pulse`} />
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-zinc-300" />
              <span className="text-sm font-medium text-zinc-300">{collaborators.length} online</span>
            </div>
            <AvatarGroup max={3}>
              {collaborators.map((user) => (
                <Avatar key={user.id} name={user.name} size="sm" status={user.status} />
              ))}
            </AvatarGroup>
          </div>
        </div>
      </Section>
      
      <Toolbar variant="default">
        <ToolbarGroup label="Tools">
          <Tooltip content="Draw (D)">
            <ToolbarButton
              active={currentTool === "draw"}
              onClick={() => setTool("draw")}
              icon={<Pencil className="w-4 h-4" />}
            >
              <span className="hidden lg:inline">Draw</span>
            </ToolbarButton>
          </Tooltip>
          <Tooltip content="Select (S)">
            <ToolbarButton
              active={currentTool === "select"}
              onClick={() => setTool("select")}
              icon={<MousePointer2 className="w-4 h-4" />}
            >
              <span className="hidden lg:inline">Select</span>
            </ToolbarButton>
          </Tooltip>
          <Tooltip content="Pan (Space)">
            <ToolbarButton
              active={currentTool === "pan"}
              onClick={() => setTool("pan")}
              icon={<Hand className="w-4 h-4" />}
            >
              <span className="hidden lg:inline">Pan</span>
            </ToolbarButton>
          </Tooltip>
        </ToolbarGroup>

        <ToolbarSeparator />

        {/* Shapes Group */}
        <ToolbarGroup label="Shapes">
          <Tooltip content="Rectangle (R)">
            <ToolbarButton
              active={currentShape === "rectangle" && currentTool === "draw"}
              onClick={() => handleSelectShape("rectangle")}
              icon={<Square className="w-4 h-4" />}
            >
              <span className="hidden xl:inline">Rectangle</span>
            </ToolbarButton>
          </Tooltip>
          <Tooltip content="Circle (C)">
            <ToolbarButton
              active={currentShape === "circle" && currentTool === "draw"}
              onClick={() => handleSelectShape("circle")}
              icon={<Circle className="w-4 h-4" />}
            >
              <span className="hidden xl:inline">Circle</span>
            </ToolbarButton>
          </Tooltip>
          <Tooltip content="Line (L)">
            <ToolbarButton
              active={currentShape === "line" && currentTool === "draw"}
              onClick={() => handleSelectShape("line")}
              icon={<Minus className="w-4 h-4" />}
            >
              <span className="hidden xl:inline">Line</span>
            </ToolbarButton>
          </Tooltip>
        </ToolbarGroup>

        <ToolbarSeparator />

        {/* Colors Group (kept colorful for drawing) */}
        <ToolbarGroup label="Color">
          <ToolbarColorPicker
            colors={colors}
            selectedColor={currentColor}
            onColorSelect={(color) => setColor(color as "none" | "red" | "blue" | "green" | "yellow")}
          />
        </ToolbarGroup>

        <ToolbarSeparator />

        {/* History Group */}
        <ToolbarGroup className="hidden md:flex">
          <Tooltip content="Undo (Ctrl+Z)">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <Undo2 className="w-4 h-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Redo (Ctrl+Y)">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <Redo2 className="w-4 h-4" />
            </Button>
          </Tooltip>
        </ToolbarGroup>

        <ToolbarSeparator className="hidden md:block" />

        {/* Actions Group */}
        <ToolbarGroup>
          <Tooltip content="Export (Ctrl+E)">
            <Button variant="ghost" size="sm" className="flex items-center gap-1.5">
              <Download className="w-4 h-4" />
              <span className="hidden lg:inline">Export</span>
            </Button>
          </Tooltip>
          <Tooltip content="Import">
            <Button variant="ghost" size="sm" className="flex items-center gap-1.5">
              <Upload className="w-4 h-4" />
              <span className="hidden lg:inline">Import</span>
            </Button>
          </Tooltip>
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <Tooltip content="Delete Selected (Del)">
            <Button
              onClick={() => engineRef.current?.deleteSelected()}
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden md:inline">Delete</span>
            </Button>
          </Tooltip>
          <Tooltip content="Clear All">
            <Button
              onClick={() => engineRef.current?.reset()}
              variant="destructive"
              size="sm"
              className="flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden md:inline">Clear</span>
            </Button>
          </Tooltip>
        </ToolbarGroup>
      </Toolbar>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden p-4">
        <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10">
          <canvas
            ref={canvasRef}
            className="w-full h-full bg-white"
            style={{
              cursor: currentTool === "pan" ? "grab" : currentTool === "select" ? "pointer" : "crosshair"
            }}
          />
        </div>
      </div>

      {/* Help Text */}
      <Section className="bg-neutral-900/50 border-t border-white/10">
        <div className="text-center">
          <p className="text-xs text-zinc-400">
            <span className="font-semibold">Keyboard shortcuts:</span> D (Draw) • S (Select) • Space (Pan) • Del (Delete) • R (Rectangle) • C (Circle) • L (Line)
          </p>
        </div>
      </Section>
    </Layout>
  );
}