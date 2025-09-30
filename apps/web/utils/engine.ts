type Shapes = "rectangle" | "circle" | "triangle";

type fillColor = "red" | "blue" | "green";

export class Engine {
    shape: Shapes;
    color: fillColor;

    constructor(shape: Shapes, color: fillColor) {
        this.shape = shape;
        this.color = color;
    }

    public draw(shape: Shapes): void {
        if (shape === "rectangle") {
            console.log("rect");     
        } else if (shape === "circle") {
            console.log("circ");
        } else if (shape === "triangle") {
            console.log("tri");
        }
    }

    public erase(): void {
        console.log("erase");
    }

    public reset(): void {
        console.log("reset whole canvas");
    }
}