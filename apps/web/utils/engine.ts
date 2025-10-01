type Shapes = "rectangle" | "circle" | "triangle";
type FillColor = "red" | "blue" | "green";

interface Point {
  x: number;
  y: number;
}

interface DrawnShape {
  type: Shapes;
  color: FillColor;
  startPoint: Point;
  endPoint: Point;
}

export class Engine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private currentShape: Shapes;
  private currentColor: FillColor;
  private isDrawing: boolean = false;
  private startPoint: Point | null = null;
  private shapes: DrawnShape[] = [];
  private currentDragShape: DrawnShape | null = null;

  constructor(
    canvas: HTMLCanvasElement,
    shape: Shapes = "rectangle",
    color: FillColor = "red"
  ) {
    this.canvas = canvas;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not get 2D context from canvas");
    }
    this.ctx = context;
    this.currentShape = shape;
    this.currentColor = color;

    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
    this.canvas.addEventListener("mouseleave", this.handleMouseUp.bind(this));
  }

  private getMousePos(event: MouseEvent): Point {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  private handleMouseDown(event: MouseEvent): void {
    this.isDrawing = true;
    this.startPoint = this.getMousePos(event);
  }

  private handleMouseMove(event: MouseEvent): void {
    if (!this.isDrawing || !this.startPoint) return;

    const currentPoint = this.getMousePos(event);
    this.currentDragShape = {
      type: this.currentShape,
      color: this.currentColor,
      startPoint: this.startPoint,
      endPoint: currentPoint,
    };

    this.redraw();
  }

  private handleMouseUp(event: MouseEvent): void {
    if (!this.isDrawing || !this.startPoint) return;

    const endPoint = this.getMousePos(event);
    const shape: DrawnShape = {
      type: this.currentShape,
      color: this.currentColor,
      startPoint: this.startPoint,
      endPoint: endPoint,
    };

    this.shapes.push(shape);
    this.currentDragShape = null;
    this.isDrawing = false;
    this.startPoint = null;

    this.redraw();
  }

  private redraw(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.shapes.forEach((shape) => {
      this.drawShape(shape);
    });

    if (this.currentDragShape) {
      this.drawShape(this.currentDragShape, true);
    }
  }

  private drawShape(shape: DrawnShape, isPreview: boolean = false): void {
    const { type, color, startPoint, endPoint } = shape;

    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;

    if (isPreview) {
      this.ctx.globalAlpha = 0.5;
    }

    if (type === "rectangle") {
      this.drawRectangle(startPoint, endPoint);
    } else if (type === "circle") {
      this.drawCircle(startPoint, endPoint);
    } else if (type === "triangle") {
      this.drawTriangle(startPoint, endPoint);
    }

    if (isPreview) {
      this.ctx.globalAlpha = 1.0;
    }
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

  private drawTriangle(start: Point, end: Point): void {
    const width = end.x - start.x;
    const height = end.y - start.y;

    this.ctx.beginPath();
    this.ctx.moveTo(start.x + width / 2, start.y);
    this.ctx.lineTo(start.x + width, start.y + height);
    this.ctx.lineTo(start.x, start.y + height);
    this.ctx.closePath();
    this.ctx.fill();
  }

  public setShape(shape: Shapes): void {
    this.currentShape = shape;
  }

  public setColor(color: FillColor): void {
    this.currentColor = color;
  }

  public draw(shape: Shapes): void {
    this.setShape(shape);
  }

  public erase(): void {
    if (this.shapes.length > 0) {
      this.shapes.pop();
      this.redraw();
    }
  }

  public reset(): void {
    this.shapes = [];
    this.currentDragShape = null;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public destroy(): void {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.removeEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.removeEventListener("mouseup", this.handleMouseUp.bind(this));
    this.canvas.removeEventListener("mouseleave", this.handleMouseUp.bind(this));
  }
}