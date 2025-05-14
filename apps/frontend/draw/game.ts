import { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./http";

type Shape = {
    type: "rect",
    x: number,
    y: number,
    width: number,
    height: number
} | {
    type: "circle",
    centerX: number,
    centerY: number,
    radius: number
} | {
    type: "line",
    "startX": number,
    "startY": number,
    "endX": number,
    "endY": number
} | {
    type: "arrow",
    "startX": number,
    "startY": number,
    "endX": number,
    "endY": number
} | {
    type: "text",
    x: number,
    y: number,
    value: string
}

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[];
    private roomId: string;
    private clicked: boolean;
    private startX: number;
    private startY: number;
    private textInput: HTMLInputElement;
    private selectedTool: Tool;

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
        this.textInput = textInput
        this.selectedTool = "rect";

        this.init();
        this.initHandlers();
        this.initMouseHandlers();
    }

    destroy () {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);

        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);

        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    }

    setTool(tool: "rect" | "circle" | "line" | "arrow" | "text") {
        this.selectedTool = tool;
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
        // Clear and redraw black background first
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(13, 27, 42)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.existingShapes.map((shape) => {
            if(shape.type === "rect"){
                this.ctx.strokeStyle = "rgba(255, 255, 255)";
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
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
            else if(shape.type === "text") {
                this.ctx.font = "20px Arial";
                this.ctx.fillStyle = "#94a3b8";
                this.ctx.fillText(shape.value, shape.x, shape.y);
            }
        })
    }

    mouseDownHandler = (e:any) => {
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;

        if(this.selectedTool === "text") {
            const input = this.textInput;
            input.style.display = "block";
            input.style.position = "fixed";
            input.style.left = `${e.clientX}px`;
            input.style.top = `${e.clientY}px`;
            input.value = "";
            input.focus();

            input.onkeydown = (event) => {
                if(event.key === "Enter") {
                    event.preventDefault();
                    const value = input.value;
                    input.style.display = "none";

                    const shape: Shape = {
                        type: "text",
                        x: this.startX,
                        y: this.startY,
                        value: value
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
        this.clicked = false;
            
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;

        //@ts-ignore
        const selectedTool = this.selectedTool;
        let shape: Shape | null = null;

        if (selectedTool === "rect") {
            shape = {
                type: "rect",
                x: this.startX,
                y: this.startY,
                width: width,
                height: height
            };
        }
        else if (selectedTool === "circle") {
            const radius = Math.max(width, height) / 2;
            shape = {
                type: "circle",
                radius: radius,
                centerX: this.startX + radius,
                centerY: this.startY + radius
            };
        }
        else if(selectedTool === "line") {
            shape = {
                type: "line",
                startX: this.startX,
                startY: this.startY,
                endX: e.clientX,
                endY: e.clientY
            };
        }
        else if(selectedTool === "arrow") {
            shape = {
                type: "arrow",
                startX: this.startX,
                startY: this.startY,
                endX: e.clientX,
                endY: e.clientY
            }
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
            this.ctx.strokeStyle = "rgba(255, 255, 255, 1)";
        
            //@ts-ignore
            const selectedTool = this.selectedTool;
            if (selectedTool === "rect") {
                this.ctx.strokeRect(this.startX, this.startY, width, height);
            }
            else if (selectedTool === "circle") {
                const radius = Math.max(width, height) / 2;
                const centerX = this.startX + radius;
                const centerY = this.startY + radius;
                
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();
            }
            else if(selectedTool == "line") {
                this.ctx.beginPath();
                this.ctx.moveTo(this.startX, this.startY);
                this.ctx.lineTo(endX, endY);
                this.ctx.stroke();
            }
            else if(selectedTool === "arrow") {
                this.drawArrow(this.startX, this.startY, endX, endY);
            }
        }
    }

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);

        this.canvas.addEventListener("mouseup", this.mouseUpHandler);

        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    }

    drawArrow(fromX: number, fromY: number, toX: number, toY: number) {
        const headLength = 10;
        const angle = Math.atan2(toY - fromY, toX - fromX);

        //Draw line
        this.ctx.beginPath();
        this.ctx.moveTo(fromX, fromY);
        this.ctx.lineTo(toX, toY);
        this.ctx.stroke();

        //Draw arrowhead
        this.ctx.beginPath();
        this.ctx.moveTo(toX, toY);
        this.ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
        this.ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
        this.ctx.lineTo(toX, toY);
        this.ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
        this.ctx.stroke();
        this.ctx.closePath();
    }
}