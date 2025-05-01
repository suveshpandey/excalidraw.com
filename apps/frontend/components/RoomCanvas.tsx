"use client";

import { WS_BACKEND } from "@/config";
import { useState } from "react";
import { useEffect } from "react";
import Canvas from "./Canvas";

export function RoomCanvas ({ roomId }: { roomId: string }) {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    //Creates a ws connection with a ws server
    useEffect(() => {
        const ws = new WebSocket(`${WS_BACKEND}?token=`);
        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({
                type: "join_room",
                roomId: roomId
            }))
        }
    }, []);


    if(!socket) {
        return <div>
            Connecting to server....
        </div>
    }

    return (
        <Canvas roomId={roomId} socket={socket} ></Canvas>
    )
}