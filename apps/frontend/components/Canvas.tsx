import { Game } from "@/draw/game";
import { useRef, useState } from "react";
import { useEffect } from "react";

export type Tool = "rect" | "circle" | "line";

export default function Canvas ({ 
    roomId,
    socket
 }: { 
    roomId: string,
    socket: WebSocket
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("rect")
    
    useEffect(() => {
        game?.setTool(selectedTool);
    }, [selectedTool, game])

    useEffect(() => {

        if(canvasRef.current) {
            const g = new Game(canvasRef.current, roomId, socket);
            setGame(g);

            return () => {
                g.destroy();
            }
        }

        

    }, [canvasRef] );

    return (
        <div className="h-screen w-screen overflow-hidden">
            <canvas ref={canvasRef} className="" width={window.innerWidth} height={window.innerHeight}></canvas>
            <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
        </div>
    )
}
function Topbar ({selectedTool, setSelectedTool} : {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void
}) {
    return <div className="h-14 w-90 bg-slate-800 rounded-md border-[1px] border-slate-500 fixed top-2 left-2 flex flex-row justify-center items-center gap-x-3 ">
        <button onClick={() => setSelectedTool("rect")} className={`py-2 px-6 ${selectedTool == "rect" ? "bg-slate-500": "bg-slate-700"} rounded-full cursor-pointer `}>Rectange</button>
        <button onClick={() => setSelectedTool("circle")} className={`py-2 px-6 ${selectedTool == "circle" ? "bg-slate-500": "bg-slate-700"} rounded-full cursor-pointer `}>Cirlce</button>
        <button onClick={() => setSelectedTool("line")} className={`py-2 px-6 ${selectedTool == "line" ? "bg-slate-500": "bg-slate-700"} rounded-full cursor-pointer `}>Line</button>
    </div>
}