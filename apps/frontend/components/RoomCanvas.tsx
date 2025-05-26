"use client";

import { useState } from "react";
import { useEffect } from "react";

import { ThreeDot } from "react-loading-indicators";

import Canvas from "./Canvas";
import { WS_BACKEND } from "@/config";


export function RoomCanvas ({ roomId }: { roomId: string }) {
    // const [socket, setSocket] = useState<WebSocket | null>(null);

    // //Creates a ws connection with a ws server
    // useEffect(() => {
    //     const token = localStorage.getItem("token");
    //     console.log("calling room canvas")
    //     console.log("token = ", token);
    //     const ws = new WebSocket(`${WS_BACKEND}?token=${token}`);
    //     ws.onopen = () => {
    //         console.log("connected to ws")
    //         setSocket(ws);
    //         ws.send(JSON.stringify({
    //             type: "join_room",
    //             roomId: roomId
    //         }))
    //     }
    // }, []);

    const [socket, setSocket] = useState<WebSocket | null>(null);
const [connectionStatus, setConnectionStatus] = useState('connecting');

useEffect(() => {
  const token = localStorage.getItem("token");
  const ws = new WebSocket(`${WS_BACKEND}?token=${token}`);

  ws.onopen = () => {
    console.log("WebSocket connected");
    setConnectionStatus('connected');
    setSocket(ws);
    ws.send(JSON.stringify({
      type: "join_room",
      roomId: roomId
    }));
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
    setConnectionStatus('error');
  };

  ws.onclose = () => {
    console.log("WebSocket disconnected");
    setConnectionStatus('disconnected');
  };

  return () => ws.close();
}, [roomId]);

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