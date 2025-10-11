import { create } from 'zustand';

export type ShapeType = 'rectangle' | 'circle' | 'line';
export type FillColor = 'red' | 'blue' | 'green' | 'yellow' | 'none';
export type Tool = 'select' | 'pan' | 'draw';

export interface CanvasState {
  currentShape: ShapeType;
  currentColor: FillColor;
  currentTool: Tool;
  isDrawing: boolean;
  isPanning: boolean;
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  selectedShapeId: string | null;
}

export interface CanvasActions {
  setShape: (shape: ShapeType) => void;
  setColor: (color: FillColor) => void;
  setTool: (tool: Tool) => void;
  setDrawing: (drawing: boolean) => void;
  setPanning: (panning: boolean) => void;
  setViewport: (viewport: { x: number; y: number; zoom: number }) => void;
  updateViewport: (updates: Partial<{ x: number; y: number; zoom: number }>) => void;
  setSelectedShape: (shapeId: string | null) => void;
  reset: () => void;
}

const initialViewport = { x: 0, y: 0, zoom: 1 };

export const useCanvasStore = create<CanvasState & CanvasActions>((set, get) => ({
  // State
  currentShape: 'rectangle',
  currentColor: 'none',
  currentTool: 'draw',
  isDrawing: false,
  isPanning: false,
  viewport: initialViewport,
  selectedShapeId: null,

  // Actions
  setShape: (shape: ShapeType) => {
    set({ currentShape: shape, currentTool: 'draw' });
  },

  setColor: (color: FillColor) => {
    set({ currentColor: color });
  },

  setTool: (tool: Tool) => {
    set({ currentTool: tool });
  },

  setDrawing: (drawing: boolean) => {
    set({ isDrawing: drawing });
  },

  setPanning: (panning: boolean) => {
    set({ isPanning: panning });
  },

  setViewport: (viewport: { x: number; y: number; zoom: number }) => {
    set({ viewport });
  },

  updateViewport: (updates: Partial<{ x: number; y: number; zoom: number }>) => {
    set((state) => ({
      viewport: { ...state.viewport, ...updates },
    }));
  },

  setSelectedShape: (shapeId: string | null) => {
    set({ selectedShapeId: shapeId });
  },

  reset: () => {
    set({
      currentShape: 'rectangle',
      currentColor: 'none',
      currentTool: 'draw',
      isDrawing: false,
      isPanning: false,
      viewport: initialViewport,
      selectedShapeId: null,
    });
  },
}));
