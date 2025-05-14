"use client";

import { useState } from "react";
import { useEffect } from "react";

import { ThreeDot } from "react-loading-indicators";

import Canvas from "./Canvas";
import { WS_BACKEND } from "@/config";


export function RoomCanvas ({ roomId }: { roomId: string }) {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    //Creates a ws connection with a ws server
    useEffect(() => {
        const token = localStorage.getItem("token");
        const ws = new WebSocket(`${WS_BACKEND}?token=${token}`);
        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({
                type: "join_room",
                roomId: roomId
            }))
        }
    }, []);


    if(!socket) {
        return <div className="w-screen h-screen flex flex-col gap-y-3 items-center justify-center">
            <ThreeDot color="#94aeba" size="medium" text="" textColor="" />
            Connecting to the server . . . .
        </div>
    }

    return (
        <Canvas roomId={roomId} socket={socket} ></Canvas>
    )
}