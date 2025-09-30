"use client";

import { use, useEffect, useRef } from "react";
import TopBar from "../../../components/TopBar";

interface CanvasPageProps {
  params: Promise<{ canvasId: string }>;
}

export default function CanvasPage({ params }: CanvasPageProps) {
  const { canvasId } = use(params);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.fillStyle = "#000";
    ctx.fillRect(10, 10, 100, 100);
  }, []);

  return (
    <div className="w-full h-screen bg-[#131212] flex flex-col">
      <TopBar />
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full bg-white"
        />
      </div>
    </div>
  );
}