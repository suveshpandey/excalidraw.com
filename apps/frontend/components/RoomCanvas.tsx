"use client";

import { WS_BACKEND } from "@/config";
import { useState } from "react";
import { useEffect } from "react";
import Canvas from "./Canvas";

export function RoomCanvas ({ roomId }: { roomId: string }) {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    //Creates a ws connection with a ws server
    useEffect(() => {
        const ws = new WebSocket(`${WS_BACKEND}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyZTk1ZWUyMS0yNGY3LTQwNDktODE2Mi1mZGE4OWNhY2U2OWYiLCJpYXQiOjE3NDYwNzQ4MjZ9._-qjdTW3OZ1oFj3PUjDhga35G_WfpOxyD74YAHFb-1o`);
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