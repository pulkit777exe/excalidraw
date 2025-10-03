"use client";

import { use, useEffect, useRef, useState } from "react";
import TopBar from "../../../components/TopBar";
import { CollaborativeEngine } from "../../../utils/engine";
import { Eraser, Pencil, Shapes as ShapesIcon } from "lucide-react";

type ShapeType = "rectangle" | "circle" | "line"; 
type FillColor = "red" | "blue" | "green" | "yellow" | "none"; 
type Tool = "select" | "pan" | "draw";

interface CanvasPageProps {
  params: Promise<{ canvasId: string }>;
}

export default function CanvasPage({ params }: CanvasPageProps) {
  const { canvasId } = use(params);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<CollaborativeEngine | null>(null);
  const [currentShape, setCurrentShape] = useState<ShapeType>("rectangle");
  const [currentColor, setCurrentColor] = useState<FillColor>("none");
  const [currentTool, setCurrentTool] = useState<Tool>("draw");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId") || "anonymous";
    const wsUrl = `ws://localhost:8080?token=${token}`;

    engineRef.current = new CollaborativeEngine(
      canvas,
      userId,
      canvasId,
      wsUrl,
      currentShape,
      currentColor
    );

    setIsConnected(true);

    return () => {
      engineRef.current?.destroy();
    };
  }, [canvasId]);

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
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // const handleMenuClick = () => {
  //   console.log("Menu clicked");
  // };

  return (
    <div className="w-full h-screen bg-[#131212] flex flex-col">
      <TopBar>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700">
            <Pencil className="w-5 h-5" />
            <span className="hidden md:inline">Pencil</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700">
            <Eraser className="w-5 h-5" />
            <span className="hidden md:inline">Eraser</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700">
            <ShapesIcon className="w-5 h-5" />
            <span className="hidden md:inline">Shapes</span>
          </button>
        </div>
      </TopBar>
      
      {/* Status Bar */}
      <div className="bg-gray-900 px-4 py-2 text-white text-sm flex items-center gap-4">
        <div>Canvas: {canvasId}</div>
        <div className={`flex items-center gap-2 ${isConnected ? "text-green-400" : "text-red-400"}`}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`} />
          {isConnected ? "Connected" : "Disconnected"}
        </div>
      </div>
      
      {/* Toolbar */}
      <div className="bg-gray-800 p-4 flex gap-6 items-center">
        {/* Tools */}
        <div className="flex gap-2 border-r border-gray-600 pr-6">
          <button
            onClick={() => setCurrentTool("draw")}
            className={`px-4 py-2 rounded ${currentTool === "draw" ? "bg-blue-600" : "bg-gray-600"}`}
            title="Draw (D)"
          >
            Draw
          </button>
          <button
            onClick={() => setCurrentTool("select")}
            className={`px-4 py-2 rounded ${currentTool === "select" ? "bg-blue-600" : "bg-gray-600"}`}
            title="Select (S)"
          >
            Select
          </button>
          <button
            onClick={() => setCurrentTool("pan")}
            className={`px-4 py-2 rounded ${currentTool === "pan" ? "bg-blue-600" : "bg-gray-600"}`}
            title="Pan (Space)"
          >
            Pan
          </button>
        </div>

        {/* Shapes */}
        <div className="flex gap-2 border-r border-gray-600 pr-6">
          <button
            onClick={() => { setCurrentShape("rectangle"); setCurrentTool("draw"); }}
            className={`px-4 py-2 rounded ${currentShape === "rectangle" && currentTool === "draw" ? "bg-blue-600" : "bg-gray-600"}`}
          >
            Rectangle
          </button>
          <button
            onClick={() => { setCurrentShape("circle"); setCurrentTool("draw"); }}
            className={`px-4 py-2 rounded ${currentShape === "circle" && currentTool === "draw" ? "bg-blue-600" : "bg-gray-600"}`}
          >
            Circle
          </button>
          <button
            onClick={() => { setCurrentShape("line"); setCurrentTool("draw"); }}
            className={`px-4 py-2 rounded ${currentShape === "line" && currentTool === "draw" ? "bg-blue-600" : "bg-gray-600"}`}
          >
            ─ Line
          </button>
        </div>

        {/* Colors */}
        <div className="flex gap-2 border-r border-gray-600 pr-6">
          {(["black", "red", "blue", "green", "yellow"] as FillColor[]).map((color) => (
            <button
              key={color}
              onClick={() => setCurrentColor(color)}
              className={`w-8 h-8 rounded border-2 ${currentColor === color ? "border-white" : "border-gray-400"}`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => engineRef.current?.deleteSelected()}
            className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-700"
            title="Delete (Del)"
          >
            🗑️ Delete
          </button>
          <button
            onClick={() => engineRef.current?.reset()}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
            title="Clear All"
          >
            ✨ Clear All
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full bg-white cursor-crosshair"
        />
      </div>

      {/* Help Text */}
      <div className="bg-gray-900 px-4 py-2 text-gray-400 text-xs">
        Scroll to zoom • Middle-click or Space+drag to pan • Delete key to remove selected shape
      </div>
    </div>
  );
}