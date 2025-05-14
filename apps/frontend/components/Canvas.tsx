import { useRef, useState } from "react";
import { useEffect } from "react";

import { Square, Circle, Minus, ArrowUpRight, LetterTextIcon } from 'lucide-react';

import { Game } from "@/draw/game";


export type Tool = "rect" | "circle" | "line" | "arrow" | "text";

export default function Canvas ({ 
    roomId,
    socket
 }: { 
    roomId: string,
    socket: WebSocket
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("rect")
    
    useEffect(() => {
        game?.setTool(selectedTool);
    }, [selectedTool, game])

    useEffect(() => {

        if(canvasRef.current && inputRef.current) {
            const g = new Game(canvasRef.current, roomId, socket, inputRef.current);
            setGame(g);

            return () => {
                g.destroy();
            }
        }

    }, [canvasRef] );

    return (
        <div className="h-screen w-screen overflow-hidden">
            <canvas 
                ref={canvasRef} 
                className="" 
                width={window.innerWidth} 
                height={window.innerHeight}>
            </canvas>
            
            <input 
                type="text" 
                ref={inputRef}  
                placeholder="write here. . ."
                className="absolute bg-gray-900 border text-slate-300 px-3 py-1 rounded shadow-md outline:none" 
                style={{ display: "none", zIndex: 1000 }} 
            />
            
            <Topbar 
                selectedTool={selectedTool} 
                setSelectedTool={setSelectedTool} 
            />
        </div>
    )
}
function Topbar ({selectedTool, setSelectedTool} : {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void
}) {
    return <div className="h-12 w-74 bg-[#1b263b] rounded-md fixed top-2 left-2 flex flex-row justify-center items-center gap-x-3 ">
        <button onClick={() => setSelectedTool("rect")} className={`py-2 px-4 ${selectedTool == "rect" ? "bg-slate-700 text-green-300": ""} rounded-full cursor-pointer transition-all duration-300`}><Square size={20} strokeWidth={1.5} /></button>
        <button onClick={() => setSelectedTool("circle")} className={`py-2 px-4 ${selectedTool == "circle" ? "bg-slate-700 text-green-300": ""} rounded-full cursor-pointer transition-all duration-300`}><Circle size={20} strokeWidth={1.5} /></button>
        <button onClick={() => setSelectedTool("line")} className={`py-2 px-4 ${selectedTool == "line" ? "bg-slate-700 text-green-300": ""} rounded-full cursor-pointer transition-all duration-300`}><Minus size={20} strokeWidth={1.5} /></button>
        <button onClick={() => setSelectedTool("arrow")} className={`py-2 px-4 ${selectedTool == "arrow" ? "bg-slate-700 text-green-300": ""} rounded-full cursor-pointer transition-all duration-300`}><ArrowUpRight size={20} strokeWidth={1.5} /></button>
        <button onClick={() => setSelectedTool("text")} className={`py-2 px-4 ${selectedTool == "text" ? "bg-slate-700 text-green-300": ""} rounded-full cursor-pointer transition-all duration-300`}><LetterTextIcon size={20} strokeWidth={1.5} /></button>
    </div>
}