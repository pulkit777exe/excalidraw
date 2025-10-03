type Shapes = "rectangle" | "circle" | "line";
type FillColor = "red" | "blue" | "green" | "yellow" | "none";
type Tool = "select" | "pan" | "draw";

interface Point {
  x: number;
  y: number;
}

interface DrawnShape {
  id: string;
  type: Shapes;
  color: FillColor;
  startPoint: Point;
  endPoint: Point;
  userId: string;
  timestamp: number;
}

interface EngineState {
  shapes: DrawnShape[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
}

interface WebSocketMessage {
  type: "shape_added" | "shape_removed" | "shape_updated" | "state_sync" | "cursor_move";
  data: any;
  userId: string;
  roomId: string;
}

export class CollaborativeEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private currentShape: Shapes;
  private currentColor: FillColor;
  private currentTool: Tool = "draw";
  private isDrawing: boolean = false;
  private isPanning: boolean = false;
  private startPoint: Point | null = null;
  private shapes: Map<string, DrawnShape> = new Map();
  private currentDragShape: DrawnShape | null = null;
  private selectedShapeId: string | null = null;
  
  private viewport = { x: 0, y: 0, zoom: 1 };
  private lastPanPoint: Point | null = null;
  
  private ws: WebSocket | null = null;
  private userId: string;
  private roomId: string;
  private remoteCursors: Map<string, Point> = new Map();

  constructor(
    canvas: HTMLCanvasElement,
    userId: string,
    roomId: string,
    wsUrl: string,
    shape: Shapes = "rectangle",
    color: FillColor = "none"
  ) {
    this.canvas = canvas;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not get 2D context from canvas");
    }
    this.ctx = context;
    this.currentShape = shape;
    this.currentColor = color;
    this.userId = userId;
    this.roomId = roomId;

    this.initializeEventListeners();
    this.connectWebSocket(wsUrl);
  }

  private connectWebSocket(wsUrl: string): void {
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onopen = () => {
      console.log("WebSocket connected");
      this.ws?.send(JSON.stringify({
        type: "join_room",
        roomId: this.roomId,
        userId: this.userId
      }));
    };

    this.ws.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      this.handleWebSocketMessage(message);
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.ws.onclose = () => {
      console.log("WebSocket disconnected");
      // try reconnecting after 3 seconds
      setTimeout(() => this.connectWebSocket(wsUrl), 3000);
    };
  }

  private handleWebSocketMessage(message: WebSocketMessage): void {
    if (message.userId === this.userId) return; // Ignore own messages

    switch (message.type) {
      case "shape_added":
        this.shapes.set(message.data.id, message.data);
        this.redraw();
        break;
      case "shape_removed":
        this.shapes.delete(message.data.id);
        this.redraw();
        break;
      case "shape_updated":
        this.shapes.set(message.data.id, message.data);
        this.redraw();
        break;
      case "state_sync":
        this.shapes.clear();
        message.data.shapes.forEach((shape: DrawnShape) => {
          this.shapes.set(shape.id, shape);
        });
        this.viewport = message.data.viewport;
        this.redraw();
        break;
      case "cursor_move":
        this.remoteCursors.set(message.userId, message.data);
        this.redraw();
        break;
    }
  }

  private broadcastMessage(type: string, data: any): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    this.ws.send(JSON.stringify({
      type,
      data,
      userId: this.userId,
      roomId: this.roomId
    }));
  }

  private initializeEventListeners(): void {
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
    this.canvas.addEventListener("mouseleave", this.handleMouseUp.bind(this));
    this.canvas.addEventListener("wheel", this.handleWheel.bind(this));
  }

  private getMousePos(event: MouseEvent): Point {
    const rect = this.canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - this.viewport.x) / this.viewport.zoom;
    const y = (event.clientY - rect.top - this.viewport.y) / this.viewport.zoom;
    return { x, y };
  }

  private handleMouseDown(event: MouseEvent): void {
    const point = this.getMousePos(event);

    if (this.currentTool === "pan" || event.button === 1) {
      this.isPanning = true;
      this.lastPanPoint = { x: event.clientX, y: event.clientY };
      this.canvas.style.cursor = "grabbing";
      return;
    }

    if (this.currentTool === "select") {
      this.selectedShapeId = this.findShapeAtPoint(point);
      this.redraw();
      return;
    }

    if (this.currentTool === "draw") {
      this.isDrawing = true;
      this.startPoint = point;
    }
  }

  private handleMouseMove(event: MouseEvent): void {
    const point = this.getMousePos(event);

    // send cursor position
    this.broadcastMessage("cursor_move", point);

    if (this.isPanning && this.lastPanPoint) {
      const dx = event.clientX - this.lastPanPoint.x;
      const dy = event.clientY - this.lastPanPoint.y;
      this.viewport.x += dx;
      this.viewport.y += dy;
      this.lastPanPoint = { x: event.clientX, y: event.clientY };
      this.redraw();
      return;
    }

    if (!this.isDrawing || !this.startPoint) return;

    this.currentDragShape = {
      id: `temp-${Date.now()}`,
      type: this.currentShape,
      color: this.currentColor,
      startPoint: this.startPoint,
      endPoint: point,
      userId: this.userId,
      timestamp: Date.now()
    };

    this.redraw();
  }

  private handleMouseUp(event: MouseEvent): void {
    if (this.isPanning) {
      this.isPanning = false;
      this.lastPanPoint = null;
      this.canvas.style.cursor = "default";
      return;
    }

    if (!this.isDrawing || !this.startPoint) return;

    const endPoint = this.getMousePos(event);
    const shape: DrawnShape = {
      id: `${this.userId}-${Date.now()}`,
      type: this.currentShape,
      color: this.currentColor,
      startPoint: this.startPoint,
      endPoint: endPoint,
      userId: this.userId,
      timestamp: Date.now()
    };

    this.shapes.set(shape.id, shape);
    this.broadcastMessage("shape_added", shape);
    
    this.currentDragShape = null;
    this.isDrawing = false;
    this.startPoint = null;

    this.redraw();
  }

  private handleWheel(event: WheelEvent): void {
    event.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(5, this.viewport.zoom * zoomFactor));

    // zoom at cursor
    this.viewport.x = mouseX - (mouseX - this.viewport.x) * (newZoom / this.viewport.zoom);
    this.viewport.y = mouseY - (mouseY - this.viewport.y) * (newZoom / this.viewport.zoom);
    this.viewport.zoom = newZoom;

    this.redraw();
  }

  private findShapeAtPoint(point: Point): string | null {
    const shapesArray = Array.from(this.shapes.values()).reverse();
    for (const shape of shapesArray) {
      if (this.isPointInShape(point, shape)) {
        return shape.id;
      }
    }
    return null;
  }

  private isPointInShape(point: Point, shape: DrawnShape): boolean {
    const { startPoint, endPoint, type } = shape;
    
    if (type === "rectangle") {
      const minX = Math.min(startPoint.x, endPoint.x);
      const maxX = Math.max(startPoint.x, endPoint.x);
      const minY = Math.min(startPoint.y, endPoint.y);
      const maxY = Math.max(startPoint.y, endPoint.y);
      return point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY;
    }
    
    return false;
  }

  private redraw(): void {
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // viewport transformation
    this.ctx.translate(this.viewport.x, this.viewport.y);
    this.ctx.scale(this.viewport.zoom, this.viewport.zoom);

    //  grid
    this.drawGrid();

    // all shapes
    this.shapes.forEach((shape) => {
      this.drawShape(shape, shape.id === this.selectedShapeId);
    });

    // preview shape
    if (this.currentDragShape) {
      this.drawShape(this.currentDragShape, false, true);
    }

    this.ctx.restore();

    // draw remote cursors (not affected by zoom/pan)
    this.drawRemoteCursors();
  }

  private drawGrid(): void {
    const gridSize = 50;
    this.ctx.strokeStyle = "#e0e0e0";
    this.ctx.lineWidth = 0.5 / this.viewport.zoom;

    const startX = Math.floor(-this.viewport.x / this.viewport.zoom / gridSize) * gridSize;
    const startY = Math.floor(-this.viewport.y / this.viewport.zoom / gridSize) * gridSize;
    const endX = startX + (this.canvas.width / this.viewport.zoom) + gridSize;
    const endY = startY + (this.canvas.height / this.viewport.zoom) + gridSize;

    for (let x = startX; x < endX; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, startY);
      this.ctx.lineTo(x, endY);
      this.ctx.stroke();
    }

    for (let y = startY; y < endY; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(startX, y);
      this.ctx.lineTo(endX, y);
      this.ctx.stroke();
    }
  }

  private drawShape(shape: DrawnShape, isSelected: boolean = false, isPreview: boolean = false): void {
    const { type, color, startPoint, endPoint } = shape;

    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2 / this.viewport.zoom;

    if (isPreview) {
      this.ctx.globalAlpha = 0.5;
    }

    switch (type) {
      case "rectangle":
        this.drawRectangle(startPoint, endPoint);
        break;
      case "circle":
        this.drawCircle(startPoint, endPoint);
        break;
      case "line":
        this.drawLine(startPoint, endPoint);
        break;
    }

    if (isSelected) {
      this.drawSelectionBox(startPoint, endPoint);
    }

    this.ctx.globalAlpha = 1.0;
  }

  private drawRectangle(start: Point, end: Point): void {
    const width = end.x - start.x;
    const height = end.y - start.y;
    this.ctx.fillRect(start.x, start.y, width, height);
  }

  private drawCircle(start: Point, end: Point): void {
    const radius = Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    );
    this.ctx.beginPath();
    this.ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  private drawLine(start: Point, end: Point): void {
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.stroke();
  }

  private drawSelectionBox(start: Point, end: Point): void {
    this.ctx.strokeStyle = "#0066ff";
    this.ctx.lineWidth = 2 / this.viewport.zoom;
    this.ctx.setLineDash([5 / this.viewport.zoom, 5 / this.viewport.zoom]);
    
    const width = end.x - start.x;
    const height = end.y - start.y;
    this.ctx.strokeRect(start.x - 5, start.y - 5, width + 10, height + 10);
    
    this.ctx.setLineDash([]);
  }

  private drawRemoteCursors(): void {
    this.remoteCursors.forEach((pos, userId) => {
      const screenX = pos.x * this.viewport.zoom + this.viewport.x;
      const screenY = pos.y * this.viewport.zoom + this.viewport.y;
      
      this.ctx.fillStyle = "#ff0000";
      this.ctx.beginPath();
      this.ctx.arc(screenX, screenY, 5, 0, 2 * Math.PI);
      this.ctx.fill();
      
      this.ctx.fillStyle = "#000000";
      this.ctx.font = "12px Arial";
      this.ctx.fillText(userId.substring(0, 8), screenX + 10, screenY);
    });
  }

  public setShape(shape: Shapes): void {
    this.currentShape = shape;
    this.currentTool = "draw";
  }

  public setColor(color: FillColor): void {
    this.currentColor = color;
  }

  public setTool(tool: Tool): void {
    this.currentTool = tool;
    this.canvas.style.cursor = tool === "pan" ? "grab" : "default";
  }

  public deleteSelected(): void {
    if (this.selectedShapeId) {
      this.shapes.delete(this.selectedShapeId);
      this.broadcastMessage("shape_removed", { id: this.selectedShapeId });
      this.selectedShapeId = null;
      this.redraw();
    }
  }

  public reset(): void {
    this.shapes.clear();
    this.broadcastMessage("state_sync", { shapes: [], viewport: this.viewport });
    this.redraw();
  }

  public getState(): EngineState {
    return {
      shapes: Array.from(this.shapes.values()),
      viewport: { ...this.viewport }
    };
  }

  public destroy(): void {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.removeEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.removeEventListener("mouseup", this.handleMouseUp.bind(this));
    this.canvas.removeEventListener("mouseleave", this.handleMouseUp.bind(this));
    this.canvas.removeEventListener("wheel", this.handleWheel.bind(this));
    this.ws?.close();
  }
}