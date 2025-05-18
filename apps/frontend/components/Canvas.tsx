import { useRef, useState } from "react";
import { useEffect } from "react";

import { Square, Circle, Minus, ArrowUpRight, LetterTextIcon, Undo2Icon } from 'lucide-react';

import { Game } from "@/draw/game";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { getExistingShapes } from "@/draw/http";


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
                game={ game }
                roomId={ roomId }
            />
        </div>
    )
}
function Topbar ({selectedTool, setSelectedTool, game, roomId} : {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void,
    game?: Game,
    roomId: string
}) {

    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const t = localStorage.getItem("token");
        setToken(t);
    }, [])

    const handleDeleteShape = async () => {
        try {
            const response = await axios.delete(`${HTTP_BACKEND}/delete-last-chat`, {
                headers: {
                    authorization: token
                }
            })
            if(response.status === 200 && game) {
                console.log("last shape deleted successfully.");
                game.existingShapes = await getExistingShapes(roomId);
                game.clearCanvas();
            }
            else {
                console.log("Failed to delete last shape.")
            }
        }
        catch (error) {
            console.log("Server error.", error)
        }
    }

    return <div className="w-full flex justify-between fixed top-2 px-2">
        <div className="h-12 w-auto px-5 bg-gray-700 rounded-md flex flex-row  items-center justify-between gap-x-3 ">
            <button onClick={() => setSelectedTool("rect")} className={`py-2 px-4 ${selectedTool == "rect" ? "bg-slate-600 text-green-300": ""} rounded-full cursor-pointer transition-all duration-300`}><Square size={20} strokeWidth={1.5} /></button>
            <button onClick={() => setSelectedTool("circle")} className={`py-2 px-4 ${selectedTool == "circle" ? "bg-slate-600 text-green-300": ""} rounded-full cursor-pointer transition-all duration-300`}><Circle size={20} strokeWidth={1.5} /></button>
            <button onClick={() => setSelectedTool("arrow")} className={`py-2 px-4 ${selectedTool == "arrow" ? "bg-slate-600 text-green-300": ""} rounded-full cursor-pointer transition-all duration-300`}><ArrowUpRight size={20} strokeWidth={1.5} /></button>
            <button onClick={() => setSelectedTool("line")} className={`py-2 px-4 ${selectedTool == "line" ? "bg-slate-600 text-green-300": ""} rounded-full cursor-pointer transition-all duration-300`}><Minus size={20} strokeWidth={1.5} /></button>
            <button onClick={() => setSelectedTool("text")} className={`py-2 px-4 ${selectedTool == "text" ? "bg-slate-600 text-green-300": ""} rounded-full cursor-pointer transition-all duration-300`}><LetterTextIcon size={20} strokeWidth={1.5} /></button>
        </div>
        <button 
            onClick={handleDeleteShape}
            className="h-12 w-auto px-5 bg-gray-700 hover:bg-gray-600 hover:text-red-200 rounded-md flex flex-row items-center justify-between gap-x-3 cursor-pointer transition-all duration-300 ">
            <Undo2Icon />
        </button>
    </div>
}