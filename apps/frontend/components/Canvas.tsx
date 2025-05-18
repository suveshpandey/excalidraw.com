"use client"

import { useRef, useState } from "react";
import { useEffect } from "react";
import { Square, Circle, Minus, ArrowUpRight, Type, Undo2 } from 'lucide-react';
import { Game } from "@/draw/game";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { getExistingShapes } from "@/draw/http";

export type Tool = "rect" | "circle" | "line" | "arrow" | "text";

export default function Canvas({ 
    roomId,
    socket
}: { 
    roomId: string,
    socket: WebSocket
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("rect");

    useEffect(() => {
        game?.setTool(selectedTool);
    }, [selectedTool, game]);

    useEffect(() => {
        if(canvasRef.current && inputRef.current) {
            const g = new Game(canvasRef.current, roomId, socket, inputRef.current);
            setGame(g);

            return () => {
                g.destroy();
            }
        }
    }, [canvasRef, roomId, socket]);

    return (
        <div className="h-screen w-screen overflow-hidden bg-slate-900">
            <canvas 
                ref={canvasRef} 
                className="bg-slate-900"
                width={window.innerWidth} 
                height={window.innerHeight}
            />
            
            <input 
                type="text" 
                ref={inputRef}  
                placeholder="Type here..."
                className="absolute text-slate-100 px-3 py-2 rounded-lg shadow-lg border-b border-slate-600 outline-none " 
                style={{ 
                    display: "none", 
                    zIndex: 1000,
                    fontSize: "16px",
                    minWidth: "200px"
                }} 
            />
            
            <Topbar 
                selectedTool={selectedTool} 
                setSelectedTool={setSelectedTool} 
                game={game}
                roomId={roomId}
            />
        </div>
    )
}

function Topbar({
    selectedTool, 
    setSelectedTool, 
    game, 
    roomId
}: {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void,
    game?: Game,
    roomId: string
}) {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const t = localStorage.getItem("token");
        setToken(t);
    }, []);

    const handleDeleteShape = async () => {
        try {
            const response = await axios.delete(`${HTTP_BACKEND}/delete-last-chat/${roomId}`, {
                headers: {
                    authorization: token
                },
            });
            if(response.status === 200 && game) {
                game.existingShapes = await getExistingShapes(roomId);
                game.clearCanvas();
            }
        } catch (error) {
            console.error("Server error:", error);
        }
    };

    return (
        <div className="w-full flex justify-center fixed top-2 px-2">
            <div className="flex items-center gap-2 bg-slate-800/90 backdrop-blur-sm rounded-md py-1.5 px-4 border border-slate-700 shadow-lg">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setSelectedTool("rect")} 
                        className={`p-2 rounded-lg transition-all ${selectedTool === "rect" ? "bg-slate-600/70 text-green-300 shadow-md" : "text-slate-300 hover:bg-slate-600"}`}
                        aria-label="Rectangle tool"
                    >
                        <Square size={20} strokeWidth={1.75} />
                    </button>
                    <button 
                        onClick={() => setSelectedTool("circle")} 
                        className={`p-2 rounded-lg transition-all ${selectedTool === "circle" ? "bg-slate-600/70 text-green-300 shadow-md" : "text-slate-300 hover:bg-slate-600"}`}
                        aria-label="Circle tool"
                    >
                        <Circle size={20} strokeWidth={1.75} />
                    </button>
                    <button 
                        onClick={() => setSelectedTool("arrow")} 
                        className={`p-2 rounded-lg transition-all ${selectedTool === "arrow" ? "bg-slate-600/70 text-green-300 shadow-md" : "text-slate-300 hover:bg-slate-600"}`}
                        aria-label="Arrow tool"
                    >
                        <ArrowUpRight size={20} strokeWidth={1.75} />
                    </button>
                    <button 
                        onClick={() => setSelectedTool("line")} 
                        className={`p-2 rounded-lg transition-all ${selectedTool === "line" ? "bg-slate-600/70 text-green-300 shadow-md" : "text-slate-300 hover:bg-slate-600"}`}
                        aria-label="Line tool"
                    >
                        <Minus size={20} strokeWidth={1.75} />
                    </button>
                    <button 
                        onClick={() => setSelectedTool("text")} 
                        className={`p-2 rounded-lg transition-all ${selectedTool === "text" ? "bg-slate-600/70 text-green-300 shadow-md" : "text-slate-300 hover:bg-slate-600"}`}
                        aria-label="Text tool"
                    >
                        <Type size={20} strokeWidth={1.75} />
                    </button>
                </div>
                
                <div className="h-8 w-px bg-slate-600 mx-1"></div>
                
                <button 
                    onClick={handleDeleteShape}
                    className="p-2 text-slate-300 hover:text-white hover:bg-slate-600 active:bg-slate-500 rounded-lg transition-all"
                    aria-label="Undo last action"
                >
                    <Undo2 size={20} strokeWidth={1.75} />
                </button>
            </div>
        </div>
    );
}