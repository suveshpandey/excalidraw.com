"use client"

import { useRef, useState, useEffect } from "react";
import React, { KeyboardEvent } from 'react';
import { Square, Circle, Minus, ArrowUpRight, Undo2, Trash2Icon, PencilIcon, LetterText, Diamond, } from 'lucide-react';
import { Game } from "@/draw/game";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { getExistingShapes } from "@/draw/http";

export type Tool = "rect" | "rhombus" | "circle" | "line" | "arrow" | "text" | "pencil";
export type Color = "white" | "red" | "blue" | "green" | "gray";

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
    const [selectedColor, setSelectedColor] = useState<Color>("white");

    useEffect(() => {
        game?.setTool(selectedTool);
        game?.setColor(selectedColor);
    }, [selectedTool, selectedColor, game]);

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
        <div className={`h-screen w-screen overflow-hidden bg-slate-900`}>
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
                className={`absolute outline-none`}
                style={{ 
                    display: "none", 
                    zIndex: 1000,
                    color: selectedColor,
                    fontSize: "18px",
                    fontFamily: "Cursive",
                    minWidth: "200px"
                }} 
            />
            
            <Topbar 
                selectedTool={selectedTool} 
                setSelectedTool={setSelectedTool} 
                game={game}
                roomId={roomId}
            />
            <ColorPallete 
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                game={game}
                roomId={roomId}
            />
        </div>
    )
}

function Topbar ({
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

    const handleDeleteLastShape = async () => {
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
    const handleDeleteAllShapes = async () => {
        try {
            const response = await axios.delete(`${HTTP_BACKEND}/delete-all-chat/${roomId}`, {
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
    const selectToolByKeyPress = (e: globalThis.KeyboardEvent) => {
        if(e.key == '1') setSelectedTool("rect");
        else if(e.key == '2') setSelectedTool("rhombus");
        else if(e.key == '3') setSelectedTool("circle");   
        else if(e.key == '4') setSelectedTool("arrow");   
        else if(e.key == '5') setSelectedTool("line");   
        else if(e.key == '6') setSelectedTool("pencil");   
        else if(e.key == '7') setSelectedTool("text"); 
    }
    useEffect(() => {
        window.addEventListener("keydown", selectToolByKeyPress);
        return () => window.removeEventListener("keydown", selectToolByKeyPress);
    }, []);

    return (
        <div className="w-full flex justify-center fixed top-2 px-2">
            <div className="flex items-center gap-2 bg-slate-800/90 backdrop-blur-sm rounded-md py-1.5 px-4 border border-slate-700 shadow-lg">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSelectedTool("rect")} 
                        className={`p-2 relative rounded-lg transition-all cursor-pointer ${selectedTool === "rect" ? "bg-slate-600/70 text-green-300 shadow-md" : "text-slate-300 hover:bg-slate-600"}`}
                        aria-label="Rectangle tool"
                    >    
                        <Square size={20} strokeWidth={1.75} />   
                        <p className="text-[10px] opacity-60 absolute bottom-0.5 right-0.5">1</p>
                    </button>
                    <button 
                        onClick={() => setSelectedTool("rhombus")} 
                        className={`p-2 relative rounded-lg transition-all cursor-pointer ${selectedTool === "rhombus" ? "bg-slate-600/70 text-green-300 shadow-md" : "text-slate-300 hover:bg-slate-600"}`}
                        aria-label="Rhombus tool"
                    >
                        <Diamond size={20} strokeWidth={1.75} />
                        <p className="text-[10px] opacity-60 absolute bottom-0.5 right-0.5">2</p>
                    </button>
                    <button 
                        onClick={() => setSelectedTool("circle")} 
                        className={`p-2 relative rounded-lg transition-all cursor-pointer ${selectedTool === "circle" ? "bg-slate-600/70 text-green-300 shadow-md" : "text-slate-300 hover:bg-slate-600"}`}
                        aria-label="Circle tool"
                    >
                        <Circle size={20} strokeWidth={1.75} />
                        <p className="text-[10px] opacity-60 absolute bottom-0.5 right-0.5">3</p>
                    </button>
                    <button 
                        onClick={() => setSelectedTool("arrow")} 
                        className={`p-2 relative rounded-lg transition-all cursor-pointer ${selectedTool === "arrow" ? "bg-slate-600/70 text-green-300 shadow-md" : "text-slate-300 hover:bg-slate-600"}`}
                        aria-label="Arrow tool"
                    >
                        <ArrowUpRight size={20} strokeWidth={1.75} />
                        <p className="text-[10px] opacity-60 absolute bottom-0.5 right-0.5">4</p>
                    </button>
                    <button 
                        onClick={() => setSelectedTool("line")} 
                        className={`p-2 relative rounded-lg transition-all cursor-pointer ${selectedTool === "line" ? "bg-slate-600/70 text-green-300 shadow-md" : "text-slate-300 hover:bg-slate-600"}`}
                        aria-label="Line tool"
                    >
                        <Minus size={20} strokeWidth={1.75} />
                        <p className="text-[10px] opacity-60 absolute bottom-0.5 right-0.5">5</p>
                    </button>
                    <button 
                        onClick={() => setSelectedTool("pencil")} 
                        className={`p-2 relative rounded-lg transition-all cursor-pointer ${selectedTool === "pencil" ? "bg-slate-600/70 text-green-300 shadow-md" : "text-slate-300 hover:bg-slate-600"}`}
                        aria-label="Pencil tool"
                    >
                        <PencilIcon size={20} strokeWidth={1.75} />
                        <p className="text-[10px] opacity-60 absolute bottom-0.5 right-0.5">6</p>
                    </button>
                    <button 
                        onClick={() => setSelectedTool("text")} 
                        className={`p-2 relative rounded-lg transition-all cursor-pointer ${selectedTool === "text" ? "bg-slate-600/70 text-green-300 shadow-md" : "text-slate-300 hover:bg-slate-600"}`}
                        aria-label="Text tool"
                    >
                        <LetterText size={20} strokeWidth={1.75} />
                        <p className="text-[10px] opacity-60 absolute bottom-0.5 right-0.5">7</p>
                    </button>
                </div>
                
                <div className="h-8 w-px bg-slate-600 mx-1"></div>
                
                <button 
                    onClick={handleDeleteLastShape}
                    className="p-2 cursor-pointer text-slate-300 hover:text-white hover:bg-slate-600 active:bg-slate-500 rounded-lg transition-all"
                    aria-label="Undo last action"
                >
                    <Undo2 size={20} strokeWidth={1.75} />
                </button>
                <button 
                    onClick={handleDeleteAllShapes}
                    className="p-2 cursor-pointer text-slate-300 hover:text-white hover:bg-slate-600 active:bg-slate-500 rounded-lg transition-all"
                    aria-label="Undo last action"
                >
                    <Trash2Icon size={20} strokeWidth={1.75} />
                </button>
            </div>
        </div>
    );
}

function ColorPallete ({
    selectedColor, 
    setSelectedColor, 
    game, 
    roomId
}: {
    selectedColor: Color,
    setSelectedColor: (s: Color) => void,
    game?: Game,
    roomId: string
}) {
    useEffect(() => {
        console.log(`select color clicked - ${selectedColor}`)
    }, [selectedColor])

    return (
        <div className="fixed top-2 left-2 flex items-center gap-3 bg-slate-800/90 backdrop-blur-sm rounded-md py-3 px-4 border border-slate-700 shadow-lg">
            <button
                onClick={() => setSelectedColor("blue")} 
                className={`h-6 w-6 bg-blue-500 opacity-60 rounded-sm transition-all duration-200 cursor-pointer ${selectedColor === 'blue' ? "ring-3 ring-blue-500 opacity-100" : ""}`}
                aria-label="Blue"
            >    
            </button>
            <button
                onClick={() => setSelectedColor("red")} 
                className={`h-6 w-6 bg-red-500 opacity-60 rounded-sm transition-all duration-200 cursor-pointer ${selectedColor === 'red' ? "ring-3 ring-red-500 opacity-100" : ""}`}
                aria-label="Red"
            >    
            </button>
            <button
                onClick={() => setSelectedColor("green")} 
                className={`h-6 w-6 bg-green-500 opacity-60 rounded-sm transition-all duration-200 cursor-pointer ${selectedColor === 'green' ? "ring-3 ring-green-500 opacity-100" : ""}`}
                aria-label="Green"
            >    
            </button>
            <button
                onClick={() => setSelectedColor("gray")} 
                className={`h-6 w-6 bg-gray-500 opacity-60 rounded-sm transition-all duration-200 cursor-pointer ${selectedColor === 'gray' ? "ring-3 ring-gray-500 opacity-100" : ""}`}
                aria-label="Gray"
            >    
            </button>
            <button
                onClick={() => setSelectedColor("white")} 
                className={`h-6 w-6 bg-white opacity-80 rounded-sm transition-all duration-200 cursor-pointer ${selectedColor === 'white' ? "ring-3 ring-white opacity-100" : ""}`}
                aria-label="White"
            >    
            </button>
        </div>       
    )
}