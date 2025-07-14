"use client"

import { useRef, useState, useEffect } from "react";
import React, { KeyboardEvent } from 'react';
import { Square, Circle, Minus, ArrowUpRight, Undo2, Trash2Icon, PencilIcon, LetterText, Diamond, PenTool, Monitor} from 'lucide-react';
import { Game } from "@/draw/game";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { getExistingShapes } from "@/draw/http";

export type Tool = "rect" | "rhombus" | "circle" | "line" | "arrow" | "text" | "pencil";
export type Color = "white" | "red" | "blue" | "green" | "gray";
export type Background = "#fefae0" | "#edf2fb" | "#02111b" | "#0F172A" | "#000c14";

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
    const [selectedBg, setSelectedBg] = useState<Background>("#000c14");
    const [isDark, setIsDark] = useState<boolean>(false);

    useEffect(() => {
        game?.setTool(selectedTool);
        game?.setColor(selectedColor);
        game?.setBg(selectedBg);
        game?.clearCanvas();

        if(selectedBg == "#fefae0" || selectedBg == "#edf2fb") setIsDark(false);
        else setIsDark(true);

    }, [selectedTool, selectedColor, selectedBg, game]);

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
        <div className={`h-screen w-screen overflow-hidden cursor-crosshair`}>
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
                className={`absolute outline-none tracking-wider`}
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
                isDark={isDark}
            />
            <div className={`fixed right-2 bottom-2 flex flex-col ${isDark ? "bg-slate-800" : "bg-gray-100/9"} gap-y-2 p-2 rounded-md shadow-lg `}>
                <ColorPallete 
                    selectedColor={selectedColor}
                    setSelectedColor={setSelectedColor}
                    game={game}
                    roomId={roomId}
                    isDark={isDark}
                />
            <BackgroundColorPallete 
                selectedBg={selectedBg}
                setSelectedBg={setSelectedBg}
                game={game}
                roomId={roomId}
                isDark={isDark}
            />
            </div>
        </div>
    )
}

function Topbar ({
    selectedTool, 
    setSelectedTool, 
    game, 
    roomId,
    isDark
}: {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void,
    game?: Game,
    roomId: string,
    isDark: boolean
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
            <div className={`flex items-center gap-2 ${isDark ? "bg-slate-800/90 text-gray-300 border border-gray-500" : "bg-gray-100/90 text-slate-500"} backdrop-blur-sm rounded-md py-1.5 px-4 shadow-lg`}>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSelectedTool("rect")} 
                        className={`p-2 relative rounded-lg transition-all cursor-pointer ${isDark ? "hover:bg-slate-600" : "hover:bg-slate-300"} ${selectedTool === "rect" && (isDark ? "bg-slate-600" : "bg-slate-300")}`}
                        aria-label="Rectangle tool"
                    >    
                        <Square size={20} strokeWidth={1.75} />   
                        <p className="text-[10px] opacity-60 absolute bottom-0.5 right-0.5">1</p>
                    </button>
                    <button 
                        onClick={() => setSelectedTool("rhombus")} 
                        className={`p-2 relative rounded-lg transition-all cursor-pointer ${isDark ? "hover:bg-slate-600" : "hover:bg-slate-300"} ${selectedTool === "rhombus" && (isDark ? "bg-slate-600" : "bg-slate-300")}`}
                        aria-label="Rhombus tool"
                    >
                        <Diamond size={20} strokeWidth={1.75} />
                        <p className="text-[10px] opacity-60 absolute bottom-0.5 right-0.5">2</p>
                    </button>
                    <button 
                        onClick={() => setSelectedTool("circle")} 
                        className={`p-2 relative rounded-lg transition-all cursor-pointer ${isDark ? "hover:bg-slate-600" : "hover:bg-slate-300"} ${selectedTool === "circle" && (isDark ? "bg-slate-600" : "bg-slate-300")}`}
                        aria-label="Circle tool"
                    >
                        <Circle size={20} strokeWidth={1.75} />
                        <p className="text-[10px] opacity-60 absolute bottom-0.5 right-0.5">3</p>
                    </button>
                    <button 
                        onClick={() => setSelectedTool("arrow")} 
                        className={`p-2 relative rounded-lg transition-all cursor-pointer ${isDark ? "hover:bg-slate-600" : "hover:bg-slate-300"} ${selectedTool === "arrow" && (isDark ? "bg-slate-600" : "bg-slate-300")}`}
                        aria-label="Arrow tool"
                    >
                        <ArrowUpRight size={20} strokeWidth={1.75} />
                        <p className="text-[10px] opacity-60 absolute bottom-0.5 right-0.5">4</p>
                    </button>
                    <button 
                        onClick={() => setSelectedTool("line")} 
                        className={`p-2 relative rounded-lg transition-all cursor-pointer ${isDark ? "hover:bg-slate-600" : "hover:bg-slate-300"} ${selectedTool === "line" && (isDark ? "bg-slate-600" : "bg-slate-300")}`}
                        aria-label="Line tool"
                    >
                        <Minus size={20} strokeWidth={1.75} />
                        <p className="text-[10px] opacity-60 absolute bottom-0.5 right-0.5">5</p>
                    </button>
                    <button 
                        onClick={() => setSelectedTool("pencil")} 
                        className={`p-2 relative rounded-lg transition-all cursor-pointer ${isDark ? "hover:bg-slate-600" : "hover:bg-slate-300"} ${selectedTool === "pencil" && (isDark ? "bg-slate-600" : "bg-slate-300")}`}
                        aria-label="Pencil tool"
                    >
                        <PencilIcon size={20} strokeWidth={1.75} />
                        <p className="text-[10px] opacity-60 absolute bottom-0.5 right-0.5">6</p>
                    </button>
                    <button 
                        onClick={() => setSelectedTool("text")} 
                        className={`p-2 relative rounded-lg transition-all cursor-pointer ${isDark ? "hover:bg-slate-600" : "hover:bg-slate-300"} ${selectedTool === "text" && (isDark ? "bg-slate-600" : "bg-slate-300")}`}
                        aria-label="Text tool"
                    >
                        <LetterText size={20} strokeWidth={1.75} />
                        <p className="text-[10px] opacity-60 absolute bottom-0.5 right-0.5">7</p>
                    </button>
                </div>
                
                <div className="h-8 w-px bg-slate-600 mx-1"></div>
                
                <button 
                    onClick={handleDeleteLastShape}
                    className={`p-2 cursor-pointer ${isDark ? "hover:text-white hover:bg-slate-600 active:bg-slate-500" : "hover:text-white hover:bg-slate-300 active:bg-slate-400"} rounded-lg transition-all`}
                    aria-label="Undo last action"
                >
                    <Undo2 size={20} strokeWidth={1.75} />
                </button>
                <button 
                    onClick={handleDeleteAllShapes}
                    className={`p-2 cursor-pointer ${isDark ? "hover:text-white hover:bg-slate-600 active:bg-slate-500" : "hover:text-white hover:bg-slate-300 active:bg-slate-400"}  rounded-lg transition-all`}
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
    roomId,
    isDark
}: {
    selectedColor: Color,
    setSelectedColor: (s: Color) => void,
    game?: Game,
    roomId: string,
    isDark: boolean
}) {
    useEffect(() => {
        console.log(`select color clicked - ${selectedColor}`)
    }, [selectedColor])

    return (
        <div className={`flex items-center gap-3 backdrop-blur-lg rounded-md py-2 px-4 border border-slate-700`}>
            <PenTool size={20} strokeWidth={1.75} color="gray" />
            
            <div className="h-8 w-px bg-slate-600"></div>
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

function BackgroundColorPallete ({
    selectedBg, 
    setSelectedBg, 
    game, 
    roomId,
    isDark
}: {
    selectedBg: Background,
    setSelectedBg: (s: Background) => void,
    game?: Game,
    roomId: string,
    isDark: boolean
}) {
    useEffect(() => {
        console.log(`select color clicked - ${selectedBg}`)
    }, [selectedBg])

    return (
        <div className="flex items-center gap-3 backdrop-blur-lg rounded-md py-2 px-4 border border-slate-700">
            <Monitor size={20} strokeWidth={1.75} color="gray" />
            
            <div className="h-8 w-px bg-slate-600"></div>
            
            <button
                onClick={() => setSelectedBg("#fefae0")} 
                className={`h-6 w-6 bg-[#fefae0] opacity-60 rounded-sm transition-all duration-200 cursor-pointer ${selectedBg === '#fefae0' ? "ring-3 ring-[#fefae0] opacity-100" : ""}`}
            >    
            </button>
            <button
                onClick={() => setSelectedBg("#edf2fb")} 
                className={`h-6 w-6 bg-[#edf2fb] opacity-60 rounded-sm transition-all duration-200 cursor-pointer ${selectedBg === '#edf2fb' ? "ring-3 ring-[#edf2fb] opacity-100" : ""}`}
            >    
            </button>
            <button
                onClick={() => setSelectedBg("#02111b")} 
                className={`h-6 w-6 bg-[#02111b] opacity-60 rounded-sm transition-all duration-200 cursor-pointer ${selectedBg === '#02111b' ? "ring-3 ring-[#02111b] opacity-100" : ""}`}
            >    
            </button>
            <button
                onClick={() => setSelectedBg("#0F172A")} 
                className={`h-6 w-6 bg-[#0F172A] opacity-60 rounded-sm transition-all duration-200 cursor-pointer ${selectedBg === '#0F172A' ? "ring-3 ring-[#0F172A] opacity-100" : ""}`}
            >    
            </button>
            <button
                onClick={() => setSelectedBg("#000c14")} 
                className={`h-6 w-6 bg-[#000c14] opacity-80 rounded-sm transition-all duration-200 cursor-pointer ${selectedBg === '#000c14' ? "ring-3 ring-[#000c14] opacity-100" : ""}`}
            >    
            </button>
        </div>       
    )
}