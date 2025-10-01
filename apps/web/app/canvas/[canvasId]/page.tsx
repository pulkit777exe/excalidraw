"use client";

import { use, useEffect, useRef, useState } from "react";
import TopBar from "../../../components/TopBar";
import { Engine } from "../../../utils/engine";

type Shapes = "rectangle" | "circle" | "triangle";
type FillColor = "red" | "blue" | "green";

interface CanvasPageProps {
  params: Promise<{ canvasId: string }>;
}

export default function CanvasPage({ params }: CanvasPageProps) {
  const { canvasId } = use(params);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const [currentShape, setCurrentShape] = useState<Shapes>("rectangle");
  const [currentColor, setCurrentColor] = useState<FillColor>("red");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    engineRef.current = new Engine(canvas, currentShape, currentColor);

    return () => {
      engineRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setShape(currentShape);
    }
  }, [currentShape]);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setColor(currentColor);
    }
  }, [currentColor]);

  return (
    <div className="w-full h-screen bg-[#131212] flex flex-col">
      <TopBar />
      <div>
        CanvasId: {canvasId}  
      </div>
      
      {/* Toolbar */}
      <div className="bg-gray-800 p-4 flex gap-4 items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentShape("rectangle")}
            className={`px-4 py-2 rounded ${
              currentShape === "rectangle" ? "bg-blue-600" : "bg-gray-600"
            }`}
          >
            Rectangle
          </button>
          <button
            onClick={() => setCurrentShape("circle")}
            className={`px-4 py-2 rounded ${
              currentShape === "circle" ? "bg-blue-600" : "bg-gray-600"
            }`}
          >
            Circle
          </button>
          <button
            onClick={() => setCurrentShape("triangle")}
            className={`px-4 py-2 rounded ${
              currentShape === "triangle" ? "bg-blue-600" : "bg-gray-600"
            }`}
          >
            Triangle
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentColor("red")}
            className="w-8 h-8 bg-red-500 rounded border-2 border-white"
          />
          <button
            onClick={() => setCurrentColor("blue")}
            className="w-8 h-8 bg-blue-500 rounded border-2 border-white"
          />
          <button
            onClick={() => setCurrentColor("green")}
            className="w-8 h-8 bg-green-500 rounded border-2 border-white"
          />
        </div>

        <button
          onClick={() => engineRef.current?.erase()}
          className="px-4 py-2 bg-yellow-600 rounded"
        >
          Undo
        </button>
        <button
          onClick={() => engineRef.current?.reset()}
          className="px-4 py-2 bg-red-600 rounded"
        >
          Clear All
        </button>
      </div>

      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full bg-white cursor-crosshair"
        />
      </div>
    </div>
  );
}