import { initDraw } from "@/draw";
import { useRef } from "react";
import { useEffect } from "react";

export default function Canvas ({ 
    roomId,
    socket
 }: { 
    roomId: string,
    socket: WebSocket
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    useEffect(() => {

        if(canvasRef.current) {
            initDraw(canvasRef.current, roomId, socket);
        }

    }, [canvasRef] );

    return (
        <div className="h-screen w-screen">
            <canvas ref={canvasRef} className="h-screen w-screen" width={2000} height={1000}></canvas>
        </div>
    )
}