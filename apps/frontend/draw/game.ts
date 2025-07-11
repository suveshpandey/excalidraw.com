import { Color, Tool } from "@/components/Canvas";
import { getExistingShapes } from "./http";

type Shape = {
    type: "rect",
    x: number,
    y: number,
    width: number,
    height: number,
    border_radius: number,
    color: string
} | {
    type: "rhombus",
    x: number,
    y: number,
    width: number,
    height: number,
    border_radius: number,
    color: string
} | {
    type: "circle",
    centerX: number,
    centerY: number,
    radius: number,
    color: string
} | {
    type: "line",
    "startX": number,
    "startY": number,
    "endX": number,
    "endY": number,
    color: string
} | {
    type: "arrow",
    "startX": number,
    "startY": number,
    "endX": number,
    "endY": number,
    color: string
} | {
    type: "pencil",
    points: {x: number, y: number} [] // array of all points mouse moved through,
    color: string
} | {
    type: "text",
    x: number,
    y: number,
    value: string,
    color: string
}

interface Point {
    x: number,
    y: number
}

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    public existingShapes: Shape[];
    private roomId: string;
    private clicked: boolean;
    private startX: number;
    private startY: number;
    private points: Point[]
    private textInput: HTMLInputElement;
    private selectedTool: Tool;
    private selectedColor: Color;

    socket: WebSocket;

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket, textInput: HTMLInputElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        this.startX = 0;
        this.startY = 0;
        this.points = [];
        this.textInput = textInput;
        this.selectedTool = "rect";
        this.selectedColor = "white";

        this.init();
        this.initHandlers();
        this.initMouseHandlers();
    }

    destroy () {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);

        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);

        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    }

    setTool(tool: "rect" | "rhombus" | "circle" | "line" | "arrow" | "text" | "pencil") {
        this.selectedTool = tool;
    }
    setColor(color: "blue" | "red" | "green" | "gray" | "white") {
        this.selectedColor = color;
    }

    async init () {
        this.existingShapes = await getExistingShapes(this.roomId)
        this.clearCanvas();
    }

    initHandlers () {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
    
            if(message.type == "chat") {
                const parsedShape = JSON.parse(message.message);
                this.existingShapes.push(parsedShape.shape);
                this.clearCanvas();
            }
        }
    }

    clearCanvas () {
        console.log("clear canvas called")
        // Clear and redraw black background first
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(13, 27, 42)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.existingShapes.map((shape) => {
            this.ctx.strokeStyle = shape.color;
            this.ctx.lineWidth = 2.5;
            
            if(shape.type === "rect"){
                this.ctx.beginPath();
                this.ctx.roundRect(shape.x, shape.y, shape.width, shape.height, [10]);
                this.ctx.stroke();
            }
            else if(shape.type === "rhombus") {
                const centerX = shape.x + shape.width / 2;
                const centerY = shape.y + shape.height / 2;

                this.ctx.save();
                // 1. Move origin to center of the shape (or wherever you want to rotate around)
                this.ctx.translate(centerX, centerY);

                // 2. Rotate the canvas 45 degrees (in radians)
                this.ctx.rotate((45 * Math.PI) / 180);

                // 3. Draw the rounded rectangle centered at (0, 0)
                this.ctx.roundRect(-shape.height / 2, -shape.height / 2, shape.height, shape.height, [10]);
                this.ctx.stroke(); // Or fill()
                this.ctx.restore(); // Restore canvas to original state
            }
            
            else if (shape.type === "circle") {
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();
            }
            else if(shape.type === "line") {
                this.ctx.beginPath();
                this.ctx.moveTo(shape.startX, shape.startY);
                this.ctx.lineTo(shape.endX, shape.endY);
                this.ctx.stroke();
                this.ctx.closePath();
            }
            else if(shape.type === "arrow") {
                this.drawArrow(shape.startX, shape.startY, shape.endX, shape.endY);
            }
            else if(shape.type === "pencil") {
                this.drawSmoothPath(shape.points);
            }
            else if(shape.type === "text") {
                this.ctx.font = "18px Cursive";
                this.ctx.fillStyle = shape.color;
                this.ctx.fillText(shape.value, shape.x, shape.y+11);
            }
        })
    }

    mouseDownHandler = (e:any) => {
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;

        this.points = [{x: e.offsetX, y: e.offsetY}];

        if(this.selectedTool === "text") {
            const input = this.textInput;
            input.style.display = "block";
            input.style.position = "absolute";
            input.style.left = `${e.clientX}px`;
            input.style.top = `${e.clientY - 10}px`;
            
            input.value = "";
            setTimeout(() => {
                input.focus();
            }, 0);

            input.onkeydown = (event) => {
                if(event.key === "Enter") {
                    event.preventDefault();
                    const value = input.value;
                    input.style.display = "none";
                    input.style.fontFamily = "Cursive"

                    const shape: Shape = {
                        type: "text",
                        x: this.startX,
                        y: this.startY,
                        value: value,
                        color: this.selectedColor
                    };

                    this.existingShapes.push(shape);
                    this.clearCanvas();

                    this.socket.send(JSON.stringify({
                        type: "chat",
                        message: JSON.stringify({shape}),
                        roomId: this.roomId
                    }));
                }
            };
        }
    }

    mouseUpHandler = (e:any) => {
        if(!this.clicked) return;

        this.clicked = false;

        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;

        // Debounce check - only create shape if we have significant movement
        if (Math.abs(width) < 5 && Math.abs(height) < 5 && this.selectedTool !== "text") {
            this.clearCanvas();
            return;
        }

        //@ts-ignore
        const selectedTool = this.selectedTool;
        let shape: Shape | null = null;

        if (selectedTool === "rect") {
            shape = {
                type: "rect",
                x: this.startX,
                y: this.startY,
                width: width,
                height: height,
                border_radius: 10,
                color: this.selectedColor
            };
        }
        else if (selectedTool === "circle") {
            const radius = Math.max(width, height) / 2;
            shape = {
                type: "circle",
                radius: radius,
                centerX: this.startX + radius,
                centerY: this.startY + radius,
                color: this.selectedColor
            };
        }
        else if(selectedTool === "line") {
            shape = {
                type: "line",
                startX: this.startX,
                startY: this.startY,
                endX: e.clientX,
                endY: e.clientY,
                color: this.selectedColor
            };
        }
        else if(selectedTool === "arrow") {
            shape = {
                type: "arrow",
                startX: this.startX,
                startY: this.startY,
                endX: e.clientX,
                endY: e.clientY,
                color: this.selectedColor
            }
        }
        else if(selectedTool === "pencil") {
            shape = {
                type: "pencil",
                points: [...this.points],
                color: this.selectedColor
            }
        }
        else if(selectedTool === "rhombus") {
            shape = {
                type: "rhombus",
                x: this.startX,
                y: this.startY,
                width: width,
                height: height,
                border_radius: 10,
                color: this.selectedColor
            };
        }

        if(shape == null) return;

        this.existingShapes.push(shape);
        this.socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({
                shape
            }),
            roomId: this.roomId
        }))
    }

    mouseMoveHandler = (e:any) => {
        if(this.clicked){
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;
            
            const endX = e.clientX;
            const endY = e.clientY;

            this.clearCanvas();
            // this.ctx.strokeStyle = "rgba(255, 255, 255, 1)";
            this.ctx.strokeStyle = this.selectedColor;
        
            //@ts-ignore
            const selectedTool = this.selectedTool;
            if (selectedTool === "rect") {
                // this.ctx.strokeRect(this.startX, this.startY, width, height);
                
                this.ctx.beginPath();
                this.ctx.roundRect(this.startX, this.startY, width, height, [10]);
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
            else if (selectedTool === "circle") {
                const radius = Math.max(width, height) / 2;
                const centerX = this.startX + radius;
                const centerY = this.startY + radius;
                
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                this.ctx.closePath();
            }
            else if(selectedTool === "line") {
                this.ctx.beginPath();
                this.ctx.moveTo(this.startX, this.startY);
                this.ctx.lineTo(endX, endY);
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
            else if(selectedTool === "arrow") {
                this.drawArrow(this.startX, this.startY, endX, endY);
                this.ctx.lineWidth = 2;
            }
            else if(selectedTool === "pencil") {
                const point = {x: e.offsetX, y: e.offsetY};
                this.points.push(point);
                this.drawSmoothPath(this.points);
            }
            else if(selectedTool === "rhombus") {
                this.ctx.beginPath();
                this.ctx.lineWidth = 1.5;
                this.ctx.stroke();
                this.ctx.save(); // Save current canvas state
                
                const centerX = (this.startX + endX) / 2;
                const centerY = (this.startY + endY) / 2;
                // 1. Move origin to center of the shape (or wherever you want to rotate around)
                this.ctx.translate(centerX, centerY);

                // 2. Rotate the canvas 45 degrees (in radians)
                this.ctx.rotate((45 * Math.PI) / 180);

                // 3. Draw the rounded rectangle centered at (0, 0)
                this.ctx.roundRect(-height / 2, -height / 2, height, height, [10]);
                this.ctx.lineWidth = 2;
                this.ctx.stroke(); // Or fill()
                this.ctx.restore(); // Restore canvas to original state
            }
        }
    }

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);

        this.canvas.addEventListener("mouseup", this.mouseUpHandler);

        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    }

    drawArrow(fromx: number, fromy: number, tox: number, toy: number) {
        const dx = tox - fromx;
        const dy = toy - fromy;
        const headlen = 12; // length of head in pixels
        const angle = Math.atan2( dy, dx );
        this.ctx.beginPath();
        this.ctx.moveTo( fromx, fromy );
        this.ctx.lineTo( tox, toy );
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo( tox - headlen * Math.cos( angle - Math.PI / 6 ), toy - headlen * Math.sin( angle - Math.PI / 6 ) );
        this.ctx.lineTo( tox, toy );
        this.ctx.lineTo( tox - headlen * Math.cos( angle + Math.PI / 6 ), toy - headlen * Math.sin( angle + Math.PI / 6 ) );
        this.ctx.stroke();
    }

    removeLastShape(){
        if(this.existingShapes.length > 0) {
            this.existingShapes.pop(); //Removes ladt shape
            this.clearCanvas(); //Redraw canvas
        }
    }

    drawSmoothPath = (points: Point[]) => {
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length - 1; i++) {
            const midX = (points[i].x + points[i + 1].x) / 2;
            const midY = (points[i].y + points[i + 1].y) / 2;
            this.ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
            this.ctx.lineWidth = 2.5;
        }

        this.ctx.stroke();
    }
}